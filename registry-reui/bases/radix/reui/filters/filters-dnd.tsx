// Title: Filters Dnd
// Description: Pointer-based drag layer for the advanced condition builder - a carry clone that follows the pointer, drop indicators between rows and into groups, and Alt to copy.

"use client"

import * as React from "react"

/**
 * Gesture model copied from `event-calendar-dnd.tsx`, deliberately not
 * imported: filters installs on its own and must not pull a whole calendar into
 * `shadcn add filters`. Vanilla-DOM overlay, so a drag renders no React.
 */
export const FILTER_DND_ACTIVATION = {
  /** Mouse travel before a press becomes a drag. Below this it stays a click. */
  moveDistancePx: 5,
  /** Touch long-press before a drag starts, so a swipe still scrolls. */
  touchDelayMs: 250,
  touchTolerancePx: 5,
  autoScrollEdgePx: 40,
  autoScrollMaxStepPx: 12,
  /** A seed only: `createCarry` measures the real grab offset before paint. */
  carryPointerOffsetPx: 12,
} as const

/** One rule row, or one group's header row. Both are drag sources and targets. */
export const FILTER_ROW_SELECTOR = '[data-slot="filter-row"]'

/** Explicit "drop INSIDE": a row hit test can only ever say "beside". */
export const FILTER_DROP_ZONE_SELECTOR = "[data-drop-parent]"

/** Marked alongside the zone, so lighting the group costs no `:has()`. */
export const FILTER_GROUP_SELECTOR = '[data-slot="filter-group"]'

/** Geometry only, so resolution is a pure function and a table test. */
export interface FilterDropBox {
  top: number
  bottom: number
  left: number
  right: number
  /** The group the drop writes into. */
  parentId: string
  /** Where in that group's children the node lands, not a slot in this list. */
  index: number
  /** How many rows enclose this box. Deeper wins. */
  depth: number
}

export interface FilterDropResolution<T extends FilterDropBox> {
  target: T
  /** Null for a zone: INTO the group rather than beside anything. */
  edge: "before" | "after" | null
}

function contains(box: FilterDropBox, x: number, y: number, grow = 0): boolean {
  return (
    x >= box.left &&
    x <= box.right &&
    y >= box.top - grow &&
    y <= box.bottom + grow
  )
}

/**
 * How far a ROW reaches past its own rect when hit tested: HALF the sibling
 * gap, which is `gap-3`, so six. `FILTER_ROW_GAP_CLASS` is the other half of
 * one measurement; this moves whenever that does.
 *
 * The seam between adjacent rows is inside NEITHER rect, so a pointer aimed
 * between two rows fell through to whatever did enclose it: at the top level
 * nothing did, so the cursor said `no-drop`; one level in it was the group.
 * Half the gap makes siblings tile, and the depth sort keeps the child ahead of
 * that group. Rows only: zones are explicit strips.
 */
export const FILTER_ROW_SEAM_PX = 6

/**
 * Zones before rows, then the DEEPEST box: a group's rect encloses everything
 * it holds, so a nested condition would otherwise resolve to its whole group.
 * `seam` is a parameter, not the constant inlined, so the tiling rule itself is
 * a table test.
 */
export function resolveFilterDrop<T extends FilterDropBox>(
  zones: T[],
  rows: T[],
  x: number,
  y: number,
  seam: number = FILTER_ROW_SEAM_PX
): FilterDropResolution<T> | null {
  let zone: T | null = null
  for (const candidate of zones) {
    if (!contains(candidate, x, y)) continue
    if (!zone || candidate.depth > zone.depth) zone = candidate
  }
  if (zone) return { target: zone, edge: null }

  let row: T | null = null
  for (const candidate of rows) {
    if (!contains(candidate, x, y, seam)) continue
    if (!row || candidate.depth > row.depth) row = candidate
  }
  if (!row) return null

  // The midpoint, not the nearest edge: a row is the width of the panel, so a
  // proximity test would leave the indicator undecided across most of one.
  const after = y > row.top + (row.bottom - row.top) / 2
  return {
    target: { ...row, index: row.index + (after ? 1 : 0) },
    edge: after ? "after" : "before",
  }
}

/** Where a dragged node started, which is what makes a drop a no-op or not. */
export interface FilterDropOrigin {
  parentId: string
  index: number
}

/**
 * Both indices name the slot the node already occupies, because
 * `moveFilterNodeTo` closes the gap the detach leaves. Copy is never a no-op.
 */
export function isFilterDropNoop(
  resolution: FilterDropResolution<FilterDropBox> | null,
  origin: FilterDropOrigin | null,
  copy: boolean
): boolean {
  if (!resolution || !origin || copy) return false
  if (resolution.target.parentId !== origin.parentId) return false
  return (
    resolution.target.index === origin.index ||
    resolution.target.index === origin.index + 1
  )
}

/** Rows unmount mid-gesture, so it is the PANEL leaving that aborts a drag. */
const activeCancels = new Set<() => void>()

/** Cancel and fully revert every in-flight filter row drag. */
export function cancelActiveFilterDrags(): void {
  for (const cancel of [...activeCancels]) cancel()
}

let lastDragEndedAt = 0

/**
 * Whether a drag ended within the last few frames. Exported: a consumer's own
 * row click handler needs the same answer the suppressor below needs.
 */
export function wasRecentFilterDrag(): boolean {
  return performance.now() - lastDragEndedAt < 250
}

/**
 * NOT `{ once: true }` alone: a drag that ends over a different element fires
 * no click at all, and a stale arming would eat the user's next click. The
 * timestamp is what makes that stale arming harmless.
 */
function suppressTrailingClick(event: MouseEvent) {
  window.removeEventListener("click", suppressTrailingClick, true)
  if (!wasRecentFilterDrag()) return
  event.stopPropagation()
  event.preventDefault()
}

/** The carry is a compositing layer: a subpixel translate blurs its text. */
function snapToPixel(value: number): number {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
  return Math.round(value * dpr) / dpr
}

/**
 * `card` is a ZONE's group, resolved once rather than walked per frame. Null on
 * a row, which stands for itself.
 */
type MeasuredBox = FilterDropBox & {
  el: HTMLElement
  card: HTMLElement | null
}

interface Surface {
  zones: MeasuredBox[]
  rows: MeasuredBox[]
  /**
   * Rects are captured ONCE, so one subtraction against this scrollTop corrects
   * for scrolling instead of a per-move `getBoundingClientRect`. THE ELEMENT,
   * NOT A MIRRORED NUMBER: a mirror tracks only this engine's own scrolling, so
   * a wheel mid-gesture left the rects stale while the correction read zero,
   * painting the indicator 60px off the pointer.
   */
  viewport: HTMLElement | null
  viewportRect: DOMRect | null
  /** The one number kept: where the rects were taken, which cannot change. */
  startScrollTop: number
}

/**
 * The nearest scroller, THIS ONE INCLUDED: the panel is exactly what a consumer
 * caps with `overflow-y: auto`, and a walk from the parent answered null for it.
 */
function findScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el ?? null
  while (node) {
    const style = getComputedStyle(node)
    const overflow = `${style.overflowY} ${style.overflow}`
    if (
      /(auto|scroll|overlay)/.test(overflow) &&
      node.scrollHeight > node.clientHeight
    ) {
      return node
    }
    node = node.parentElement
  }
  return null
}

function rowDepth(el: HTMLElement, root: HTMLElement): number {
  let depth = 0
  let node = el.parentElement
  while (node && node !== root) {
    if (node.matches(FILTER_ROW_SELECTOR)) depth++
    node = node.parentElement
  }
  return depth
}

/**
 * Measured once. DESCENDANTS of the dragged node are excluded rather than
 * refused later: an indicator the drop ignores is a broken promise. The dragged
 * row ITSELF is kept, so its own slot reads as a no-op, not as a hole.
 */
function collectSurface(root: HTMLElement, dragged: HTMLElement): Surface {
  const zones: MeasuredBox[] = []
  const rows: MeasuredBox[] = []

  for (const el of root.querySelectorAll<HTMLElement>(
    FILTER_DROP_ZONE_SELECTOR
  )) {
    if (dragged.contains(el)) continue
    const parentId = el.dataset.dropParent
    if (!parentId) continue
    const rect = el.getBoundingClientRect()
    zones.push({
      el,
      card: el.closest<HTMLElement>(FILTER_GROUP_SELECTOR),
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      parentId,
      index: Number(el.dataset.dropIndex ?? 0),
      depth: rowDepth(el, root),
    })
  }

  for (const el of root.querySelectorAll<HTMLElement>(FILTER_ROW_SELECTOR)) {
    if (el !== dragged && dragged.contains(el)) continue
    const parentId = el.dataset.parentId
    if (!parentId) continue
    const rect = el.getBoundingClientRect()
    rows.push({
      el,
      card: null,
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      parentId,
      index: Number(el.dataset.index ?? 0),
      depth: rowDepth(el, root),
    })
  }

  const viewport = findScrollParent(root)
  return {
    zones,
    rows,
    viewport,
    viewportRect: viewport?.getBoundingClientRect() ?? null,
    startScrollTop: viewport?.scrollTop ?? 0,
  }
}

export interface FilterDropDetails {
  parentId: string
  index: number
  /** Alt was held at release: copy the node rather than moving it. */
  copy: boolean
}

export interface FilterRowDragOptions {
  /** The PANEL, not its body: the top-level append zone is in the footer. */
  root: () => HTMLElement | null
  onDrop: (nodeId: string, details: FilterDropDetails) => void
  disabled?: boolean
}

/**
 * Straight to the DOM: a React state write per move is a tree render. A zone
 * marks TWO elements, itself and its card, and both clear every frame.
 */
function paint(
  surface: Surface,
  hit: FilterDropResolution<MeasuredBox> | null
) {
  for (const box of surface.zones) {
    delete box.el.dataset.dropInto
    if (box.card) delete box.card.dataset.dropInto
  }
  for (const box of surface.rows) delete box.el.dataset.dropEdge
  if (!hit) return
  if (hit.edge) {
    hit.target.el.dataset.dropEdge = hit.edge
    return
  }
  hit.target.el.dataset.dropInto = ""
  if (hit.target.card) hit.target.card.dataset.dropInto = ""
}

function startDrag(
  event: React.PointerEvent<HTMLElement>,
  nodeId: string,
  options: FilterRowDragOptions
) {
  const handle = event.currentTarget
  const root = options.root()
  const source = handle.closest<HTMLElement>(FILTER_ROW_SELECTOR)
  if (!root || !source) return

  const pointerId = event.pointerId
  const isTouch = event.pointerType === "touch"
  const startX = event.clientX
  const startY = event.clientY

  // Off the row's own attributes, which it already publishes for the hit test.
  // Asking the panel would mean threading a position through the drag context.
  const origin: FilterDropOrigin | null = source.dataset.parentId
    ? {
        parentId: source.dataset.parentId,
        index: Number(source.dataset.index ?? 0),
      }
    : null

  let active = false
  let finished = false
  let surface: Surface | null = null
  let hit: FilterDropResolution<MeasuredBox> | null = null
  let copy = event.altKey
  let lastEvent: PointerEvent | null = null
  let touchTimer: ReturnType<typeof setTimeout> | null = null
  let rafScroll = 0

  // Three states, not a boolean: `"ok"` lands somewhere new, `"noop"` puts the
  // node back where it came from, `"none"` is over nothing at all.
  let dropState: "ok" | "noop" | "none" = "none"

  let carryEl: HTMLDivElement | null = null
  let badgeEl: HTMLSpanElement | null = null
  // Where inside the row the pointer went down, so the copy holds that spot.
  // Measured in `createCarry`, which runs before anything reads these.
  let grabOffsetX = FILTER_DND_ACTIVATION.carryPointerOffsetPx
  let grabOffsetY = FILTER_DND_ACTIVATION.carryPointerOffsetPx

  const createCarry = () => {
    const rect = source.getBoundingClientRect()
    grabOffsetX = startX - rect.left
    grabOffsetY = startY - rect.top

    carryEl = document.createElement("div")
    carryEl.setAttribute("data-slot", "filters-drag-carry")
    carryEl.setAttribute("aria-hidden", "true")
    // `data-drop-invalid` rather than a toggled class name, so the style stays
    // one static string Tailwind can see at build time.
    //
    // Muted and translucent, no border or shadow: the clone carries the row's
    // own controls, and a box around them read as a card leaving the page. Only
    // the invalid state marks the clone, since nothing else says the drop is
    // dead, and it RINGS rather than going dashed: dashed is this builder's
    // word for "a row can land here", and the clone is not one.
    carryEl.className =
      "pointer-events-none fixed " +
      "top-0 left-0 z-100 " +
      "opacity-95 will-change-transform " +
      "data-drop-invalid:ring-destructive/70 data-drop-invalid:ring-2 " +
      "data-drop-invalid:opacity-60"
    // A bare anchor: the clip box below owns the size, and no overflow lets the
    // badge overhang.
    carryEl.style.position = "fixed"

    const clone = source.cloneNode(true) as HTMLElement
    // The source is faded while in flight; its copy must not inherit that.
    delete clone.dataset.dragging
    delete clone.dataset.dropNoop
    delete clone.dataset.dropEdge
    if (rect.width > 0) clone.style.width = `${rect.width}px`

    /*
      SANITIZED, because the clone lives on `<body>`: two elements would claim
      one node id, `aria-hidden` leaves real buttons in the tab order and must
      never wrap a focused one, and cloned ids make a `for` resolve to a copy.
    */
    const strip = (el: HTMLElement) => {
      el.removeAttribute("id")
      el.removeAttribute("data-node-id")
      el.removeAttribute("data-filter-cell")
      if (el.dataset.slot === "filter-row") el.removeAttribute("data-slot")
      // `-1` rather than removed: the attribute is also how the roving scheme
      // marks its cells, and a row copied mid-gesture has one cell at `0`.
      el.setAttribute("tabindex", "-1")
    }
    strip(clone)
    for (const el of clone.querySelectorAll<HTMLElement>("*")) strip(el)

    /*
      The CLIPPING box is the inner one: the carry is the badge's containing
      block, so `overflow-hidden` there clipped the badge that overhangs it.
    */
    const clip = document.createElement("div")
    clip.className = "bg-background overflow-hidden rounded-md"
    // Sized only when the rect is real: a document that is not being laid out
    // measures zero, and a copy pinned to `0px` is invisible.
    if (rect.width > 0) clip.style.width = `${rect.width}px`
    if (rect.height > 0) clip.style.height = `${rect.height}px`
    clip.appendChild(clone)
    carryEl.appendChild(clip)

    badgeEl = document.createElement("span")
    badgeEl.setAttribute("data-slot", "filters-drag-copy")
    badgeEl.className =
      "bg-primary text-primary-foreground absolute -end-1.5 -top-1.5 flex " +
      "size-4 items-center justify-center rounded-full text-[10px] leading-none"
    badgeEl.textContent = "+"
    // Legible BEFORE the release, or Alt is discoverable only by error.
    badgeEl.hidden = !copy
    carryEl.appendChild(badgeEl)

    // <body>, not the panel: a transform or a `content-visibility` on a wrapper
    // becomes the containing block for `position: fixed`, and the clone jumps.
    document.body.appendChild(carryEl)
    positionCarry(startX, startY)
  }

  const positionCarry = (x: number, y: number) => {
    if (!carryEl) return
    // THE GRAB OFFSET, not a fixed nudge: the grip sits at the row's trailing
    // edge, so anchoring at the pointer hung the copy a row's width away.
    carryEl.style.transform = `translate3d(${snapToPixel(x - grabOffsetX)}px, ${snapToPixel(y - grabOffsetY)}px, 0)`
  }

  // Two things decide the cursor and the RESOLUTION outranks Alt, which is why
  // `none` is tested first: `copy` over nothing is still nothing.
  const paintCursor = () => {
    if (!active) return
    document.body.style.cursor =
      dropState === "none" ? "no-drop" : copy ? "copy" : "grabbing"
  }

  // Deliberately NOT guarded on `dropState === next`: the first resolution of a
  // gesture is routinely `"none"`, which is also the initial value, so a guard
  // left the first frame of a drag onto nothing wearing no mark at all.
  const setDropState = (next: typeof dropState) => {
    dropState = next
    // On the SOURCE: "it stays here" is a statement about the row carried.
    if (next === "noop") source.dataset.dropNoop = ""
    else delete source.dataset.dropNoop
    // And on the CARRY: over nothing there is no target left to mark.
    if (carryEl) {
      if (next === "none") carryEl.dataset.dropInvalid = ""
      else delete carryEl.dataset.dropInvalid
    }
    paintCursor()
  }

  const setCopy = (next: boolean) => {
    if (copy === next) return
    copy = next
    if (badgeEl) badgeEl.hidden = !next
    paintCursor()
    // Alt changes the ANSWER, not just the cursor: a release beside yourself is
    // a no-op while moving and a duplicate in place while copying.
    if (lastEvent) hitTest(lastEvent.clientX, lastEvent.clientY)
  }

  const hitTest = (x: number, y: number) => {
    if (!surface) return
    // One subtraction instead of a re-measure. Read off the ELEMENT every time:
    // see `Surface.viewport`, a mirror misses the user's own scroll.
    const scrolled = surface.viewport?.scrollTop ?? surface.startScrollTop
    const drift = scrolled - surface.startScrollTop
    const resolved = resolveFilterDrop(
      surface.zones,
      surface.rows,
      x,
      y + drift
    )
    const noop = isFilterDropNoop(resolved, origin, copy)
    // A no-op commits as NOTHING, not as a move the tree would discard.
    hit = noop ? null : resolved
    paint(surface, hit)
    setDropState(noop ? "noop" : hit ? "ok" : "none")
  }

  const autoScroll = (y: number) => {
    if (rafScroll) cancelAnimationFrame(rafScroll)
    rafScroll = 0
    const viewport = surface?.viewport
    const rect = surface?.viewportRect
    if (!viewport || !rect) return

    const edge = FILTER_DND_ACTIVATION.autoScrollEdgePx
    const step = FILTER_DND_ACTIVATION.autoScrollMaxStepPx
    let delta = 0
    if (y >= rect.top && y < rect.top + edge) {
      delta = -step * ((rect.top + edge - y) / edge)
    } else if (y <= rect.bottom && y > rect.bottom - edge) {
      delta = step * Math.min(1, (y - (rect.bottom - edge)) / edge)
    }
    if (delta === 0) return

    const tick = () => {
      // The read-back STOPS the loop: the browser clamps at the scroll extent,
      // so a panel at its limit would keep asking for unusable frames.
      const before = viewport.scrollTop
      viewport.scrollTop = before + delta
      if (viewport.scrollTop === before) return
      if (lastEvent) hitTest(lastEvent.clientX, lastEvent.clientY)
      rafScroll = requestAnimationFrame(tick)
    }
    rafScroll = requestAnimationFrame(tick)
  }

  /**
   * A still pointer fires no `pointermove`, so a wheel mid-drag would leave the
   * last answer painted while the rows slid out from under it. The overlap
   * with the autoScroll tick is deliberate: this is arithmetic over boxes
   * already measured, and one redundant pass per frame is cheaper than a rule
   * about who owns the repaint.
   */
  const onViewportScroll = () => {
    if (!active || !lastEvent) return
    hitTest(lastEvent.clientX, lastEvent.clientY)
  }

  const activate = () => {
    if (active) return
    active = true
    surface = collectSurface(root, source)

    // Passive: nothing here calls `preventDefault`, and a non-passive listener
    // on a scroller is a frame of jank per notch.
    surface.viewport?.addEventListener("scroll", onViewportScroll, {
      passive: true,
    })
    source.dataset.dragging = ""
    document.body.style.cursor = copy ? "copy" : "grabbing"
    document.body.style.userSelect = "none"
    createCarry()
    // Armed with the GESTURE, not the press: a press that never travels far
    // enough strands no overlay, no body style and no listener.
    window.addEventListener("blur", onWindowBlur)
  }

  // Idempotent. pointerup, pointercancel, Escape, window blur and the panel's
  // own teardown can all race; whichever lands first wins and the rest no-op.
  const cleanup = () => {
    if (finished) return
    finished = true
    activeCancels.delete(cancel)
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("pointerup", onPointerUp)
    window.removeEventListener("pointercancel", onPointerCancel)
    window.removeEventListener("keydown", onKeyDown, true)
    window.removeEventListener("keyup", onKeyUp, true)
    window.removeEventListener("blur", onWindowBlur)
    surface?.viewport?.removeEventListener("scroll", onViewportScroll)
    if (touchTimer) clearTimeout(touchTimer)
    if (rafScroll) cancelAnimationFrame(rafScroll)
    if (surface) paint(surface, null)
    delete source.dataset.dragging
    delete source.dataset.dropNoop
    carryEl?.remove()
    carryEl = null
    badgeEl = null
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }

  /** A bare teardown: nothing is committed until release, so no snapshot. */
  const cancel = () => {
    if (active) lastDragEndedAt = performance.now()
    cleanup()
  }

  const onWindowBlur = () => cancel()

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && active) {
      // Stopped, or the popover the builder may be living in closes underneath
      // the gesture and takes the panel the drop was aimed at with it.
      e.stopPropagation()
      e.preventDefault()
      cancel()
      return
    }
    if (e.key === "Alt") setCopy(true)
  }

  // Alt tracked on its own keys too: reaching for the modifier without moving
  // the mouse fires no pointermove, and the badge has to appear regardless.
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Alt") setCopy(false)
  }

  const onPointerMove = (e: PointerEvent) => {
    // A second finger must not drive or cancel the gesture this one started.
    if (e.pointerId !== pointerId) return
    lastEvent = e

    if (!active) {
      const distance = Math.hypot(e.clientX - startX, e.clientY - startY)
      if (isTouch) {
        // Past the tolerance the user is scrolling, so the press stays a scroll.
        if (distance > FILTER_DND_ACTIVATION.touchTolerancePx) cancel()
        return
      }
      if (distance < FILTER_DND_ACTIVATION.moveDistancePx) return
      activate()
    }

    setCopy(e.altKey)
    positionCarry(e.clientX, e.clientY)
    hitTest(e.clientX, e.clientY)
    autoScroll(e.clientY)
  }

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    const landed = active ? hit : null
    const wasCopy = copy
    cleanup()
    if (!active) return

    lastDragEndedAt = performance.now()
    // The trailing click belongs to the gesture, not to whatever it ended over.
    window.addEventListener("click", suppressTrailingClick, true)

    if (!landed) return
    options.onDrop(nodeId, {
      parentId: landed.target.parentId,
      index: landed.target.index,
      copy: wasCopy,
    })
  }

  const onPointerCancel = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    cancel()
  }

  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointercancel", onPointerCancel)
  window.addEventListener("keydown", onKeyDown, true)
  window.addEventListener("keyup", onKeyUp, true)
  activeCancels.add(cancel)

  if (isTouch) {
    touchTimer = setTimeout(() => {
      activate()
      if (lastEvent) {
        positionCarry(lastEvent.clientX, lastEvent.clientY)
        hitTest(lastEvent.clientX, lastEvent.clientY)
      }
    }, FILTER_DND_ACTIVATION.touchDelayMs)
  }
}

/**
 * Only `onPointerDown`: the handle is a real button that Tab reaches, so it must
 * not also be `draggable` and race the browser's HTML5 drag, with its ghost, no
 * copy affordance and no way to report a drop into a nested target.
 */
export function useFilterRowDrag(options: FilterRowDragOptions) {
  // Read at gesture time, not captured at wiring time, so the handler identity
  // is stable and a memoized row never re-renders on a re-created callback.
  const latest = React.useRef(options)
  React.useEffect(() => {
    latest.current = options
  })

  // A gesture outlives its row by design, but never the panel: its listeners
  // are on `window` and its carry on `document.body`.
  React.useEffect(() => cancelActiveFilterDrags, [])

  return React.useCallback(
    (nodeId: string) => ({
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        if (latest.current.disabled) return
        // Primary button only: a right press strands the drag under a menu.
        if (event.button !== 0) return
        startDrag(event, nodeId, latest.current)
      },
    }),
    []
  )
}
