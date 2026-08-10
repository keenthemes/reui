// Title: Gantt Types
// Description: Public TypeScript contract for the headless gantt: events, occurrences, segments, state, and callbacks.

type GanttBarId = string

/** Horizontal time scale of the gantt axis. */
type GanttScale = "day" | "week" | "month" | "quarter" | "year"

/** Proposal emitted when a timeline resource row is drag-reordered. */
interface GanttResourceReorder {
  /** The dragged resource id. */
  resourceId: string
  /** New parent id, or null for the root level. */
  parentId: string | null
  /** Insertion index among the new parent's children. */
  index: number
  /** The full resource tree with the move applied (convenience). */
  resources: GanttResource[]
}

/**
 * How many schedules one tree node may hold at once.
 * - "single": one track. The node never grows a second lane and a gesture that
 *   would create a concurrent schedule is refused.
 * - "multiple": concurrent schedules stack into stable lanes and the row grows.
 */
type GanttScheduleMode = "single" | "multiple"

/**
 * Drop policy for a gesture that would overlap another schedule in the SAME
 * node. Policy only - overlapping data always renders.
 * - "allow" (default): the gesture commits as proposed.
 * - "clamp": the gesture stops at the neighbour's edge.
 * - "reject": the gesture is marked invalid and never commits.
 */
type GanttOverlapPolicy = "allow" | "reject" | "clamp"

/** Vertical placement of a row's content when the node holds several lanes. */
type GanttRowAlign = "start" | "center"

/**
 * One node of the gantt tree: a generic item that carries a title, consumer
 * columns, and zero or more schedules. It is not domain-bound - the same node
 * expresses a task (one schedule) or a resource lane (many). Nesting via
 * children renders as collapsible groups.
 */
interface GanttResource {
  id: string
  title: string
  /** Token or css color used for subtle row/column accents. */
  color?: string
  /** Per-node cardinality override; falls back to the view-level default. */
  scheduleMode?: GanttScheduleMode
  children?: GanttResource[]
}

/** Preferred name for a tree node; `GanttResource` is the legacy alias. */
type GanttNode = GanttResource

interface GanttDateRange {
  /** Inclusive instant. */
  start: Date
  /** Exclusive instant. */
  end: Date
}

type GanttWeekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU"

interface GanttRecurrenceRule {
  freq: "daily" | "weekly" | "monthly" | "yearly"
  interval?: number
  count?: number
  /** Inclusive instant. */
  until?: Date
  byWeekday?: Array<GanttWeekday | { day: GanttWeekday; ordinal: number }>
  byMonthDay?: number[]
  byMonth?: number[]
  weekStart?: GanttWeekday
  exDates?: Date[]
  rDates?: Date[]
}

interface GanttEvent<TData = unknown> {
  id: GanttBarId
  title: string
  /** Plain instant; consumers parse ISO strings themselves. */
  start: Date
  /** Exclusive; must be >= start. */
  end: Date
  allDay?: boolean
  /** Structured rule or a raw "RRULE:..." line. */
  recurrence?: GanttRecurrenceRule | string
  /** This event is an edited single occurrence of that series. */
  recurringEventId?: GanttBarId
  /** Which occurrence it replaces (RECURRENCE-ID semantics). */
  originalStart?: Date
  /** Token or css color; flows to the --gantt-event-color css var. */
  color?: string
  /** Excluded from drag and resize regardless of interactions state. */
  readOnly?: boolean
  /** Per-event override; default comes from interactions.drag. */
  draggable?: boolean
  /** Per-event override; default comes from interactions.resize. */
  resizable?: boolean
  /** Packing prominence; feeds getEventPriority ordering. */
  priority?: number
  /** Completion 0-100; renders as a subtle fill inside the bar. */
  progress?: number
  /** Explicit stacking override; wins over the computed z. */
  zIndex?: number
  /** Resource row this bar belongs to. */
  resourceId?: string
  /** Consumer payload, fully generic. */
  data?: TData
}

interface GanttOccurrence<TData = unknown> {
  /** Stable per instance: `${event.id}::${startISO}`. */
  key: string
  eventId: GanttBarId
  event: GanttEvent<TData>
  start: Date
  end: Date
  allDay: boolean
  isRecurring: boolean
  recurrenceIndex?: number
}

interface GanttSegment<TData = unknown> {
  occurrence: GanttOccurrence<TData>
  /** Range-start reference instant of the segment's timeline slice. */
  day: Date
  isStart: boolean
  isEnd: boolean
  continuesBefore: boolean
  continuesAfter: boolean
  /** Minutes from the visible range start, clamped to the range. */
  startMin?: number
  endMin?: number
  /** Row lane packing: 0-based lane index within the node's row. */
  column?: number
  /** Lanes the node's row resolved to. */
  columnCount?: number
  columnSpan?: number
}

interface GanttSelection {
  eventKeys: string[]
  /** Committed slot selection; see GanttSlotDraft for the in-gesture value. */
  slot: { start: Date; end: Date; allDay: boolean } | null
}

interface GanttInteractions {
  /** Horizontal move within the bar's own row; never across rows. */
  drag: boolean
  resize: boolean
  selectSlot: boolean
}

interface GanttDragState<TData = unknown> {
  kind: "move" | "resize-start" | "resize-end"
  occurrence: GanttOccurrence<TData>
  proposedStart: Date
  proposedEnd: Date
  proposedAllDay: boolean
  /** The bar's own resource; moves are x-axis only and never cross rows. */
  proposedResourceId?: string
  /** Last canDropEvent verdict; drives data-drop-invalid styling. */
  valid: boolean
}

/**
 * The in-progress drag-create rectangle ONLY, cleared on commit or cancel.
 * The committed slot selection lives in GanttSelection.slot.
 */
interface GanttSlotDraft {
  start: Date
  end: Date
  allDay: boolean
  /** Present when the slot was selected inside a resource row. */
  resourceId?: string
}

interface GanttState<TData = unknown> {
  /** Horizontal axis scale. */
  scale: GanttScale
  /** Anchor date. */
  date: Date
  /** Full rendered axis range - fetch remote data for THIS. */
  visibleRange: GanttDateRange
  /** The logical period (the month/week itself). */
  activeRange: GanttDateRange
  events: GanttEvent<TData>[]
  selection: GanttSelection
  interactions: GanttInteractions
  loading: boolean
  drag: GanttDragState<TData> | null
  slotDraft: GanttSlotDraft | null
  /**
   * Instant at the center of the scrolled viewport; the nav title follows it
   * so the header always names what you are looking at. null before the view
   * reports a position (falls back to the anchor date).
   */
  viewportCenter: Date | null
}

interface GanttRangeInfo {
  range: GanttDateRange
  activeRange: GanttDateRange
  scale: GanttScale
  date: Date
  timeZone: string
}

interface GanttProposedUpdate<TData = unknown> {
  event: GanttEvent<TData>
  /** null when source === "api". */
  occurrence: GanttOccurrence<TData> | null
  start: Date
  end: Date
  allDay: boolean
  /** The bar's own resource (moves stay in-row); set on create/api. */
  resourceId?: string
  source: "drag" | "resize-start" | "resize-end" | "keyboard" | "api"
}

/** false = reject/revert; void or true = accept; object = accept with adjustment. */
type GanttUpdateResult =
  | boolean
  | void
  | { start?: Date; end?: Date; allDay?: boolean }

/** A click is a point, not a range; `end` is reserved for future gestures. */
interface GanttSlotInfo {
  date: Date
  end?: Date
  allDay: boolean
  /** Present when the click happened inside a resource row. */
  resourceId?: string
}

/**
 * Off-day marking (non-working days). `true` uses the defaults: weekends
 * with a muted background. Custom weekday sets, explicit dates, a predicate,
 * and a custom class are all supported; marked cells carry `data-off` for
 * CSS-selector customization.
 */
interface GanttOffDaysConfig {
  /** Weekday numbers treated as off (0 = Sunday). Default [0, 6]. */
  weekendDays?: number[]
  /** Additional explicit off dates (compared by day in the display zone). */
  dates?: Date[]
  /** Full custom predicate; runs in addition to weekendDays/dates. */
  isOffDay?: (day: Date) => boolean
  /** Marker classes; default "bg-muted/40". */
  className?: string
}

/**
 * External-data contract. v1 ships the type plus docs recipes (Google
 * events.list / MS Graph calendarView map to GanttEvent in ~15 lines);
 * OAuth, tokens, and sync loops are application backend territory.
 */
interface GanttDataAdapter<TData = unknown> {
  getEvents(
    range: GanttDateRange,
    signal?: AbortSignal
  ): Promise<GanttEvent<TData>[]>
}

export type {
  GanttEvent,
  GanttDataAdapter,
  GanttDateRange,
  GanttDragState,
  GanttBarId,
  GanttInteractions,
  GanttNode,
  GanttOccurrence,
  GanttOffDaysConfig,
  GanttOverlapPolicy,
  GanttProposedUpdate,
  GanttRangeInfo,
  GanttRecurrenceRule,
  GanttResource,
  GanttRowAlign,
  GanttScheduleMode,
  GanttSegment,
  GanttSelection,
  GanttSlotDraft,
  GanttSlotInfo,
  GanttState,
  GanttResourceReorder,
  GanttScale,
  GanttUpdateResult,
  GanttWeekday,
}
