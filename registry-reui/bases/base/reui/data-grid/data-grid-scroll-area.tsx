"use client"

import {
  PointerEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { useDataGrid } from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { cn } from "@/registry/bases/base/lib/utils"

const MIN_THUMB_SIZE = 24
const FALLBACK_SCROLLBAR_SIZE = 12

const INITIAL_METRICS = {
  hasVerticalOverflow: false,
  headerHeight: 0,
  horizontalScrollbarSize: 0,
  thumbHeight: 0,
  thumbTop: 0,
  trackHeight: 0,
} as const

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
  const { props: dataGridProps } = useDataGrid()
  const containerRef = useRef<HTMLDivElement>(null)
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
  const [hasCustomVerticalOverflow, setHasCustomVerticalOverflow] =
    useState(false)

  const clearDragState = useCallback(() => {
    dragRef.current = null
    document.body.style.userSelect = ""
    document.body.style.webkitUserSelect = ""
  }, [])

  const resetMetrics = useCallback(() => {
    const container = containerRef.current

    if (container && !areMetricsEqual(INITIAL_METRICS, metricsRef.current)) {
      applyMetrics(container, INITIAL_METRICS)
      metricsRef.current = INITIAL_METRICS
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

    const { header, horizontalScrollbar } = observedElementsRef.current
    const headerHeight = header?.getBoundingClientRect().height ?? 0
    const viewportHeight = viewport.clientHeight
    const viewportWidth = viewport.clientWidth
    const scrollHeight = viewport.scrollHeight
    const scrollWidth = viewport.scrollWidth
    const hasHorizontalOverflow =
      showHorizontal && scrollWidth > viewportWidth + 0.5
    const horizontalScrollbarSize = hasHorizontalOverflow
      ? horizontalScrollbar?.offsetHeight || FALLBACK_SCROLLBAR_SIZE
      : 0
    const trackHeight = Math.max(
      0,
      viewportHeight - headerHeight - horizontalScrollbarSize
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
        scrollHeight - headerHeight
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
      applyMetrics(container, nextMetrics)
      metricsRef.current = nextMetrics
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

    let frame = 0

    const scheduleSync = () => {
      cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(syncCustomVerticalScrollbar)
    }

    scheduleSync()
    viewport.addEventListener("scroll", scheduleSync, { passive: true })

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleSync)

    observer?.observe(viewport)
    observedElementsRef.current.header &&
      observer?.observe(observedElementsRef.current.header)
    observedElementsRef.current.table &&
      observer?.observe(observedElementsRef.current.table)
    observedElementsRef.current.tableViewport &&
      observer?.observe(observedElementsRef.current.tableViewport)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
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
    <div ref={containerRef} className="relative">
      <ScrollAreaPrimitive.Root
        data-slot="data-grid-scroll-area"
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
            className="flex touch-none p-px transition-colors select-none data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=vertical]:border-s data-[orientation=vertical]:border-s-transparent"
          >
            <ScrollAreaPrimitive.Thumb
              data-slot="data-grid-thumb"
              className="bg-border style-vega:rounded-full style-maia:rounded-full style-nova:rounded-full style-lyra:rounded-none style-mira:rounded-full relative flex-1"
            />
          </ScrollAreaPrimitive.Scrollbar>
        )}

        {showVertical && !usesCustomVerticalScrollbar && (
          <ScrollAreaPrimitive.Scrollbar
            data-slot="data-grid-scrollbar"
            data-orientation="vertical"
            orientation="vertical"
            className="flex touch-none p-px transition-colors select-none data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=vertical]:border-s data-[orientation=vertical]:border-s-transparent"
          >
            <ScrollAreaPrimitive.Thumb
              data-slot="data-grid-thumb"
              className="bg-border style-vega:rounded-full style-maia:rounded-full style-nova:rounded-full style-lyra:rounded-none style-mira:rounded-full relative flex-1"
            />
          </ScrollAreaPrimitive.Scrollbar>
        )}
      </ScrollAreaPrimitive.Root>

      {usesCustomVerticalScrollbar && hasCustomVerticalOverflow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-e-0 top-(--data-grid-scrollbar-header-height) z-20 h-(--data-grid-scrollbar-track-height)"
        >
          <div
            className="pointer-events-auto relative h-full w-2 touch-none p-px"
            onPointerDown={handleTrackPointerDown}
          >
            <div
              className={cn(
                "bg-border absolute end-px w-2",
                "top-(--data-grid-scrollbar-thumb-top) h-(--data-grid-scrollbar-thumb-height)",
                "style-vega:rounded-full style-maia:rounded-full style-nova:rounded-full style-lyra:rounded-none style-mira:rounded-full"
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
  )
}

export { DataGridScrollArea }
export type { DataGridScrollAreaOrientation, DataGridScrollAreaProps }
