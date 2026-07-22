// Title: Gantt Lib
// Description: Pure, React-free calendar math: view ranges, zoned day keys, multi-day segmentation, overlap packing, lane packing, and the event index.

import { expandRecurrence } from "@/registry-reui/bases/base/reui/gantt/gantt-recurrence"
import type {
  GanttDateRange,
  GanttEvent,
  GanttOccurrence,
  GanttOffDaysConfig,
  GanttResource,
  GanttScale,
  GanttSegment,
} from "@/registry-reui/bases/base/reui/gantt/gantt-types"
import { TZDate } from "@date-fns/tz"
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  format,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns"

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Packing-effective minimum in minutes so tiny events do not stack invisibly.
 * It is a packing FOOTPRINT, not a render size: two schedules less than this
 * apart are treated as concurrent and split into separate lanes even though
 * their real ranges do not touch.
 */
const MIN_PACK_SLOT = 30

/** The instant re-expressed in the display time zone (TZDate extends Date). */
function toZoned(date: Date, timeZone: string): TZDate {
  return new TZDate(date.getTime(), timeZone)
}

/** Zoned midnight of the day containing the instant. */
function zonedStartOfDay(date: Date, timeZone: string): TZDate {
  return startOfDay(toZoned(date, timeZone))
}

/** Stable per-day key in the display time zone. */
function getDayKey(date: Date, timeZone: string): string {
  return format(toZoned(date, timeZone), "yyyy-MM-dd")
}

/** Day length in minutes; 1380/1500 on DST transition days - never assume 1440. */
function getDayTotalMinutes(dayStart: Date, timeZone: string): number {
  const next = zonedStartOfDay(
    addDays(toZoned(dayStart, timeZone), 1),
    timeZone
  )
  return differenceInMinutes(next, dayStart)
}

function snapMinutes(minutes: number, snap: number): number {
  return Math.round(minutes / snap) * snap
}

interface ViewRangeOptions {
  timeZone: string
  weekStartsOn: WeekStartsOn
}

interface ViewDateRanges {
  visibleRange: GanttDateRange
  activeRange: GanttDateRange
}

/** Axis range for the anchor date at the given scale. */
function getGanttDateRange(
  scale: GanttScale,
  date: Date,
  opts: ViewRangeOptions
): ViewDateRanges {
  const { timeZone, weekStartsOn } = opts
  const zoned = toZoned(date, timeZone)

  if (scale === "week") {
    const start = startOfWeek(zoned, { weekStartsOn })
    const range = { start, end: addWeeks(start, 1) }
    return { activeRange: range, visibleRange: range }
  }
  if (scale === "month") {
    // exact month: no outside days on the horizontal axis
    const start = startOfMonth(zoned)
    const range = { start, end: startOfMonth(addMonths(zoned, 1)) }
    return { activeRange: range, visibleRange: range }
  }
  if (scale === "quarter") {
    // week-aligned so the axis partitions into uniform week units
    const quarterStart = startOfQuarter(zoned)
    const quarterEnd = startOfQuarter(addMonths(zoned, 3))
    const start = startOfWeek(quarterStart, { weekStartsOn })
    let end = startOfWeek(quarterEnd, { weekStartsOn })
    if (end < quarterEnd) end = addWeeks(end, 1)
    return {
      activeRange: { start: quarterStart, end: quarterEnd },
      visibleRange: { start, end },
    }
  }
  if (scale === "year") {
    const start = startOfYear(zoned)
    const range = { start, end: startOfYear(addYears(zoned, 1)) }
    return { activeRange: range, visibleRange: range }
  }
  const start = startOfDay(zoned)
  const range = { start, end: addDays(start, 1) }
  return { activeRange: range, visibleRange: range }
}

/** The anchor date stepped one period forward or backward for the scale. */
function stepGanttDate(
  scale: GanttScale,
  date: Date,
  direction: 1 | -1,
  opts: Pick<ViewRangeOptions, "timeZone">
): Date {
  const zoned = toZoned(date, opts.timeZone)
  if (scale === "week") return addWeeks(zoned, direction)
  if (scale === "month") return addMonths(zoned, direction)
  if (scale === "quarter") return addMonths(zoned, direction * 3)
  if (scale === "year") return addYears(zoned, direction)
  return addDays(zoned, direction)
}

function rangesIntersect(a: GanttDateRange, b: GanttDateRange): boolean {
  return a.start < b.end && a.end > b.start
}

function eventsOverlap(
  a: { start: Date; end: Date },
  b: { start: Date; end: Date }
): boolean {
  return a.start < b.end && a.end > b.start
}

function spansMultipleDays(occ: { start: Date; end: Date }): boolean {
  // An event ending exactly at the next midnight is still single-day
  // (exclusive end), so compare against a strictly-later instant.
  return occ.end.getTime() - occ.start.getTime() > 24 * 60 * 60 * 1000
}

interface PackedPosition {
  column: number
  columnCount: number
  columnSpan: number
}

/**
 * Identity of a schedule ACROSS time edits. `occurrence.key` embeds the start
 * instant, so it changes the moment a schedule is moved or start-resized -
 * useless as lane memory. This key survives the edit: the event id plus, for a
 * recurring series, the occurrence's position in it.
 */
function getLaneKey(occurrence: {
  eventId: string
  recurrenceIndex?: number
}): string {
  return `${occurrence.eventId}::${occurrence.recurrenceIndex ?? 0}`
}

/**
 * What one schedule held on the previous layout pass. The TIMES are what make
 * this more than a lane number: they are how the packer tells the schedule the
 * user just edited apart from the ones that merely sat still.
 */
interface GanttLaneMemo {
  lane: number
  startMs: number
  endMs: number
}

interface PackOptions {
  /**
   * Where each schedule sat on the previous pass, by getLaneKey.
   *
   * A schedule whose times are UNCHANGED keeps its lane if that lane is still
   * free, so editing one schedule never re-indexes the ones around it. A
   * schedule whose times CHANGED - the one the user just dragged or resized -
   * deliberately forfeits its pin and re-seeks the lowest free lane. That is
   * what makes the arrangement live rather than frozen: a schedule dragged
   * onto its neighbours stacks DOWN into the first free lane, and one dragged
   * clear of them comes back UP inline. Only the edited schedule moves.
   */
  preferredLanes?: Map<string, GanttLaneMemo>
  /** "single" collapses the row to one track; see GanttScheduleMode. */
  mode?: "single" | "multiple"
}

/**
 * Overlap packing for one row's timed segments.
 * Mutates column/columnCount/columnSpan on the segments, in place.
 * z resolution happens at render: event.zIndex verbatim, else 10 + column.
 */
function packTimedSegments<TData>(
  segments: GanttSegment<TData>[],
  options: PackOptions = {}
): void {
  if (segments.length === 0) return

  if (options.mode === "single") {
    // one track: every schedule shares lane 0 and the row never grows
    for (const seg of segments) {
      seg.column = 0
      seg.columnCount = 1
      seg.columnSpan = 1
    }
    return
  }

  const preferredLanes = options.preferredLanes

  type Working = {
    seg: GanttSegment<TData>
    startMin: number
    effEnd: number
    lane: number
    /** The occupancy entry this item added, so a settle can take it back. */
    interval?: { from: number; to: number }
  }

  const items: Working[] = segments
    .map((seg) => {
      const startMin = seg.startMin ?? 0
      const endMin = seg.endMin ?? startMin
      return {
        seg,
        startMin,
        effEnd: Math.max(endMin, startMin + MIN_PACK_SLOT),
        lane: -1,
      }
    })
    .sort(
      (a, b) =>
        a.startMin - b.startMin ||
        b.effEnd - b.startMin - (a.effEnd - a.startMin) ||
        a.seg.occurrence.key.localeCompare(b.seg.occurrence.key)
    )

  // Sweep into connected clusters
  const clusters: Working[][] = []
  let current: Working[] = []
  let clusterEnd = -Infinity
  for (const item of items) {
    if (item.startMin >= clusterEnd) {
      current = []
      clusters.push(current)
      clusterEnd = -Infinity
    }
    current.push(item)
    clusterEnd = Math.max(clusterEnd, item.effEnd)
  }

  for (const cluster of clusters) {
    // Per-lane occupancy INTERVALS, not a single running end: pass 1 claims
    // remembered lanes out of time order, so a lane can be free before an
    // occupant and busy after it.
    const laneIntervals: Array<Array<{ from: number; to: number }>> = []
    const isFree = (lane: number, item: Working) =>
      !(laneIntervals[lane] ?? []).some(
        (iv) => iv.from < item.effEnd && iv.to > item.startMin
      )
    const claim = (lane: number, item: Working) => {
      while (laneIntervals.length <= lane) laneIntervals.push([])
      const interval = { from: item.startMin, to: item.effEnd }
      laneIntervals[lane].push(interval)
      item.lane = lane
      item.interval = interval
    }
    const release = (item: Working) => {
      const occupants = laneIntervals[item.lane] ?? []
      const at = occupants.indexOf(item.interval!)
      if (at >= 0) occupants.splice(at, 1)
    }

    // pass 1: schedules that did not move keep the lane they had. The one the
    // user just edited is NOT pinned - its times differ from the memo, so it
    // falls through to pass 2 and re-seeks a lane against its new span.
    const pending: Working[] = []
    for (const item of cluster) {
      const memo = preferredLanes?.get(getLaneKey(item.seg.occurrence))
      const untouched =
        memo !== undefined &&
        memo.startMs === item.seg.occurrence.start.getTime() &&
        memo.endMs === item.seg.occurrence.end.getTime()
      if (untouched && memo.lane >= 0 && isFree(memo.lane, item)) {
        claim(memo.lane, item)
      } else {
        pending.push(item)
      }
    }
    // pass 2: the rest take the lowest free lane - overlapping goes DOWN into
    // the first lane with room, fitting comes back UP to lane 0
    for (const item of pending) {
      let lane = 0
      while (!isFree(lane, item)) lane++
      claim(lane, item)
    }

    // pass 3: nothing floats above an empty lane. A pin only survives while
    // something above it still needs the space - once the schedule that was
    // there moves away or is deleted, its neighbour settles down into the
    // gap. Without this a row keeps a permanently blank top lane and never
    // shrinks back. Settling in lane order, and only ever DOWNWARD into space
    // that is genuinely free, means two schedules can never trade places -
    // so an edit still moves at most the schedule it touched.
    const byLane = [...cluster].sort(
      (a, b) => a.lane - b.lane || a.startMin - b.startMin
    )
    for (const item of byLane) {
      if (item.lane === 0) continue
      let lane = 0
      while (lane < item.lane && !isFree(lane, item)) lane++
      if (lane < item.lane) {
        release(item)
        claim(lane, item)
      }
    }
  }

  // Lane memory can leave holes (the schedule that held lane 0 was deleted or
  // moved away). Collapse the row's USED lanes onto 0..n-1: relative stacking
  // order survives, so nothing reshuffles, but the row cannot creep taller
  // than the lanes it actually needs.
  const used = [...new Set(items.map((item) => item.lane))].sort(
    (a, b) => a - b
  )
  const compacted = new Map(used.map((lane, index) => [lane, index]))
  const columnCount = used.length
  for (const item of items) {
    item.lane = compacted.get(item.lane) ?? 0
    item.seg.column = item.lane
    item.seg.columnCount = columnCount
  }

  // Partial-overlap expansion: widen rightward into free lanes
  for (const cluster of clusters) {
    for (const item of cluster) {
      let span = 1
      while (item.lane + span < columnCount) {
        const blocked = cluster.some(
          (other) =>
            other !== item &&
            other.lane === item.lane + span &&
            other.startMin < item.effEnd &&
            other.effEnd > item.startMin
        )
        if (blocked) break
        span++
      }
      item.seg.columnSpan = span
    }
  }
}

function defaultEventOrder(a: GanttOccurrence, b: GanttOccurrence): number {
  return (
    a.start.getTime() - b.start.getTime() ||
    b.end.getTime() -
      b.start.getTime() -
      (a.end.getTime() - a.start.getTime()) ||
    a.key.localeCompare(b.key)
  )
}

interface BuildIndexOptions<TData = unknown> {
  timeZone: string
  /** Escape hatch for exotic recurrence: return the expanded occurrences. */
  getOccurrences?: (
    event: GanttEvent<TData>,
    range: GanttDateRange,
    ctx: { timeZone: string }
  ) => Array<{ start: Date; end: Date }> | null | undefined
  eventOrder?: (a: GanttOccurrence<TData>, b: GanttOccurrence<TData>) => number
}

interface GanttIndex<TData = unknown> {
  occurrences: GanttOccurrence<TData>[]
}

function buildEventIndex<TData>(
  events: GanttEvent<TData>[],
  visibleRange: GanttDateRange,
  opts: BuildIndexOptions<TData>
): GanttIndex<TData> {
  const { timeZone } = opts
  const order = opts.eventOrder ?? defaultEventOrder

  // RECURRENCE-ID override replacement: an event carrying recurringEventId +
  // originalStart is an edited single occurrence of that series. The parent's
  // expansion drops the replaced instant; the override renders as its own
  // occurrence through the normal path below.
  const overrideTimes = new Map<string, Set<number>>()
  for (const event of events) {
    if (!event.recurringEventId || !event.originalStart) continue
    let times = overrideTimes.get(event.recurringEventId)
    if (!times) overrideTimes.set(event.recurringEventId, (times = new Set()))
    times.add(event.originalStart.getTime())
  }

  const occurrences: GanttOccurrence<TData>[] = []
  for (const event of events) {
    const custom = opts.getOccurrences?.(event, visibleRange, { timeZone })
    if (custom) {
      custom.forEach((occ, i) => {
        if (!rangesIntersect({ start: occ.start, end: occ.end }, visibleRange))
          return
        occurrences.push({
          key: `${event.id}::${occ.start.toISOString()}`,
          eventId: event.id,
          event,
          start: occ.start,
          end: occ.end,
          allDay: event.allDay ?? false,
          isRecurring: true,
          recurrenceIndex: i,
        })
      })
      continue
    }
    const replaced = overrideTimes.get(event.id)
    const expanded = expandRecurrence(event, visibleRange, { timeZone })
    occurrences.push(
      ...(replaced
        ? expanded.filter((occ) => !replaced.has(occ.start.getTime()))
        : expanded)
    )
  }
  occurrences.sort(order)
  return { occurrences }
}

/** Cache key for index memoization; cheap string compare. */
function getRangeKey(range: GanttDateRange): string {
  return `${range.start.getTime()}-${range.end.getTime()}`
}

/** Depth-first flatten of the resource tree (parents included). */
function flattenResources(
  resources: GanttResource[],
  depth = 0
): Array<{ resource: GanttResource; depth: number }> {
  const rows: Array<{ resource: GanttResource; depth: number }> = []
  for (const resource of resources) {
    rows.push({ resource, depth })
    if (resource.children?.length) {
      rows.push(...flattenResources(resource.children, depth + 1))
    }
  }
  return rows
}

/** Depth-first lookup of one node in the tree. */
function findResource(
  resources: GanttResource[],
  id: string
): GanttResource | null {
  for (const resource of resources) {
    if (resource.id === id) return resource
    const found = resource.children?.length
      ? findResource(resource.children, id)
      : null
    if (found) return found
  }
  return null
}

/**
 * Pure tree move: removes `resourceId` from wherever it sits and reinserts it
 * under `parentId` (null = root) at `index`. Returns a new tree; the original
 * is untouched. Returns null for impossible moves (unknown ids, or dropping a
 * node into its own subtree).
 */
function reorderResources(
  resources: GanttResource[],
  resourceId: string,
  parentId: string | null,
  index: number
): GanttResource[] | null {
  let moved: GanttResource | null = null

  const strip = (nodes: GanttResource[]): GanttResource[] =>
    nodes.flatMap((node) => {
      if (node.id === resourceId) {
        moved = node
        return []
      }
      if (!node.children?.length) return [node]
      return [{ ...node, children: strip(node.children) }]
    })

  const stripped = strip(resources)
  if (!moved) return null

  const contains = (node: GanttResource, id: string): boolean =>
    node.id === id || !!node.children?.some((child) => contains(child, id))
  if (parentId !== null && contains(moved, parentId)) return null

  const insert = (nodes: GanttResource[]): GanttResource[] => {
    if (parentId === null) {
      const next = [...nodes]
      next.splice(Math.min(Math.max(index, 0), next.length), 0, moved!)
      return next
    }
    return nodes.map((node) => {
      if (node.id === parentId) {
        const children = [...(node.children ?? [])]
        children.splice(
          Math.min(Math.max(index, 0), children.length),
          0,
          moved!
        )
        return { ...node, children }
      }
      if (!node.children?.length) return node
      return { ...node, children: insert(node.children) }
    })
  }

  const next = insert(stripped)
  // unknown parentId: the node vanished - reject
  if (parentId !== null) {
    const flat = flattenResources(next)
    if (!flat.some(({ resource }) => resource.id === resourceId)) return null
  }
  return next
}

const DEFAULT_WEEKEND_DAYS = [0, 6]

/** Resolves whether a day is an off day (non-working) in the display zone. */
function resolveOffDay(
  day: Date,
  timeZone: string,
  config: boolean | GanttOffDaysConfig | undefined
): boolean {
  if (!config) return false
  const resolved: GanttOffDaysConfig = config === true ? {} : config
  const weekendDays = resolved.weekendDays ?? DEFAULT_WEEKEND_DAYS
  const zoned = toZoned(day, timeZone)
  if (weekendDays.includes(zoned.getDay())) return true
  if (resolved.dates?.length) {
    const key = getDayKey(day, timeZone)
    if (resolved.dates.some((date) => getDayKey(date, timeZone) === key)) {
      return true
    }
  }
  return resolved.isOffDay?.(day) ?? false
}

export {
  buildEventIndex,
  defaultEventOrder,
  eventsOverlap,
  findResource,
  flattenResources,
  getDayKey,
  getDayTotalMinutes,
  getGanttDateRange,
  getLaneKey,
  getRangeKey,
  MIN_PACK_SLOT,
  packTimedSegments,
  rangesIntersect,
  reorderResources,
  resolveOffDay,
  snapMinutes,
  spansMultipleDays,
  stepGanttDate,
  toZoned,
  zonedStartOfDay,
}
export type {
  BuildIndexOptions,
  GanttIndex,
  GanttLaneMemo,
  PackOptions,
  ViewDateRanges,
  ViewRangeOptions,
  WeekStartsOn,
}
