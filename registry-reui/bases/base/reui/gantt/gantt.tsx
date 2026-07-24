// Title: Gantt
// Description: Headless-first gantt - horizontal resource timeline with day-to-year scales, external CRUD contract, and a subscribable store.

"use client"

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
  type RefObject,
} from "react"
import {
  mergeGanttI18n,
  type GanttI18nConfig,
  type GanttI18nOverrides,
} from "@/registry-reui/bases/base/reui/gantt/gantt-i18n"
import {
  buildEventIndex,
  defaultEventOrder,
  eventsOverlap,
  findResource,
  getGanttDateRange,
  getRangeKey,
  stepGanttDate,
  toZoned,
  type GanttIndex,
  type WeekStartsOn,
} from "@/registry-reui/bases/base/reui/gantt/gantt-lib"
import type {
  GanttBarId,
  GanttDateRange,
  GanttDragState,
  GanttEvent,
  GanttInteractions,
  GanttOccurrence,
  GanttOffDaysConfig,
  GanttOverlapPolicy,
  GanttProposedUpdate,
  GanttRangeInfo,
  GanttResource,
  GanttResourceReorder,
  GanttRowAlign,
  GanttScale,
  GanttScheduleMode,
  GanttSegment,
  GanttSelection,
  GanttSlotDraft,
  GanttSlotInfo,
  GanttState,
  GanttUpdateResult,
} from "@/registry-reui/bases/base/reui/gantt/gantt-types"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import type { Locale } from "date-fns"

import { cn } from "@/registry/bases/base/lib/utils"

const DEFAULT_INTERACTIONS: GanttInteractions = {
  drag: true,
  resize: true,
  selectSlot: true,
}

/** Infinite-scroll growth cap, in whole periods per side. */
const MAX_RANGE_WINDOW = 12

/** A node holds as many concurrent schedules as it needs unless told otherwise. */
const DEFAULT_SCHEDULE_MODE: GanttScheduleMode = "multiple"

/** Tree label sits on the first schedule's baseline, not the grown row's middle. */
const DEFAULT_ROW_ALIGN: GanttRowAlign = "start"

/**
 * A node's cardinality: its own override wins over the view-level default.
 * Shared by the layout pass and the gesture engine so both read one rule.
 */
function resolveScheduleMode(
  node: GanttResource | null | undefined,
  scheduleMode: GanttScheduleMode | undefined
): GanttScheduleMode {
  return node?.scheduleMode ?? scheduleMode ?? DEFAULT_SCHEDULE_MODE
}

const EMPTY_SELECTION: GanttSelection = { eventKeys: [], slot: null }

interface GanttCallbacks<TData = unknown> {
  onEventClick?: (
    occurrence: GanttOccurrence<TData>,
    e: React.MouseEvent
  ) => void
  onEventDoubleClick?: (
    occurrence: GanttOccurrence<TData>,
    e: React.MouseEvent
  ) => void
  onEventUpdate?: (update: GanttProposedUpdate<TData>) => GanttUpdateResult
  canDropEvent?: (update: GanttProposedUpdate<TData>) => boolean
  onSlotClick?: (slot: GanttSlotInfo, e: React.MouseEvent) => void
  onSelectSlot?: (slot: GanttSlotDraft) => void
  canSelectSlot?: (slot: GanttSlotDraft) => boolean
  /** Fires when the "add task" hint is activated; create a new tree row. */
  onCreateTask?: (ctx: { parentId: string | null; index: number }) => void
  /**
   * Gates the "add task" hint. The shipped view offers root-level creation
   * only (parentId = null); parentId stays in the contract for group-level
   * affordances a consumer builds via its own UI + onCreateTask.
   */
  canCreateTask?: (ctx: { parentId: string | null }) => boolean
  /** Click on a tree row's surface (chevron/checkbox/grip clicks excluded). */
  onResourceClick?: (ctx: GanttColumnContext, e: React.MouseEvent) => void
  onResourceDoubleClick?: (ctx: GanttColumnContext, e: React.MouseEvent) => void
  onRangeChange?: (info: GanttRangeInfo) => void
  onScaleChange?: (scale: GanttScale) => void
  onDateChange?: (date: Date) => void
  onSelectionChange?: (selection: GanttSelection) => void
  onInteractionsChange?: (interactions: GanttInteractions) => void
  onEventsChange?: (events: GanttEvent<TData>[]) => void
  /**
   * Commit gate for timeline resource-row drag reorder. Return false to
   * reject; apply the move by adopting proposal.resources into your
   * `resources` state (controlled - the calendar never self-mutates).
   */
  onResourceReorder?: (proposal: GanttResourceReorder) => void | false
  /** Live validity predicate while a resource row is being dragged. */
  canReorderResource?: (proposal: GanttResourceReorder) => boolean
  /**
   * Fires when a reorder gesture is released on a position rejected by
   * `canReorderResource` (e.g. a pinned row). Use it to explain the rejection
   * (a toast) - the destructive drop indicator already shows it live.
   */
  onResourceReorderReject?: (proposal: GanttResourceReorder) => void
}

interface UseGanttStateOptions<TData = unknown> extends GanttCallbacks<TData> {
  events?: GanttEvent<TData>[]
  defaultEvents?: GanttEvent<TData>[]
  scale?: GanttScale
  defaultScale?: GanttScale
  date?: Date
  defaultDate?: Date
  selection?: GanttSelection
  defaultSelection?: GanttSelection
  interactions?: Partial<GanttInteractions>
  defaultInteractions?: Partial<GanttInteractions>
  loading?: boolean
  timeZone?: string
  locale?: Locale
  weekStartsOn?: WeekStartsOn
  slotDuration?: number
  snapDuration?: number
  i18n?: GanttI18nOverrides
  /**
   * Hard travel bounds for infinite scrolling; either side may be omitted
   * for unlimited travel in that direction.
   */
  rangeBounds?: { min?: Date; max?: Date }
  /** Pointer-activation threshold overrides for drag/resize/create. */
  activation?: GanttActivationConfig
  /**
   * Infinite-scroll growth cap in whole periods per side; past it the
   * anchor slides instead (DOM stays bounded). Default 12.
   */
  maxRangeWindow?: number
  /** Tree nodes of the gantt (GanttNode is the preferred type name). */
  resources?: GanttResource[]
  /**
   * What a gesture may do when it would overlap another schedule in the SAME
   * node: "allow" (default), "clamp" to the neighbour's edge, or "reject".
   * Policy only - overlapping data always renders. A node in "single"
   * scheduleMode rejects regardless.
   */
  overlap?: GanttOverlapPolicy
  getEventPriority?: (event: GanttEvent<TData>) => number
  eventOrder?: (a: GanttOccurrence<TData>, b: GanttOccurrence<TData>) => number
  getOccurrences?: (
    event: GanttEvent<TData>,
    range: GanttDateRange,
    ctx: { timeZone: string }
  ) => Array<{ start: Date; end: Date }> | null
}

/**
 * Resolved configuration: every UseGanttStateOptions field except the
 * controlled/uncontrolled state pairs, with defaults applied and i18n merged.
 * Read via ref semantics - callback identity changes never re-render the grid.
 */
interface GanttSettings<TData = unknown> extends GanttCallbacks<TData> {
  timeZone: string
  locale?: Locale
  weekStartsOn: WeekStartsOn
  slotDuration: number
  snapDuration: number
  i18n: GanttI18nConfig
  rangeBounds?: { min?: Date; max?: Date }
  activation?: GanttActivationConfig
  maxRangeWindow?: number
  resources: GanttResource[]
  overlap: GanttOverlapPolicy
  getEventPriority: (event: GanttEvent<TData>) => number
  eventOrder: (a: GanttOccurrence<TData>, b: GanttOccurrence<TData>) => number
  getOccurrences?: (
    event: GanttEvent<TData>,
    range: GanttDateRange,
    ctx: { timeZone: string }
  ) => Array<{ start: Date; end: Date }> | null
}

interface GanttApi<TData = unknown> {
  next(): void
  prev(): void
  today(): void
  goTo(date: Date): void
  setScale(scale: GanttScale): void
  getEvents(): GanttEvent<TData>[]
  getEvent(id: GanttBarId): GanttEvent<TData> | undefined
  setEvents(events: GanttEvent<TData>[]): void
  addEvent(event: GanttEvent<TData>): void
  updateEvent(id: GanttBarId, patch: Partial<GanttEvent<TData>>): void
  removeEvent(id: GanttBarId): void
  getOccurrences(range?: GanttDateRange): GanttOccurrence<TData>[]
  findOverlapping(candidate: {
    start: Date
    end: Date
    excludeEventId?: string
  }): GanttOccurrence<TData>[]
  select(selection: Partial<GanttSelection>): void
  selectEvent(key: string, opts?: { additive?: boolean }): void
  clearSelection(): void
  setInteractions(patch: Partial<GanttInteractions>): void
  getVisibleRange(): GanttDateRange
  getActiveRange(): GanttDateRange
  /** TZDate in the gantt's display time zone. */
  toZoned(date: Date): Date
}

/** Cross-file plumbing for sibling view/interaction modules; not public API. */
interface GanttInternals<TData = unknown> {
  getIndex(): GanttIndex<TData>
  setDrag(drag: GanttDragState<TData> | null): void
  setSlotDraft(draft: GanttSlotDraft | null): void
  applyProposedUpdate(update: GanttProposedUpdate<TData>): boolean
  getSettingsVersion(): number
  /**
   * Grow visibleRange by whole periods for infinite scrolling; resets on
   * date/scale changes. Returns false once the growth cap is reached.
   */
  extendRange(direction: "before" | "after"): boolean
  /**
   * True when the LAST anchor-date change was an extendRange window slide
   * (not a navigation) - the view keeps its scroll guard across slides.
   */
  didAnchorSlide(): boolean
  /** View reports the visible-center instant (or null) for the nav title. */
  setViewportCenter(date: Date | null): void
}

interface GanttInstance<TData = unknown> {
  getState(): GanttState<TData>
  subscribe(listener: () => void): () => void
  api: GanttApi<TData>
  settings: GanttSettings<TData>
  internals: GanttInternals<TData>
}

function resolveSettings<TData>(
  options: UseGanttStateOptions<TData>
): GanttSettings<TData> {
  const {
    // strip state pairs; the rest flows into settings
    events: _e,
    defaultEvents: _de,
    scale: _v,
    defaultScale: _dv,
    date: _d,
    defaultDate: _dd,
    selection: _s,
    defaultSelection: _ds,
    interactions: _i,
    defaultInteractions: _di,
    loading: _l,
    ...rest
  } = options
  const getEventPriority =
    options.getEventPriority ??
    ((event: GanttEvent<TData>) => event.priority ?? 0)
  return {
    ...rest,
    timeZone:
      options.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: options.locale,
    // locale-first default: a de/fr locale gets Monday weeks without also
    // having to set weekStartsOn; an explicit weekStartsOn always wins
    weekStartsOn:
      options.weekStartsOn ?? options.locale?.options?.weekStartsOn ?? 0,
    slotDuration: options.slotDuration ?? 30,
    snapDuration: options.snapDuration ?? 15,
    i18n: mergeGanttI18n(options.i18n),
    rangeBounds: options.rangeBounds,
    resources: options.resources ?? [],
    overlap: options.overlap ?? "allow",
    getEventPriority,
    // priority-aware default: higher getEventPriority packs/orders first
    eventOrder:
      options.eventOrder ??
      ((a, b) =>
        getEventPriority(b.event) - getEventPriority(a.event) ||
        defaultEventOrder(a, b)),
    getOccurrences: options.getOccurrences,
  }
}

const warned = new Set<string>()
function warnOnce(key: string, message: string) {
  if (process.env.NODE_ENV !== "production" && !warned.has(key)) {
    warned.add(key)
    console.warn(`[gantt] ${message}`)
  }
}

interface GanttStore<TData> {
  instance: GanttInstance<TData>
  setOptions(next: UseGanttStateOptions<TData>): boolean
  notify(): void
  emitRangeIfChanged(): void
}

function createGanttStore<TData>(
  initial: UseGanttStateOptions<TData>
): GanttStore<TData> {
  let options = initial
  let settings = resolveSettings(initial)
  let settingsVersion = 0

  const listeners = new Set<() => void>()

  const internal = {
    scale: initial.defaultScale ?? "day",
    date: initial.defaultDate ?? new Date(),
    events: initial.defaultEvents ?? [],
    selection: initial.defaultSelection ?? EMPTY_SELECTION,
    interactions: { ...DEFAULT_INTERACTIONS, ...initial.defaultInteractions },
    drag: null as GanttDragState<TData> | null,
    slotDraft: null as GanttSlotDraft | null,
    /** Whole extra periods rendered on each side (infinite scroll). */
    rangeWindow: { before: 0, after: 0 },
    /** Visible-center instant reported by the view; drives the nav title. */
    viewportCenter: null as Date | null,
  }

  let snapshot: GanttState<TData> | null = null
  let indexCache: {
    events: GanttEvent<TData>[]
    rangeKey: string
    timeZone: string
    index: GanttIndex<TData>
  } | null = null
  let lastEmittedRangeKey: string | null = null
  /** Whether the last anchor change came from an extendRange window slide. */
  let lastAnchorChangeWasSlide = false

  const invalidate = () => {
    snapshot = null
  }

  const notify = () => {
    listeners.forEach((listener) => listener())
    emitRangeIfChanged()
  }

  const getState = (): GanttState<TData> => {
    if (snapshot) return snapshot
    const scale = options.scale ?? internal.scale
    const date = options.date ?? internal.date
    const rangeOpts = {
      timeZone: settings.timeZone,
      weekStartsOn: settings.weekStartsOn,
    }
    const { visibleRange: baseRange, activeRange } = getGanttDateRange(
      scale,
      date,
      rangeOpts
    )
    // Infinite scroll: widen by whole periods; the anchor period stays put
    const { before, after } = internal.rangeWindow
    let visibleRange = baseRange
    if (before > 0 || after > 0) {
      let earlier = date
      for (let i = 0; i < before; i++) {
        earlier = stepGanttDate(scale, earlier, -1, rangeOpts)
      }
      let later = date
      for (let i = 0; i < after; i++) {
        later = stepGanttDate(scale, later, 1, rangeOpts)
      }
      visibleRange = {
        start: getGanttDateRange(scale, earlier, rangeOpts).visibleRange.start,
        end: getGanttDateRange(scale, later, rangeOpts).visibleRange.end,
      }
    }
    snapshot = {
      scale,
      date,
      visibleRange,
      activeRange,
      events: options.events ?? internal.events,
      selection: options.selection ?? internal.selection,
      interactions: options.interactions
        ? { ...DEFAULT_INTERACTIONS, ...options.interactions }
        : internal.interactions,
      loading: options.loading ?? false,
      drag: internal.drag,
      slotDraft: internal.slotDraft,
      viewportCenter: internal.viewportCenter,
    }
    return snapshot
  }

  const emitRangeIfChanged = () => {
    if (!settings.onRangeChange) return
    const state = getState()
    const key = `${state.scale}:${getRangeKey(state.visibleRange)}:${settings.timeZone}`
    if (key === lastEmittedRangeKey) return
    lastEmittedRangeKey = key
    settings.onRangeChange({
      range: state.visibleRange,
      activeRange: state.activeRange,
      scale: state.scale,
      date: state.date,
      timeZone: settings.timeZone,
    })
  }

  type ControlledKey =
    | "scale"
    | "date"
    | "events"
    | "selection"
    | "interactions"

  const setField = <K extends ControlledKey>(
    key: K,
    value: GanttState<TData>[K extends "events" ? "events" : K]
  ) => {
    const controlled = options[key] !== undefined
    if (key === "date" || key === "scale") {
      // value-equal sets are no-ops: they must not touch store state (the
      // controlled path would mutate without notify) nor drop infinite-
      // scroll growth for a navigation that never happened
      const current = getState()[key]
      const same =
        key === "date"
          ? (current as Date).getTime() === (value as Date).getTime()
          : current === value
      if (same) return
      // navigating re-anchors the axis; drop any infinite-scroll growth and
      // let the title follow the anchor again until the user scrolls
      internal.rangeWindow = { before: 0, after: 0 }
      internal.viewportCenter = null
      lastAnchorChangeWasSlide = false
      invalidate()
    }
    if (!controlled) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(internal as any)[key] = value
      invalidate()
    }
    const callbacks: Record<ControlledKey, ((v: never) => void) | undefined> = {
      scale: settings.onScaleChange as never,
      date: settings.onDateChange as never,
      events: settings.onEventsChange as never,
      selection: settings.onSelectionChange as never,
      interactions: settings.onInteractionsChange as never,
    }
    callbacks[key]?.(value as never)
    if (!controlled) notify()
  }

  const applyProposedUpdate = (
    update: GanttProposedUpdate<TData>,
    // extra non-timing fields committed in the SAME events emission: a second
    // setField pass would read stale controlled options.events and emit an
    // array without the timing change
    extra?: Partial<GanttEvent<TData>>
  ): boolean => {
    const result = settings.onEventUpdate?.(update)
    if (result === false) return false
    const adjusted: Partial<GanttEvent<TData>> =
      result && typeof result === "object"
        ? {
            start: result.start ?? update.start,
            end: result.end ?? update.end,
            allDay: result.allDay ?? update.allDay,
          }
        : { start: update.start, end: update.end, allDay: update.allDay }
    if (update.resourceId !== undefined) adjusted.resourceId = update.resourceId
    const merged = extra ? { ...extra, ...adjusted } : adjusted
    const events = getState().events
    const next = events.map((event) =>
      event.id === update.event.id ? { ...event, ...merged } : event
    )
    setField("events", next)
    return true
  }

  const getIndex = (): GanttIndex<TData> => {
    const state = getState()
    const rangeKey = getRangeKey(state.visibleRange)
    if (
      indexCache &&
      indexCache.events === state.events &&
      indexCache.rangeKey === rangeKey &&
      indexCache.timeZone === settings.timeZone
    ) {
      return indexCache.index
    }
    const index = buildEventIndex(state.events, state.visibleRange, {
      timeZone: settings.timeZone,
      eventOrder: settings.eventOrder,
      getOccurrences: settings.getOccurrences,
    })
    indexCache = {
      events: state.events,
      rangeKey,
      timeZone: settings.timeZone,
      index,
    }
    return index
  }

  /** Anchor clamp: navigation may never leave the configured bounds. */
  const clampToBounds = (date: Date): Date => {
    const bounds = settings.rangeBounds
    if (!bounds) return date
    if (bounds.min && date.getTime() < bounds.min.getTime()) return bounds.min
    if (bounds.max && date.getTime() > bounds.max.getTime()) return bounds.max
    return date
  }

  const api: GanttApi<TData> = {
    next() {
      const state = getState()
      setField(
        "date",
        clampToBounds(
          stepGanttDate(state.scale, state.date, 1, {
            timeZone: settings.timeZone,
          })
        )
      )
    },
    prev() {
      const state = getState()
      setField(
        "date",
        clampToBounds(
          stepGanttDate(state.scale, state.date, -1, {
            timeZone: settings.timeZone,
          })
        )
      )
    },
    today() {
      setField("date", clampToBounds(new Date()))
    },
    goTo(date) {
      setField("date", clampToBounds(date))
    },
    setScale(scale) {
      setField("scale", scale)
    },
    getEvents() {
      return getState().events
    },
    getEvent(id) {
      return getState().events.find((event) => event.id === id)
    },
    setEvents(events) {
      setField("events", events)
    },
    addEvent(event) {
      setField("events", [...getState().events, event])
    },
    updateEvent(id, patch) {
      const event = api.getEvent(id)
      if (!event) return
      const merged = { ...event, ...patch }
      const timingChanged =
        patch.start !== undefined ||
        patch.end !== undefined ||
        patch.allDay !== undefined
      if (timingChanged && settings.onEventUpdate) {
        // timing + rest commit as ONE events emission (a rejected update
        // drops the whole patch, same as before)
        const rest = { ...patch }
        delete rest.start
        delete rest.end
        delete rest.allDay
        applyProposedUpdate(
          {
            event: merged,
            occurrence: null,
            start: merged.start,
            end: merged.end,
            allDay: merged.allDay ?? false,
            source: "api",
          },
          Object.keys(rest).length > 0 ? rest : undefined
        )
        return
      }
      setField(
        "events",
        getState().events.map((e) => (e.id === id ? merged : e))
      )
    },
    removeEvent(id) {
      setField(
        "events",
        getState().events.filter((event) => event.id !== id)
      )
    },
    getOccurrences(range) {
      if (!range) return getIndex().occurrences
      const state = getState()
      const within =
        range.start >= state.visibleRange.start &&
        range.end <= state.visibleRange.end
      if (within) {
        return getIndex().occurrences.filter((occ) => eventsOverlap(occ, range))
      }
      return buildEventIndex(state.events, range, {
        timeZone: settings.timeZone,
        eventOrder: settings.eventOrder,
        getOccurrences: settings.getOccurrences,
      }).occurrences
    },
    findOverlapping({ start, end, excludeEventId }) {
      return api
        .getOccurrences({ start, end })
        .filter((occ) => occ.eventId !== excludeEventId)
    },
    select(partial) {
      const current = getState().selection
      setField("selection", {
        eventKeys: partial.eventKeys ?? current.eventKeys,
        slot: partial.slot !== undefined ? partial.slot : current.slot,
      })
    },
    selectEvent(key, opts) {
      const current = getState().selection
      const eventKeys = opts?.additive
        ? current.eventKeys.includes(key)
          ? current.eventKeys.filter((k) => k !== key)
          : [...current.eventKeys, key]
        : [key]
      setField("selection", { ...current, eventKeys })
    },
    clearSelection() {
      setField("selection", EMPTY_SELECTION)
    },
    setInteractions(patch) {
      setField("interactions", { ...getState().interactions, ...patch })
    },
    getVisibleRange() {
      return getState().visibleRange
    },
    getActiveRange() {
      return getState().activeRange
    },
    toZoned(date) {
      return toZoned(date, settings.timeZone)
    },
  }

  const internals: GanttInternals<TData> = {
    getIndex,
    setDrag(drag) {
      internal.drag = drag
      invalidate()
      notify()
    },
    setSlotDraft(draft) {
      internal.slotDraft = draft
      invalidate()
      notify()
    },
    setViewportCenter(date) {
      const prev = internal.viewportCenter
      if (prev?.getTime() === date?.getTime()) return
      internal.viewportCenter = date
      invalidate()
      notify()
    },
    applyProposedUpdate,
    getSettingsVersion() {
      return settingsVersion
    },
    extendRange(direction) {
      const state = getState()
      const bounds = settings.rangeBounds
      if (
        direction === "before" &&
        bounds?.min &&
        state.visibleRange.start.getTime() <= bounds.min.getTime()
      ) {
        return false
      }
      if (
        direction === "after" &&
        bounds?.max &&
        state.visibleRange.end.getTime() >= bounds.max.getTime()
      ) {
        return false
      }
      const cap = Math.max(1, settings.maxRangeWindow ?? MAX_RANGE_WINDOW)
      const { before, after } = internal.rangeWindow
      const grow = direction === "before" ? before < cap : after < cap
      if (grow) {
        internal.rangeWindow =
          direction === "before"
            ? { before: before + 1, after }
            : { before, after: after + 1 }
      } else {
        // window is at capacity: SLIDE the anchor one period instead, so
        // travel stays unbounded while the DOM stays bounded
        const next = stepGanttDate(
          state.scale,
          state.date,
          direction === "before" ? -1 : 1,
          {
            timeZone: settings.timeZone,
          }
        )
        if (options.date !== undefined) {
          // controlled anchor: propose the slide; nothing changes until the
          // parent adopts it
          settings.onDateChange?.(next)
          return false
        }
        internal.date = next
        lastAnchorChangeWasSlide = true
        settings.onDateChange?.(next)
      }
      invalidate()
      notify()
      return true
    },
    didAnchorSlide() {
      return lastAnchorChangeWasSlide
    },
  }

  const instance: GanttInstance<TData> = {
    getState,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    api,
    get settings() {
      return settings
    },
    internals,
  }

  const STATE_KEYS = [
    "events",
    "scale",
    "date",
    "selection",
    "interactions",
    "loading",
  ] as const
  const SETTINGS_KEYS = [
    "timeZone",
    "locale",
    "weekStartsOn",
    "slotDuration",
    "snapDuration",
    "i18n",
    "rangeBounds",
    "activation",
    "maxRangeWindow",
    "resources",
    "overlap",
    "getEventPriority",
    "eventOrder",
    "getOccurrences",
  ] as const

  return {
    instance,
    setOptions(next) {
      const prev = options
      options = next
      // compare by value: a freshly constructed but equal controlled date
      // must not wipe infinite-scroll growth on every parent re-render
      if (
        prev.date?.getTime() !== next.date?.getTime() ||
        prev.scale !== next.scale
      ) {
        internal.rangeWindow = { before: 0, after: 0 }
        lastAnchorChangeWasSlide = false
      }
      let changed = false
      for (const key of STATE_KEYS) {
        if (prev[key] !== next[key]) {
          changed = true
          break
        }
      }
      let settingsChanged = false
      for (const key of SETTINGS_KEYS) {
        if (prev[key] !== next[key]) {
          settingsChanged = true
          break
        }
      }
      settings = resolveSettings(next)
      if (settingsChanged) {
        settingsVersion++
        changed = true
      }
      if (changed) invalidate()
      return changed
    },
    notify,
    emitRangeIfChanged,
  }
}

/**
 * Headless root hook - the full calendar engine without any markup.
 * Pass the returned instance to <Gantt calendar={instance}> or drive
 * fully custom UI from instance.getState()/subscribe/api.
 */
function useGanttState<TData = unknown>(
  options: UseGanttStateOptions<TData> = {}
): GanttInstance<TData> {
  const [store] = useState(() => createGanttStore<TData>(options))
  const changed = store.setOptions(options)
  const changedRef = useRef(false)
  if (changed) changedRef.current = true
  useLayoutEffect(() => {
    if (changedRef.current) {
      changedRef.current = false
      store.notify()
    }
  })
  useEffect(() => {
    store.emitRangeIfChanged()
    // mount-only: onRangeChange fires once for the initial range
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return store.instance
}

const GanttContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContext<GanttInstance<any> | null>(null)

/** The stable calendar instance; throws outside <Gantt>. */
function useGantt<TData = unknown>(): GanttInstance<TData> {
  const instance = useContext(GanttContext)
  if (!instance) {
    throw new Error("useGantt must be used within <Gantt>")
  }
  return instance as GanttInstance<TData>
}

interface UseGanttSelectorOptions<TData, TSelected> {
  calendar?: GanttInstance<TData>
  isEqual?: (a: TSelected, b: TSelected) => boolean
}

/** Fine-grained subscription with equality memoization (Object.is default). */
function useGanttSelector<TData = unknown, TSelected = unknown>(
  selector: (state: GanttState<TData>) => TSelected,
  options?: UseGanttSelectorOptions<TData, TSelected>
): TSelected {
  const contextInstance = useContext(GanttContext)
  const instance = options?.calendar ?? contextInstance
  if (!instance) {
    throw new Error(
      "useGanttSelector needs an <Gantt> ancestor or an explicit `calendar` option"
    )
  }
  const isEqual = options?.isEqual ?? Object.is
  const lastRef = useRef<{ value: TSelected } | null>(null)
  const selectorRef = useRef(selector)
  selectorRef.current = selector

  const getSnapshot = () => {
    const next = selectorRef.current(instance.getState() as GanttState<TData>)
    if (lastRef.current && isEqual(lastRef.current.value, next)) {
      return lastRef.current.value
    }
    lastRef.current = { value: next }
    return next
  }

  return useSyncExternalStore(instance.subscribe, getSnapshot, getSnapshot)
}

function useGanttScale(): {
  scale: GanttScale
  setScale: (scale: GanttScale) => void
} {
  const instance = useGantt()
  const scale = useGanttSelector((state) => state.scale)
  return { scale, setScale: instance.api.setScale }
}

function useGanttNavigation(): {
  date: Date
  /** i18n.functions.formatTitle output for the current view. */
  title: string
  visibleRange: GanttDateRange
  activeRange: GanttDateRange
  next: () => void
  prev: () => void
  today: () => void
  goTo: (date: Date) => void
  /** True when the anchor period contains now in the display time zone. */
  isToday: boolean
} {
  const instance = useGantt()
  const { settings } = instance
  const slice = useGanttSelector(
    (state) => ({
      date: state.date,
      scale: state.scale,
      visibleRange: state.visibleRange,
      activeRange: state.activeRange,
      viewportCenter: state.viewportCenter,
    }),
    {
      isEqual: (a, b) =>
        a.date.getTime() === b.date.getTime() &&
        a.scale === b.scale &&
        a.viewportCenter?.getTime() === b.viewportCenter?.getTime() &&
        getRangeKey(a.visibleRange) === getRangeKey(b.visibleRange),
    }
  )
  useGanttSettingsVersion(instance)
  const now = new Date()
  // The title names what you are LOOKING at: the visible-center period when
  // the view reports one, otherwise the anchor period.
  const titleDate = slice.viewportCenter ?? slice.date
  const titleActive = slice.viewportCenter
    ? getGanttDateRange(slice.scale, slice.viewportCenter, {
        timeZone: settings.timeZone,
        weekStartsOn: settings.weekStartsOn,
      }).activeRange
    : slice.activeRange
  return {
    date: slice.date,
    title: settings.i18n.functions.formatTitle(slice.scale, {
      date: toZoned(titleDate, settings.timeZone),
      activeRange: titleActive,
      visibleRange: slice.visibleRange,
      locale: settings.locale,
    }),
    visibleRange: slice.visibleRange,
    activeRange: slice.activeRange,
    next: instance.api.next,
    prev: instance.api.prev,
    today: instance.api.today,
    goTo: instance.api.goTo,
    isToday: now >= slice.activeRange.start && now < slice.activeRange.end,
  }
}

function useGanttSelection(): {
  selection: GanttSelection
  select: (selection: Partial<GanttSelection>) => void
  selectEvent: (key: string, opts?: { additive?: boolean }) => void
  clearSelection: () => void
} {
  const instance = useGantt()
  const selection = useGanttSelector((state) => state.selection)
  return {
    selection,
    select: instance.api.select,
    selectEvent: instance.api.selectEvent,
    clearSelection: instance.api.clearSelection,
  }
}

function useGanttInteractions(): {
  interactions: GanttInteractions
  setInteractions: (patch: Partial<GanttInteractions>) => void
} {
  const instance = useGantt()
  const interactions = useGanttSelector((state) => state.interactions)
  return { interactions, setInteractions: instance.api.setInteractions }
}

/** Expanded, sorted occurrences; defaults to the visible range. */
function useGanttOccurrences<TData = unknown>(
  range?: GanttDateRange
): GanttOccurrence<TData>[] {
  const instance = useGantt<TData>()
  return useGanttSelector<TData, GanttOccurrence<TData>[]>(
    () => instance.api.getOccurrences(range),
    {
      calendar: instance,
      // keys encode id + start only, so end edits (resize-end) and payload
      // changes (title, color, progress) must be compared explicitly
      isEqual: (a, b) =>
        a.length === b.length &&
        a.every(
          (occ, i) =>
            occ.key === b[i]?.key &&
            occ.end.getTime() === b[i].end.getTime() &&
            occ.event === b[i].event
        ),
    }
  )
}

interface GanttNodeSchedules<TData = unknown> {
  /** The node itself, or null when the id is not in the tree. */
  node: GanttResource | null
  /** Cardinality in force for this node (its own override, else the default). */
  scheduleMode: GanttScheduleMode
  /** The node's occurrences in the visible range, in axis order. */
  schedules: GanttOccurrence<TData>[]
  /** Pairs of the node's schedules that overlap in time. */
  conflicts: Array<[GanttOccurrence<TData>, GanttOccurrence<TData>]>
}

/**
 * Everything a consumer needs to MANAGE one node's schedules without
 * re-deriving layout: the node, its resolved cardinality, its schedules in
 * order, and the pairs that collide. Pure state - it renders nothing, so a
 * "manage schedules" panel is entirely the consumer's design.
 */
function useGanttNodeSchedules<TData = unknown>(
  nodeId: string
): GanttNodeSchedules<TData> {
  const settings = useGanttSettings<TData>()
  const viewConfig = useGanttViewConfig<TData>()
  const occurrences = useGanttOccurrences<TData>()

  const node = findResource(settings.resources, nodeId)
  const schedules = occurrences.filter(
    (occurrence) => occurrence.event.resourceId === nodeId
  )
  const conflicts: Array<[GanttOccurrence<TData>, GanttOccurrence<TData>]> = []
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      if (eventsOverlap(schedules[i], schedules[j])) {
        conflicts.push([schedules[i], schedules[j]])
      }
    }
  }
  return {
    node,
    scheduleMode: resolveScheduleMode(node, viewConfig.scheduleMode),
    schedules,
    conflicts,
  }
}

/** Subscribes to settings changes only (version counter, not state). */
function useGanttSettingsVersion<TData>(
  instance: GanttInstance<TData>
): number {
  return useSyncExternalStore(
    instance.subscribe,
    instance.internals.getSettingsVersion,
    instance.internals.getSettingsVersion
  )
}

/** Resolved settings incl. merged i18n; re-renders only when settings change. */
function useGanttSettings<TData = unknown>(): GanttSettings<TData> {
  const instance = useGantt<TData>()
  useGanttSettingsVersion(instance)
  return instance.settings
}

interface GanttClassNames {
  nav?: string
  toolbar?: string
  /** The gantt body (tree + track). */
  view?: string
  event?: string
}

/** Row context handed to tree-panel column and label renderers. */
interface GanttColumnContext {
  resource: GanttResource
  depth: number
  isGroup: boolean
  collapsed: boolean
}

/** One extra tree-panel column after the built-in name column. */
interface GanttColumn {
  /** Stable id; doubles as the default header label. */
  id: string
  /** Header label. */
  title?: ReactNode
  /** Fixed column width in px. Default 96. */
  width?: number
  /** Cell content alignment. Default "start". */
  align?: "start" | "center" | "end"
  /** Cell content per row; omit or return null for an empty cell. */
  render?: (ctx: GanttColumnContext) => ReactNode
  /** Extra classes on every cell of this column (header included). */
  className?: string
}

/** Pointer-activation thresholds; unset keys keep the dnd-kit parity defaults. */
interface GanttActivationConfig {
  /** Mouse travel (px) before a bar move starts. Default 5. */
  moveDistancePx?: number
  /** Mouse travel (px) before a drag-create starts. Default 4. */
  createDistancePx?: number
  /** Touch long-press delay in ms. Default 250. */
  touchDelayMs?: number
  /** Touch movement tolerance (px) during the long-press. Default 5. */
  touchTolerancePx?: number
}

/** Layout metrics (rem unless noted); every knob falls back to its default. */
/** A gridline: false to hide it, true for the default solid stroke, or a style. */
type GanttGridLine = boolean | "solid" | "dashed"

interface GanttTimelineLines {
  /** Unit boundary lines running down the timeline. Default solid. */
  vertical?: GanttGridLine
  /** Row separator lines running across the timeline. Default solid. */
  horizontal?: GanttGridLine
}

/** Resolved stroke per axis; null means the axis draws nothing. */
interface GanttResolvedLines {
  vertical: "solid" | "dashed" | null
  horizontal: "solid" | "dashed" | null
}

/**
 * One place decides what the grid draws, so the header lines, the body lines
 * and the row separators can never disagree.
 */
function resolveTimelineLines(
  value: GanttTimelineLines | "vertical" | "both" | "none" | undefined
): GanttResolvedLines {
  if (value === "none") return { vertical: null, horizontal: null }
  if (value === "vertical") return { vertical: "solid", horizontal: null }
  if (value === "both" || value === undefined) {
    return { vertical: "solid", horizontal: "solid" }
  }
  const stroke = (line: GanttGridLine | undefined) =>
    line === false ? null : line === true || line === undefined ? "solid" : line
  return {
    vertical: stroke(value.vertical),
    horizontal: stroke(value.horizontal),
  }
}

interface GanttMetrics {
  /** Height of one schedule bar. Default 1.25. */
  laneHeight?: number
  /** Gap between stacked schedules in one node. Default 0.1875. */
  laneGap?: number
  /**
   * Vertical inset between the row's edges and its block of schedules - the
   * breathing room around the stack, kept separate from laneGap so schedules
   * in one node can sit tight without cramping the row. Default 0.5.
   */
  rowPadding?: number
  /** Minimum row height. Default 2.5. */
  minRowHeight?: number
  /** barLabel "auto" flips the title outside below this bar width. Default 7. */
  autoLabelMin?: number
  /** Unit width at zoom 1, per scale. Day scale = width per interval unit. */
  unitWidths?: Partial<Record<GanttScale, number>>
  /** Minimum timeline pane width in px. Default 200. */
  minTimelineWidth?: number
  /** Scroll distance (px) from an edge that grows the range. Default 160. */
  infiniteScrollEdge?: number
}

/** Live gesture snapshot handed to the drag/resize indicator render props. */
interface GanttDragIndicatorProps<TData = unknown> {
  occurrence: GanttOccurrence<TData>
  kind: "move" | "resize-start" | "resize-end"
  /** Proposed (snapped) range of the current gesture step. */
  start: Date
  end: Date
  valid: boolean
}

/** Slot handed to a custom schedule-hint renderer. */
interface GanttScheduleHintProps {
  start: Date
  end: Date
  resource: GanttResource
}

/** Parent rollup handed to a custom summary renderer. */
interface GanttSummaryProps {
  resource: GanttResource
  start: Date
  end: Date
  progress: number | null
}

/** Left tree-panel sizing and splitter behavior. */
interface GanttTreePanelConfig {
  /** Initial panel width in px. Default 288. */
  width?: number
  /** Splitter lower bound in px. Default 180. */
  minWidth?: number
  /** Splitter upper bound in px. Default 640. */
  maxWidth?: number
  /** Drag/keyboard splitter between the panels. Default true. */
  resizable?: boolean
  /** Width of the sticky name column in px. Default 208. */
  nameColumnWidth?: number
  /** Fires after any user resize (drag release, keyboard, double-click reset). */
  onWidthChange?: (width: number) => void
}

interface GanttRenderEventProps<TData = unknown> {
  occurrence: GanttOccurrence<TData>
  segment: GanttSegment<TData>
  isDragging: boolean
  isSelected: boolean
}

/**
 * View-layer configuration: display props and render overrides. These live on
 * <Gantt> (and per-view components), never in the headless options.
 */
interface GanttViewConfig<TData = unknown> {
  /** Red now-line on the axis. */
  nowIndicator: boolean
  /**
   * Day-scale unit interval in minutes: axis units and gridlines follow it.
   */
  interval: number
  /**
   * Scroll implementation for the gantt body: "custom" (default, shadcn
   * ScrollArea) or "native" (browser scrollbars via overflow auto).
   */
  scrollbars: "custom" | "native"
  /**
   * Placement hint over empty timeline track: a validated, snapped tile that
   * opens the schedule flow (onSlotClick, else onSelectSlot) at that day.
   * Works on every scale. Default off.
   */
  displayScheduleHint: boolean
  /**
   * Where the viewport opens. `"now"` (default) centres the current instant
   * when the anchor period contains it and falls back to the anchor; `"anchor"`
   * always centres the anchor; a Date centres that instant.
   *
   * Only `"now"` follows the wall clock - which is right for a live board and
   * wrong for a demo or a report, whose opening composition must not depend on
   * the hour it is viewed at. Those pass an explicit instant.
   */
  initialCenter: "now" | "anchor" | Date
  /**
   * Empty-track presses on schedulable rows start a drag-create gesture that
   * commits through onSelectSlot. Default off: the whole panel drags-to-pan
   * instead, and scheduling flows through the hint tile / onSlotClick.
   */
  dragCreate: boolean
  /**
   * "Add task" affordance at the foot of the tree that opens the create-task
   * flow (onCreateTask). Shown only when canCreateTask allows it. Default off.
   */
  displayCreateTaskHint: boolean
  /** Floating zoom in/out control over the track. Default on. */
  zoomControl: boolean
  /** Nav button variant; all nav buttons follow it. Default "ghost". */
  navButtonVariant: "ghost" | "outline" | "secondary" | "default"
  /** Nav button size; icon buttons use the icon twin. Default "sm". */
  navButtonSize: "sm" | "default"
  /**
   * Off-day (non-working day) marking on day/week/month scales. true =
   * weekends with a muted background; a config object customizes weekdays,
   * explicit dates, a predicate, and the marker class.
   */
  offDays?: boolean | GanttOffDaysConfig
  /**
   * Extra tree-panel columns after the built-in name column. The tree panel
   * scrolls horizontally when the columns outgrow it; the name column stays
   * pinned.
   */
  columns?: GanttColumn[]
  /**
   * Consumer slot pinned at the end of the tree-panel header - the intended
   * home for an add/remove-columns dropdown menu.
   */
  columnsMenu?: ReactNode
  /** Tree-panel width, splitter bounds, and resizability. */
  treePanel?: GanttTreePanelConfig
  /**
   * Timeline gridlines. The object form controls the two axes independently
   * and gives each its own stroke: `{ vertical: "dashed", horizontal: true }`.
   * An omitted axis stays on and solid. `true` means solid.
   *
   * The three legacy shorthands still work: "none" (bare), "vertical" (unit
   * boundaries only, rows separated by whitespace) and "both" (adds row
   * separators).
   */
  timelineLines: GanttTimelineLines | "vertical" | "both" | "none"
  /**
   * Bar title placement: "inside" (default) renders it in the bar, "outside"
   * beside the bar, "auto" moves it outside only when the bar is too short.
   */
  barLabel: "inside" | "outside" | "auto"
  /** Edge chips that scroll to bars outside the visible timeline. Default true. */
  offscreenIndicators: boolean
  /**
   * Extend the timeline into the past/future while scrolling near an edge
   * (the anchor period stays the nav title). Default true.
   */
  infiniteScroll: boolean
  /** Zoom bounds and button step for the floating control. Default 0.5 - 3, step 0.25. */
  zoomRange?: { min?: number; max?: number; step?: number }
  /** Layout metric overrides (row/lane/unit geometry, thresholds). */
  metrics?: GanttMetrics
  /** Sticky nav bar (same contract as the event calendar). Default false. */
  stickyNav: boolean
  /**
   * Leaf-row selection checkboxes in the tree panel. Default true;
   * uncontrolled unless selectedRows is passed.
   */
  rowCheckboxes: boolean
  /** Controlled selected row ids; pairs with onSelectedRowsChange. */
  selectedRows?: string[]
  onSelectedRowsChange?: (ids: string[]) => void
  /** Controlled collapsed group ids; pairs with onCollapsedGroupsChange. */
  collapsedGroups?: string[]
  /** Initial collapsed group ids (uncontrolled). */
  defaultCollapsedGroups?: string[]
  onCollapsedGroupsChange?: (ids: string[]) => void
  /** Controlled zoom multiplier; pairs with onZoomChange. */
  zoom?: number
  /** Initial zoom multiplier (uncontrolled). Default 1. */
  defaultZoom?: number
  onZoomChange?: (zoom: number) => void
  /**
   * Allow drag-create and slot clicks on rows that have children. Default
   * false: parents aggregate their subtree instead of owning bars.
   */
  parentScheduling: boolean
  /**
   * Rollup strips on parent rows without bars of their own: the envelope of
   * descendant bars with duration-weighted progress. Default true.
   */
  summaryBars: boolean
  /**
   * How many schedules a tree node may hold. "multiple" (default) stacks
   * concurrent schedules into stable lanes and grows the row; "single" keeps
   * one track per node - the task-gantt shape. Any node can override it with
   * its own `scheduleMode`.
   */
  scheduleMode: GanttScheduleMode
  /**
   * Vertical placement of a row's content once a node holds several lanes.
   * "start" (default) keeps the tree label on the baseline of the FIRST
   * schedule; "center" centers both against the grown row.
   */
  rowAlign: GanttRowAlign
  classNames?: GanttClassNames
  renderEvent?: (props: GanttRenderEventProps<TData>) => ReactNode
  /**
   * Right-click menu for a bar: return shadcn ContextMenu items (the primitive
   * wraps every bar in a ContextMenu and renders this as its content). Read
   * the occurrence for the subject and drive actions through the gantt api
   * (useGantt) or your own state - fully headless. Omit for no menu.
   */
  renderEventMenu?: (props: GanttRenderEventProps<TData>) => ReactNode
  /**
   * Tree-node label. Receives the resource with its tree position; return
   * any rich content (icons, badges). Default is the plain title.
   */
  renderResourceLabel?: (props: {
    resource: GanttResource
    depth: number
    isGroup: boolean
    collapsed: boolean
  }) => ReactNode
  /**
   * Right-click menu for a tree row (same contract as renderEventMenu):
   * return shadcn ContextMenu items and drive actions through your own state.
   */
  renderResourceMenu?: (ctx: GanttColumnContext) => ReactNode
  /** Rendered in the timeline body when there are no resources. */
  renderNoResources?: () => ReactNode
  /**
   * Replaces the smooth cursor-following MOVE clone. Content is React and
   * re-renders per snap step; the gantt owns the fixed wrapper and writes
   * its position imperatively per pointermove (no per-frame React).
   */
  renderDragPreview?: (props: GanttDragIndicatorProps<TData>) => ReactNode
  /**
   * Replaces the RESIZE edge line + status chip. Same positioning contract
   * as renderDragPreview: your content, gantt-owned cursor tracking.
   */
  renderResizeIndicator?: (props: GanttDragIndicatorProps<TData>) => ReactNode
  /**
   * Replaces the schedule-hint tile + bubble. Rendered inside the snapped,
   * validated, pointer-transparent wrapper: set pointer-events-auto on your
   * clickable parts and drive your own create flow from the slot.
   */
  renderScheduleHint?: (props: GanttScheduleHintProps) => ReactNode
  /** Replaces the parent rollup strip (the positioned wrapper stays gantt-owned). */
  renderSummary?: (props: GanttSummaryProps) => ReactNode
  /**
   * Replaces the rollup MATH: return 0-100 (or null to hide) for a group
   * from its descendant events. Default: duration-weighted mean progress.
   */
  getSummaryProgress?: (ctx: {
    resource: GanttResource
    events: GanttEvent<TData>[]
  }) => number | null
}

const DEFAULT_VIEW_CONFIG: GanttViewConfig = {
  nowIndicator: true,
  interval: 60,
  scrollbars: "custom",
  displayScheduleHint: false,
  initialCenter: "now",
  displayCreateTaskHint: false,
  dragCreate: false,
  zoomControl: true,
  navButtonVariant: "ghost",
  navButtonSize: "sm",
  timelineLines: "vertical",
  barLabel: "inside",
  offscreenIndicators: true,
  infiniteScroll: true,
  stickyNav: false,
  rowCheckboxes: true,
  parentScheduling: false,
  summaryBars: true,
  scheduleMode: "multiple",
  rowAlign: "start",
}

const GanttViewConfigContext = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GanttViewConfig<any>
>(DEFAULT_VIEW_CONFIG)

/** Root-level display props + render overrides, for view components. */
function useGanttViewConfig<TData = unknown>(): GanttViewConfig<TData> {
  return useContext(GanttViewConfigContext)
}

const VIEW_CONFIG_KEYS: Array<keyof GanttViewConfig> = [
  "nowIndicator",
  "interval",
  "scrollbars",
  "displayScheduleHint",
  "initialCenter",
  "displayCreateTaskHint",
  "dragCreate",
  "zoomControl",
  "navButtonVariant",
  "navButtonSize",
  "offDays",
  "columns",
  "columnsMenu",
  "treePanel",
  "metrics",
  "timelineLines",
  "barLabel",
  "offscreenIndicators",
  "infiniteScroll",
  "zoomRange",
  "stickyNav",
  "rowCheckboxes",
  "selectedRows",
  "onSelectedRowsChange",
  "collapsedGroups",
  "defaultCollapsedGroups",
  "onCollapsedGroupsChange",
  "zoom",
  "defaultZoom",
  "onZoomChange",
  "parentScheduling",
  "summaryBars",
  "scheduleMode",
  "rowAlign",
  "classNames",
  "renderEvent",
  "renderEventMenu",
  "renderResourceLabel",
  "renderResourceMenu",
  "renderNoResources",
  "renderDragPreview",
  "renderResizeIndicator",
  "renderScheduleHint",
  "renderSummary",
  "getSummaryProgress",
]

interface GanttProps<TData = unknown>
  extends
    UseGanttStateOptions<TData>,
    Partial<GanttViewConfig<TData>>,
    Omit<useRender.ComponentProps<"div">, "children" | "defaultValue"> {
  /** Adopt a hoisted useGanttState instance; option props are then ignored. */
  calendar?: GanttInstance<TData>
  /** Imperative escape hatch usable from outside the tree. */
  apiRef?: RefObject<GanttApi<TData> | null>
  children?: ReactNode
}

const OPTION_KEYS: Array<keyof UseGanttStateOptions> = [
  "events",
  "defaultEvents",
  "scale",
  "defaultScale",
  "date",
  "defaultDate",
  "selection",
  "defaultSelection",
  "interactions",
  "defaultInteractions",
  "loading",
  "timeZone",
  "locale",
  "weekStartsOn",
  "slotDuration",
  "snapDuration",
  "i18n",
  "rangeBounds",
  "activation",
  "maxRangeWindow",
  "resources",
  "overlap",
  "getEventPriority",
  "eventOrder",
  "getOccurrences",
  "onEventClick",
  "onEventDoubleClick",
  "onEventUpdate",
  "canDropEvent",
  "onSlotClick",
  "onSelectSlot",
  "canSelectSlot",
  "onCreateTask",
  "canCreateTask",
  "onResourceClick",
  "onResourceDoubleClick",
  "onRangeChange",
  "onScaleChange",
  "onDateChange",
  "onSelectionChange",
  "onInteractionsChange",
  "onEventsChange",
  "onResourceReorder",
  "onResourceReorderReject",
  "canReorderResource",
]

function shallowEqualRecord(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  const aKeys = Object.keys(a)
  if (aKeys.length !== Object.keys(b).length) return false
  for (const key of aKeys) {
    if (!Object.is(a[key], b[key])) return false
  }
  return true
}

function splitOptions<TData>(props: Record<string, unknown>): {
  options: UseGanttStateOptions<TData>
  viewConfig: GanttViewConfig<TData>
  rest: Record<string, unknown>
} {
  const options: Record<string, unknown> = {}
  const viewConfig: Record<string, unknown> = { ...DEFAULT_VIEW_CONFIG }
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if ((OPTION_KEYS as string[]).includes(key)) options[key] = value
    else if ((VIEW_CONFIG_KEYS as string[]).includes(key)) {
      if (value !== undefined) viewConfig[key] = value
    } else rest[key] = value
  }
  return {
    options: options as UseGanttStateOptions<TData>,
    viewConfig: viewConfig as unknown as GanttViewConfig<TData>,
    rest,
  }
}

/**
 * Root provider + container. Composition contract:
 * <Gantt><GanttNav/><GanttToolbar/><GanttView/></Gantt>
 */
function Gantt<TData = unknown>({
  calendar,
  apiRef,
  className,
  render,
  children,
  ...props
}: GanttProps<TData>) {
  const { options, viewConfig, rest } = splitOptions<TData>(
    props as Record<string, unknown>
  )

  // Stable context identity: splitOptions builds a fresh object per render,
  // and every row subscribes to this context - hand out the previous object
  // unless a config value actually changed.
  const viewConfigRef = useRef(viewConfig)
  if (
    !shallowEqualRecord(
      viewConfigRef.current as unknown as Record<string, unknown>,
      viewConfig as unknown as Record<string, unknown>
    )
  ) {
    viewConfigRef.current = viewConfig
  }
  const stableViewConfig = viewConfigRef.current

  if (calendar && Object.keys(options).length > 0) {
    warnOnce(
      "calendar-and-options",
      "both `calendar` and option props were passed; option props are ignored when adopting an instance."
    )
  }

  const own = useGanttState<TData>(calendar ? {} : options)
  const instance = calendar ?? own

  useEffect(() => {
    if (apiRef) apiRef.current = instance.api
  }, [apiRef, instance])

  const defaultProps = {
    "data-slot": "gantt",
    // own the foreground (previews and consumer shells may not set body
    // color) and the type scale: every gantt label inherits the root's text
    // size, so one class here (or on the consumer's className) rescales the
    // whole component - e.g. className="text-sm" for a roomier grid
    className: cn(
      "text-foreground flex min-h-0 min-w-0 flex-col text-xs",
      className
    ),
    children: (
      <>
        {children}
        <div
          data-slot="gantt-announcer"
          aria-live="polite"
          className="sr-only"
        />
      </>
    ),
  }

  return (
    <GanttContext.Provider value={instance}>
      <GanttViewConfigContext.Provider value={stableViewConfig}>
        {useRender({
          defaultTagName: "div",
          render,
          props: mergeProps<"div">(defaultProps, rest),
        })}
      </GanttViewConfigContext.Provider>
    </GanttContext.Provider>
  )
}

export {
  DEFAULT_ROW_ALIGN,
  DEFAULT_SCHEDULE_MODE,
  DEFAULT_VIEW_CONFIG,
  Gantt,
  GanttContext,
  GanttViewConfigContext,
  resolveScheduleMode,
  resolveTimelineLines,
  useGantt,
  useGanttInteractions,
  useGanttNavigation,
  useGanttNodeSchedules,
  useGanttOccurrences,
  useGanttScale,
  useGanttSelection,
  useGanttSelector,
  useGanttSettings,
  useGanttSettingsVersion,
  useGanttState,
  useGanttViewConfig,
}
export type {
  GanttActivationConfig,
  GanttApi,
  GanttCallbacks,
  GanttClassNames,
  GanttColumn,
  GanttColumnContext,
  GanttDragIndicatorProps,
  GanttGridLine,
  GanttInstance,
  GanttInternals,
  GanttMetrics,
  GanttNodeSchedules,
  GanttProps,
  GanttRenderEventProps,
  GanttResolvedLines,
  GanttScheduleHintProps,
  GanttSettings,
  GanttSummaryProps,
  GanttTimelineLines,
  GanttTreePanelConfig,
  GanttViewConfig,
  UseGanttStateOptions,
}
