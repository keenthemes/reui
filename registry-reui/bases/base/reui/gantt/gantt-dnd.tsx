// Title: Gantt Dnd
// Description: Custom pointer-event interaction engine - edge resize and drag-create over the horizontal axis with live validation; bars are never dragged whole.

"use client"

import { useCallback, useEffect } from "react"
import {
  resolveScheduleMode,
  useGantt,
  useGanttViewConfig,
  type GanttInstance,
} from "@/registry-reui/bases/base/reui/gantt/gantt"
import {
  findResource,
  snapMinutes,
  toZoned,
  zonedStartOfDay,
} from "@/registry-reui/bases/base/reui/gantt/gantt-lib"
import type {
  GanttProposedUpdate,
  GanttScheduleMode,
  GanttSegment,
} from "@/registry-reui/bases/base/reui/gantt/gantt-types"
import { addDays, differenceInCalendarDays } from "date-fns"

/**
 * Activation policy (dnd-kit parity where proven):
 * mouse move 5px before a drag starts (below = click), create 4px;
 * touch long-press 250ms with 5px tolerance (movement past tolerance
 * before the delay cancels the drag so taps stay taps).
 */
const GANTT_ACTIVATION = {
  moveDistancePx: 5,
  createDistancePx: 4,
  touchDelayMs: 250,
  touchTolerancePx: 5,
} as const

type GestureKind = "move" | "resize-start" | "resize-end" | "create"

interface GanttSurface {
  rect: DOMRect
  rangeStart: number
  rangeEnd: number
  snapMin: number
  /** Mirrored axis: in RTL the range START sits at the rect's RIGHT edge. */
  isRtl: boolean
  rows: Array<{ resourceId: string; rect: DOMRect }>
}

/**
 * Pointer x (viewport px) to minutes from the range start, clamped to the
 * track. The single place the horizontal axis direction is resolved: every
 * gesture mapping (move, both resizes, create, grab offset) goes through it.
 */
function surfaceMinutesAt(tl: GanttSurface, x: number): number {
  const clamped = Math.min(Math.max(x, tl.rect.left), tl.rect.right)
  const traveled = tl.isRtl ? tl.rect.right - clamped : clamped - tl.rect.left
  return (traveled / tl.rect.width) * ((tl.rangeEnd - tl.rangeStart) / 60000)
}

/** Module flag so bar onClick can ignore the click that ends a drag. */
let lastGestureEndedAt = 0
function wasRecentDrag(): boolean {
  return performance.now() - lastGestureEndedAt < 250
}

/** Mark a non-dnd gesture (e.g. a timeline pan) so the click it ends is ignored. */
function markGestureEnd(): void {
  lastGestureEndedAt = performance.now()
}

/**
 * Registry of in-flight gesture cancels. A gesture measures its surface
 * (axis + row rects) once at activation, so the VIEW - not the bar, bars
 * legitimately unmount mid-gesture - must be able to abort gestures when it
 * unmounts or when the measured geometry changes under them (zoom, scale,
 * range growth, splitter). Cancel fully reverts: listeners, overlays and the
 * body drag state all clear, and no update is committed.
 */
const activeGestureCancels = new Set<() => void>()

/** Cancel (and fully revert) every in-flight gantt pointer gesture. */
function cancelActiveGanttGestures(): void {
  for (const cancel of [...activeGestureCancels]) cancel()
}

/**
 * View-level teardown, mounted once by GanttView: aborts any in-flight
 * gesture on unmount so window listeners, body-appended overlays and the
 * gantt-dragging body class never outlive the gantt.
 */
function useGanttGestureTeardown(): void {
  useEffect(() => cancelActiveGanttGestures, [])
}

/**
 * Snap a translate offset to the device pixel grid. The cursor-following
 * overlays (the move clone and the resize indicator) are their own
 * `will-change: transform` compositing layers: the GPU rasterizes their text
 * once and repositions that texture each frame, so a subpixel translate
 * (getBoundingClientRect and raw clientX/Y are routinely fractional) resamples
 * the texture and blurs the text. Rounding each offset to a whole device pixel
 * lands the layer on the grid so glyphs stay crisp, without giving up the
 * per-frame GPU transform.
 */
function snapToPixel(value: number): number {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
  return Math.round(value * dpr) / dpr
}

function collectSurface(root: HTMLElement | null): GanttSurface | null {
  if (!root) return null
  const axis = root.querySelector<HTMLElement>("[data-gantt-axis]")
  if (!axis) return null
  return {
    rect: axis.getBoundingClientRect(),
    rangeStart: Number(axis.dataset.ganttRangeStart),
    rangeEnd: Number(axis.dataset.ganttRangeEnd),
    snapMin: Number(axis.dataset.ganttSnap) || 15,
    isRtl: getComputedStyle(axis).direction === "rtl",
    rows: [...root.querySelectorAll<HTMLElement>("[data-gantt-row]")]
      // static rows (parents that aggregate their subtree) take no drops
      .filter((row) => row.dataset.ganttRowStatic === undefined)
      .map((row) => ({
        resourceId: row.dataset.ganttResource ?? "",
        rect: row.getBoundingClientRect(),
      })),
  }
}

interface BeginGestureConfig<TData> {
  instance: GanttInstance<TData>
  kind: GestureKind
  origin: HTMLElement
  startEvent: PointerEvent
  segment?: GanttSegment<TData>
  /** Consumer renders the move preview (renderDragPreview); the engine only positions it. */
  customMoveOverlay?: boolean
  /** Consumer renders the resize indicator; the engine only positions it. */
  customResizeOverlay?: boolean
  /** View-level cardinality default; a node's own scheduleMode wins. */
  scheduleMode?: GanttScheduleMode
}

function beginGesture<TData>(config: BeginGestureConfig<TData>) {
  const {
    instance,
    kind,
    origin,
    startEvent,
    segment,
    customMoveOverlay,
    customResizeOverlay,
  } = config
  const { settings, internals, api } = instance
  const activation = { ...GANTT_ACTIVATION, ...settings.activation }
  const startX = startEvent.clientX
  const startY = startEvent.clientY
  const pointerId = startEvent.pointerId
  // stable ancestors: bar nodes may be replaced by re-renders mid-gesture
  const viewRoot = origin.closest<HTMLElement>("[data-slot=gantt-view]")
  const ganttRoot = origin.closest<HTMLElement>("[data-slot=gantt]")
  const announcer = ganttRoot?.querySelector<HTMLElement>(
    "[data-slot=gantt-announcer]"
  )

  /**
   * The cursor-following overlays are appended to document.body so no ancestor
   * transform or overflow can clip them - which also cuts them off from the
   * gantt root, and the root is what OWNS the type scale (its `text-xs` is
   * what every resting label inherits). Without this the clone's label jumps
   * to the document default and reads visibly bigger than the bar it left.
   * Copying the ROOT's resolved metrics - rather than hardcoding a size -
   * keeps the documented contract that one class on the root (e.g.
   * className="text-sm") rescales the whole gantt, drag clone included.
   */
  const adoptRootTypography = (el: HTMLElement) => {
    if (!ganttRoot) return
    const rootStyle = getComputedStyle(ganttRoot)
    el.style.fontSize = rootStyle.fontSize
    el.style.lineHeight = rootStyle.lineHeight
    el.style.fontFamily = rootStyle.fontFamily
    el.style.letterSpacing = rootStyle.letterSpacing
    // physical positioning, logical content: the flex row mirrors so the
    // label lands on the same side of the bar as the resting one in RTL
    el.style.direction = rootStyle.direction
  }

  const isTouch = startEvent.pointerType === "touch"
  // resize activates immediately on precise pointers; on touch it waits for
  // the same long-press as a move, so a stray brush over a bar edge can
  // never start an accidental resize
  let active = kind.startsWith("resize") && !isTouch
  let surface: GanttSurface | null = active ? collectSurface(viewRoot) : null
  let lastProposalKey = ""
  let touchTimer: ReturnType<typeof setTimeout> | null = null
  let lastPointer: PointerEvent = startEvent

  const occurrence = segment?.occurrence

  // ----- neighbour awareness: the other schedules in the SAME node -----
  // A node in "single" mode rejects any concurrency regardless of the
  // overlap option; otherwise the option decides. "allow" short-circuits
  // everything below, so the default gesture path is untouched.
  const nodeId = occurrence?.event.resourceId
  const nodeMode = resolveScheduleMode(
    nodeId === undefined ? null : findResource(settings.resources, nodeId),
    config.scheduleMode
  )
  const overlapPolicy =
    nodeMode === "single" ? ("reject" as const) : settings.overlap
  // Read once per gesture: the gantt never mutates events mid-drag, so the
  // neighbours cannot move under us.
  let neighbourCache: Array<{ start: number; end: number }> | null = null
  const getNeighbours = () => {
    if (neighbourCache) return neighbourCache
    neighbourCache =
      !occurrence || nodeId === undefined || overlapPolicy === "allow"
        ? []
        : api
            .getOccurrences()
            .filter(
              (other) =>
                other.event.resourceId === nodeId &&
                other.key !== occurrence.key
            )
            .map((other) => ({
              start: other.start.getTime(),
              end: other.end.getTime(),
            }))
    return neighbourCache
  }
  const overlapsNeighbour = (start: Date, end: Date) =>
    getNeighbours().some(
      (other) => other.start < end.getTime() && other.end > start.getTime()
    )
  /**
   * Stop the gesture at the neighbour's edge. Runs AFTER snapping so the
   * clamp always wins, and only against neighbours that sit clear of the
   * bar's CURRENT span - a pre-existing overlap has no edge to stop at.
   */
  const clampToNeighbours = (
    start: Date,
    end: Date
  ): { start: Date; end: Date } => {
    if (overlapPolicy !== "clamp" || !occurrence) return { start, end }
    const anchorStart = occurrence.start.getTime()
    const anchorEnd = occurrence.end.getTime()
    let floor = -Infinity
    let ceiling = Infinity
    for (const other of getNeighbours()) {
      if (other.end <= anchorStart) floor = Math.max(floor, other.end)
      else if (other.start >= anchorEnd)
        ceiling = Math.min(ceiling, other.start)
    }
    if (floor === -Infinity && ceiling === Infinity) return { start, end }
    let from = start.getTime()
    let to = end.getTime()
    if (kind === "resize-start") {
      from = Math.min(Math.max(from, floor), to)
    } else if (kind === "resize-end") {
      to = Math.max(Math.min(to, ceiling), from)
    } else {
      // a move keeps its duration and parks against whichever edge it meets
      const duration = to - from
      if (from < floor) {
        from = floor
        to = from + duration
      }
      if (to > ceiling) {
        to = ceiling
        from = to - duration
      }
      // window narrower than the bar itself: park at the earlier edge
      if (from < floor) {
        from = floor
        to = from + duration
      }
    }
    return { start: new Date(from), end: new Date(to) }
  }
  // Set by applyProposal when a "reject" policy refuses the current proposal;
  // read on pointerup so the commit is actually blocked, not merely styled.
  let overlapRejected = false

  // Preserve the grab offset so the bar does not jump to the pointer
  let grabOffsetMin = 0
  // Smooth cursor-following clone for a move: a real-looking bar that tracks
  // the pointer's x via transform (no per-frame React), lifted with a shadow.
  let overlay: HTMLDivElement | null = null
  let grabOffsetPx = 0
  let barTop = 0
  let barWidth = 0
  let barHeight = 0

  const createMoveOverlay = () => {
    if (kind !== "move" || !occurrence || overlay || barWidth === 0) return
    // consumer-rendered preview (renderDragPreview): the view mounts it from
    // drag state; positionOverlay adopts it lazily and only writes transforms
    if (customMoveOverlay) return
    const color = occurrence.event.color ?? "var(--color-primary)"
    overlay = document.createElement("div")
    overlay.setAttribute("data-slot", "gantt-drag-overlay")
    // container: the bar + its label ride together; the label stays OUTSIDE
    // the bar (to the right), matching the resting look - no in-bar text
    overlay.className =
      // physical left-0 anchor: the clone is positioned by translate3d from
      // raw clientX, which is physical - a logical start-0 anchor would pin
      // it to the RIGHT edge in RTL and fling the clone off screen
      "pointer-events-none fixed top-0 left-0 z-100 flex items-center gap-2 will-change-transform"
    adoptRootTypography(overlay)
    overlay.style.height = `${barHeight}px`
    const barEl = document.createElement("div")
    barEl.className = "shrink-0 rounded-sm shadow-lg"
    barEl.style.width = `${barWidth}px`
    barEl.style.height = "100%"
    barEl.style.background = `color-mix(in oklab, ${color} 22%, var(--color-background))`
    barEl.style.outline = `1px solid color-mix(in oklab, ${color} 55%, transparent)`
    overlay.appendChild(barEl)
    const label = document.createElement("span")
    label.className = "text-foreground truncate font-medium whitespace-nowrap"
    label.textContent = occurrence.event.title
    overlay.appendChild(label)
    document.body.appendChild(overlay)
    positionOverlay(lastPointer)
  }

  const positionOverlay = (e: PointerEvent) => {
    if (!overlay && customMoveOverlay && active && kind === "move") {
      overlay = document.querySelector<HTMLDivElement>(
        "[data-slot=gantt-drag-overlay][data-custom]"
      )
      if (overlay) overlay.style.visibility = "visible"
    }
    if (!overlay) return
    // x follows the pointer freely (smooth); y stays on the bar's own row
    overlay.style.transform = `translate3d(${snapToPixel(e.clientX - grabOffsetPx)}px, ${snapToPixel(barTop)}px, 0)`
  }

  // Resize status indicator: a smooth cursor-following edge line plus a live
  // range + duration chip. The dashed ghost still shows the SNAPPED landing;
  // this overlay is the continuous feedback between snap steps.
  let resizeOverlay: HTMLDivElement | null = null
  let resizeLine: HTMLDivElement | null = null
  let resizeRange: HTMLSpanElement | null = null
  let resizeDot: HTMLSpanElement | null = null
  let resizeDuration: HTMLSpanElement | null = null

  const positionResizeOverlay = (e: PointerEvent) => {
    if (!resizeOverlay && customResizeOverlay && kind.startsWith("resize")) {
      resizeOverlay = document.querySelector<HTMLDivElement>(
        "[data-slot=gantt-resize-indicator][data-custom]"
      )
      if (resizeOverlay) resizeOverlay.style.visibility = "visible"
    }
    if (!resizeOverlay || !surface) return
    // x follows the pointer freely (clamped to the track); y stays on the bar
    const x = Math.min(
      Math.max(e.clientX, surface.rect.left),
      surface.rect.right
    )
    resizeOverlay.style.transform = `translate3d(${snapToPixel(x)}px, ${snapToPixel(barTop)}px, 0)`
  }

  const createResizeOverlay = () => {
    if (!kind.startsWith("resize") || !occurrence || resizeOverlay) return
    const barEl = origin.closest<HTMLElement>("[data-slot=gantt-bar]")
    const rect = (barEl ?? origin).getBoundingClientRect()
    barTop = rect.top
    barHeight = rect.height
    // consumer-rendered indicator: rect capture above still runs (the engine
    // positions the consumer's wrapper), only the default DOM is skipped
    if (customResizeOverlay) return
    const color = occurrence.event.color ?? "var(--color-primary)"
    resizeOverlay = document.createElement("div")
    resizeOverlay.setAttribute("data-slot", "gantt-resize-indicator")
    resizeOverlay.className =
      // physical left-0 anchor, same reason as the move clone above
      "pointer-events-none fixed top-0 left-0 z-100 will-change-transform"
    adoptRootTypography(resizeOverlay)
    resizeOverlay.style.height = `${barHeight}px`
    resizeLine = document.createElement("div")
    resizeLine.className = "h-full w-0.5 -translate-x-1/2 rounded-full"
    resizeLine.style.background = color
    resizeOverlay.appendChild(resizeLine)
    const chip = document.createElement("div")
    chip.className =
      // physical left-0: centered with a physical translate on a physical anchor
      // no text size of its own: it inherits the root scale adopted above, so
      // the chip tracks a consumer rescale instead of pinning itself to 12px
      "bg-foreground text-background absolute bottom-full left-0 mb-1.5 flex -translate-x-1/2 items-center gap-1.5 rounded-md px-2 py-1 font-medium whitespace-nowrap"
    resizeRange = document.createElement("span")
    chip.appendChild(resizeRange)
    resizeDot = document.createElement("span")
    resizeDot.className = "bg-background/40 size-1 shrink-0 rounded-full"
    resizeDot.setAttribute("aria-hidden", "true")
    chip.appendChild(resizeDot)
    resizeDuration = document.createElement("span")
    chip.appendChild(resizeDuration)
    // The arrow. Every other bubble in the gantt has one pointing at what it
    // describes; this chip had none, so a resize looked like a different
    // component from the hover hint. Physical left-1/2 to match the chip's own
    // physical anchor, and out of flow so the chip's flex gap ignores it.
    const chipArrow = document.createElement("span")
    chipArrow.setAttribute("aria-hidden", "true")
    chipArrow.className =
      "bg-foreground absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px]"
    chip.appendChild(chipArrow)
    resizeOverlay.appendChild(chip)
    document.body.appendChild(resizeOverlay)
    // seed the chip with the CURRENT range so it never flashes empty;
    // zoned so the label names the same day the grid shows
    resizeRange.textContent = settings.i18n.functions.formatEventTime(
      toZoned(occurrence.start, settings.timeZone),
      toZoned(occurrence.end, settings.timeZone),
      occurrence.allDay ?? false,
      settings.locale
    )
    const days = Math.round(
      (occurrence.end.getTime() - occurrence.start.getTime()) / 86_400_000
    )
    if (days >= 1) {
      resizeDuration.textContent = settings.i18n.labels.durationDays(days)
    } else {
      resizeDot.style.display = "none"
      resizeDuration.style.display = "none"
    }
    positionResizeOverlay(startEvent)
  }

  // resize activates immediately, so its indicator mounts with the gesture
  if (active) createResizeOverlay()

  const activationDistance =
    kind === "create" ? activation.createDistancePx : activation.moveDistancePx

  // Each gesture keeps its own cursor: a resize must stay ew-resize for the
  // whole drag (flipping to grabbing reads as a move), a move grabs.
  const gestureCursor = kind.startsWith("resize") ? "ew-resize" : "grabbing"
  const setBodyDragging = (on: boolean, invalid = false) => {
    document.body.classList.toggle("gantt-dragging", on)
    document.body.style.cursor = on
      ? invalid
        ? "not-allowed"
        : gestureCursor
      : ""
    document.body.style.userSelect = on ? "none" : ""
    if (!on) document.body.style.removeProperty("-webkit-user-select")
  }

  const activate = () => {
    if (active) return
    active = true
    surface = collectSurface(viewRoot)
    // touch resize activates here (long-press) instead of at gesture start,
    // so its indicator mounts now; the guard inside makes this a no-op for
    // every other path
    createResizeOverlay()
    if (kind === "move" && occurrence && surface) {
      const pointerMin = surfaceMinutesAt(surface, startX)
      // TRUE start, never clamped to the range: a bar that begins before the
      // visible window (negative minutes) must keep its real grab offset, or
      // the first snapped proposal teleports its start to the range edge
      const occStartMin =
        (occurrence.start.getTime() - surface.rangeStart) / 60000
      grabOffsetMin = pointerMin - occStartMin
      const rect = origin.getBoundingClientRect()
      barTop = rect.top
      barWidth = rect.width
      barHeight = rect.height
      grabOffsetPx = startX - rect.left
      createMoveOverlay()
    }
    setBodyDragging(true)
  }

  const computeProposal = (
    e: PointerEvent
  ): {
    start: Date
    end: Date
    allDay: boolean
    resourceId?: string
  } | null => {
    if (!surface) return null
    const tl = surface
    const rangeMinutes = (tl.rangeEnd - tl.rangeStart) / 60000
    const minutesAt = (x: number) => surfaceMinutesAt(tl, x)
    // Day-grid scales snap to real zoned midnights, not 1440-minute
    // multiples from the range start - those drift by an hour across DST
    const snapMin = (minutes: number) => {
      if (tl.snapMin < 24 * 60) return snapMinutes(minutes, tl.snapMin)
      const ms = tl.rangeStart + minutes * 60000
      const dayStart = zonedStartOfDay(new Date(ms), settings.timeZone)
      const dayEnd = zonedStartOfDay(
        addDays(toZoned(new Date(ms), settings.timeZone), 1),
        settings.timeZone
      )
      const snapped =
        ms - dayStart.getTime() < dayEnd.getTime() - ms ? dayStart : dayEnd
      return (snapped.getTime() - tl.rangeStart) / 60000
    }
    const rowAt = (y: number) => {
      let best = tl.rows[0]
      for (const row of tl.rows) {
        if (y >= row.rect.top && y < row.rect.bottom) return row
        if (
          best &&
          Math.abs(y - (row.rect.top + row.rect.height / 2)) <
            Math.abs(y - (best.rect.top + best.rect.height / 2))
        ) {
          best = row
        }
      }
      return best
    }
    const at = (minutes: number) => new Date(tl.rangeStart + minutes * 60000)

    if (kind === "create") {
      const anchorMin = snapMin(minutesAt(startX))
      const curMin = snapMin(minutesAt(e.clientX))
      const lo = Math.min(anchorMin, curMin)
      // a bare click still yields a usable slot: at least slotDuration long
      const hi = Math.max(
        anchorMin,
        curMin,
        lo + Math.max(tl.snapMin, settings.slotDuration)
      )
      return {
        start: at(lo),
        end: at(hi),
        allDay: false,
        resourceId: rowAt(startY)?.resourceId,
      }
    }
    if (!occurrence) return null
    const midnightAligned = (d: Date) =>
      zonedStartOfDay(d, settings.timeZone).getTime() === d.getTime()
    if (kind === "move") {
      // x-axis only: the bar slides along its OWN row, never across rows.
      // The proposal preserves the pointer DELTA - no clamping to the visible
      // range, or bars crossing the window edge would teleport to it.
      const start = at(snapMin(minutesAt(e.clientX) - grabOffsetMin))
      // Day-snapped scales preserve the CALENDAR span for day-aligned bars:
      // a 3-day bar dragged across a DST change stays midnight-to-midnight
      // (72h +/- 1h), never drifting to a 23:00 end. Sub-day events keep
      // their exact ms duration.
      let end: Date
      if (
        tl.snapMin >= 24 * 60 &&
        (occurrence.allDay ||
          (midnightAligned(occurrence.start) &&
            midnightAligned(occurrence.end)))
      ) {
        const daySpan = Math.max(
          differenceInCalendarDays(
            toZoned(occurrence.end, settings.timeZone),
            toZoned(occurrence.start, settings.timeZone)
          ),
          1
        )
        end = zonedStartOfDay(
          addDays(toZoned(start, settings.timeZone), daySpan),
          settings.timeZone
        )
      } else {
        end = new Date(
          start.getTime() +
            (occurrence.end.getTime() - occurrence.start.getTime())
        )
      }
      const bounded = clampToNeighbours(start, end)
      return {
        start: bounded.start,
        end: bounded.end,
        allDay: occurrence.allDay,
        resourceId: occurrence.event.resourceId,
      }
    }
    const min = snapMin(minutesAt(e.clientX))
    if (kind === "resize-start") {
      const endMin = (occurrence.end.getTime() - tl.rangeStart) / 60000
      // Minimum length = one snap unit; on day grids that unit is the LAST
      // zoned midnight before the end (raw 1440-minute arithmetic lands off
      // the midnight grid across DST changes).
      const maxStartMin =
        tl.snapMin >= 24 * 60
          ? (zonedStartOfDay(
              midnightAligned(occurrence.end)
                ? addDays(toZoned(occurrence.end, settings.timeZone), -1)
                : occurrence.end,
              settings.timeZone
            ).getTime() -
              tl.rangeStart) /
            60000
          : endMin - tl.snapMin
      const clamped = Math.min(Math.max(min, 0), maxStartMin)
      const bounded = clampToNeighbours(at(clamped), occurrence.end)
      return {
        start: bounded.start,
        end: bounded.end,
        allDay: occurrence.allDay,
        resourceId: occurrence.event.resourceId,
      }
    }
    const startMin = (occurrence.start.getTime() - tl.rangeStart) / 60000
    // Mirror of the resize-start bound: the FIRST zoned midnight after the
    // start on day grids, plain snap arithmetic otherwise.
    const minEndMin =
      tl.snapMin >= 24 * 60
        ? (zonedStartOfDay(
            addDays(toZoned(occurrence.start, settings.timeZone), 1),
            settings.timeZone
          ).getTime() -
            tl.rangeStart) /
          60000
        : startMin + tl.snapMin
    const clamped = Math.max(Math.min(min, rangeMinutes), minEndMin)
    const bounded = clampToNeighbours(occurrence.start, at(clamped))
    return {
      start: bounded.start,
      end: bounded.end,
      allDay: occurrence.allDay,
      resourceId: occurrence.event.resourceId,
    }
  }

  const applyProposal = (e: PointerEvent) => {
    const proposal = computeProposal(e)
    if (!proposal) return
    const key = `${proposal.start.getTime()}-${proposal.end.getTime()}-${proposal.allDay}-${proposal.resourceId ?? ""}`
    if (key === lastProposalKey) return
    lastProposalKey = key

    if (kind === "create") {
      const draft = { ...proposal }
      if (settings.canSelectSlot && !settings.canSelectSlot(draft)) return
      internals.setSlotDraft(draft)
      return
    }
    const update: GanttProposedUpdate<TData> = {
      event: occurrence!.event,
      occurrence: occurrence!,
      ...proposal,
      source:
        kind === "move" ? "drag" : (kind as "resize-start" | "resize-end"),
    }
    // "reject" is the one veto the engine owns: it both styles the ghost AND
    // blocks the commit below. canDropEvent stays advisory, as documented.
    overlapRejected =
      overlapPolicy === "reject" &&
      overlapsNeighbour(proposal.start, proposal.end)
    const valid =
      !overlapRejected &&
      (settings.canDropEvent ? settings.canDropEvent(update) : true)
    // live status: the indicator chip always names the CURRENT proposed
    // range; the edge line flips to destructive on an invalid drop
    if (resizeRange && resizeDot && resizeDuration) {
      resizeRange.textContent = settings.i18n.functions.formatEventTime(
        toZoned(proposal.start, settings.timeZone),
        toZoned(proposal.end, settings.timeZone),
        proposal.allDay,
        settings.locale
      )
      const days = Math.round(
        (proposal.end.getTime() - proposal.start.getTime()) / 86_400_000
      )
      const showDays = days >= 1
      resizeDot.style.display = showDays ? "" : "none"
      resizeDuration.style.display = showDays ? "" : "none"
      if (showDays) {
        resizeDuration.textContent = settings.i18n.labels.durationDays(days)
      }
    }
    if (resizeLine) {
      resizeLine.style.background = valid
        ? (occurrence!.event.color ?? "var(--color-primary)")
        : "var(--color-destructive)"
    }
    setBodyDragging(true, !valid)
    internals.setDrag({
      kind: kind === "move" ? "move" : (kind as "resize-start" | "resize-end"),
      occurrence: occurrence!,
      proposedStart: proposal.start,
      proposedEnd: proposal.end,
      proposedAllDay: proposal.allDay,
      proposedResourceId: proposal.resourceId,
      valid,
    })
  }

  // ----- edge auto-scroll: pan the timeline while dragging near its edge -----
  // The pointer is clamped to the visible track, so without this a bar can
  // never travel past the window. Holding the pointer inside the edge zone
  // scrolls the viewport (speed eased by proximity), refreshes the track rect
  // (the axis moved under the pointer) and re-derives the proposal from the
  // same pointer position. Programmatic scrolls never mark user intent, so
  // this can never trigger infinite-range growth mid-gesture.
  const AUTO_SCROLL_EDGE_PX = 24
  const AUTO_SCROLL_MAX_SPEED = 14
  let autoScrollRaf = 0
  const timelineViewport = viewRoot?.querySelector<HTMLElement>(
    "[data-slot=gantt-timeline-pane] [data-slot=scroll-area-viewport]"
  )
  const autoScrollTick = () => {
    autoScrollRaf = 0
    if (finished || !active || !surface || !timelineViewport) return
    const paneRect = timelineViewport.getBoundingClientRect()
    const x = lastPointer.clientX
    let speed = 0
    if (x < paneRect.left + AUTO_SCROLL_EDGE_PX) {
      speed =
        -((paneRect.left + AUTO_SCROLL_EDGE_PX - x) / AUTO_SCROLL_EDGE_PX) *
        AUTO_SCROLL_MAX_SPEED
    } else if (x > paneRect.right - AUTO_SCROLL_EDGE_PX) {
      speed =
        ((x - (paneRect.right - AUTO_SCROLL_EDGE_PX)) / AUTO_SCROLL_EDGE_PX) *
        AUTO_SCROLL_MAX_SPEED
    }
    if (speed === 0) return
    const before = timelineViewport.scrollLeft
    timelineViewport.scrollLeft = before + speed
    if (timelineViewport.scrollLeft === before) return // parked on the end
    const axis = viewRoot?.querySelector<HTMLElement>("[data-gantt-axis]")
    if (axis) surface.rect = axis.getBoundingClientRect()
    applyProposal(lastPointer)
    positionResizeOverlay(lastPointer)
    scheduleAutoScroll()
  }
  const scheduleAutoScroll = () => {
    if (!autoScrollRaf) autoScrollRaf = requestAnimationFrame(autoScrollTick)
  }

  // idempotent: pointerup, pointercancel, Escape, blur and the view-level
  // teardown can race; whichever lands first wins and the rest no-op
  let finished = false
  const cleanup = () => {
    if (finished) return
    finished = true
    activeGestureCancels.delete(cancel)
    if (autoScrollRaf) cancelAnimationFrame(autoScrollRaf)
    try {
      origin.releasePointerCapture(pointerId)
    } catch {
      // capture already released (pointer gone or origin detached)
    }
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("pointerup", onPointerUp)
    window.removeEventListener("pointercancel", onCancel)
    window.removeEventListener("blur", onWindowBlur)
    window.removeEventListener("keydown", onKeyDown, true)
    if (touchTimer) clearTimeout(touchTimer)
    // consumer-rendered overlays are React-owned: they unmount when the drag
    // state clears, so the engine must never removeChild them itself
    if (!customMoveOverlay) overlay?.remove()
    overlay = null
    if (!customResizeOverlay) resizeOverlay?.remove()
    resizeOverlay = null
    setBodyDragging(false)
  }

  const cancel = () => {
    cleanup()
    if (active) {
      lastGestureEndedAt = performance.now()
      internals.setDrag(null)
      internals.setSlotDraft(null)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation()
      cancel()
    }
  }

  // focus loss mid-gesture (alt-tab, OS dialogs) means the release may never
  // be delivered; treat it as a cancel so the gesture cannot get stuck
  const onWindowBlur = () => cancel()

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    lastPointer = e
    if (!active) {
      const distance = Math.hypot(e.clientX - startX, e.clientY - startY)
      if (isTouch) {
        // Long-press pending: moving past tolerance means scroll, not drag
        if (distance > activation.touchTolerancePx) cancel()
        return
      }
      if (distance < activationDistance) return
      activate()
    }
    applyProposal(e)
    positionOverlay(e)
    positionResizeOverlay(e)
    scheduleAutoScroll()
  }

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    cleanup()
    if (!active) return
    lastGestureEndedAt = performance.now()

    const state = instance.getState()
    if (kind === "create") {
      const draft = state.slotDraft
      internals.setSlotDraft(null)
      if (draft) {
        api.select({
          slot: { start: draft.start, end: draft.end, allDay: draft.allDay },
        })
        settings.onSelectSlot?.(draft)
      }
      return
    }
    const drag = state.drag
    internals.setDrag(null)
    if (!drag || !occurrence) return
    // the node refuses concurrency: revert instead of committing an overlap
    if (overlapRejected) return
    const unchanged =
      drag.proposedStart.getTime() === occurrence.start.getTime() &&
      drag.proposedEnd.getTime() === occurrence.end.getTime() &&
      (drag.proposedResourceId === undefined ||
        drag.proposedResourceId === occurrence.event.resourceId)
    if (unchanged) return
    // Commit through the one validation funnel; consumer reject = automatic
    // revert because the gantt never mutated during the gesture.
    const accepted = internals.applyProposedUpdate({
      event: occurrence.event,
      occurrence,
      start: drag.proposedStart,
      end: drag.proposedEnd,
      allDay: drag.proposedAllDay,
      resourceId: drag.proposedResourceId,
      source:
        kind === "move" ? "drag" : (kind as "resize-start" | "resize-end"),
    })
    if (accepted && announcer) {
      announcer.textContent = `${occurrence.event.title}, ${settings.i18n.functions.formatEventTime(
        toZoned(drag.proposedStart, settings.timeZone),
        toZoned(drag.proposedEnd, settings.timeZone),
        drag.proposedAllDay,
        settings.locale
      )}`
    }
  }

  const onCancel = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    cancel()
  }

  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointercancel", onCancel)
  window.addEventListener("blur", onWindowBlur)
  window.addEventListener("keydown", onKeyDown, true)
  activeGestureCancels.add(cancel)

  // Capture the pointer so a release OUTSIDE the OS window still delivers
  // pointerup here instead of leaving the gesture stuck. Captured events keep
  // bubbling to the window listeners above, and if the origin node is removed
  // mid-gesture the capture auto-releases - behavior then degrades to plain
  // window listeners, never worse than before. Guarded: the pointer can
  // already be gone by now (fast flicks, synthetic events).
  try {
    origin.setPointerCapture(pointerId)
  } catch {
    // capture is an enhancement, never a requirement
  }

  // Touch: long-press activation (movement past tolerance cancels above)
  if (isTouch && !active) {
    touchTimer = setTimeout(() => {
      activate()
      applyProposal(lastPointer)
    }, activation.touchDelayMs)
  }
}

/** Per-bar / per-row pointer gesture wiring. */
function useGanttGestures<TData = unknown>() {
  const instance = useGantt<TData>()
  const viewConfig = useGanttViewConfig<TData>()
  // presence flags only: the engine skips its default overlay DOM and
  // positions the consumer-rendered node instead
  const customMoveOverlay = !!viewConfig.renderDragPreview
  const customResizeOverlay = !!viewConfig.renderResizeIndicator

  const canDrag = useCallback(
    (segment: GanttSegment<TData>) => {
      const { interactions } = instance.getState()
      const event = segment.occurrence.event
      return interactions.drag && !event.readOnly && event.draggable !== false
    },
    [instance]
  )

  const beginMove = useCallback(
    (e: React.PointerEvent, segment: GanttSegment<TData>) => {
      if (e.button !== 0 || !canDrag(segment)) return
      beginGesture({
        instance,
        kind: "move",
        origin: e.currentTarget as HTMLElement,
        startEvent: e.nativeEvent,
        segment,
        customMoveOverlay,
        scheduleMode: viewConfig.scheduleMode,
      })
    },
    [instance, canDrag, customMoveOverlay, viewConfig.scheduleMode]
  )

  const canResize = useCallback(
    (segment: GanttSegment<TData>) => {
      const { interactions } = instance.getState()
      const event = segment.occurrence.event
      return interactions.resize && !event.readOnly && event.resizable !== false
    },
    [instance]
  )

  const beginResize = useCallback(
    (
      e: React.PointerEvent,
      segment: GanttSegment<TData>,
      edge: "start" | "end"
    ) => {
      if (e.button !== 0 || !canResize(segment)) return
      e.stopPropagation()
      e.preventDefault()
      beginGesture({
        instance,
        kind: edge === "start" ? "resize-start" : "resize-end",
        origin: e.currentTarget as HTMLElement,
        startEvent: e.nativeEvent,
        segment,
        customResizeOverlay,
        scheduleMode: viewConfig.scheduleMode,
      })
    },
    [instance, canResize, customResizeOverlay, viewConfig.scheduleMode]
  )

  const beginCreate = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      if (!instance.getState().interactions.selectSlot) return
      beginGesture({
        instance,
        kind: "create",
        origin: e.currentTarget as HTMLElement,
        startEvent: e.nativeEvent,
      })
    },
    [instance]
  )

  return { beginMove, beginResize, beginCreate, canDrag, canResize }
}

export {
  cancelActiveGanttGestures,
  GANTT_ACTIVATION,
  markGestureEnd,
  useGanttGestures,
  useGanttGestureTeardown,
  wasRecentDrag,
}
