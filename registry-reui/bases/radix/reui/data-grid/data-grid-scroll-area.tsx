"use client"

// Opted out of React Compiler with the rest of the grid (see data-grid.tsx).
"use no memo"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type { PointerEvent, ReactNode } from "react"
import { useDataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { cn } from "cn"

const MIN_THUMB_SIZE = 24
const FALLBACK_SCROLLBAR_SIZE = 12
// Gap between each track and the grid edge: the mb-px / me-px on the tracks and
// the overlay's inset-e-px. The overlay's height math adds it below the bar.
const SCROLLBAR_EDGE_GAP = 1

const INITIAL_METRICS = {
  hasVerticalOverflow: false,
  headerHeight: 0,
  horizontalScrollbarSize: 0,
  thumbHeight: 0,
  thumbTop: 0,
  trackHeight: 0,
} as const

// Track footprint: --data-grid-scrollbar-size (10px by default) in both
// orientations, less 1px for the transparent border and 2px for p-px, so every
// thumb lands at that size less 3px (7px), held 1px off the grid edge. Thinner
// was hard to grab; the tracks overlay the last row and column, so the default
// stays under 12px. The sticky-header overlay below follows the same variable.
const SCROLLBAR_CLASSNAME =
  "flex touch-none p-px transition-colors select-none data-[orientation=horizontal]:mb-px data-[orientation=horizontal]:h-[var(--data-grid-scrollbar-size,0.625rem)] data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=vertical]:me-px data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[var(--data-grid-scrollbar-size,0.625rem)] data-[orientation=vertical]:border-s data-[orientation=vertical]:border-s-transparent"

// The ::before reaches the track's outer edge, so the whole track thickness
// grabs the thumb rather than only its painted 7px.
const SCROLLBAR_THUMB_CLASSNAME =
  "bg-border rounded-full relative flex-1 before:absolute before:-inset-0.5"

type DataGridScrollAreaOrientation = "horizontal" | "vertical" | "both"

type ScrollbarMetrics = {
  hasVerticalOverflow: boolean
  headerHeight: number
  horizontalScrollbarSize: number
  thumbHeight: number
  thumbTop: number
  trackHeight: number
}

type ObservedElements = {
  header: HTMLElement | null
  horizontalScrollbar: HTMLElement | null
  table: HTMLElement | null
  tableViewport: HTMLElement | null
}

type DataGridScrollAreaProps = Omit<
  ScrollAreaPrimitive.Root.Props,
  "children"
> & {
  children: ReactNode
  orientation?: DataGridScrollAreaOrientation
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function areMetricsEqual(next: ScrollbarMetrics, prev: ScrollbarMetrics) {
  return (
    next.hasVerticalOverflow === prev.hasVerticalOverflow &&
    next.headerHeight === prev.headerHeight &&
    next.horizontalScrollbarSize === prev.horizontalScrollbarSize &&
    next.thumbHeight === prev.thumbHeight &&
    next.thumbTop === prev.thumbTop &&
    next.trackHeight === prev.trackHeight
  )
}

// A footer held at the bottom (its tfoot or its cells are sticky, however the
// consumer made them so) takes the track's lower end the way the sticky header
// takes its top, so the thumb never paints over the totals.
function getStickyFooterHeight(table: HTMLElement | null) {
  const footer = table instanceof HTMLTableElement ? table.tFoot : null
  if (!footer) return 0

  const isSticky = [footer, footer.rows[0]?.cells[0]].some(
    (element) => element && getComputedStyle(element).position === "sticky"
  )
  return isSticky ? footer.getBoundingClientRect().height : 0
}

function applyMetrics(element: HTMLElement, metrics: ScrollbarMetrics) {
  element.style.setProperty(
    "--data-grid-scrollbar-header-height",
    `${metrics.headerHeight}px`
  )
  element.style.setProperty(
    "--data-grid-scrollbar-thumb-height",
    `${metrics.thumbHeight}px`
  )
  element.style.setProperty(
    "--data-grid-scrollbar-thumb-top",
    `${metrics.thumbTop}px`
  )
  element.style.setProperty(
    "--data-grid-scrollbar-track-height",
    `${metrics.trackHeight}px`
  )
}

function DataGridScrollArea({
  children,
  className,
  orientation = "both",
  ...props
}: DataGridScrollAreaProps) {
  const { props: dataGridProps, table } = useDataGrid()
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{
    pointerId: number
    startScrollTop: number
    startY: number
  } | null>(null)
  const metricsRef = useRef<ScrollbarMetrics>(INITIAL_METRICS)
  const observedElementsRef = useRef<ObservedElements>({
    header: null,
    horizontalScrollbar: null,
    table: null,
    tableViewport: null,
  })

  const showHorizontal = orientation !== "vertical"
  const showVertical = orientation !== "horizontal"
  const usesCustomVerticalScrollbar =
    showVertical && !!dataGridProps.tableLayout?.headerSticky
  // Pinned columns are sticky and never scroll, so the horizontal scrollbar
  // track is inset to span only the scrollable center region between them.
  const isColumnsPinnable = !!dataGridProps.tableLayout?.columnsPinnable
  const scrollbarInsetStart = isColumnsPinnable ? table.getStartTotalSize() : 0
  const scrollbarInsetEnd = isColumnsPinnable ? table.getEndTotalSize() : 0
  const [hasCustomVerticalOverflow, setHasCustomVerticalOverflow] =
    useState(false)

  // Base UI's thumb math reads direction from its own context, which a Radix
  // app or a bare dir="rtl" page never provides, so RTL scrolled with LTR math
  // and the thumb froze. RTL is read off the layout instead, so no provider of
  // any kind is needed. LTR passes the inherited value through untouched: no
  // state change and no extra render, exactly as before this existed.
  const inheritedDirection = useDirection()
  const [isLayoutRtl, setIsLayoutRtl] = useState(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const readDirection = () => {
      const next = getComputedStyle(container).direction === "rtl"
      setIsLayoutRtl((prev) => (prev === next ? prev : next))
    }

    readDirection()
    if (typeof MutationObserver === "undefined") return

    // Only a dir attribute flips it at runtime (an RTL toggle on <html>).
    const observer = new MutationObserver(readDirection)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
      subtree: true,
    })
    return () => observer.disconnect()
  }, [])

  const clearDragState = useCallback(() => {
    dragRef.current = null
    document.body.style.userSelect = ""
    document.body.style.webkitUserSelect = ""
  }, [])

  // The overlay is mounted one commit after the sync that detected overflow,
  // so it misses that sync's write. Seeding it from the ref callback lands the
  // geometry during commit, before the browser paints the track.
  const setOverlayRef = useCallback((node: HTMLDivElement | null) => {
    overlayRef.current = node

    if (node) applyMetrics(node, metricsRef.current)
  }, [])

  const resetMetrics = useCallback(() => {
    if (!areMetricsEqual(INITIAL_METRICS, metricsRef.current)) {
      metricsRef.current = INITIAL_METRICS
      if (overlayRef.current) applyMetrics(overlayRef.current, INITIAL_METRICS)
    }

    setHasCustomVerticalOverflow((prev) => (prev ? false : prev))
  }, [])

  const syncCustomVerticalScrollbar = useCallback(() => {
    const container = containerRef.current
    const viewport = viewportRef.current

    if (!container || !viewport || !usesCustomVerticalScrollbar) {
      resetMetrics()
      return
    }

    const { header, horizontalScrollbar, table } = observedElementsRef.current
    const headerHeight = header?.getBoundingClientRect().height ?? 0
    const footerHeight = getStickyFooterHeight(table)
    const viewportHeight = viewport.clientHeight
    const viewportWidth = viewport.clientWidth
    const scrollHeight = viewport.scrollHeight
    const scrollWidth = viewport.scrollWidth
    const hasHorizontalOverflow =
      showHorizontal && scrollWidth > viewportWidth + 0.5
    const horizontalScrollbarSize = hasHorizontalOverflow
      ? (horizontalScrollbar?.offsetHeight || FALLBACK_SCROLLBAR_SIZE) +
        SCROLLBAR_EDGE_GAP
      : 0
    // The horizontal bar overlays the bottom of the viewport, which a sticky
    // footer already covers, so only the larger of the two is taken off.
    const trackHeight = Math.max(
      0,
      viewportHeight -
        headerHeight -
        Math.max(footerHeight, horizontalScrollbarSize)
    )
    const maxScroll = Math.max(0, scrollHeight - viewportHeight)

    let nextMetrics: ScrollbarMetrics

    if (trackHeight === 0 || maxScroll === 0) {
      nextMetrics = {
        hasVerticalOverflow: false,
        headerHeight,
        horizontalScrollbarSize,
        thumbHeight: trackHeight,
        thumbTop: 0,
        trackHeight,
      }
    } else {
      const bodyContentHeight = Math.max(
        trackHeight,
        scrollHeight - headerHeight - footerHeight
      )
      const thumbHeight = clamp(
        trackHeight * (trackHeight / bodyContentHeight),
        MIN_THUMB_SIZE,
        trackHeight
      )
      const maxThumbTop = Math.max(0, trackHeight - thumbHeight)
      const thumbTop =
        maxThumbTop > 0 ? (viewport.scrollTop / maxScroll) * maxThumbTop : 0

      nextMetrics = {
        hasVerticalOverflow: true,
        headerHeight,
        horizontalScrollbarSize,
        thumbHeight,
        thumbTop,
        trackHeight,
      }
    }

    if (!areMetricsEqual(nextMetrics, metricsRef.current)) {
      metricsRef.current = nextMetrics
      // Scoped to the overlay, never to the container. These four properties
      // inherit, and thumbTop changes on essentially every scroll frame, so
      // writing them on the element that wraps the whole grid invalidates
      // computed style for every row and cell each frame. The overlay subtree
      // is their only reader.
      if (overlayRef.current) applyMetrics(overlayRef.current, nextMetrics)
    }

    setHasCustomVerticalOverflow((prev) =>
      prev === nextMetrics.hasVerticalOverflow
        ? prev
        : nextMetrics.hasVerticalOverflow
    )
  }, [resetMetrics, showHorizontal, usesCustomVerticalScrollbar])

  useEffect(() => {
    const container = containerRef.current
    const viewport = viewportRef.current

    if (!container || !viewport) return

    if (!usesCustomVerticalScrollbar) {
      resetMetrics()
      return
    }

    let frame = 0

    const scheduleSync = () => {
      cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(syncCustomVerticalScrollbar)
    }

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleSync)
    const observed = new Set<HTMLElement>()

    const observeElement = (element: HTMLElement | null) => {
      if (element && observer && !observed.has(element)) {
        observer.observe(element)
        observed.add(element)
      }
    }

    const resolveObservedElements = () => {
      observedElementsRef.current = {
        header: container.querySelector(
          '[data-slot="data-grid-table"] thead'
        ) as HTMLElement | null,
        horizontalScrollbar: container.querySelector(
          '[data-slot="data-grid-scrollbar"][data-orientation="horizontal"]'
        ) as HTMLElement | null,
        table: container.querySelector(
          '[data-slot="data-grid-table"]'
        ) as HTMLElement | null,
        tableViewport: container.querySelector(
          '[data-slot="data-grid-table-viewport"]'
        ) as HTMLElement | null,
      }

      observeElement(observedElementsRef.current.header)
      observeElement(observedElementsRef.current.table)
      observeElement(observedElementsRef.current.tableViewport)

      return !!(
        observedElementsRef.current.header && observedElementsRef.current.table
      )
    }

    observeElement(viewport)
    const resolvedOnMount = resolveObservedElements()

    scheduleSync()
    viewport.addEventListener("scroll", scheduleSync, { passive: true })

    // A table that mounts after this effect (empty state swapped for data)
    // would otherwise never be observed and the custom scrollbar would
    // overlap the sticky header. One-shot: disconnects once resolved.
    let mutationObserver: MutationObserver | null = null
    if (!resolvedOnMount && typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(() => {
        if (resolveObservedElements()) {
          mutationObserver?.disconnect()
          mutationObserver = null
          scheduleSync()
        }
      })
      mutationObserver.observe(container, { childList: true, subtree: true })
    }

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      mutationObserver?.disconnect()
      viewport.removeEventListener("scroll", scheduleSync)
      clearDragState()
    }
  }, [
    clearDragState,
    resetMetrics,
    syncCustomVerticalScrollbar,
    usesCustomVerticalScrollbar,
  ])

  const scrollToThumbOffset = (nextThumbTop: number) => {
    const viewport = viewportRef.current
    const { thumbHeight, trackHeight } = metricsRef.current

    if (!viewport) return

    const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight)
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight)

    if (maxScroll === 0 || maxThumbTop === 0) {
      viewport.scrollTop = 0
      return
    }

    const ratio = clamp(nextThumbTop, 0, maxThumbTop) / maxThumbTop
    viewport.scrollTop = ratio * maxScroll
  }

  const handleThumbPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current

    if (!viewport) return

    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)

    dragRef.current = {
      pointerId: event.pointerId,
      startScrollTop: viewport.scrollTop,
      startY: event.clientY,
    }

    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"
  }

  const handleThumbPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    const dragState = dragRef.current
    const { thumbHeight, trackHeight } = metricsRef.current

    if (!viewport || !dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    const maxThumbTop = Math.max(0, trackHeight - thumbHeight)
    const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight)

    if (maxThumbTop === 0 || maxScroll === 0) return

    const deltaY = event.clientY - dragState.startY
    const nextScrollTop =
      dragState.startScrollTop + (deltaY / maxThumbTop) * maxScroll

    viewport.scrollTop = clamp(nextScrollTop, 0, maxScroll)
  }

  const handleThumbPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    clearDragState()
  }

  const handleTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const { thumbHeight } = metricsRef.current

    if (event.target !== event.currentTarget) return

    event.preventDefault()
    event.stopPropagation()

    const rect = event.currentTarget.getBoundingClientRect()
    const offsetY = event.clientY - rect.top - thumbHeight / 2

    scrollToThumbOffset(offsetY)
  }

  return (
    <DirectionProvider direction={isLayoutRtl ? "rtl" : inheritedDirection}>
      <div ref={containerRef} className="relative">
        <ScrollAreaPrimitive.Root
          data-slot="data-grid-scroll-area"
          // Styling hook: present while the sticky-header scroll mode detects
          // vertical overflow, so consumers can style scrollable vs short
          // grids with a plain ancestor attribute selector.
          data-overflow-vertical={
            hasCustomVerticalOverflow ? "true" : undefined
          }
          className={cn("relative", className)}
          {...props}
        >
          <ScrollAreaPrimitive.Viewport
            ref={viewportRef}
            data-slot="scroll-area-viewport"
            className="size-full"
          >
            <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
              {children}
            </ScrollAreaPrimitive.Content>
          </ScrollAreaPrimitive.Viewport>

          {showHorizontal && (
            <ScrollAreaPrimitive.Scrollbar
              data-slot="data-grid-scrollbar"
              data-orientation="horizontal"
              orientation="horizontal"
              className={SCROLLBAR_CLASSNAME}
              style={
                scrollbarInsetStart > 0 || scrollbarInsetEnd > 0
                  ? {
                      marginInlineStart: scrollbarInsetStart || undefined,
                      marginInlineEnd: scrollbarInsetEnd || undefined,
                    }
                  : undefined
              }
            >
              <ScrollAreaPrimitive.Thumb
                data-slot="data-grid-thumb"
                className={SCROLLBAR_THUMB_CLASSNAME}
              />
            </ScrollAreaPrimitive.Scrollbar>
          )}

          {showVertical && !usesCustomVerticalScrollbar && (
            <ScrollAreaPrimitive.Scrollbar
              data-slot="data-grid-scrollbar"
              data-orientation="vertical"
              orientation="vertical"
              className={SCROLLBAR_CLASSNAME}
            >
              <ScrollAreaPrimitive.Thumb
                data-slot="data-grid-thumb"
                className={SCROLLBAR_THUMB_CLASSNAME}
              />
            </ScrollAreaPrimitive.Scrollbar>
          )}
        </ScrollAreaPrimitive.Root>

        {usesCustomVerticalScrollbar && hasCustomVerticalOverflow && (
          <div
            ref={setOverlayRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-e-px top-(--data-grid-scrollbar-header-height) z-20 h-(--data-grid-scrollbar-track-height)"
          >
            <div
              className="pointer-events-auto relative h-full w-[var(--data-grid-scrollbar-size,0.625rem)] touch-none p-px"
              onPointerDown={handleTrackPointerDown}
            >
              <div
                className={cn(
                  "bg-border absolute end-px w-[calc(var(--data-grid-scrollbar-size,0.625rem)-0.1875rem)]",
                  "top-(--data-grid-scrollbar-thumb-top) h-(--data-grid-scrollbar-thumb-height)",
                  "rounded-full before:absolute before:-inset-0.5"
                )}
                onLostPointerCapture={clearDragState}
                onPointerCancel={handleThumbPointerUp}
                onPointerDown={handleThumbPointerDown}
                onPointerMove={handleThumbPointerMove}
                onPointerUp={handleThumbPointerUp}
              />
            </div>
          </div>
        )}
      </div>
    </DirectionProvider>
  )
}

export { DataGridScrollArea }
export type { DataGridScrollAreaOrientation, DataGridScrollAreaProps }
