// Title: Gantt View
// Description: The gantt body - split resizable tree/timeline panes with synced scrolling, multi-column tree, grouped two-row header, day through year scales, zoom, drag-to-pan, lanes, drag and resize.

"use client"

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react"
import {
  DEFAULT_ROW_ALIGN,
  resolveScheduleMode,
  resolveTimelineLines,
  useGantt,
  useGanttSelector,
  useGanttSettings,
  useGanttViewConfig,
  type GanttColumn,
} from "@/registry-reui/bases/base/reui/gantt/gantt"
import { GanttBar } from "@/registry-reui/bases/base/reui/gantt/gantt-bar"
import {
  cancelActiveGanttGestures,
  markGestureEnd,
  useGanttGestures,
  useGanttGestureTeardown,
  wasRecentDrag,
} from "@/registry-reui/bases/base/reui/gantt/gantt-dnd"
import {
  getDayKey,
  getLaneKey,
  getRangeKey,
  MIN_PACK_SLOT,
  packTimedSegments,
  reorderResources,
  resolveOffDay,
  toZoned,
  zonedStartOfDay,
  type GanttLaneMemo,
} from "@/registry-reui/bases/base/reui/gantt/gantt-lib"
import type {
  GanttDateRange,
  GanttEvent,
  GanttOccurrence,
  GanttResource,
  GanttResourceReorder,
  GanttSegment,
} from "@/registry-reui/bases/base/reui/gantt/gantt-types"
import { mergeProps } from "@base-ui/react/merge-props"
// Base UI's ScrollArea re-measures its thumb + overflow on mount, viewport
// resize and scroll, but NOT on a content-size change unless the content sits
// in a ScrollArea.Content (which carries the content ResizeObserver). ReUI's
// ScrollArea puts children straight in the Viewport, so the tree/timeline
// panes wrap their scroll content in this Content to keep the scrollbar in
// sync when rows expand/collapse or tree columns show/hide. (Radix observes
// content automatically, so its twin needs no equivalent.)
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { useRender } from "@base-ui/react/use-render"
import {
  addDays,
  addMinutes,
  addMonths,
  format,
  getWeek,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  type Locale,
} from "date-fns"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/registry/bases/base/ui/context-menu"
import { ScrollArea, ScrollBar } from "@/registry/bases/base/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/** Current time, refreshed on an interval and on tab focus. */
function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = setInterval(tick, intervalMs)
    document.addEventListener("visibilitychange", tick)
    window.addEventListener("focus", tick)
    return () => {
      clearInterval(id)
      document.removeEventListener("visibilitychange", tick)
      window.removeEventListener("focus", tick)
    }
  }, [intervalMs])
  return now
}

/**
 * Today's zoned day key, re-rendering only at the midnight rollover (and on
 * focus/visibility) - the grid needs day granularity, not the 30s now tick.
 */
function useTodayKey(timeZone: string): string {
  const [key, setKey] = useState(() => getDayKey(new Date(), timeZone))
  useEffect(() => {
    const tick = () =>
      setKey((prev) => {
        const next = getDayKey(new Date(), timeZone)
        return next === prev ? prev : next
      })
    tick()
    const id = setInterval(tick, 60_000)
    document.addEventListener("visibilitychange", tick)
    window.addEventListener("focus", tick)
    return () => {
      clearInterval(id)
      document.removeEventListener("visibilitychange", tick)
      window.removeEventListener("focus", tick)
    }
  }, [timeZone])
  return key
}

/**
 * Lowest lane free for [startMs, endMs) among a row's segments, padded by
 * MIN_PACK_SLOT exactly as packTimedSegments pads its own occupancy test.
 * Comparing raw instants instead lets a sub-slot bar read as clear, so an
 * affordance would promise a lane the packer then refuses.
 *
 * Shared by the hover hint and the drag placeholder on purpose: two copies of
 * this is how the ring and the range it paints end up on different tracks.
 */
function lowestFreeLane(
  segments: GanttSegment[],
  startMs: number,
  endMs: number
): number {
  const padMs = MIN_PACK_SLOT * 60000
  const to = Math.max(endMs, startMs + padMs)
  const busy = new Set<number>()
  for (const segment of segments) {
    const segStart = segment.occurrence.start.getTime()
    const segEnd = Math.max(segment.occurrence.end.getTime(), segStart + padMs)
    if (segStart < to && segEnd > startMs) busy.add(segment.column ?? 0)
  }
  let lane = 0
  while (busy.has(lane)) lane += 1
  return lane
}

/**
 * Pointer x resolved against the element's TIME axis: the 0..1 fraction and
 * the same measurement in CSS pixels from the axis start. Mirrored in RTL,
 * where the range start renders at the element's right edge. One rect read
 * and one style read, because this runs on every pointer move.
 */
function trackPoint(
  el: HTMLElement,
  clientX: number
): { fraction: number; offset: number } {
  const rect = el.getBoundingClientRect()
  const rtl = getComputedStyle(el).direction === "rtl"
  const offset = rtl ? rect.right - clientX : clientX - rect.left
  // `offset` is exact and drives the time maths. `snapped` is the same value
  // biased so that rect start + snapped lands on a WHOLE viewport pixel: the
  // row's own edge routinely sits on a half pixel, so rounding the offset
  // alone still puts anything placed at it between two pixels.
  const snapped = rtl
    ? rect.right - Math.round(clientX)
    : Math.round(clientX) - rect.left
  return {
    fraction: rect.width > 0 ? offset / rect.width : 0,
    offset: snapped,
  }
}

/** Fraction only, for the call sites that do not place anything. */
function trackFraction(el: HTMLElement, clientX: number): number {
  return trackPoint(el, clientX).fraction
}

/**
 * Row geometry is three numbers: a bar is LANE_HEIGHT_REM tall, stacked bars
 * are separated by LANE_GAP_REM, and the block as a whole is inset from the
 * row's edges by ROW_PADDING_REM. Padding and gap are deliberately NOT the
 * same value - schedules in one node belong together, so they sit tight, while
 * the row still needs real breathing room above and below. Every inter-lane
 * gap is identical, which is what keeps a stacked row reading evenly.
 */
const LANE_HEIGHT_REM = 1.25
const LANE_GAP_REM = 0.1875
const ROW_PADDING_REM = 0.5
/** Drop-indicator height (h-5); it is centered inside its lane band. */
const GHOST_HEIGHT_REM = 1.25
/** Bars narrower than this flip their title outside in barLabel "auto". */
const AUTO_LABEL_MIN_REM = 7
const DEFAULT_TREE_PANEL = {
  width: 288,
  minWidth: 180,
  maxWidth: 640,
  resizable: true,
  nameColumnWidth: 208,
}
const DEFAULT_COLUMN_WIDTH = 96
const DEFAULT_ZOOM_RANGE = { min: 0.5, max: 3 }
/** Timeline pane never shrinks below this so it stays usable on narrow screens. */
const MIN_TIMELINE_WIDTH = 200
/** Scroll distance from an edge that triggers infinite-range growth. */
const INFINITE_EDGE_PX = 160

interface TimelineUnit {
  key: string
  label: string
  ms: number
  /** Relative width share; uniform scales use 1 (year: days per month). */
  weight: number
  isToday?: boolean
  isOff?: boolean
}

interface TimelineGroup {
  key: string
  label: string
  span: number
}

interface TimelineRow {
  resource: GanttResource
  parentId: string | null
  depth: number
  isGroup: boolean
  collapsed: boolean
}

/** Per-row packed bars plus the extents the off-screen chips need. */
interface TimelineRowBars {
  segments: GanttSegment[]
  laneCount: number
  /**
   * Lane a drag-create in flight would land on, or null when none is aimed at
   * this row. The row reserves the track, so it grows exactly as it will on
   * commit and the placeholder never has to overlap the bar it is going under.
   * Computed here, once, because BOTH panes size themselves from this object -
   * deriving it a second time in the timeline row is how the two would drift.
   */
  draftLane: number | null
  /** Mode this row was packed under; the draft overlay must honour it. */
  scheduleMode: "single" | "multiple"
  heightRem: number
  /** Gap above the first bar; equal to every other gap in the row. */
  laneOffsetRem: number
  /**
   * The band the FIRST schedule occupies, its gaps included. The tree cell
   * sizes its label box to exactly this, so the label and the first bar share
   * a centerline however many lanes the node grew.
   */
  bandRem: number
  /** Envelope of all bars, as track fractions; null when the row is empty. */
  extent: {
    from: number
    to: number
    color?: string
    label: string
    /** First bar start, for the jump-chip tooltip. */
    startMs: number
  } | null
  /**
   * Parent rollup: descendant-bar envelope + duration-weighted progress,
   * present only on group rows without bars of their own.
   */
  summary: { from: number; to: number; progress: number | null } | null
}

interface TimelineReorderState {
  resourceId: string
  /** Insertion offset (px) within the tree pane. */
  top: number
  valid: boolean
  proposal: GanttResourceReorder | null
}

interface GanttViewProps extends useRender.ComponentProps<"div"> {
  /** Day-scale unit interval in minutes; defaults to the interval view config. */
  interval?: number
}

/** The pane's scrollable viewport (custom ScrollArea or native host). */
function getPaneViewport(pane: HTMLElement | null): HTMLElement | null {
  return (
    pane?.querySelector<HTMLElement>("[data-slot=scroll-area-viewport]") ?? null
  )
}

/** Distance scrolled from the inline-start edge (RTL reports negative). */
function getScrollStart(viewport: HTMLElement): number {
  return Math.abs(viewport.scrollLeft)
}

/** Write a distance-from-inline-start back as a signed scrollLeft. */
function setScrollStart(viewport: HTMLElement, value: number) {
  viewport.scrollLeft =
    getComputedStyle(viewport).direction === "rtl" ? -value : value
}

function GanttView({
  className,
  render,
  interval: intervalProp,
  ...props
}: GanttViewProps) {
  const instance = useGantt()
  const settings = useGanttSettings()
  const viewConfig = useGanttViewConfig()
  const range = useGanttSelector<unknown, GanttDateRange>(
    (state) => state.visibleRange,
    { isEqual: (a, b) => getRangeKey(a) === getRangeKey(b) }
  )
  const occurrences = useGanttSelector<unknown, GanttOccurrence[]>(
    () => instance.api.getOccurrences(),
    {
      calendar: instance,
      isEqual: (a, b) =>
        a.length === b.length &&
        a.every(
          (occ, i) =>
            occ.key === b[i]?.key &&
            occ.start.getTime() === b[i]?.start.getTime() &&
            occ.end.getTime() === b[i]?.end.getTime() &&
            occ.event === b[i]?.event
        ),
    }
  )

  // Tree expand/collapse: controlled (collapsedGroups/onCollapsedGroupsChange)
  // or uncontrolled (defaultCollapsedGroups) - same pattern as selectedRows.
  const [internalCollapsed, setInternalCollapsed] = useState<string[]>(
    () => viewConfig.defaultCollapsedGroups ?? []
  )
  const collapsedIds = viewConfig.collapsedGroups ?? internalCollapsed
  const collapsedGroups = useMemo(() => new Set(collapsedIds), [collapsedIds])

  const scale = useGanttSelector((state) => state.scale)
  const interval = Math.min(
    Math.max(intervalProp ?? viewConfig.interval, 15),
    240
  )
  // Every layout metric is consumer-overridable; unset keys keep defaults.
  const metrics = viewConfig.metrics
  const laneHeightRem = metrics?.laneHeight ?? LANE_HEIGHT_REM
  const rowPaddingRem = metrics?.rowPadding ?? ROW_PADDING_REM
  const laneGapRem = metrics?.laneGap ?? LANE_GAP_REM
  const minRowRem = metrics?.minRowHeight ?? 2.5
  const minTimelineWidth = metrics?.minTimelineWidth ?? MIN_TIMELINE_WIDTH
  const infiniteEdgePx = metrics?.infiniteScrollEdge ?? INFINITE_EDGE_PX
  const timeZone = settings.timeZone
  const rangeStartMs = range.start.getTime()
  const rangeEndMs = range.end.getTime()
  const rangeKey = getRangeKey(range)
  const snapMin = scale === "day" ? settings.snapDuration : 24 * 60
  // day-granular time input so the today highlight rolls over at midnight
  // without the whole grid re-rendering on the 30s now tick
  const todayDayKey = useTodayKey(timeZone)

  const rows = useMemo(() => {
    const result: TimelineRow[] = []
    const walk = (
      resources: GanttResource[],
      depth: number,
      parentId: string | null
    ) => {
      for (const resource of resources) {
        const isGroup = !!resource.children?.length
        const collapsed = collapsedGroups.has(resource.id)
        result.push({ resource, parentId, depth, isGroup, collapsed })
        if (isGroup && !collapsed)
          walk(resource.children!, depth + 1, resource.id)
      }
    }
    walk(settings.resources, 0, null)
    return result
  }, [settings.resources, collapsedGroups])

  // Header model: bottom row = units, top row = grouping sectors.
  // Weights are proportional to REAL duration (a 23h/25h DST day differs from
  // its siblings), so weight-driven gridlines, ms-fraction bar geometry, and
  // the dnd pointer math all share one coordinate system.
  const { units, groups, unitWidthRem } = useMemo(() => {
    const units: TimelineUnit[] = []
    const groups: TimelineGroup[] = []
    // day-start ms for the today window checks; recomputed when the day key
    // rolls over (this memo depends on todayDayKey)
    const todayStartMs = zonedStartOfDay(new Date(), timeZone).getTime()
    if (scale === "day") {
      const labelFormat =
        interval % 60 === 0 ? settings.i18n.formats.timeGutter : "h:mm"
      // walk whole days: infinite scroll can extend the range past one day
      let dayCursor = zonedStartOfDay(range.start, timeZone)
      while (dayCursor.getTime() < rangeEndMs) {
        const zonedDay = toZoned(dayCursor, timeZone)
        const nextDay = zonedStartOfDay(addDays(zonedDay, 1), timeZone)
        const dayMinutes = (nextDay.getTime() - dayCursor.getTime()) / 60000
        const dayOff = resolveOffDay(
          dayCursor,
          timeZone,
          viewConfig.offDays ?? true
        )
        let span = 0
        for (let m = 0; m < dayMinutes; m += interval) {
          const time = addMinutes(zonedDay, m)
          // a DST day whose minutes don't divide evenly leaves a short
          // final unit; its weight must be its REAL share or bars drift
          const weight = Math.min(interval, dayMinutes - m) / interval
          units.push({
            key: `${getDayKey(dayCursor, timeZone)}-m${m}`,
            label: format(time, labelFormat, { locale: settings.locale }),
            ms: time.getTime(),
            weight,
            isOff: dayOff,
          })
          span += weight
        }
        groups.push({
          key: getDayKey(dayCursor, timeZone),
          label: format(zonedDay, settings.i18n.formats.dayTitle, {
            locale: settings.locale,
          }),
          span,
        })
        dayCursor = nextDay
      }
      return {
        units,
        groups,
        unitWidthRem:
          metrics?.unitWidths?.day ?? Math.max(2.5, 5 * (interval / 60)),
      }
    }
    if (scale === "quarter") {
      // units are week-aligned weeks (lib aligns the range), groups are months
      let cursor = zonedStartOfDay(range.start, timeZone)
      while (cursor.getTime() < rangeEndMs) {
        const zoned = toZoned(cursor, timeZone)
        const next = zonedStartOfDay(addDays(zoned, 7), timeZone)
        // real week duration / nominal week: 1 except across DST changes
        const weight =
          (next.getTime() - cursor.getTime()) / (7 * 24 * 60 * 60000)
        units.push({
          key: getDayKey(cursor, timeZone),
          label: format(zoned, "MMM d", { locale: settings.locale }),
          ms: cursor.getTime(),
          weight,
          isToday:
            todayStartMs >= cursor.getTime() && todayStartMs < next.getTime(),
        })
        const monthKey = format(zoned, "yyyy-MM")
        const lastGroup = groups[groups.length - 1]
        if (lastGroup && lastGroup.key === monthKey) {
          lastGroup.span += weight
        } else {
          groups.push({
            key: monthKey,
            label: format(zoned, "MMMM", { locale: settings.locale }),
            span: weight,
          })
        }
        cursor = next
      }
      return { units, groups, unitWidthRem: metrics?.unitWidths?.quarter ?? 8 }
    }
    if (scale === "year") {
      // units are calendar months (weight = real duration), groups are quarters
      let cursor: Date = startOfMonth(toZoned(range.start, timeZone))
      while (cursor.getTime() < rangeEndMs) {
        const next = startOfMonth(addMonths(cursor, 1))
        // nominal-day units so a month reads ~30 wide; real ms keeps DST months true
        const weight = (next.getTime() - cursor.getTime()) / (24 * 60 * 60000)
        units.push({
          key: format(cursor, "yyyy-MM"),
          label: format(cursor, "MMM", { locale: settings.locale }),
          ms: cursor.getTime(),
          weight,
          isToday:
            todayStartMs >= cursor.getTime() && todayStartMs < next.getTime(),
        })
        const quarterStart = startOfQuarter(cursor)
        const quarterKey = format(quarterStart, "yyyy-QQQ")
        const lastGroup = groups[groups.length - 1]
        if (lastGroup && lastGroup.key === quarterKey) {
          lastGroup.span += weight
        } else {
          groups.push({
            key: quarterKey,
            label: format(quarterStart, "QQQ yyyy", {
              locale: settings.locale,
            }),
            span: weight,
          })
        }
        cursor = next
      }
      return { units, groups, unitWidthRem: metrics?.unitWidths?.year ?? 10 }
    }
    // week/month: units are days, groups are ISO-ish weeks
    let cursor = zonedStartOfDay(range.start, timeZone)
    while (cursor.getTime() < rangeEndMs) {
      const zoned = toZoned(cursor, timeZone)
      const nextDay = zonedStartOfDay(addDays(zoned, 1), timeZone)
      // real day duration / 24h: 1 except the 23h/25h DST days
      const weight = (nextDay.getTime() - cursor.getTime()) / (24 * 60 * 60000)
      units.push({
        key: getDayKey(cursor, timeZone),
        label: format(zoned, "EEE d", { locale: settings.locale }),
        ms: cursor.getTime(),
        weight,
        isToday: getDayKey(cursor, timeZone) === todayDayKey,
        isOff: resolveOffDay(cursor, timeZone, viewConfig.offDays ?? true),
      })
      // locale supplies firstWeekContainsDate so W-numbers match the locale's
      // week numbering (ISO in de/fr, US-style otherwise); the explicit
      // weekStartsOn keeps the number aligned with the rendered grid
      const weekNumber = getWeek(zoned, {
        locale: settings.locale,
        weekStartsOn: settings.weekStartsOn,
      })
      // key + label from the true week start: a range that begins midweek
      // must not split or mislabel its first group (incl. the Jan 1 week)
      const weekStart = startOfWeek(zoned, {
        weekStartsOn: settings.weekStartsOn,
      })
      const weekKey = `w-${format(weekStart, "yyyy-MM-dd")}`
      const lastGroup = groups[groups.length - 1]
      if (lastGroup && lastGroup.key === weekKey) {
        lastGroup.span += weight
      } else {
        groups.push({
          key: weekKey,
          label: `${settings.i18n.labels.week(weekNumber)} ${format(weekStart, "MMM d", { locale: settings.locale })} - ${format(addDays(weekStart, 6), "d", { locale: settings.locale })}`,
          span: weight,
        })
      }
      cursor = nextDay
    }
    return {
      units,
      groups,
      unitWidthRem: metrics?.unitWidths?.[scale] ?? (scale === "week" ? 10 : 4),
    }
  }, [
    scale,
    interval,
    range.start,
    rangeEndMs,
    timeZone,
    settings.i18n,
    settings.locale,
    settings.weekStartsOn,
    viewConfig.offDays,
    todayDayKey,
    metrics,
  ])

  // Zoom multiplies the minimum unit width; the flex track still fills when
  // the zoomed width is narrower than the pane. Controlled (zoom/onZoomChange)
  // or uncontrolled (defaultZoom) - same pattern as selectedRows.
  const zoomRange = { ...DEFAULT_ZOOM_RANGE, ...viewConfig.zoomRange }
  const clampZoom = (value: number) =>
    Math.min(Math.max(value, zoomRange.min), zoomRange.max)
  const [internalZoom, setInternalZoom] = useState(
    () => viewConfig.defaultZoom ?? 1
  )
  const zoom = clampZoom(viewConfig.zoom ?? internalZoom)
  const setZoomValue = (next: number) => {
    const clamped = clampZoom(next)
    if (viewConfig.zoom === undefined) setInternalZoom(clamped)
    viewConfig.onZoomChange?.(clamped)
  }
  const canZoomIn = zoom < zoomRange.max - 1e-9
  const canZoomOut = zoom > zoomRange.min + 1e-9
  const trackRemWidth = units.length * unitWidthRem * zoom
  const trackWidth = `${trackRemWidth}rem`
  // unequal weights (year months, DST-containing day/week ranges) draw
  // boundaries from weight fractions instead of the uniform gradient
  const uniform = units.every(
    (unit) => Math.abs(unit.weight - units[0].weight) < 1e-9
  )
  const totalWeight = units.reduce((sum, unit) => sum + unit.weight, 0)
  /** Cumulative start/width fractions per unit, for backdrop stripes/lines. */
  const unitFractions = useMemo(() => {
    let acc = 0
    return units.map((unit) => {
      const start = acc / totalWeight
      acc += unit.weight
      return { unit, start, width: unit.weight / totalWeight }
    })
  }, [units, totalWeight])
  /** Snap a track fraction to its unit (hint preview target). */
  const resolveHintStop = useMemo(() => {
    return (
      fraction: number
    ): { index: number; center: number; ms: number; endMs: number } | null => {
      for (let i = 0; i < unitFractions.length; i++) {
        const { unit, start, width } = unitFractions[i]
        if (fraction < start + width || i === unitFractions.length - 1) {
          return {
            index: i,
            center: start + width / 2,
            ms: unit.ms,
            endMs: unitFractions[i + 1]?.unit.ms ?? unit.ms,
          }
        }
      }
      return null
    }
  }, [unitFractions])

  /** Group boundary fractions; spans are in unit-weight terms everywhere. */
  const groupBoundaries = useMemo(() => {
    const fractions: number[] = []
    let acc = 0
    for (let i = 0; i < groups.length - 1; i++) {
      acc += groups[i].span
      fractions.push(acc / totalWeight)
    }
    return fractions
  }, [groups, totalWeight])
  /** Resource id -> every descendant id, for parent rollups. */
  const descendantIds = useMemo(() => {
    const map = new Map<string, string[]>()
    const walk = (resource: GanttResource): string[] => {
      const ids = (resource.children ?? []).flatMap((child) => [
        child.id,
        ...walk(child),
      ])
      map.set(resource.id, ids)
      return ids
    }
    settings.resources.forEach(walk)
    return map
  }, [settings.resources])

  // All events (not just visible occurrences) so parent rollup progress is
  // all-time and matches a consumer's own tree rollup, independent of scroll.
  const allEvents = useGanttSelector<unknown, GanttEvent[]>(
    (state) => state.events
  )
  const subtreeProgress = useMemo(() => {
    // consumer-owned rollup math: hand each group its descendant events
    if (viewConfig.getSummaryProgress) {
      const byResource = new Map<string, GanttEvent[]>()
      for (const ev of allEvents) {
        if (!ev.resourceId) continue
        const list = byResource.get(ev.resourceId)
        if (list) list.push(ev)
        else byResource.set(ev.resourceId, [ev])
      }
      const map = new Map<string, number | null>()
      for (const row of rows) {
        if (!row.isGroup) continue
        const events: GanttEvent[] = []
        for (const id of descendantIds.get(row.resource.id) ?? []) {
          const list = byResource.get(id)
          if (list) events.push(...list)
        }
        map.set(
          row.resource.id,
          viewConfig.getSummaryProgress({ resource: row.resource, events })
        )
      }
      return map
    }
    // default: one pass over events -> per-resource aggregates, then a cheap
    // descendant sum per group; never O(rows x events)
    const perResource = new Map<
      string,
      { weighted: number; total: number; saw: boolean }
    >()
    for (const ev of allEvents) {
      if (!ev.resourceId) continue
      let agg = perResource.get(ev.resourceId)
      if (!agg) {
        agg = { weighted: 0, total: 0, saw: false }
        perResource.set(ev.resourceId, agg)
      }
      const dur = Math.max(ev.end.getTime() - ev.start.getTime(), 1)
      agg.total += dur
      if (typeof ev.progress === "number") {
        agg.saw = true
        agg.weighted += ev.progress * dur
      }
    }
    const map = new Map<string, number | null>()
    for (const row of rows) {
      if (!row.isGroup) continue
      let weighted = 0
      let weightTotal = 0
      let saw = false
      for (const id of descendantIds.get(row.resource.id) ?? []) {
        const agg = perResource.get(id)
        if (!agg) continue
        weightTotal += agg.total
        if (agg.saw) {
          saw = true
          weighted += agg.weighted
        }
      }
      map.set(
        row.resource.id,
        saw && weightTotal > 0
          ? Math.min(Math.max(Math.round(weighted / weightTotal), 0), 100)
          : null
      )
    }
    return map
  }, [rows, allEvents, descendantIds, viewConfig.getSummaryProgress])

  // Lane memory across layout passes, keyed by getLaneKey (event identity,
  // NOT the time-stamped occurrence key). It stores the TIMES alongside the
  // lane so the packer can tell the schedule the user just edited apart from
  // the ones that sat still: untouched schedules keep their lane, the edited
  // one re-seeks. Written during the memo below on purpose: the pass is
  // idempotent - feeding its own output back in produces the same assignment -
  // so a StrictMode double render is a no-op.
  const laneMemory = useRef(new Map<string, GanttLaneMemo>())
  const scheduleMode = viewConfig.scheduleMode

  // Per-row packed bars, hoisted so the tree and timeline rows share heights
  // A drag-create in flight. Reduced to the three fields the layout needs, and
  // compared by value, so this re-runs only when the SNAPPED range moves - the
  // gesture engine already gates setSlotDraft on exactly that, so it is a
  // handful of recomputes per drag rather than one per frame.
  const draftLayout = useGanttSelector<
    unknown,
    { resourceId: string; startMs: number; endMs: number } | null
  >(
    (state) => {
      const slotDraft = state.slotDraft
      if (!slotDraft?.resourceId) return null
      return {
        resourceId: slotDraft.resourceId,
        startMs: slotDraft.start.getTime(),
        endMs: slotDraft.end.getTime(),
      }
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.resourceId === b.resourceId &&
          a.startMs === b.startMs &&
          a.endMs === b.endMs),
    }
  )

  const baseRowBars = useMemo(() => {
    const map = new Map<string, TimelineRowBars>()
    // read the lanes the previous pass settled on, write the ones this pass
    // settles on; rebuilding (not mutating) prunes schedules that are gone
    const previousLanes = laneMemory.current
    const nextLanes = new Map<string, GanttLaneMemo>()
    const totalMin = (rangeEndMs - rangeStartMs) / 60000
    // one pass: occurrences grouped by resource, plus per-resource envelopes
    // for the parent rollups (never O(rows x occurrences))
    const byResource = new Map<string, GanttOccurrence[]>()
    const envelopes = new Map<string, { fromMin: number; toMin: number }>()
    for (const occ of occurrences) {
      const rid = occ.event.resourceId
      if (!rid) continue
      const list = byResource.get(rid)
      if (list) list.push(occ)
      else byResource.set(rid, [occ])
      const fromMin = Math.max((occ.start.getTime() - rangeStartMs) / 60000, 0)
      const toMin = Math.min(
        (occ.end.getTime() - rangeStartMs) / 60000,
        totalMin
      )
      const env = envelopes.get(rid)
      if (!env) {
        envelopes.set(rid, { fromMin, toMin })
      } else {
        env.fromMin = Math.min(env.fromMin, fromMin)
        env.toMin = Math.max(env.toMin, toMin)
      }
    }
    for (const row of rows) {
      const mine = byResource.get(row.resource.id) ?? []
      const segments: GanttSegment[] = mine.map((occurrence) => ({
        occurrence,
        day: new Date(rangeStartMs),
        isStart: occurrence.start.getTime() >= rangeStartMs,
        isEnd: occurrence.end.getTime() <= rangeEndMs,
        continuesBefore: occurrence.start.getTime() < rangeStartMs,
        continuesAfter: occurrence.end.getTime() > rangeEndMs,
        startMin: Math.max(
          (occurrence.start.getTime() - rangeStartMs) / 60000,
          0
        ),
        endMin: Math.min(
          (occurrence.end.getTime() - rangeStartMs) / 60000,
          totalMin
        ),
      }))
      const mode = resolveScheduleMode(row.resource, scheduleMode)
      packTimedSegments(segments, { mode, preferredLanes: previousLanes })
      for (const segment of segments) {
        nextLanes.set(getLaneKey(segment.occurrence), {
          lane: segment.column ?? 0,
          startMs: segment.occurrence.start.getTime(),
          endMs: segment.occurrence.end.getTime(),
        })
      }
      const laneCount = segments.reduce(
        (max, segment) => Math.max(max, (segment.column ?? 0) + 1),
        1
      )
      let from = Infinity
      let to = -Infinity
      for (const segment of segments) {
        from = Math.min(from, (segment.startMin ?? 0) / totalMin)
        to = Math.max(to, (segment.endMin ?? 0) / totalMin)
      }

      // Parent rollup from the subtree's bars: envelope clamped to the range,
      // progress weighted by each bar's full duration
      let summary: TimelineRowBars["summary"] = null
      if (row.isGroup && segments.length === 0 && viewConfig.summaryBars) {
        let sumFrom = Infinity
        let sumTo = -Infinity
        for (const id of descendantIds.get(row.resource.id) ?? []) {
          const env = envelopes.get(id)
          if (!env) continue
          sumFrom = Math.min(sumFrom, env.fromMin / totalMin)
          sumTo = Math.max(sumTo, env.toMin / totalMin)
        }
        if (sumTo > sumFrom) {
          summary = {
            from: sumFrom,
            to: sumTo,
            // all-time completion (matches a consumer's tree rollup), not the
            // visible-range slice - task progress is independent of scroll
            progress: subtreeProgress.get(row.resource.id) ?? null,
          }
        }
      }

      // The stack, then the row's own padding around it. Centering the block
      // in the resulting height gives an equal inset top and bottom, and it
      // is also what keeps a lone bar on the tree label's centerline when a
      // short row is held open by minRowHeight.
      const blockRem = laneCount * laneHeightRem + (laneCount - 1) * laneGapRem
      const heightRem = Math.max(minRowRem, blockRem + 2 * rowPaddingRem)
      const laneOffsetRem = (heightRem - blockRem) / 2

      map.set(row.resource.id, {
        segments,
        laneCount,
        draftLane: null,
        scheduleMode: mode,
        heightRem,
        laneOffsetRem,
        bandRem: laneHeightRem + laneOffsetRem * 2,
        extent:
          segments.length > 0
            ? {
                from,
                to,
                color: segments[0].occurrence.event.color,
                label:
                  segments.length === 1
                    ? segments[0].occurrence.event.title
                    : settings.i18n.labels.events(segments.length),
                startMs: Math.min(
                  ...segments.map((s) => s.occurrence.start.getTime())
                ),
              }
            : summary
              ? {
                  from: summary.from,
                  to: summary.to,
                  label: row.resource.title,
                  startMs:
                    rangeStartMs + summary.from * (rangeEndMs - rangeStartMs),
                }
              : null,
        summary,
      })
    }
    laneMemory.current = nextLanes
    return map
  }, [
    rows,
    occurrences,
    rangeStartMs,
    rangeEndMs,
    settings.i18n,
    viewConfig.summaryBars,
    descendantIds,
    subtreeProgress,
    laneHeightRem,
    rowPaddingRem,
    laneGapRem,
    minRowRem,
    scheduleMode,
  ])

  // ----- split panes: width state, splitter drag/keyboard, scroll sync -----
  const treeConfig = { ...DEFAULT_TREE_PANEL, ...viewConfig.treePanel }
  const clampTree = (width: number) =>
    Math.min(Math.max(width, treeConfig.minWidth), treeConfig.maxWidth)
  const [treeWidth, setTreeWidth] = useState(treeConfig.width)
  const configuredTreeWidth = clampTree(treeWidth)
  const columns = viewConfig.columns ?? []

  // "Add task" hint at the foot of the tree, gated by validation
  /**
   * Reserve the track a drag-create in flight will land on - as a THIN overlay
   * over the layout above, never as an input to it. Rebuilding the whole map
   * per snapped step would hand every row a new `bars` object and defeat
   * GanttTimelineRow's memo across the entire grid, so only the drafted row's
   * entry is replaced; every other row keeps its identity and never re-renders.
   *
   * `laneOffsetRem` and `bandRem` are deliberately carried over UNCHANGED.
   * Deriving them from the grown track count re-centres the row, which drags
   * the settled bars and the tree label box with it - a 2px wobble by default
   * and, under a consumer `metrics.minRowHeight` big enough to swallow the
   * growth, an 11.5px jerk that snaps back on release. Growing a row must add
   * space BELOW what is already there and move nothing.
   */
  const rowBars = useMemo(() => {
    if (!draftLayout) return baseRowBars
    const base = baseRowBars.get(draftLayout.resourceId)
    if (!base) return baseRowBars
    const next = new Map(baseRowBars)
    // "single" packs every bar onto lane 0, so that is where the draft goes
    // too and the row never grows. Recorded rather than left null so the
    // placeholder's data-lane still names a real destination.
    if (base.scheduleMode === "single") {
      next.set(draftLayout.resourceId, { ...base, draftLane: 0 })
      return next
    }
    const draftLane = lowestFreeLane(
      base.segments,
      draftLayout.startMs,
      draftLayout.endMs
    )
    const trackCount = Math.max(base.laneCount, draftLane + 1)
    const draftBlockRem =
      trackCount * laneHeightRem + (trackCount - 1) * laneGapRem
    next.set(draftLayout.resourceId, {
      ...base,
      draftLane,
      heightRem: Math.max(
        base.heightRem,
        base.laneOffsetRem * 2 + draftBlockRem
      ),
    })
    return next
  }, [baseRowBars, draftLayout, laneHeightRem, laneGapRem])

  const showCreateTask =
    viewConfig.displayCreateTaskHint &&
    !!settings.onCreateTask &&
    (settings.canCreateTask?.({ parentId: null }) ?? true)

  // Responsive guard: the timeline must always keep a usable width, so on
  // narrow containers the tree pane yields down toward its minWidth. Measured
  // (not media-queried) because the gantt can live in any column. The -1
  // reserves the splitter hairline so the timeline truly keeps MIN width.
  const [containerWidth, setContainerWidth] = useState(0)
  const clampContainer = (width: number, container: number) => {
    if (container <= 0) return width
    const ceiling = container - minTimelineWidth - 1
    // The tree's own minWidth is a PREFERENCE, not a licence to squeeze the
    // timeline out of existence: cap it by what the container can actually
    // spare. Without this cap a consumer minWidth wider than the container
    // wins outright and the timeline collapses below minTimelineWidth with
    // the splitter already pinned, so the space cannot be dragged back.
    const floor = Math.min(treeConfig.minWidth, Math.max(ceiling, 0))
    return Math.max(Math.min(width, ceiling), Math.min(floor, container - 1))
  }
  const clampedTreeWidth = clampContainer(configuredTreeWidth, containerWidth)
  /** Live width while the splitter is dragging; render reads it so a
      mid-drag re-render can't snap the pane back to stale state. */
  const liveTreeWidthRef = useRef<number | null>(null)

  // In-flight gestures must never outlive the view (leaked window listeners,
  // body overlays and the drag cursor), and must never keep running against
  // geometry they measured before it changed - a gesture snapshots the axis
  // and row rects once at activation, so any of these invalidates it.
  // Cancel-and-revert is the safe contract; all of this is a no-op in normal
  // flows (none of these values can change during an ordinary pointer drag).
  useGanttGestureTeardown()
  useEffect(() => {
    cancelActiveGanttGestures()
  }, [zoom, scale, rangeKey, clampedTreeWidth, rows.length])

  // Leaf-row checkbox selection: uncontrolled unless selectedRows is passed
  const [internalSelected, setInternalSelected] = useState<string[]>([])
  const selectedRows = viewConfig.selectedRows ?? internalSelected
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows])
  // Latest-value refs so the row handlers keep ONE identity across renders -
  // the row components are memoized and must not re-render per state change
  const viewConfigRef = useRef(viewConfig)
  viewConfigRef.current = viewConfig
  const selectedRowsRef = useRef(selectedRows)
  selectedRowsRef.current = selectedRows
  const toggleRowSelected = useCallback((id: string, checked: boolean) => {
    const current = selectedRowsRef.current
    const next = checked
      ? [...current.filter((rowId) => rowId !== id), id]
      : current.filter((rowId) => rowId !== id)
    if (viewConfigRef.current.selectedRows === undefined) {
      setInternalSelected(next)
    }
    viewConfigRef.current.onSelectedRowsChange?.(next)
  }, [])

  const bodyRef = useRef<HTMLDivElement | null>(null)
  const treePaneRef = useRef<HTMLDivElement | null>(null)
  const timelinePaneRef = useRef<HTMLDivElement | null>(null)
  const treeRowsRef = useRef<HTMLDivElement | null>(null)

  // Track the body width so the tree pane can yield on narrow containers.
  // Layout effect, not effect: the first measure must flush BEFORE the first
  // paint so a clamped tree width never paints wide for a frame and then
  // snaps - the panes are laid out final from the very first displayed frame.
  useLayoutEffect(() => {
    const body = bodyRef.current
    if (!body) return
    const update = () => setContainerWidth(body.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(body)
    return () => observer.disconnect()
  }, [])

  const beginSplit = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    const pointerId = e.pointerId
    const startX = e.clientX
    const startWidth = clampedTreeWidth
    const splitter = e.currentTarget as HTMLElement
    // in RTL the tree pane sits on the right: pointer deltas invert
    const dir = getComputedStyle(splitter).direction === "rtl" ? -1 : 1
    splitter.setAttribute("data-resizing", "")
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    // Live width goes straight to the DOM: a React state write here would
    // re-render every row and bar per pointermove. State commits on release.
    // The container clamp applies live too - the timeline must not collapse
    // below its minimum mid-drag only to snap back on release.
    let liveWidth = startWidth
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      liveWidth = clampContainer(
        clampTree(startWidth + (ev.clientX - startX) * dir),
        bodyRef.current?.clientWidth ?? 0
      )
      liveTreeWidthRef.current = liveWidth
      if (treePaneRef.current) {
        treePaneRef.current.style.width = `${liveWidth}px`
      }
    }
    const finish = (ev?: PointerEvent) => {
      if (ev && ev.pointerId !== pointerId) return
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", finish)
      window.removeEventListener("pointercancel", finish)
      splitter.removeAttribute("data-resizing")
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      liveTreeWidthRef.current = null
      if (liveWidth !== startWidth) {
        setTreeWidth(liveWidth)
        viewConfigRef.current.treePanel?.onWidthChange?.(liveWidth)
      }
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", finish)
    window.addEventListener("pointercancel", finish)
  }

  // Both panes scroll vertically; whichever moves drives the other.
  useEffect(() => {
    const treeViewport = getPaneViewport(treePaneRef.current)
    const timelineViewport = getPaneViewport(timelinePaneRef.current)
    if (!treeViewport || !timelineViewport) return
    const link = (source: HTMLElement, target: HTMLElement) => {
      // Mirror only when the source's own vertical position changed -
      // horizontal-only scroll events must not replay a stale scrollTop over
      // the other pane. Assign only on drift: the mirrored handler then
      // no-ops, so no loop.
      let lastTop = source.scrollTop
      const onScroll = () => {
        if (source.scrollTop === lastTop) return
        lastTop = source.scrollTop
        if (target.scrollTop !== source.scrollTop) {
          target.scrollTop = source.scrollTop
        }
      }
      source.addEventListener("scroll", onScroll)
      return () => source.removeEventListener("scroll", onScroll)
    }
    const unlinkTree = link(treeViewport, timelineViewport)
    const unlinkTimeline = link(timelineViewport, treeViewport)
    let unforward: (() => void) | null = null
    if (treeViewport.hasAttribute("data-gantt-native-scroll")) {
      // Native mode: the tree's vertical axis is overflow-hidden (its bar
      // would duplicate the timeline's), so vertical wheel intent forwards to
      // the timeline, which mirrors back through the link above. Horizontal
      // wheel intent stays native for the tree's own columns.
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
        timelineViewport.scrollTop += dy
        e.preventDefault()
      }
      treeViewport.addEventListener("wheel", onWheel, { passive: false })
      unforward = () => treeViewport.removeEventListener("wheel", onWheel)
    } else {
      // Custom scrollbars: both panes are real vertical scrollers. The links
      // above mirror on the scroll event, which fires only AFTER the source
      // has already painted - so with compositor momentum (wheel/trackpad) the
      // active pane runs a frame ahead of the mirror and the two visibly drift
      // (the flicker). Fix: drive BOTH viewports from one wheel handler so they
      // move in the same frame, perfectly locked. Horizontal intent stays
      // native for each pane's own axis; the links still cover scrollbar drags,
      // keyboard, touch and programmatic scrolls; touch has no wheel events,
      // so flick-scrolling syncs through the (frame-lagged) link - accepted,
      // pointer drags are the gantt's primary touch interaction.
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
        const max =
          timelineViewport.scrollHeight - timelineViewport.clientHeight
        if (max <= 0) return
        const unit =
          e.deltaMode === 1
            ? 16
            : e.deltaMode === 2
              ? timelineViewport.clientHeight
              : 1
        const next = Math.max(
          0,
          Math.min(max, timelineViewport.scrollTop + e.deltaY * unit)
        )
        e.preventDefault()
        timelineViewport.scrollTop = next
        treeViewport.scrollTop = next
      }
      treeViewport.addEventListener("wheel", onWheel, { passive: false })
      timelineViewport.addEventListener("wheel", onWheel, { passive: false })
      unforward = () => {
        treeViewport.removeEventListener("wheel", onWheel)
        timelineViewport.removeEventListener("wheel", onWheel)
      }
    }
    return () => {
      unlinkTree()
      unlinkTimeline()
      unforward?.()
    }
  }, [scale, viewConfig.scrollbars])

  // Linked row hover: mirror data-hover onto the row's twin in the other pane
  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    let current: string | null = null
    const apply = (id: string | null) => {
      if (id === current) return
      if (current) {
        body
          .querySelectorAll(`[data-gantt-row-id="${CSS.escape(current)}"]`)
          .forEach((el) => el.removeAttribute("data-hover"))
      }
      if (id) {
        body
          .querySelectorAll(`[data-gantt-row-id="${CSS.escape(id)}"]`)
          .forEach((el) => el.setAttribute("data-hover", ""))
      }
      current = id
    }
    const onOver = (e: PointerEvent) => {
      const row = (e.target as HTMLElement | null)?.closest?.(
        "[data-gantt-row-id]"
      )
      apply(row?.getAttribute("data-gantt-row-id") ?? null)
    }
    const onLeave = () => apply(null)
    body.addEventListener("pointerover", onOver)
    body.addEventListener("pointerleave", onLeave)
    return () => {
      body.removeEventListener("pointerover", onOver)
      body.removeEventListener("pointerleave", onLeave)
      apply(null)
    }
  }, [])

  // Auto-manage the horizontal position for the current anchor until the user
  // scrolls: pre-buffer one period per side (so infinite scroll never resizes
  // the scrollbar on the first gesture), then center the target instant.
  // Idempotent - re-running just re-centers the same instant - so React
  // StrictMode's double-invoke and range-growth re-renders are both safe.
  const anchorMs = useGanttSelector((state) => state.date.getTime())
  // flattened to a primitive so an inline `initialCenter={new Date(...)}`
  // cannot re-run the centring effect on every render
  const initialCenter =
    viewConfig.initialCenter instanceof Date
      ? viewConfig.initialCenter.getTime()
      : viewConfig.initialCenter
  const manageRef = useRef({ key: "", buffered: false, userTook: false })
  useLayoutEffect(() => {
    const key = `${scale}:${anchorMs}:${viewConfig.scrollbars}`
    if (manageRef.current.key !== key) {
      // An anchor change from an extendRange window SLIDE continues the
      // user's own travel: the guard survives, or the pre-buffer branch
      // would re-extend and cascade further slides at the window cap.
      const slideContinuation =
        manageRef.current.userTook && instance.internals.didAnchorSlide()
      manageRef.current = slideContinuation
        ? { key, buffered: manageRef.current.buffered, userTook: true }
        : { key, buffered: false, userTook: false }
    }
    if (manageRef.current.userTook) return
    // Deferred-mount wait: when the viewport is not measurable yet (hidden
    // tab, display:none ancestor), a ResizeObserver resumes positioning on
    // the exact frame it gains a size - RO callbacks run in the rendering
    // steps BEFORE that frame paints, so no uncentered frame is ever shown.
    // (An rAF retry here would paint the range start first and then snap.)
    let waiter: ResizeObserver | null = null
    const run = () => {
      waiter?.disconnect()
      waiter = null
      const viewport = getPaneViewport(timelinePaneRef.current)
      const axis = viewport?.querySelector<HTMLElement>("[data-gantt-axis]")
      if (!viewport || !axis) return
      if (viewport.clientWidth === 0) {
        waiter = new ResizeObserver(() => {
          if (viewport.clientWidth > 0) run()
        })
        waiter.observe(viewport)
        return
      }
      // pre-buffer once; the re-run after the range grows lands the center
      if (viewConfig.infiniteScroll && !manageRef.current.buffered) {
        manageRef.current.buffered = true
        extendLockRef.current = true
        instance.internals.extendRange("before")
        instance.internals.extendRange("after")
        return
      }
      extendLockRef.current = false
      if (viewport.scrollWidth <= viewport.clientWidth) return
      // read the clock at run time - the effect must not depend on a
      // reactive now that re-runs it (and the whole grid) every 30s.
      // Target now ONLY when the anchor period itself contains it: keying
      // on the whole (buffered) visible range would re-center prev/next
      // navigation right back onto today.
      const active = instance.getState().activeRange
      let target: number
      if (typeof initialCenter === "number") {
        target = initialCenter
      } else if (initialCenter === "anchor") {
        target = anchorMs
      } else {
        const nowMs = Date.now()
        target =
          nowMs >= active.start.getTime() && nowMs < active.end.getTime()
            ? nowMs
            : anchorMs
      }
      const fraction = Math.min(
        Math.max((target - rangeStartMs) / (rangeEndMs - rangeStartMs), 0),
        1
      )
      setScrollStart(
        viewport,
        Math.max(0, fraction * viewport.scrollWidth - viewport.clientWidth / 2)
      )
    }
    run()
    return () => {
      waiter?.disconnect()
    }
  }, [
    scale,
    anchorMs,
    initialCenter,
    viewConfig.scrollbars,
    viewConfig.infiniteScroll,
    rangeKey,
    rangeStartMs,
    rangeEndMs,
    instance,
  ])

  // ----- infinite scroll: grow the range near an edge, keep the position -----
  // Restoration is anchored to a TIMESTAMP, not pixel deltas: it survives
  // growth, window slides, and zoom changes alike.
  const pendingRestoreRef = useRef<{
    ms: number
    align: "start" | "center"
  } | null>(null)
  const extendLockRef = useRef(false)
  const lastUserScrollRef = useRef(0)
  /** Fine-grained viewport-center instant, for controlled-zoom anchoring. */
  const fineCenterRef = useRef<number | null>(null)
  const lastZoomRef = useRef<number | null>(null)

  // Only user gestures may extend the range - programmatic scrolls (chip
  // jumps, auto-center, zoom clamping) must never grow it.
  useEffect(() => {
    const pane = timelinePaneRef.current
    if (!pane) return
    const markIntent = () => {
      lastUserScrollRef.current = performance.now()
    }
    // pointerdown counts only where pressing can scroll: the scrollbars,
    // the pan header, or a native-scroll host - NOT bars, chips, or zoom
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target?.closest(
          "[data-slot=scroll-area-scrollbar], [data-slot=gantt-timeline-header], [data-gantt-native-scroll]"
        )
      ) {
        markIntent()
      }
    }
    pane.addEventListener("wheel", markIntent, { passive: true })
    pane.addEventListener("pointerdown", onPointerDown)
    pane.addEventListener("touchstart", markIntent, { passive: true })
    pane.addEventListener("keydown", markIntent)
    return () => {
      pane.removeEventListener("wheel", markIntent)
      pane.removeEventListener("pointerdown", onPointerDown)
      pane.removeEventListener("touchstart", markIntent)
      pane.removeEventListener("keydown", markIntent)
    }
  }, [])

  useEffect(() => {
    if (!viewConfig.infiniteScroll) return
    const viewport = getPaneViewport(timelinePaneRef.current)
    if (!viewport) return
    const tryExtend = (direction: "before" | "after") => {
      // anchor the left edge as an instant, from the LIVE axis range
      const axis = viewport.querySelector<HTMLElement>("[data-gantt-axis]")
      const liveStart = Number(axis?.dataset.ganttRangeStart)
      const liveEnd = Number(axis?.dataset.ganttRangeEnd)
      if (!axis || Number.isNaN(liveStart) || Number.isNaN(liveEnd)) return
      extendLockRef.current = true
      manageRef.current.userTook = true
      pendingRestoreRef.current = {
        ms:
          liveStart +
          (getScrollStart(viewport) / viewport.scrollWidth) *
            (liveEnd - liveStart),
        align: "start",
      }
      if (!instance.internals.extendRange(direction)) {
        pendingRestoreRef.current = null
        extendLockRef.current = false
      }
    }
    // scrollLeft is signed by direction; all edge math runs on the
    // distance-from-inline-start so RTL panes behave identically
    const isRtl = getComputedStyle(viewport).direction === "rtl"
    const onScroll = () => {
      if (extendLockRef.current) return
      if (performance.now() - lastUserScrollRef.current > 1200) return
      // a track that fits the pane has no scroll gesture to extend from
      if (viewport.scrollWidth <= viewport.clientWidth + 8) return
      const fromStart = getScrollStart(viewport)
      const fromEnd = viewport.scrollWidth - fromStart - viewport.clientWidth
      const direction =
        fromStart < infiniteEdgePx
          ? ("before" as const)
          : fromEnd < infiniteEdgePx
            ? ("after" as const)
            : null
      if (!direction) return
      tryExtend(direction)
    }
    // parked exactly on an edge, further wheeling emits no scroll event -
    // the wheel itself is the growth gesture then
    const onWheel = (e: WheelEvent) => {
      if (extendLockRef.current || e.deltaX === 0) return
      if (viewport.scrollWidth <= viewport.clientWidth + 8) return
      const towardStart = isRtl ? e.deltaX > 0 : e.deltaX < 0
      if (towardStart && getScrollStart(viewport) <= 0) {
        tryExtend("before")
      } else if (
        !towardStart &&
        getScrollStart(viewport) + viewport.clientWidth >=
          viewport.scrollWidth - 1
      ) {
        tryExtend("after")
      }
    }
    viewport.addEventListener("scroll", onScroll)
    viewport.addEventListener("wheel", onWheel, { passive: true })
    return () => {
      viewport.removeEventListener("scroll", onScroll)
      viewport.removeEventListener("wheel", onWheel)
    }
  }, [
    instance,
    viewConfig.infiniteScroll,
    scale,
    viewConfig.scrollbars,
    infiniteEdgePx,
  ])

  // Report the visible-center instant so the nav title names what you are
  // looking at. Throttled to period boundaries (a coarse key) so scrolling
  // within a period never re-renders the grid.
  useEffect(() => {
    const viewport = getPaneViewport(timelinePaneRef.current)
    if (!viewport) return
    const keyFmt =
      scale === "day"
        ? "yyyy-MM-dd"
        : scale === "week"
          ? "RRRR-'W'II"
          : scale === "month"
            ? "yyyy-MM"
            : scale === "quarter"
              ? "yyyy-qqq"
              : "yyyy"
    let raf = 0
    let lastKey = ""
    const measure = () => {
      raf = 0
      const axis = viewport.querySelector<HTMLElement>("[data-gantt-axis]")
      const liveStart = Number(axis?.dataset.ganttRangeStart)
      const liveEnd = Number(axis?.dataset.ganttRangeEnd)
      if (!axis || Number.isNaN(liveStart) || Number.isNaN(liveEnd)) return
      const fraction =
        (getScrollStart(viewport) + viewport.clientWidth / 2) /
        Math.max(1, viewport.scrollWidth)
      const centerMs = liveStart + fraction * (liveEnd - liveStart)
      // fine center first (controlled-zoom anchor), then the coarse-keyed
      // store report that drives the nav title
      fineCenterRef.current = centerMs
      const center = new Date(centerMs)
      const key = format(toZoned(center, timeZone), keyFmt)
      if (key === lastKey) return
      lastKey = key
      instance.internals.setViewportCenter(center)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    viewport.addEventListener("scroll", schedule)
    schedule()
    return () => {
      viewport.removeEventListener("scroll", schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [instance, scale, timeZone, viewConfig.scrollbars, rangeKey])

  // Re-seat the viewport on its anchored instant before paint. Runs for range
  // growth, window slides, and zoom changes; a slide moves the anchor date,
  // so pre-mark auto-centering as done for the new key.
  useLayoutEffect(() => {
    // Consumer-driven (controlled) zoom changes carry no anchorZoomCenter
    // call; anchor them to the last known viewport center so the view does
    // not drift. Built-in buttons set pendingRestore first and win.
    if (
      lastZoomRef.current !== null &&
      lastZoomRef.current !== zoom &&
      !pendingRestoreRef.current &&
      fineCenterRef.current !== null
    ) {
      pendingRestoreRef.current = { ms: fineCenterRef.current, align: "center" }
    }
    lastZoomRef.current = zoom
    let raf: number | null = null
    let attempts = 0
    const seat = () => {
      raf = null
      const viewport = getPaneViewport(timelinePaneRef.current)
      if (viewport && pendingRestoreRef.current) {
        // Not laid out yet (0-width on first mount): centering with a 0 offset
        // parks the view a half-pane off. Defer until the pane is measured so
        // "center" lands the anchored instant in the middle on initial load.
        if (viewport.clientWidth === 0 && attempts++ < 20) {
          raf = requestAnimationFrame(seat)
          return
        }
        const { ms, align } = pendingRestoreRef.current
        pendingRestoreRef.current = null
        // clamp: a stale anchor (e.g. an ignored controlled-zoom proposal)
        // must never park the view outside the track
        const fraction = Math.min(
          Math.max((ms - rangeStartMs) / (rangeEndMs - rangeStartMs), 0),
          1
        )
        const offset = align === "center" ? viewport.clientWidth / 2 : 0
        setScrollStart(
          viewport,
          Math.max(0, fraction * viewport.scrollWidth - offset)
        )
      }
      extendLockRef.current = false
    }
    seat()
    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [
    rangeKey,
    zoom,
    rangeStartMs,
    rangeEndMs,
    scale,
    viewConfig.scrollbars,
    instance,
  ])

  /** Keep the view centered on the same instant across a zoom step. */
  const anchorZoomCenter = () => {
    const viewport = getPaneViewport(timelinePaneRef.current)
    const axis = viewport?.querySelector<HTMLElement>("[data-gantt-axis]")
    if (!viewport || !axis) return
    const liveStart = Number(axis.dataset.ganttRangeStart)
    const liveEnd = Number(axis.dataset.ganttRangeEnd)
    if (Number.isNaN(liveStart) || Number.isNaN(liveEnd)) return
    pendingRestoreRef.current = {
      ms:
        liveStart +
        ((getScrollStart(viewport) + viewport.clientWidth / 2) /
          viewport.scrollWidth) *
          (liveEnd - liveStart),
      align: "center",
    }
  }

  // Drag-to-pan from the header (intent-based: activates after 4px)
  const beginHeaderPan = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const viewport = getPaneViewport(timelinePaneRef.current)
    if (!viewport) return
    const pointerId = e.pointerId
    const startX = e.clientX
    const startLeft = viewport.scrollLeft
    let active = false
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      const dx = ev.clientX - startX
      if (!active && Math.abs(dx) < 4) return
      if (!active) {
        markGestureEnd()
        setIsPanning(true)
      }
      active = true
      // panning is a user scroll: keep the infinite-scroll gate open
      lastUserScrollRef.current = performance.now()
      document.body.style.cursor = "grabbing"
      document.body.style.userSelect = "none"
      viewport.scrollLeft = startLeft - dx
    }
    const finish = (ev?: PointerEvent) => {
      if (ev && ev.pointerId !== pointerId) return
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", finish)
      window.removeEventListener("pointercancel", finish)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      if (active) setIsPanning(false)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", finish)
    window.addEventListener("pointercancel", finish)
  }

  // Panning suppresses the placement hints (scroll intent, not create intent)
  const [isPanning, setIsPanning] = useState(false)

  // ----- tree-row drag reorder (mirrors the event engine: live validity,
  // destructive styling when invalid, Esc cancel, commit via callback) -----
  const [reorder, setReorder] = useState<TimelineReorderState | null>(null)
  const reorderEnabled = !!settings.onResourceReorder
  const settingsRef = useRef(settings)
  settingsRef.current = settings
  const rowsRef = useRef(rows)
  rowsRef.current = rows

  const beginRowReorder = useCallback(
    (e: React.PointerEvent, dragRow: TimelineRow) => {
      const settings = settingsRef.current
      const rows = rowsRef.current
      if (e.button !== 0 || !settings.onResourceReorder) return
      e.preventDefault()
      e.stopPropagation()
      const container = treeRowsRef.current
      const pane = treePaneRef.current
      if (!container || !pane) return
      const rowEls = Array.from(
        container.querySelectorAll<HTMLElement>("[data-slot=gantt-row-group]")
      )
      document.body.style.cursor = "grabbing"
      document.body.style.userSelect = "none"
      let current: TimelineReorderState | null = null
      let lastBoundary = -1

      // Carry overlay: clone the WHOLE row (name + detail columns), flat -
      // it reads as the row itself moving, not a separate card
      const pointerId = e.pointerId
      const rowEl = (e.currentTarget as HTMLElement).closest<HTMLElement>(
        "[data-slot=gantt-row-group]"
      )
      const overlay = document.createElement("div")
      overlay.setAttribute("data-slot", "gantt-drag-overlay")
      overlay.className =
        "bg-background pointer-events-none fixed overflow-hidden opacity-95"
      overlay.style.zIndex = "100"
      // body-appended, so it is outside the gantt root that owns the type
      // scale: without adopting the root's resolved metrics the carried row
      // renders at the document default and reads bigger than the row it left
      const ganttRoot = pane.closest<HTMLElement>("[data-slot=gantt]")
      if (ganttRoot) {
        const rootStyle = getComputedStyle(ganttRoot)
        overlay.style.fontSize = rootStyle.fontSize
        overlay.style.lineHeight = rootStyle.lineHeight
        overlay.style.fontFamily = rootStyle.fontFamily
        overlay.style.letterSpacing = rootStyle.letterSpacing
        overlay.style.direction = rootStyle.direction
      }
      if (rowEl) {
        const rowRect = rowEl.getBoundingClientRect()
        overlay.style.width = `${rowRect.width}px`
        overlay.style.height = `${rowRect.height}px`
        const clone = rowEl.cloneNode(true) as HTMLElement
        clone.removeAttribute("data-gantt-row-id")
        clone.classList.remove("border-b")
        clone.style.height = "100%"
        overlay.appendChild(clone)
      }
      document.body.appendChild(overlay)
      const grabRect = rowEl?.getBoundingClientRect()
      const grabDY = grabRect ? e.clientY - grabRect.top : 8
      // vertical-only carry, locked to the tree panel like a list row drag
      const lockedX = grabRect?.left ?? pane.getBoundingClientRect().left
      const paneRect = pane.getBoundingClientRect()
      const rowH = grabRect?.height ?? 40
      // Rows do not move during the gesture (the carry is a fixed overlay), so
      // rects are measured ONCE - per-move full-row rect scans forced a
      // synchronous reflow after every overlay style write.
      const rects = rowEls.map((el) => el.getBoundingClientRect())
      const place = (y: number) => {
        const top = Math.min(
          Math.max(y - grabDY, paneRect.top),
          paneRect.bottom - rowH
        )
        overlay.style.left = `${lockedX}px`
        overlay.style.top = `${top}px`
      }
      place(e.clientY)

      const propose = (boundary: number): TimelineReorderState => {
        const below = rows[boundary]
        const parentId =
          below?.parentId ?? rows[rows.length - 1]?.parentId ?? null
        let index = 0
        for (let i = 0; i < boundary; i++) {
          if (
            rows[i].parentId === parentId &&
            rows[i].resource.id !== dragRow.resource.id
          ) {
            index++
          }
        }
        const next = reorderResources(
          settings.resources,
          dragRow.resource.id,
          parentId,
          index
        )
        const proposal: GanttResourceReorder | null = next
          ? {
              resourceId: dragRow.resource.id,
              parentId,
              index,
              resources: next,
            }
          : null
        const valid =
          !!proposal && (settings.canReorderResource?.(proposal) ?? true)
        const top =
          boundary < rects.length
            ? rects[boundary].top - paneRect.top
            : (rects[rects.length - 1]?.bottom ?? paneRect.top) - paneRect.top
        return { resourceId: dragRow.resource.id, top, valid, proposal }
      }

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return
        place(ev.clientY)
        let boundary = rects.length
        for (let i = 0; i < rects.length; i++) {
          if (ev.clientY < rects[i].top + rects[i].height / 2) {
            boundary = i
            break
          }
        }
        // the immutable tree clone + validity check run only when the pointer
        // crosses into another slot, not per pointermove
        if (boundary === lastBoundary) return
        lastBoundary = boundary
        const nextState = propose(boundary)
        if (
          current &&
          current.top === nextState.top &&
          current.valid === nextState.valid
        ) {
          return
        }
        current = nextState
        document.body.style.cursor = nextState.valid
          ? "grabbing"
          : "not-allowed"
        setReorder(nextState)
      }
      const finish = (commit: boolean) => {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
        window.removeEventListener("pointercancel", onCancelEvent)
        window.removeEventListener("keydown", onKey)
        overlay.remove()
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        if (commit && current?.proposal && !current.valid) {
          // released on a rejected position (e.g. a pinned row): let the
          // consumer explain it - the destructive indicator already showed live
          settings.onResourceReorderReject?.(current.proposal)
        } else if (commit && current?.valid && current.proposal) {
          settings.onResourceReorder?.(current.proposal)
          const announcer = pane
            .closest<HTMLElement>("[data-slot=gantt]")
            ?.querySelector<HTMLElement>("[data-slot=gantt-announcer]")
          if (announcer) {
            announcer.textContent = `${dragRow.resource.title}: ${settings.i18n.labels.reorder}`
          }
        }
        setReorder(null)
      }
      const onUp = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return
        finish(true)
      }
      const onCancelEvent = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return
        finish(false)
      }
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") finish(false)
      }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
      window.addEventListener("pointercancel", onCancelEvent)
      window.addEventListener("keydown", onKey)
    },
    []
  )

  const collapsedIdsRef = useRef(collapsedIds)
  collapsedIdsRef.current = collapsedIds
  // Stable identity (reads through refs) so memoized rows survive re-renders
  const onToggleRow = useCallback((row: TimelineRow) => {
    const current = collapsedIdsRef.current
    const next = current.includes(row.resource.id)
      ? current.filter((id) => id !== row.resource.id)
      : [...current, row.resource.id]
    if (viewConfigRef.current.collapsedGroups === undefined) {
      setInternalCollapsed(next)
    }
    viewConfigRef.current.onCollapsedGroupsChange?.(next)
  }, [])

  const loading = useGanttSelector<unknown, boolean>((state) => state.loading)
  const customScrollbars = viewConfig.scrollbars !== "native"
  const gridLines = resolveTimelineLines(viewConfig.timelineLines)
  const showVerticalLines = gridLines.vertical !== null
  const offDayClassName =
    (typeof viewConfig.offDays === "object" && viewConfig.offDays.className) ||
    "bg-muted/40"
  // Body texture: default off-days carry a whisper-faint diagonal hatch over
  // a lighter wash (header cells stay flat). A custom offDays.className
  // replaces both surfaces verbatim.
  const offDayBodyClassName =
    (typeof viewConfig.offDays === "object" && viewConfig.offDays.className) ||
    "bg-muted/25 bg-[repeating-linear-gradient(135deg,transparent,transparent_5px,color-mix(in_oklab,var(--color-border)_35%,transparent)_5px,color-mix(in_oklab,var(--color-border)_35%,transparent)_6px)]"

  // Header-only unit lines, and ONE mechanism for every vertical line in the
  // header: positioned spans at calc(fraction% - 1px). A background gradient
  // rasterizes stripe positions differently from element layout at fractional
  // unit widths, which shifted the group-row boundaries 1px off the unit
  // lines below them mid-track - identical span formulas snap identically.
  // The body stays bare - rows separate by whitespace, never vertical borders.
  const showUnitLines = !uniform || showVerticalLines

  // ----- tree pane content -----
  // Header label offset = the row cell's ps-3 (0.75rem) left gutter + the
  // toggle/checkbox gutter (w-5 + me-1 = 1.5rem) + the reorder grip (0.875rem)
  // when present, so "Resources" lines up with the row titles below it.
  const namePaddingStart = reorderEnabled ? "3.125rem" : "2.25rem"
  const treeContent = (
    <div
      className={cn(
        "flex min-h-full w-max min-w-full flex-col",
        // clearance for the pinned horizontal scrollbar strip
        customScrollbars && "pb-2.5"
      )}
    >
      {/* Same 65px height as the two-row timeline header so the panes align.
          The head keeps its own bottom rule (under the Resources label), but
          the header/body boundary line is transparent so the first tree node
          has no rule directly above it - the 1px is kept only to preserve the
          65px height, matching the timeline. */}
      <div
        data-slot="gantt-tree-header"
        className="bg-background sticky top-0 z-30 box-content h-16 shrink-0 border-b border-b-transparent"
      >
        <div className="flex h-8 border-b">
          <div className="flex h-full min-w-0 flex-1">
            <div
              className="flex h-full shrink-0 items-center"
              style={{
                width: treeConfig.nameColumnWidth,
                paddingInlineStart: namePaddingStart,
              }}
            >
              <span className="text-muted-foreground truncate font-medium">
                {settings.i18n.labels.resources}
              </span>
            </div>
            {columns.map((column) => (
              <div
                key={column.id}
                data-slot="gantt-column-header"
                data-column={column.id}
                className={cn(
                  "text-muted-foreground flex h-full shrink-0 items-center px-2 font-medium",
                  column.align === "center" && "justify-center",
                  column.align === "end" && "justify-end",
                  column.className
                )}
                style={{ width: column.width ?? DEFAULT_COLUMN_WIDTH }}
              >
                <span className="truncate">{column.title ?? column.id}</span>
              </div>
            ))}
            <div className="min-w-0 flex-1" />
          </div>
          {viewConfig.columnsMenu && (
            <div
              data-slot="gantt-columns-menu"
              // gradient lead-in: scrolled column headers dissolve into this
              // sticky control instead of hard-clipping against its background
              className="bg-background before:from-background sticky end-0 z-10 flex h-full shrink-0 items-center ps-1.5 pe-2.5 before:pointer-events-none before:absolute before:inset-y-0 before:-start-5 before:w-5 before:bg-linear-to-l before:to-transparent rtl:before:bg-linear-to-r"
            >
              {viewConfig.columnsMenu}
            </div>
          )}
        </div>
      </div>
      <div ref={treeRowsRef} className="flex flex-col">
        {rows.map((row) => (
          <GanttTreeRow
            key={row.resource.id}
            row={row}
            heightRem={rowBars.get(row.resource.id)?.heightRem ?? minRowRem}
            bandRem={rowBars.get(row.resource.id)?.bandRem ?? minRowRem}
            columns={columns}
            nameWidth={treeConfig.nameColumnWidth}
            dimmed={reorder?.resourceId === row.resource.id}
            selected={selectedSet.has(row.resource.id)}
            onSelectedChange={row.isGroup ? undefined : toggleRowSelected}
            onGripPointerDown={reorderEnabled ? beginRowReorder : undefined}
            onToggle={onToggleRow}
          />
        ))}
        {showCreateTask && (
          <button
            type="button"
            data-slot="gantt-create-task"
            // mirror the tree row's left structure so the + lands in the same
            // column as the row toggle chevrons, and the label lines up with
            // the task titles above
            className="text-muted-foreground hover:text-foreground hover:bg-muted/40 flex h-10 w-full shrink-0 items-center border-b ps-3 pe-3"
            onClick={() =>
              settings.onCreateTask?.({
                parentId: null,
                index: settings.resources.length,
              })
            }
          >
            <span className="flex h-full w-full items-center">
              {reorderEnabled && (
                <span aria-hidden className="w-3.5 shrink-0" />
              )}
              {/* group chevrons sit centered in a size-5 button that fills
                  this w-5 gutter, so the + must center here too */}
              <span className="me-1 flex w-5 shrink-0 items-center justify-center">
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                  className="size-3.5"
                  aria-hidden="true"
                />
              </span>
              <span>{settings.i18n.labels.addTask}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  )

  // ----- timeline pane content -----
  const timelineContent = (
    <div
      className={cn(
        // grow (not just min-h-full) so the body reaches the bottom of the
        // pane: the columns then run the full height and the empty space
        // below the last row becomes pannable canvas instead of dead area
        "flex min-h-full w-max min-w-full grow flex-col",
        customScrollbars && "pb-2.5"
      )}
    >
      {/* Two-row grouped header; also the drag-to-pan surface */}
      <div
        data-slot="gantt-timeline-header"
        className="bg-background sticky top-0 z-30 shrink-0 border-b"
        style={{ minWidth: trackWidth }}
        onPointerDown={beginHeaderPan}
      >
        {/* group sectors; boundaries painted like the body lines */}
        <div className="relative h-8 border-b">
          <div className="flex h-full">
            {groups.map((group) => (
              <div
                key={group.key}
                data-slot="gantt-axis-group"
                // no `truncate` here: overflow-hidden would make this the
                // sticky label's scrollport and the stick would never fire
                className="text-muted-foreground flex min-w-0 items-center ps-3 pe-2"
                style={{ flex: `${group.span} 0 0px` }}
              >
                {/* Pure-CSS sticky: the label rides the leading edge for as
                  long as its own band is on screen, then the next band pushes
                  it out - so the day you are looking at always names itself.
                  The browser composites this; a scroll listener would run JS
                  on every frame to do worse. start-3 matches the cell's ps-3
                  so the gutter is identical parked or pinned. */}
                <span
                  data-slot="gantt-axis-group-label"
                  className="sticky start-3 max-w-full truncate"
                >
                  {group.label}
                </span>
              </div>
            ))}
          </div>
          {/* same span formula as the unit lines below: equal fractions get
              equal layout rounding, so the two rows' lines never drift apart */}
          {groupBoundaries.map((fraction) => (
            <span
              key={fraction}
              aria-hidden
              className="bg-border absolute inset-y-0 w-px"
              style={{ insetInlineStart: `calc(${fraction * 100}% - 1px)` }}
            />
          ))}
        </div>
        {/* units, engine axis = this row */}
        <div
          data-gantt-axis=""
          data-gantt-range-start={rangeStartMs}
          data-gantt-range-end={rangeEndMs}
          data-gantt-snap={snapMin}
          className="relative h-8"
        >
          {/* chrome underlay: off-day washes under the label layer */}
          <div aria-hidden className="absolute inset-0">
            {unitFractions.map(
              ({ unit, start, width }) =>
                unit.isOff && (
                  <span
                    key={unit.key}
                    className={cn("absolute inset-y-0", offDayClassName)}
                    style={{
                      insetInlineStart: `${start * 100}%`,
                      width: `${width * 100}%`,
                    }}
                  />
                )
            )}
          </div>
          <div className="flex h-full">
            {units.map((unit) => (
              <div
                key={unit.key}
                data-today={unit.isToday || undefined}
                data-off={unit.isOff || undefined}
                className={cn(
                  "flex min-w-0 items-center justify-center truncate px-1.5 text-center",
                  "text-muted-foreground",
                  unit.isToday && "text-primary font-medium"
                )}
                style={{ flex: `${unit.weight} 0 0px` }}
              >
                {/* today reads as a soft pill, not just tinted text */}
                {unit.isToday ? (
                  <span className="bg-primary/10 truncate rounded-full px-1.5 py-px">
                    {unit.label}
                  </span>
                ) : (
                  unit.label
                )}
              </div>
            ))}
          </div>
          {showUnitLines &&
            unitFractions.slice(1).map(({ unit, start }) => (
              <span
                key={unit.key}
                aria-hidden
                data-slot="gantt-grid-line"
                data-axis="vertical"
                className={cn(
                  "absolute inset-y-0 w-px",
                  // a dashed rule is a repeating gradient, not a border: the
                  // line is a 1px span, and border-dashed on a zero-width box
                  // paints nothing
                  gridLines.vertical === "dashed"
                    ? "bg-[repeating-linear-gradient(to_bottom,var(--color-border)_0,var(--color-border)_3px,transparent_3px,transparent_6px)]"
                    : "bg-border"
                )}
                style={{ insetInlineStart: `calc(${start * 100}% - 1px)` }}
              />
            ))}
          {viewConfig.nowIndicator && (
            <GanttNowDot rangeStartMs={rangeStartMs} rangeEndMs={rangeEndMs} />
          )}
        </div>
      </div>
      {/* Rows over a shared backdrop (off days, today, boundaries, now);
          grows so the columns run to the bottom of the pane. Pressing anywhere
          here that is not a bar or a hint tile begins a scroll pan - the whole
          panel is a draggable canvas, not just the rows. */}
      <div
        className="relative flex min-h-0 grow flex-col"
        onPointerDown={beginHeaderPan}
      >
        {/* off-day / today / now backdrop only; vertical gridlines are
            per-row and reveal on selection, not painted here */}
        <div
          aria-hidden
          data-slot="gantt-timeline-backdrop"
          className="pointer-events-none absolute inset-0"
        >
          {unitFractions.map(({ unit, start, width }) => (
            <span key={unit.key} className="contents">
              {unit.isOff && (
                <span
                  data-off=""
                  className={cn("absolute inset-y-0", offDayBodyClassName)}
                  style={{
                    insetInlineStart: `${start * 100}%`,
                    width: `${width * 100}%`,
                  }}
                />
              )}
              {unit.isToday && scale !== "day" && (
                <span
                  data-today=""
                  className="bg-primary/5 absolute inset-y-0"
                  style={{
                    insetInlineStart: `${start * 100}%`,
                    width: `${width * 100}%`,
                  }}
                />
              )}
            </span>
          ))}
          {/* one layer for the whole body, not per row: the unit boundaries
            have to line up with the header's spans exactly, so both use the
            same fraction formula */}
          {gridLines.vertical !== null &&
            unitFractions
              .slice(1)
              .map(({ unit, start }) => (
                <span
                  key={`grid-${unit.key}`}
                  data-slot="gantt-grid-line"
                  data-axis="vertical"
                  className={cn(
                    "absolute inset-y-0 w-px",
                    gridLines.vertical === "dashed"
                      ? "bg-[repeating-linear-gradient(to_bottom,var(--color-border)_0,var(--color-border)_3px,transparent_3px,transparent_6px)]"
                      : "bg-border"
                  )}
                  style={{ insetInlineStart: `calc(${start * 100}% - 1px)` }}
                />
              ))}
          {viewConfig.nowIndicator && (
            <GanttNowLine rangeStartMs={rangeStartMs} rangeEndMs={rangeEndMs} />
          )}
        </div>
        {rows.map((row, rowIndex) => (
          <GanttTimelineRow
            key={row.resource.id}
            row={row}
            rowIndex={rowIndex}
            bars={rowBars.get(row.resource.id)}
            rangeStartMs={rangeStartMs}
            rangeEndMs={rangeEndMs}
            trackWidth={trackWidth}
            trackRemWidth={trackRemWidth}
            rowBorder={gridLines.horizontal}
            selected={selectedSet.has(row.resource.id)}
            resolveHintStop={resolveHintStop}
            isPanning={isPanning}
            laneHeightRem={laneHeightRem}
            laneGapRem={laneGapRem}
            minRowRem={minRowRem}
          />
        ))}
        {rows.length === 0 && viewConfig.renderNoResources && (
          <div
            data-slot="gantt-no-resources"
            className="text-muted-foreground flex grow items-center justify-center p-6 text-sm"
          >
            {viewConfig.renderNoResources()}
          </div>
        )}
        {showCreateTask && (
          <div
            aria-hidden
            data-slot="gantt-create-task-spacer"
            className="h-10 border-b"
            style={{ minWidth: trackWidth }}
          />
        )}
      </div>
    </div>
  )

  const horizontalScrollbar = (
    <ScrollBar
      orientation="horizontal"
      // taller strip with vertical padding so the thumb is not crowded.
      // end-0 runs the strip (bg + top border) to the pane's right edge instead
      // of stopping short by the corner width - the vertical scrollbar is inset
      // to end above this strip, so nothing collides in the bottom-right corner.
      className="bg-background border-t-border! end-0! z-40 h-4! rounded-none py-1"
    />
  )

  const defaultProps = {
    "data-slot": "gantt-view",
    "data-scale": scale,
    "aria-busy": loading || undefined,
    className: cn(
      "flex min-h-0 flex-1 flex-col overflow-hidden",
      viewConfig.classNames?.view,
      className
    ),
    children: (
      <div ref={bodyRef} className="relative flex min-h-0 flex-1">
        {/* Tree pane */}
        <div
          ref={treePaneRef}
          data-slot="gantt-tree-pane"
          className="relative h-full shrink-0"
          style={{ width: liveTreeWidthRef.current ?? clampedTreeWidth }}
        >
          {customScrollbars ? (
            // keyed by scale: Base UI measures overflow once per mount, and a
            // scale switch changes content without resizing the viewport
            <ScrollArea
              key={scale}
              className="h-full [&>[data-orientation=vertical]]:hidden"
            >
              <ScrollAreaPrimitive.Content>
                {treeContent}
              </ScrollAreaPrimitive.Content>
              {horizontalScrollbar}
            </ScrollArea>
          ) : (
            <div
              data-slot="scroll-area-viewport"
              data-gantt-native-scroll=""
              // vertical axis is DISPLAY-ONLY: the position is always
              // mirrored from the timeline, so no vertical scrollbar can
              // ever appear (overlay platforms included). Wheel deltas
              // forward to the timeline (see the sync effect); horizontal
              // column scrolling stays fully native.
              className="h-full overflow-x-auto overflow-y-hidden overscroll-contain"
            >
              {treeContent}
            </div>
          )}
          {/* Reserved horizontal-scrollbar rail: the tree usually has no
              horizontal overflow, so its real scrollbar never mounts and its
              bottom edge would sit higher than the timeline's pinned strip.
              This static rail fills that gutter (same 1rem height + top border)
              so the bottom strip reads as one continuous band across both
              panes; a real tree scrollbar (with columns) draws over it. */}
          {customScrollbars && (
            <div
              aria-hidden
              data-slot="gantt-tree-scrollbar-rail"
              className="bg-background border-t-border pointer-events-none absolute inset-x-0 bottom-0 h-4 border-t"
            />
          )}
          {/* Reorder insertion indicator, pinned to the visible pane */}
          {reorder && (
            <div
              data-slot="gantt-reorder-indicator"
              data-invalid={!reorder.valid || undefined}
              className="pointer-events-none absolute inset-x-0 flex items-center"
              style={{ top: reorder.top - 4, zIndex: 110 }}
            >
              {/* caret head pointing along the insertion line; the whole
                  indicator sits above the row carry overlay (z 100) */}
              <span
                className={cn(
                  "ms-0.5 size-0 shrink-0 border-y-4 border-s-8 border-y-transparent",
                  reorder.valid ? "border-s-primary" : "border-s-destructive"
                )}
              />
              <span
                className={cn(
                  "h-px min-w-0 flex-1",
                  reorder.valid ? "bg-primary" : "bg-destructive"
                )}
              />
            </div>
          )}
        </div>
        {/* Splitter */}
        {treeConfig.resizable ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={settings.i18n.labels.resizePanel}
            aria-valuenow={Math.round(clampedTreeWidth)}
            // the EFFECTIVE floor, not the configured one: on a narrow
            // container the tree yields below its own minWidth to keep the
            // timeline usable, and valuenow must never fall outside the range
            aria-valuemin={Math.round(
              Math.min(treeConfig.minWidth, clampedTreeWidth)
            )}
            aria-valuemax={Math.round(
              Math.max(treeConfig.maxWidth, clampedTreeWidth)
            )}
            tabIndex={0}
            data-slot="gantt-splitter"
            className={cn(
              "group/gantt-splitter bg-border hover:bg-primary/60 data-resizing:bg-primary relative z-30 w-px shrink-0 cursor-col-resize touch-none outline-none",
              "focus-visible:ring-ring/50 focus-visible:ring-2",
              "after:absolute after:inset-y-0 after:-start-1 after:-end-1"
            )}
            onPointerDown={beginSplit}
            onDoubleClick={() => {
              setTreeWidth(treeConfig.width)
              treeConfig.onWidthChange?.(treeConfig.width)
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault()
                const dir =
                  getComputedStyle(e.currentTarget).direction === "rtl" ? -1 : 1
                const delta = (e.key === "ArrowLeft" ? -16 : 16) * dir
                const next = clampTree(clampedTreeWidth + delta)
                setTreeWidth(next)
                treeConfig.onWidthChange?.(next)
              }
            }}
          >
            {/* grip pill: makes the hairline read as draggable on approach */}
            <span
              aria-hidden
              data-slot="gantt-splitter-grip"
              className="bg-primary/60 group-data-resizing/gantt-splitter:bg-primary absolute top-1/2 left-1/2 h-6 w-0.75 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-150 group-hover/gantt-splitter:opacity-100 group-focus-visible/gantt-splitter:opacity-100 group-data-resizing/gantt-splitter:opacity-100"
            />
          </div>
        ) : (
          <div aria-hidden className="bg-border w-px shrink-0" />
        )}
        {/* Timeline pane */}
        <div
          ref={timelinePaneRef}
          data-slot="gantt-timeline-pane"
          className="relative h-full min-w-0 flex-1"
        >
          {viewConfig.zoomControl && (
            <div
              data-slot="gantt-zoom"
              className="bg-background absolute end-3 bottom-5 z-40 flex flex-col rounded-md border shadow-sm"
            >
              {/* aria-disabled instead of disabled: the not-allowed cursor
                  must still show at the zoom limits */}
              <TooltipProvider delay={600} closeDelay={0} timeout={300}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={settings.i18n.labels.zoomIn}
                        aria-disabled={!canZoomIn || undefined}
                        className="text-muted-foreground hover:text-foreground size-5! rounded-b-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent"
                        onClick={() => {
                          if (!canZoomIn) return
                          // controlled zoom anchors via fineCenterRef when
                          // the parent adopts; a pre-set anchor would leak
                          // stale if the parent ignores the proposal
                          if (viewConfig.zoom === undefined) anchorZoomCenter()
                          setZoomValue(
                            +(zoom + (zoomRange.step ?? 0.25)).toFixed(2)
                          )
                        }}
                      />
                    }
                  >
                    <IconPlaceholder
                      lucide="PlusIcon"
                      tabler="IconPlus"
                      hugeicons="PlusSignIcon"
                      phosphor="PlusIcon"
                      remixicon="RiAddLine"
                      className="size-3"
                      aria-hidden="true"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {settings.i18n.labels.zoomIn}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={settings.i18n.labels.zoomOut}
                        aria-disabled={!canZoomOut || undefined}
                        className="text-muted-foreground hover:text-foreground size-5! rounded-t-none border-t aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent"
                        onClick={() => {
                          if (!canZoomOut) return
                          if (viewConfig.zoom === undefined) anchorZoomCenter()
                          setZoomValue(
                            +(zoom - (zoomRange.step ?? 0.25)).toFixed(2)
                          )
                        }}
                      />
                    }
                  >
                    <IconPlaceholder
                      lucide="MinusIcon"
                      tabler="IconMinus"
                      hugeicons="MinusSignIcon"
                      phosphor="MinusIcon"
                      remixicon="RiSubtractLine"
                      className="size-3"
                      aria-hidden="true"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {settings.i18n.labels.zoomOut}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {customScrollbars ? (
            // The vertical scrollbar is inset into the body lane: it starts
            // below the sticky 65px two-row header (otherwise its top slides
            // behind the header and the thumb is clipped) and stops above the
            // pinned 16px horizontal strip. `!` overrides Base UI's inline
            // top/bottom; h-auto lets top+bottom define the track height so
            // the thumb is measured against the visible lane, not the full pane.
            <ScrollArea
              key={scale}
              className="h-full [&>[data-orientation=vertical]]:top-[65px]! [&>[data-orientation=vertical]]:bottom-4! [&>[data-orientation=vertical]]:h-auto!"
            >
              {/* A FLEX column, not a percentage: the content's own
                min-h-full would resolve against this box's auto height and
                collapse to nothing, which is why the columns used to stop at
                the last row and leave the rest of the pane dead space. As a
                flex parent it can hand the leftover height down instead. */}
              <ScrollAreaPrimitive.Content className="flex min-h-full flex-col">
                {timelineContent}
              </ScrollAreaPrimitive.Content>
              {horizontalScrollbar}
            </ScrollArea>
          ) : (
            <div
              data-slot="scroll-area-viewport"
              data-gantt-native-scroll=""
              className="h-full overflow-auto overscroll-contain"
            >
              {timelineContent}
            </div>
          )}
          {/* Reserved scrollbar rail - the twin of the tree rail. Keeps the
              bottom gutter present even when the real horizontal scrollbar is
              hidden (e.g. hover-reveal scrollbars at rest), so the strip reads
              as one continuous reserved band across both panes; the real
              scrollbar (z-40) draws over it when active. */}
          {customScrollbars && (
            <div
              aria-hidden
              data-slot="gantt-timeline-scrollbar-rail"
              className="bg-background border-t-border pointer-events-none absolute inset-x-0 bottom-0 h-4 border-t"
            />
          )}
          {viewConfig.offscreenIndicators && (
            <GanttOffscreenChips
              paneRef={timelinePaneRef}
              occurrences={occurrences}
              locale={settings.locale}
              refreshKey={`${scale}:${rangeKey}:${zoom}:${rows.length}:${clampedTreeWidth}:${viewConfig.scrollbars}`}
            />
          )}
        </div>
        {loading && (
          <div
            data-slot="gantt-loading"
            className="bg-background/60 absolute inset-0 z-50 flex items-center justify-center"
          >
            <span className="text-muted-foreground animate-pulse text-sm">
              {settings.i18n.labels.loading}
            </span>
          </div>
        )}
        {(viewConfig.renderDragPreview || viewConfig.renderResizeIndicator) && (
          <GanttCustomDragLayer />
        )}
      </div>
    ),
  }

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  })
}

/**
 * The red now-line, self-ticking: only this component re-renders on the 30s
 * clock, never the grid around it. z-10 keeps it above row content but UNDER
 * the sticky header (z-30) - vertical scrolling slides it beneath, never over.
 */
function GanttNowLine({
  rangeStartMs,
  rangeEndMs,
}: {
  rangeStartMs: number
  rangeEndMs: number
}) {
  const now = useNow()
  const ms = now.getTime()
  if (ms < rangeStartMs || ms >= rangeEndMs) return null
  const fraction = (ms - rangeStartMs) / (rangeEndMs - rangeStartMs)
  return (
    <div
      data-slot="gantt-now-indicator"
      // comet tail: solid at the cap, dissolving toward the bottom -
      // present without ruling a hard line through every row
      className="from-destructive/80 via-destructive/45 to-destructive/15 absolute inset-y-0 z-10 w-px bg-linear-to-b"
      style={{ insetInlineStart: `${fraction * 100}%` }}
    />
  )
}

/**
 * The now-line's dot cap, pinned INSIDE the sticky header at the header/body
 * boundary: it stays put while the line scrolls beneath the header.
 */
function GanttNowDot({
  rangeStartMs,
  rangeEndMs,
}: {
  rangeStartMs: number
  rangeEndMs: number
}) {
  const now = useNow()
  const ms = now.getTime()
  if (ms < rangeStartMs || ms >= rangeEndMs) return null
  const fraction = (ms - rangeStartMs) / (rangeEndMs - rangeStartMs)
  return (
    <span
      aria-hidden
      data-slot="gantt-now-dot"
      className="bg-destructive absolute -bottom-0.75 z-10 size-1.5 -translate-x-1/2 rounded-full"
      style={{ insetInlineStart: `${fraction * 100}%` }}
    />
  )
}

/**
 * Consumer-owned drag/resize indicators (renderDragPreview /
 * renderResizeIndicator): content is React and re-renders per snap step from
 * drag state; the dnd engine adopts this wrapper and writes its
 * cursor-tracking transform imperatively, flipping visibility on the first
 * positioned frame so nothing flashes at the viewport origin.
 */
function GanttCustomDragLayer() {
  const viewConfig = useGanttViewConfig()
  const drag = useGanttSelector((state) => state.drag)
  if (!drag) return null
  const render =
    drag.kind === "move"
      ? viewConfig.renderDragPreview
      : viewConfig.renderResizeIndicator
  if (!render) return null
  return (
    <div
      data-slot={
        drag.kind === "move" ? "gantt-drag-overlay" : "gantt-resize-indicator"
      }
      data-custom=""
      // physical left-0 anchor: positioned by the engine's translate3d from
      // raw clientX (physical); a logical start-0 would break in RTL
      className="pointer-events-none fixed top-0 left-0 z-100 will-change-transform"
      style={{ visibility: "hidden" }}
    >
      {render({
        occurrence: drag.occurrence,
        kind: drag.kind,
        start: drag.proposedStart,
        end: drag.proposedEnd,
        valid: drag.valid,
      })}
    </div>
  )
}

/** Memoized: only rows whose props actually changed re-render. */
const GanttTreeRow = memo(function GanttTreeRow({
  row,
  heightRem,
  bandRem,
  columns,
  nameWidth,
  dimmed,
  selected,
  onSelectedChange,
  onGripPointerDown,
  onToggle,
}: {
  row: TimelineRow
  heightRem: number
  bandRem: number
  columns: GanttColumn[]
  nameWidth: number
  dimmed: boolean
  selected: boolean
  onSelectedChange?: (id: string, checked: boolean) => void
  onGripPointerDown?: (e: React.PointerEvent, row: TimelineRow) => void
  onToggle: (row: TimelineRow) => void
}) {
  const settings = useGanttSettings()
  const viewConfig = useGanttViewConfig()
  const ctx = {
    resource: row.resource,
    depth: row.depth,
    isGroup: row.isGroup,
    collapsed: row.collapsed,
  }

  // consumer-owned right-click menu, same contract as the bar menu
  const menu = viewConfig.renderResourceMenu?.(ctx)

  // A node with several schedules grows its row; "start" keeps the label and
  // its columns on the FIRST schedule's baseline instead of floating them to
  // the middle of a tall row. Every cell's inner box is minRowHeight tall, so
  // a single-lane row renders identically either way.
  const alignStart = (viewConfig.rowAlign ?? DEFAULT_ROW_ALIGN) === "start"

  const rowNode = (
    <div
      data-slot="gantt-row-group"
      data-gantt-row-id={row.resource.id}
      data-selected={selected || undefined}
      className={cn(
        "group/gantt-row data-hover:bg-muted/40 data-selected:bg-primary/5 data-selected:data-hover:bg-primary/5 flex border-b",
        dimmed && "opacity-50"
      )}
      style={{ height: `${heightRem}rem` }}
      onClick={
        settings.onResourceClick
          ? (e: React.MouseEvent) => {
              // chrome clicks (chevron, checkbox, grip) are their own actions
              if ((e.target as HTMLElement).closest("button, [role=checkbox]"))
                return
              settings.onResourceClick?.(ctx, e)
            }
          : undefined
      }
      onDoubleClick={
        settings.onResourceDoubleClick
          ? (e: React.MouseEvent) => {
              if ((e.target as HTMLElement).closest("button, [role=checkbox]"))
                return
              settings.onResourceDoubleClick?.(ctx, e)
            }
          : undefined
      }
    >
      <div className="flex h-full w-full min-w-0">
        {/* In-flow name cell: the whole tree row scrolls horizontally as one;
          row-level hover/selected tints show through the transparent cell */}
        <div
          data-slot="gantt-tree-cell"
          className={cn(
            // ps-3 keeps the row toggles off the left edge (kept in sync with
            // namePaddingStart above so headers stay aligned with row titles)
            "flex shrink-0 ps-3 pe-3",
            alignStart ? "items-start" : "items-center",
            row.isGroup && "font-medium"
          )}
          style={{ width: nameWidth }}
        >
          {/* exactly the band the first schedule occupies: same height, both
            top-anchored, so the label and that schedule share a centerline */}
          <div
            className="flex w-full min-w-0 items-center"
            style={{ height: `${bandRem}rem` }}
          >
            {onGripPointerDown && (
              <button
                type="button"
                data-slot="gantt-row-grip"
                aria-label={settings.i18n.labels.reorder}
                // pointer-coarse keeps the grip visible on touch (no hover there).
                // -ms-1.5/me-1.5 nudge the grip toward the row edge and open a
                // gap before the checkbox so it's easy to grab without catching
                // the checkbox; the equal start/end margins keep the grip's
                // footprint net-zero, so the title stays aligned with the header.
                className="text-muted-foreground/60 hover:text-foreground -ms-1.5 me-1.5 flex w-3.5 shrink-0 cursor-grab touch-none items-center justify-center opacity-0 group-hover/gantt-row:opacity-100 group-data-hover/gantt-row:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
                onPointerDown={(e) => onGripPointerDown(e, row)}
                onClick={(e) => e.stopPropagation()}
              >
                <IconPlaceholder
                  lucide="GripVerticalIcon"
                  tabler="IconGripVertical"
                  hugeicons="DragDropVerticalIcon"
                  phosphor="DotsSixVerticalIcon"
                  remixicon="RiDraggable"
                  className="size-3"
                  aria-hidden="true"
                />
              </button>
            )}
            {/* per-level indent keeps sibling titles on one x */}
            <span
              aria-hidden
              className="shrink-0"
              style={{ width: `${row.depth * 0.875}rem` }}
            />
            {/* fixed gutter: groups toggle here, leaves carry the checkbox -
              titles of one level share the same x either way */}
            <span className="me-1 flex w-5 shrink-0 items-center justify-start">
              {row.isGroup ? (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-expanded={!row.collapsed}
                  aria-label={row.resource.title}
                  className={cn(
                    "size-5! aria-expanded:bg-transparent!",
                    row.collapsed
                      ? "text-foreground"
                      : "text-muted-foreground aria-expanded:text-muted-foreground! hover:text-foreground!"
                  )}
                  onClick={() => onToggle(row)}
                >
                  <IconPlaceholder
                    lucide="ChevronRightIcon"
                    tabler="IconChevronRight"
                    hugeicons="ArrowRight01Icon"
                    phosphor="CaretRightIcon"
                    remixicon="RiArrowRightSLine"
                    className={cn(
                      "size-3.5 transition-transform",
                      !row.collapsed && "rotate-90"
                    )}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                viewConfig.rowCheckboxes &&
                onSelectedChange && (
                  <Checkbox
                    data-slot="gantt-row-checkbox"
                    checked={selected}
                    onCheckedChange={(checked: boolean) =>
                      onSelectedChange(row.resource.id, checked)
                    }
                    aria-label={row.resource.title}
                    className={cn(
                      "size-3.5 opacity-0 transition-opacity group-hover/gantt-row:opacity-100 group-data-hover/gantt-row:opacity-100 focus-visible:opacity-100",
                      selected && "opacity-100"
                    )}
                  />
                )
              )}
            </span>
            {viewConfig.renderResourceLabel?.(ctx) ?? (
              <span className="truncate">{row.resource.title}</span>
            )}
          </div>
        </div>
        {columns.map((column) => (
          <div
            key={column.id}
            data-slot="gantt-tree-column-cell"
            data-column={column.id}
            className={cn(
              "flex shrink-0 px-2",
              alignStart ? "items-start" : "items-center",
              column.className
            )}
            style={{ width: column.width ?? DEFAULT_COLUMN_WIDTH }}
          >
            <div
              className={cn(
                "flex w-full min-w-0 items-center",
                column.align === "center" && "justify-center",
                column.align === "end" && "justify-end"
              )}
              style={{ height: `${bandRem}rem` }}
            >
              {column.render?.(ctx)}
            </div>
          </div>
        ))}
        <div className="min-w-0 flex-1" />
      </div>
    </div>
  )

  if (!menu) return rowNode
  return (
    <ContextMenu>
      <ContextMenuTrigger render={rowNode} />
      <ContextMenuContent data-slot="gantt-resource-menu" className="min-w-44">
        {menu}
      </ContextMenuContent>
    </ContextMenu>
  )
})

const GanttTimelineRow = memo(function GanttTimelineRow({
  row,
  rowIndex,
  bars,
  rangeStartMs,
  rangeEndMs,
  trackWidth,
  trackRemWidth,
  rowBorder,
  selected,
  resolveHintStop,
  isPanning,
  laneHeightRem,
  laneGapRem,
  minRowRem,
}: {
  row: TimelineRow
  rowIndex: number
  bars: TimelineRowBars | undefined
  rangeStartMs: number
  rangeEndMs: number
  trackWidth: string
  trackRemWidth: number
  rowBorder: "solid" | "dashed" | null
  selected: boolean
  resolveHintStop: (
    fraction: number
  ) => { index: number; center: number; ms: number; endMs: number } | null
  isPanning: boolean
  laneHeightRem: number
  laneGapRem: number
  minRowRem: number
}) {
  const instance = useGantt()
  const settings = useGanttSettings()
  const viewConfig = useGanttViewConfig()
  const gestures = useGanttGestures()
  const segments = bars?.segments ?? []
  // parents aggregate their subtree; they take no direct scheduling gestures
  const schedulable = !row.isGroup || viewConfig.parentScheduling
  const heightRem = bars?.heightRem ?? minRowRem
  const laneCount = bars?.laneCount ?? 1
  const singleTrack =
    resolveScheduleMode(row.resource, viewConfig.scheduleMode) === "single"
  // shared with the tree pane so the two can never drift apart
  const laneOffsetRem = bars?.laneOffsetRem ?? (minRowRem - laneHeightRem) / 2

  // Hover affordance over empty track space: the ghost tile snaps to the
  // unit under the cursor, so the (real) tooltip re-anchors per unit
  const [hintStop, setHintStop] = useState<{
    index: number
    center: number
    ms: number
    endMs: number
  } | null>(null)
  // Gated on an active hint: rows without one read a stable false, so a
  // gesture starting/ending anywhere doesn't re-render every row.
  const hintSuppressed = useGanttSelector<unknown, boolean>(
    (state) =>
      hintStop !== null && (state.drag !== null || state.slotDraft !== null)
  )
  const canSchedule = useGanttSelector<unknown, boolean>(
    (state) => state.interactions.selectSlot
  )
  // The affordance is offered ANYWHERE on a schedulable row - over bare track
  // and over existing bars alike - because a row can always take another
  // schedule on a free lane. The primitive deliberately owns NO opinion about
  // what may land where: that is `canSelectSlot`, the consumer's call. (It
  // used to withhold the hint on a one-track row that already held a
  // schedule, which also blocked adding a second NON-overlapping one.)
  // The lowest track FREE at the hovered time. Two jobs, kept separate on
  // purpose:
  //  - VISIBILITY: `hintFreeLane < laneCount` is what proves an empty track
  //    actually exists to draw on. It is computed regardless of mode, because
  //    a "single" row whose only track is booked has nowhere free either, and
  //    pinning the placement to 0 there would put the ring straight on the bar.
  //  - PLACEMENT: "single" packs everything onto track 0, so that is where its
  //    ring belongs; otherwise the ring sits on the track the schedule will
  //    actually land on. Lane is a function of TIME only, so moving the pointer
  //    down onto the ring never moves it away from you.
  const hintFreeLane = hintStop
    ? lowestFreeLane(segments, hintStop.ms, hintStop.endMs)
    : 0
  const hintLane = bars?.scheduleMode === "single" ? 0 : hintFreeLane
  const hintTopRem = Math.min(
    laneOffsetRem + hintLane * (laneHeightRem + laneGapRem) + laneHeightRem / 2,
    Math.max(heightRem - laneHeightRem / 2, laneHeightRem / 2)
  )
  // Single source of truth for "the add affordance is live at this spot". The
  // ring renders on it AND the row takes its cursor from it, so the pointer can
  // never promise something the ring is not offering.
  const hintVisible =
    hintStop !== null &&
    hintFreeLane < laneCount &&
    !hintSuppressed &&
    !isPanning
  // name the gesture that is actually wired, not a generic one
  const hintLabel = viewConfig.dragCreate
    ? settings.i18n.labels.scheduleHintDrag
    : settings.i18n.labels.scheduleHint
  const showHint =
    viewConfig.displayScheduleHint &&
    schedulable &&
    canSchedule &&
    !isPanning &&
    !!(settings.onSelectSlot || settings.onSlotClick)

  const fractionOf = (ms: number) =>
    Math.min(Math.max((ms - rangeStartMs) / (rangeEndMs - rangeStartMs), 0), 1)

  const dragTarget = useGanttSelector<unknown, "valid" | "invalid" | null>(
    (state) => {
      const drag = state.drag
      if (!drag || drag.proposedResourceId !== row.resource.id) return null
      return drag.valid ? "valid" : "invalid"
    }
  )
  const ghost = useGanttSelector<
    unknown,
    {
      from: number
      to: number
      color?: string
      valid: boolean
      title: string
      kind: string
      occurrenceKey: string
    } | null
  >(
    (state) => {
      const drag = state.drag
      if (!drag || drag.proposedResourceId !== row.resource.id) return null
      return {
        from: fractionOf(drag.proposedStart.getTime()),
        to: fractionOf(drag.proposedEnd.getTime()),
        color: drag.occurrence.event.color,
        valid: drag.valid,
        title: drag.occurrence.event.title,
        kind: drag.kind,
        occurrenceKey: drag.occurrence.key,
      }
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.from === b.from &&
          a.to === b.to &&
          a.valid === b.valid),
    }
  )
  const draft = useGanttSelector<
    unknown,
    {
      from: number
      to: number
      startMs: number
      endMs: number
    } | null
  >(
    (state) => {
      const slotDraft = state.slotDraft
      if (!slotDraft || slotDraft.resourceId !== row.resource.id) return null
      const startMs = slotDraft.start.getTime()
      const endMs = slotDraft.end.getTime()
      return {
        from: fractionOf(startMs),
        to: fractionOf(endMs),
        startMs,
        endMs,
      }
    },
    {
      // from/to as well as the instants: they are derived through fractionOf,
      // which closes over the range. An extendRange mid-gesture moves every
      // bar while an instants-only compare serves the cached (stale) fractions,
      // leaving the placeholder pinned to where the range used to be.
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.startMs === b.startMs &&
          a.endMs === b.endMs &&
          a.from === b.from &&
          a.to === b.to),
    }
  )

  /**
   * Where the schedule being painted will land - resolved in the shared layout
   * memo, which also RESERVES that track, so the row has already grown to hold
   * it. The clamp is only a backstop for the frame between a draft appearing
   * and the layout catching up.
   */
  const draftLane = bars?.draftLane ?? 0
  const draftTopRem = Math.min(
    laneOffsetRem + draftLane * (laneHeightRem + laneGapRem),
    Math.max(heightRem - laneHeightRem, 0)
  )
  // the range you are painting, named while you paint it - a drag that shows
  // no times asks you to guess where you let go
  const draftLabel = draft
    ? settings.i18n.functions.formatEventTime(
        toZoned(new Date(draft.startMs), settings.timeZone),
        toZoned(new Date(draft.endMs), settings.timeZone),
        false,
        settings.locale
      )
    : ""

  /**
   * The row's create contract, in one place: onSlotClick if the consumer
   * wired it, else a ready-made slot draft. Both the hint tile and a plain
   * click on bare track go through this, so clicking anywhere placeable
   * behaves the same as clicking the tile.
   */
  const createAt = (
    stop: { ms: number; endMs: number },
    e: React.MouseEvent
  ) => {
    if (settings.onSlotClick) {
      settings.onSlotClick(
        { date: new Date(stop.ms), allDay: false, resourceId: row.resource.id },
        e
      )
    } else {
      settings.onSelectSlot?.({
        start: new Date(stop.ms),
        end: new Date(Math.max(stop.endMs, stop.ms + 1)),
        allDay: false,
        resourceId: row.resource.id,
      })
    }
  }

  // The drop indicator belongs on the lane the dragged schedule actually
  // occupies. The gesture has not committed, so the segment is still packed
  // under its pre-drag key - no second packing pass, just a lookup.
  const ghostLane = ghost
    ? (segments.find(
        (segment) => segment.occurrence.key === ghost.occurrenceKey
      )?.column ?? 0)
    : 0
  const ghostLaneOffsetRem =
    laneOffsetRem +
    ghostLane * (laneHeightRem + laneGapRem) +
    (laneHeightRem - GHOST_HEIGHT_REM) / 2

  return (
    <div
      data-gantt-row=""
      data-gantt-resource={row.resource.id}
      data-gantt-row-id={row.resource.id}
      data-gantt-row-static={!schedulable || undefined}
      data-gantt-bar-min={bars?.extent?.from}
      data-gantt-bar-max={bars?.extent?.to}
      data-gantt-bar-color={bars?.extent?.color}
      data-gantt-bar-label={bars?.extent?.label}
      data-gantt-bar-start-ms={bars?.extent?.startMs}
      data-drop-target={dragTarget ?? undefined}
      data-selected={selected || undefined}
      className={cn(
        "data-hover:bg-muted/30 data-selected:bg-primary/5 data-selected:data-hover:bg-primary/5 relative w-full min-w-0",
        // The ring is pointer-events-none, so a cursor set on IT can never be
        // reached - the row is the element actually under the pointer, so the
        // cursor belongs here. Gated on the same flag as the ring: wherever the
        // add affordance shows, the pointer says "add", and nowhere else.
        hintVisible && "cursor-crosshair",
        // horizontal separators mirror the tree node borders across panes.
        // No special case for the last row: the columns run the full height of
        // the pane, so the grid closes on the container edge on its own.
        rowBorder !== null && "border-b",
        rowBorder === "dashed" && "border-dashed",
        dragTarget === "valid" && "bg-muted/40",
        dragTarget === "invalid" && "bg-destructive/10"
      )}
      style={{
        height: `${heightRem}rem`,
        minWidth: trackWidth,
      }}
      onPointerDown={(e) => {
        // Opt-in drag-create owns presses on empty schedulable track (the
        // onSelectSlot contract); otherwise the press bubbles to the
        // container and pans the timeline.
        if (
          viewConfig.dragCreate &&
          e.button === 0 &&
          schedulable &&
          canSchedule &&
          // the bare track, or the hint tile that spawns under the cursor -
          // a sub-threshold press still ends as the tile's own click
          (e.target === e.currentTarget ||
            !!(e.target as HTMLElement).closest?.(
              "[data-slot=gantt-schedule-hint]"
            )) &&
          !!settings.onSelectSlot
        ) {
          // validate BEFORE claiming the press: on a vetoed slot (e.g. the
          // one-schedule-per-task rule) the press falls through to the pan
          const stop = resolveHintStop(
            trackFraction(e.currentTarget, e.clientX)
          )
          const allowed =
            stop !== null &&
            (settings.canSelectSlot?.({
              start: new Date(stop.ms),
              end: new Date(Math.max(stop.endMs, stop.ms + 1)),
              allDay: false,
              resourceId: row.resource.id,
            }) ??
              true)
          if (!allowed) return
          e.stopPropagation()
          gestures.beginCreate(e)
        }
      }}
      onPointerMove={(e) => {
        // read interaction state imperatively - a subscription here would
        // re-render the row for every gesture anywhere on the grid
        const interacting =
          instance.getState().drag !== null ||
          instance.getState().slotDraft !== null
        if (!showHint || e.pointerType !== "mouse" || interacting) {
          if (hintStop) setHintStop(null)
          return
        }
        // EMPTY TRACK ONLY. A bar under the pointer means the pointer is not
        // on an empty slot, so the affordance goes away entirely rather than
        // hovering over booked time - and the bar is left completely alone,
        // hover and click both. (No "pointer is over the tile" bail: the ring
        // is pointer-events-none, so it is never the target; a bail on it would
        // freeze it on the spot, since it rides under the cursor.)
        if (e.target !== e.currentTarget) {
          if (hintStop) setHintStop(null)
          return
        }
        const { fraction, offset } = trackPoint(e.currentTarget, e.clientX)
        // The dot follows the pointer FREELY - it is a cursor, not a cell, so
        // it is never quantised to the interval grid. Its position is written
        // as a CSS custom property straight onto the row: the cursor moves
        // every frame and a state update per frame would re-render the row and
        // every bar in it. React state still owns WHICH slot is offered, and
        // that changes only once per interval.
        //
        // In pixels rather than a percentage, pre-snapped by trackPoint to the
        // viewport pixel grid: a fractional inset makes the browser antialias
        // the ring and the glyph across two device pixels, which reads as a
        // furry, smudged dot. -translate-x-1/2 of an even-sized box keeps it on
        // the grid, so the result is crisp.
        e.currentTarget.style.setProperty("--gantt-hint-x", `${offset}px`)
        const stop = resolveHintStop(fraction)
        // validate placement before offering it: a consumer canSelectSlot
        // veto (e.g. a locked span) hides the hint entirely
        const allowed =
          stop !== null &&
          (settings.canSelectSlot?.({
            start: new Date(stop.ms),
            end: new Date(Math.max(stop.endMs, stop.ms + 1)),
            allDay: false,
            resourceId: row.resource.id,
          }) ??
            true)
        const next = allowed ? stop : null
        // state changes only when the cursor crosses into another unit
        if (next?.index !== hintStop?.index) setHintStop(next)
      }}
      onPointerLeave={() => {
        if (hintStop) setHintStop(null)
      }}
      onClick={(e) => {
        // With dragCreate the press belongs to the create GESTURE, which only
        // activates past its movement threshold - so a click that never moved
        // committed nothing and the row felt dead. Treat it as a create at the
        // hovered slot, using the same validation the hint tile uses.
        if (!viewConfig.dragCreate || e.target !== e.currentTarget) return
        if (!schedulable || !canSchedule) return
        if (wasRecentDrag()) return
        if (!settings.onSlotClick && !settings.onSelectSlot) return
        const stop = resolveHintStop(trackFraction(e.currentTarget, e.clientX))
        if (!stop) return
        const allowed =
          settings.canSelectSlot?.({
            start: new Date(stop.ms),
            end: new Date(Math.max(stop.endMs, stop.ms + 1)),
            allDay: false,
            resourceId: row.resource.id,
          }) ?? true
        if (!allowed) return
        createAt(stop, e)
        setHintStop(null)
      }}
    >
      {/* row CONTENT (bars, labels, ghosts). Pointer-transparent so
          empty-track presses still hit the row itself.
          content-visibility lets the browser skip rendering this layer for
          rows scrolled out of view (large trees stay cheap on low-end
          devices). Safe here: the layer is absolute inset-0 (geometry comes
          from the row, never from content), its paint containment keeps it
          a stacking context, and nothing inside escapes the row box - the
          schedule hint deliberately lives OUTSIDE this layer. Browsers
          without support simply ignore it. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ contentVisibility: "auto" }}
      >
        {segments.map((segment, segmentIndex) => {
          const from = fractionOf(
            rangeStartMs + (segment.startMin ?? 0) * 60000
          )
          const to = fractionOf(rangeStartMs + (segment.endMin ?? 0) * 60000)
          if (to <= from) return null
          const lane = segment.column ?? 0
          // Title placement: outside beside the bar when configured (or too
          // short in "auto"), flipped before the bar near the range end, and
          // back inside when the bar spans the whole view.
          const barRemWidth = (to - from) * trackRemWidth
          const wantsOutside =
            viewConfig.barLabel === "outside" ||
            (viewConfig.barLabel === "auto" &&
              barRemWidth <
                (viewConfig.metrics?.autoLabelMin ?? AUTO_LABEL_MIN_REM))
          const placement = !wantsOutside
            ? "inside"
            : to <= 0.92
              ? "after"
              : from >= 0.08
                ? "before"
                : "inside"
          // the wrapper carries the drag kind itself (from the row's ghost
          // state, same notify as the bar's own attribute) so the hide rules
          // below use plain attribute selectors instead of :has(), which
          // older Firefox (<121) does not support
          const segDragKind =
            ghost && ghost.occurrenceKey === segment.occurrence.key
              ? ghost.kind
              : undefined
          return (
            <div
              key={segment.occurrence.key}
              data-drag-kind={segDragKind}
              // lane position is headless state: a consumer can read it to
              // label the bar ("2 of 4") or drive its own manage UI
              data-lane={lane}
              data-lane-count={laneCount}
              // during a MOVE the whole thing (bar + its outside label) hides so
              // the smooth clone carries both; resize keeps the BAR as a faint
              // placeholder but its label yields to the ghost's outside label.
              // pointer-events-auto: the parent mask layer is pointer-
              // transparent so empty-track presses reach the row.
              // px-px keeps back-to-back bars off each other; the vertical
              // breathing room is the lane gap itself, not padding here, so
              // the bar is exactly laneHeight tall
              className="group/gantt-seg pointer-events-auto absolute px-px data-[drag-kind=move]:opacity-0"
              // insetInlineStart, not left: in RTL the axis mirrors and bars
              // must mirror with it (fractions measure from the range start)
              style={{
                insetInlineStart: `${from * 100}%`,
                width: `${Math.max((to - from) * 100, 0.5)}%`,
                top: `${laneOffsetRem + lane * (laneHeightRem + laneGapRem)}rem`,
                height: `${laneHeightRem}rem`,
                // one track means every lane is 0, so paint order (not the
                // lane) is what keeps overlapping bars individually reachable
                zIndex:
                  segment.occurrence.event.zIndex ??
                  10 + (singleTrack ? segmentIndex : lane),
              }}
            >
              <GanttBar
                segment={segment}
                labelOutside={placement !== "inside"}
                rowTitle={row.resource.title}
                className="h-full"
              />
              {placement !== "inside" && (
                <span
                  data-slot="gantt-bar-label"
                  data-placement={placement}
                  className={cn(
                    "text-foreground pointer-events-none absolute top-1/2 z-10 max-w-60 -translate-y-1/2 truncate font-medium",
                    // one label at a time: the resize ghost carries it while
                    // this bar is the faded placeholder
                    "group-data-[drag-kind^=resize]/gantt-seg:opacity-0",
                    placement === "after" ? "start-full ms-2" : "end-full me-2"
                  )}
                >
                  {segment.occurrence.event.title}
                </span>
              )}
            </div>
          )
        })}
        {bars?.summary && segments.length === 0 && (
          <div
            data-slot="gantt-summary"
            aria-hidden
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{
              insetInlineStart: `${bars.summary.from * 100}%`,
              width: `${Math.max((bars.summary.to - bars.summary.from) * 100, 0.5)}%`,
            }}
          >
            {viewConfig.renderSummary ? (
              // consumer-owned rollup: the positioned envelope wrapper stays
              viewConfig.renderSummary({
                resource: row.resource,
                start: new Date(
                  rangeStartMs + bars.summary.from * (rangeEndMs - rangeStartMs)
                ),
                end: new Date(
                  rangeStartMs + bars.summary.to * (rangeEndMs - rangeStartMs)
                ),
                progress: bars.summary.progress,
              })
            ) : (
              <>
                {/* envelope end caps: the classic PM rollup silhouette, muted */}
                <span
                  aria-hidden
                  className="bg-muted-foreground/50 absolute start-0 top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full"
                />
                <span
                  aria-hidden
                  className="bg-muted-foreground/50 absolute end-0 top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full"
                />
                <div className="bg-muted-foreground/20 relative h-1.5 overflow-hidden rounded-full">
                  {bars.summary.progress !== null && (
                    <div
                      data-slot="gantt-summary-progress"
                      className="bg-muted-foreground/50 absolute inset-y-0 start-0 rounded-full"
                      style={{ width: `${bars.summary.progress}%` }}
                    />
                  )}
                </div>
                {bars.summary.progress !== null && (
                  <span className="text-muted-foreground absolute start-full top-1/2 ms-2 -translate-y-1/2 whitespace-nowrap">
                    {bars.summary.progress}%
                  </span>
                )}
              </>
            )}
          </div>
        )}
        {ghost && (
          <div
            data-slot="gantt-drag-ghost"
            data-kind={ghost.kind}
            data-drop-invalid={!ghost.valid || undefined}
            className={cn(
              // Slight dashed indicator, never a dramatic restyle. Move shows a
              // faint drop-target placeholder (the smooth cursor clone carries
              // the visual); resize shows the event at its new size in its own
              // color with just a dashed border.
              "pointer-events-none absolute z-40 h-5 rounded-sm border border-dashed font-medium",
              !ghost.valid &&
                "border-destructive bg-destructive/10 text-destructive",
              ghost.valid &&
                ghost.kind === "move" &&
                "border-(--gantt-event-color)/50 bg-(--gantt-event-color)/8",
              ghost.valid &&
                ghost.kind !== "move" &&
                "text-foreground border-(--gantt-event-color)/70 bg-(--gantt-event-color)/22"
            )}
            style={
              {
                insetInlineStart: `${ghost.from * 100}%`,
                width: `${Math.max((ghost.to - ghost.from) * 100, 0.5)}%`,
                // sit on the dragged schedule's OWN lane. Centering the ghost
                // in the row put it on no lane at all once a node stacked, so
                // a 3-lane row showed the drop target floating in the middle.
                top: `${ghostLaneOffsetRem}rem`,
                "--gantt-event-color": ghost.color ?? "var(--color-primary)",
              } as CSSProperties
            }
          >
            {ghost.kind !== "move" && (
              // label rides OUTSIDE after the bar, exactly like the resting
              // outside placement - never inside the schedule
              <span className="pointer-events-none absolute start-full top-1/2 ms-2 max-w-60 -translate-y-1/2 truncate whitespace-nowrap">
                {ghost.title}
              </span>
            )}
          </div>
        )}
        {draft && (
          <div
            data-slot="gantt-slot-draft"
            data-lane={draftLane}
            // OPAQUE. When the destination lane does not exist yet the row has
            // not grown, so the placeholder rides the bottom edge and overlaps
            // the bar it is going under - as a tint that read as a smudge over
            // the bar's own label. Punched out of the backdrop it reads as a
            // distinct object sliding underneath, which is what it is.
            className="border-primary bg-background pointer-events-none absolute z-40 overflow-hidden rounded-sm border border-dashed"
            style={{
              insetInlineStart: `${draft.from * 100}%`,
              width: `${Math.max((draft.to - draft.from) * 100, 0.5)}%`,
              // the destination lane, not the row's middle (which on a stacked
              // row is the GAP between two lanes), and the real lane height
              // rather than a hardcoded h-5 a consumer's metrics would break
              top: `${draftTopRem}rem`,
              height: `${laneHeightRem}rem`,
            }}
          >
            {/* the accent tint, over the opaque base rather than over whatever
                happens to be beneath the row */}
            <span aria-hidden className="bg-primary/15 absolute inset-0" />
          </div>
        )}
      </div>
      {/* OUTSIDE the content layer for the same reason as the hint bubble: the
          layer's paint containment would CLIP a chip that overhangs the row.
          Centred on the range being painted, so the times track the drag. */}
      {draft && draftLabel && (
        <div
          data-slot="gantt-slot-draft-label"
          className="pointer-events-none absolute z-40"
          style={{
            // anchored to the range's END and riding after it, exactly like the
            // drag ghost's own label. Centred above the placeholder it covered
            // the schedule on the track above - and the one thing a create
            // gesture must never hide is what is already booked.
            insetInlineStart: `${draft.to * 100}%`,
            top: `${draftTopRem}rem`,
            height: `${laneHeightRem}rem`,
          }}
        >
          <span className="bg-foreground text-background absolute start-full top-1/2 ms-2 inline-flex w-max -translate-y-1/2 items-center rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap">
            {draftLabel}
            {/* Same arrow as every other bubble, one size down. A 45-degree
                square is symmetric, so size-2.5 spans ~14px whichever edge it
                straddles: a small nub under a ~120px-wide chip, but most of the
                short edge of a ~26px-TALL one. size-1.5 spans ~8.5px and
                protrudes ~4px, the usual tooltip-arrow proportion, so the side
                arrow reads the same weight as the ones above and below. */}
            <span
              aria-hidden
              className="bg-foreground absolute start-0 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px]"
            />
          </span>
        </div>
      )}
      {/* OUTSIDE the content layer: its paint containment creates a stacking
          context that would trap the bubble's z-index under neighboring rows.
          As a direct row child its z-30 stacks above every row in the pane. */}
      {/* `hintLane < laneCount` is the second half of "empty slots only": the
          pointer being on bare track can still mean the row's own padding above
          a column that is booked on every track. There is no free track to
          draw on there, so the clamp would park the ring on top of a bar -
          exactly what must never happen. Booking such an instant is a drag from
          a free point, not a click. */}
      {hintVisible && hintStop && (
        <div
          data-slot="gantt-schedule-hint"
          // rtl flips the translate sign: insetInlineStart anchors the box's
          // inline-start edge, which is the RIGHT edge under rtl, so centring
          // on the anchor shifts the opposite way there
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2"
          style={{
            // the live cursor position, written without React (see onPointerMove)
            insetInlineStart: "var(--gantt-hint-x, 50%)",
            // first track, centred on it - z-30 on this wrapper keeps the dot
            // above every bar, so a busy span still offers the affordance
            top: `${hintTopRem}rem`,
          }}
        >
          {viewConfig.renderScheduleHint ? (
            // consumer-owned hint: the wrapper stays snapped + validated;
            // the content drives its own create flow
            viewConfig.renderScheduleHint({
              start: new Date(hintStop.ms),
              end: new Date(Math.max(hintStop.endMs, hintStop.ms + 1)),
              resource: row.resource,
            })
          ) : (
            <>
              {/* the band IS the placement affordance: it covers the interval
              under the pointer, so what you see is the slot you get. Clicking
              books it; pressing and dragging paints a longer range. The bubble
              mirrors the tooltip theme, arrow included. */}
              {/* The dot IS the cursor: an open ring, so whatever it is standing
              on stays readable through it. The outer background ring is what
              keeps it visible on a dark bar - an outline, not a fill.
              The GLYPH is the native cursor rather than an icon: `cell` is the
              range-select cursor every spreadsheet uses, which is exactly the
              drag-a-range gesture, and `copy` carries a plus for the
              click-to-add case. Clicking books the interval it is standing in;
              pressing and dragging paints a range whose ends snap to the
              nearest boundary. */}
              <button
                type="button"
                data-slot="gantt-schedule-hint-tile"
                aria-label={hintLabel}
                // pointer-events-NONE: the ring rides under the cursor, so any
                // press it accepts is a press stolen from whatever it is
                // standing on - which is how it swallowed every click meant for
                // a bar. Passing pointers straight through makes the element
                // physically underneath the thing you click: a bar opens its
                // job, bare track creates (the row's own handlers, which the
                // ring merely previews). The button and its onClick stay for
                // KEYBOARD use - pointer-events never blocks Enter/Space.
                // No cursor class here: pointer-events-none makes it unreachable.
                // The row carries it (see `hintVisible`).
                className="border-primary ring-background/80 pointer-events-none block size-5 rounded-full border-2 bg-transparent ring-1"
                onPointerDown={(e) => {
                  // with drag-create on the press belongs to the row's create
                  // gesture; a sub-threshold press still ends as this click
                  if (!viewConfig.dragCreate) e.stopPropagation()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  // a completed drag-create already committed via onSelectSlot
                  if (wasRecentDrag()) return
                  createAt(hintStop, e)
                  setHintStop(null)
                }}
              />
              <span
                data-slot="gantt-schedule-hint-bubble"
                className={cn(
                  "bg-foreground text-background absolute start-1/2 inline-flex w-max -translate-x-1/2 items-center rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
                  rowIndex === 0 ? "top-full mt-2" : "bottom-full mb-2"
                )}
              >
                {hintLabel}
                <span
                  aria-hidden
                  className={cn(
                    "bg-foreground absolute start-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px]",
                    rowIndex === 0 ? "-top-1" : "-bottom-1"
                  )}
                />
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
})

interface OffscreenChip {
  id: string
  side: "start" | "end"
  top: number
  color?: string
  label: string
  /** First bar start, shown in the chip tooltip. */
  startMs: number | null
  /** scrollLeft that brings the bar back into view. */
  target: number
  /** End-chip inset in px, widened to clear the zoom control when they overlap. */
  insetEnd: number
}

function sameChips(a: OffscreenChip[], b: OffscreenChip[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (chip, i) =>
        chip.id === b[i].id &&
        chip.side === b[i].side &&
        chip.top === b[i].top &&
        chip.target === b[i].target &&
        chip.insetEnd === b[i].insetEnd
    )
  )
}

/**
 * Edge chips for rows whose bars sit entirely outside the visible timeline;
 * clicking scrolls the bar back into view. Reads geometry straight from the
 * DOM (row data attributes), so scrolling never re-renders the grid.
 */
function GanttOffscreenChips({
  paneRef,
  occurrences,
  locale,
  refreshKey,
}: {
  paneRef: RefObject<HTMLDivElement | null>
  occurrences: GanttOccurrence[]
  locale?: Locale
  refreshKey: string
}) {
  const settings = useGanttSettings()
  const [chips, setChips] = useState<OffscreenChip[]>([])

  useEffect(() => {
    const pane = paneRef.current
    const viewport = getPaneViewport(pane)
    if (!pane || !viewport) return
    let raf = 0
    const measure = () => {
      raf = 0
      const paneRect = pane.getBoundingClientRect()
      const header = viewport.querySelector<HTMLElement>(
        "[data-slot=gantt-timeline-header]"
      )
      const headerBottom = header
        ? header.getBoundingClientRect().bottom - paneRect.top
        : 0
      const trackW = viewport.scrollWidth
      const visibleStart = getScrollStart(viewport)
      const visibleEnd = visibleStart + viewport.clientWidth
      // the floating zoom control shares the right edge (higher z); end chips
      // whose row center falls in its band shift left so they stay clickable
      const zoomEl = pane.querySelector<HTMLElement>("[data-slot=gantt-zoom]")
      const zoom = zoomEl
        ? {
            top: zoomEl.getBoundingClientRect().top - paneRect.top - 8,
            bottom: zoomEl.getBoundingClientRect().bottom - paneRect.top + 8,
            inset: paneRect.right - zoomEl.getBoundingClientRect().left + 8,
          }
        : null
      const next: OffscreenChip[] = []
      for (const rowEl of viewport.querySelectorAll<HTMLElement>(
        "[data-gantt-row]"
      )) {
        const from = parseFloat(rowEl.dataset.ganttBarMin ?? "")
        const to = parseFloat(rowEl.dataset.ganttBarMax ?? "")
        if (Number.isNaN(from) || Number.isNaN(to)) continue
        const rect = rowEl.getBoundingClientRect()
        const top = rect.top - paneRect.top + rect.height / 2
        if (top < headerBottom + 10 || top > paneRect.height - 16) continue
        const startPx = from * trackW
        const endPx = to * trackW
        const startMs = parseFloat(rowEl.dataset.ganttBarStartMs ?? "")
        const base = {
          id: rowEl.dataset.ganttRowId ?? "",
          top: Math.round(top),
          color: rowEl.dataset.ganttBarColor,
          label: rowEl.dataset.ganttBarLabel ?? "",
          startMs: Number.isNaN(startMs) ? null : startMs,
        }
        if (endPx <= visibleStart + 2) {
          next.push({
            ...base,
            side: "start",
            target: startPx - 24,
            insetEnd: 14,
          })
        } else if (startPx >= visibleEnd - 2) {
          const overlapsZoom = zoom && top >= zoom.top && top <= zoom.bottom
          next.push({
            ...base,
            side: "end",
            target: endPx - viewport.clientWidth + 24,
            insetEnd: overlapsZoom ? Math.max(14, zoom.inset) : 14,
          })
        }
      }
      setChips((prev) => (sameChips(prev, next) ? prev : next))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    viewport.addEventListener("scroll", schedule)
    const observer = new ResizeObserver(schedule)
    observer.observe(viewport)
    schedule()
    return () => {
      viewport.removeEventListener("scroll", schedule)
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [paneRef, occurrences, refreshKey])

  if (chips.length === 0) return null

  const scrollTo = (chip: OffscreenChip) => {
    const viewport = getPaneViewport(paneRef.current)
    if (!viewport) return
    const target = Math.max(0, chip.target)
    viewport.scrollTo({
      // chip targets are distances from the inline start; RTL signs them
      left: getComputedStyle(viewport).direction === "rtl" ? -target : target,
      behavior: "smooth",
    })
    // hand keyboard focus to the bar the chip promised (the chip unmounts)
    const bar = viewport.querySelector<HTMLElement>(
      `[data-gantt-row-id="${CSS.escape(chip.id)}"] [data-slot=gantt-bar]`
    )
    bar?.focus({ preventScroll: true })
  }

  return (
    <div
      data-slot="gantt-offscreen-chips"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      <TooltipProvider delay={600} closeDelay={0} timeout={300}>
        {chips.map((chip) => (
          <Tooltip key={`${chip.id}-${chip.side}`}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  data-slot="gantt-offscreen-chip"
                  data-side={chip.side}
                  aria-label={settings.i18n.labels.jumpToBar(chip.label)}
                  className="bg-background text-muted-foreground hover:text-foreground pointer-events-auto absolute flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-xs"
                  style={{
                    top: chip.top,
                    ...(chip.side === "start"
                      ? { insetInlineStart: "0.5rem" }
                      : { insetInlineEnd: chip.insetEnd }),
                  }}
                  onClick={() => scrollTo(chip)}
                />
              }
            >
              {chip.side === "start" ? (
                <IconPlaceholder
                  lucide="ChevronLeftIcon"
                  tabler="IconChevronLeft"
                  hugeicons="ArrowLeft01Icon"
                  phosphor="CaretLeftIcon"
                  remixicon="RiArrowLeftSLine"
                  className="size-3"
                  aria-hidden="true"
                />
              ) : (
                <IconPlaceholder
                  lucide="ChevronRightIcon"
                  tabler="IconChevronRight"
                  hugeicons="ArrowRight01Icon"
                  phosphor="CaretRightIcon"
                  remixicon="RiArrowRightSLine"
                  className="size-3"
                  aria-hidden="true"
                />
              )}
              <span
                aria-hidden
                className="ring-background absolute -end-px -top-px size-1.5 rounded-full ring-1"
                style={{ background: chip.color ?? "var(--color-primary)" }}
              />
            </TooltipTrigger>
            <TooltipContent side={chip.side === "start" ? "right" : "left"}>
              <div className="font-medium">{chip.label}</div>
              {chip.startMs !== null && (
                <div className="opacity-80">
                  {/* zoned: the chip must name the same day the grid shows */}
                  {format(
                    toZoned(new Date(chip.startMs), settings.timeZone),
                    "MMM d, yyyy",
                    { locale }
                  )}
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}

export { GanttView }
export type { GanttViewProps }
