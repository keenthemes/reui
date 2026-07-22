// Title: Gantt I18n
// Description: Default UI texts, date-format strings, and formatter functions for the gantt, fully overridable per key.

import type {
  GanttDateRange,
  GanttScale,
} from "@/registry-reui/bases/base/reui/gantt/gantt-types"
import {
  format,
  isSameMonth,
  isSameYear,
  subMilliseconds,
  type Locale,
} from "date-fns"

interface GanttI18nConfig {
  labels: {
    today: string
    previous: string
    next: string
    addEvent: string
    /** "Add task" hint at the foot of the tree. */
    addTask: string
    allDay: string
    loading: string
    event: string
    events: (count: number) => string
    week: (weekNumber: number) => string
    resources: string
    goToDate: string
    /** Hover hint over empty row space, click-only create. */
    scheduleHint: string
    /** Same hint where dragCreate is on and a drag paints a range. */
    scheduleHintDrag: string
    reorder: string
    /** Scale switcher label ("Timeline scale"). */
    selectView: string
    zoomIn: string
    zoomOut: string
    /** Aria-label of the tree/timeline splitter. */
    resizePanel: string
    /** Aria-label of the off-screen bar chips. */
    jumpToBar: (title: string) => string
    /** Read to screen readers as part of the bar label. */
    progress: (percent: number) => string
    /** Live duration readout on the resize indicator. */
    durationDays: (days: number) => string
    /** Appended to the bar aria-label when its segment is clipped by the range. */
    continues: string
    scales: {
      day: string
      week: string
      month: string
      quarter: string
      year: string
    }
  }
  /** date-fns format strings, applied with the gantt `locale`. */
  formats: {
    monthTitle: string
    dayTitle: string
    timeGutter: string
    eventTime: string
  }
  functions: {
    formatTitle: (
      scale: GanttScale,
      ctx: {
        date: Date
        activeRange: GanttDateRange
        visibleRange: GanttDateRange
        locale?: Locale
      }
    ) => string
    formatEventTime: (
      start: Date,
      end: Date,
      allDay: boolean,
      locale?: Locale
    ) => string
    formatDayRange: (range: GanttDateRange, locale?: Locale) => string
    /** Composes the bar's screen-reader label from its localized parts. */
    formatEventAriaLabel: (parts: {
      title: string
      timeLabel: string
      rowTitle?: string
      progressLabel?: string
      continues: boolean
    }) => string
  }
}

const DEFAULT_LABELS: GanttI18nConfig["labels"] = {
  today: "Today",
  previous: "Previous",
  next: "Next",
  addEvent: "Add event",
  addTask: "Add task",
  allDay: "All day",
  loading: "Loading events",
  event: "event",
  events: (count) => (count === 1 ? "1 event" : `${count} events`),
  week: (weekNumber) => `W${weekNumber}`,
  resources: "Resources",
  goToDate: "Go to date",
  scheduleHint: "Click to add a schedule",
  scheduleHintDrag: "Click or drag to add a schedule",
  reorder: "Reorder",
  selectView: "Select view",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resizePanel: "Resize panel",
  jumpToBar: (title) => `Scroll to "${title}"`,
  progress: (percent) => `${percent}% complete`,
  durationDays: (days) => (days === 1 ? "1 day" : `${days} days`),
  continues: "continues",
  scales: {
    day: "Day",
    week: "Week",
    month: "Month",
    quarter: "Quarter",
    year: "Year",
  },
}

const DEFAULT_FORMATS: GanttI18nConfig["formats"] = {
  monthTitle: "MMMM yyyy",
  dayTitle: "EEEE, MMMM d, yyyy",
  timeGutter: "h a",
  eventTime: "h:mm a",
}

/**
 * Default formatting functions BOUND to a config's labels/formats, so that
 * `formats` overrides flow into the default renderers (a consumer overriding
 * formats.eventTime without replacing formatEventTime still sees it applied).
 */
function makeDefaultGanttFunctions(
  cfg: Pick<GanttI18nConfig, "labels" | "formats">
): GanttI18nConfig["functions"] {
  return {
    formatTitle: (scale, { date, activeRange, locale }) => {
      const opts = { locale }
      if (scale === "day") {
        return format(date, cfg.formats.dayTitle, opts)
      }
      if (scale === "month") {
        return format(date, cfg.formats.monthTitle, opts)
      }
      if (scale === "quarter") {
        return format(date, "QQQ yyyy", opts)
      }
      if (scale === "year") {
        return format(date, "yyyy", opts)
      }
      // week: smart range label, last day is activeRange.end - 1ms.
      // subMilliseconds keeps the zoned date type (a plain new Date(ms)
      // would flip the label to the machine zone near midnight)
      const rangeEnd = subMilliseconds(activeRange.end, 1)
      const start = activeRange.start
      if (isSameMonth(start, rangeEnd)) {
        return `${format(start, "MMMM d", opts)} - ${format(rangeEnd, "d, yyyy", opts)}`
      }
      if (isSameYear(start, rangeEnd)) {
        return `${format(start, "MMM d", opts)} - ${format(rangeEnd, "MMM d, yyyy", opts)}`
      }
      return `${format(start, "MMM d, yyyy", opts)} - ${format(rangeEnd, "MMM d, yyyy", opts)}`
    },
    formatEventTime: (start, end, allDay, locale) => {
      const opts = { locale }
      if (allDay) {
        // a gantt bar is a DATE RANGE: show it, never a bare "All day".
        // Ends are exclusive midnights, so the last shown day is end - 1ms;
        // subMilliseconds keeps the caller's zoned date type intact.
        const last =
          end.getTime() - 1 >= start.getTime() ? subMilliseconds(end, 1) : start
        const sameDay =
          format(start, "yyyy-MM-dd") === format(last, "yyyy-MM-dd")
        if (sameDay) return format(start, "MMM d, yyyy", opts)
        if (isSameYear(start, last)) {
          return `${format(start, "MMM d", opts)} - ${format(last, "MMM d, yyyy", opts)}`
        }
        return `${format(start, "MMM d, yyyy", opts)} - ${format(last, "MMM d, yyyy", opts)}`
      }
      const fmt = cfg.formats.eventTime
      // Multi-day timed events carry the date on both sides
      if (end.getTime() - start.getTime() > 24 * 60 * 60 * 1000) {
        return `${format(start, `MMM d, ${fmt}`, opts)} - ${format(end, `MMM d, ${fmt}`, opts)}`
      }
      return `${format(start, fmt, opts)} - ${format(end, fmt, opts)}`
    },
    formatDayRange: (range, locale) => {
      const opts = { locale }
      const rangeEnd = subMilliseconds(range.end, 1)
      return `${format(range.start, "MMM d", opts)} - ${format(rangeEnd, "MMM d", opts)}`
    },
    formatEventAriaLabel: ({
      title,
      timeLabel,
      rowTitle,
      progressLabel,
      continues,
    }) =>
      [
        title,
        timeLabel,
        rowTitle,
        progressLabel,
        continues ? cfg.labels.continues : undefined,
      ]
        .filter(Boolean)
        .join(", "),
  }
}

const DEFAULT_GANTT_I18N: GanttI18nConfig = {
  labels: DEFAULT_LABELS,
  formats: DEFAULT_FORMATS,
  functions: makeDefaultGanttFunctions({
    labels: DEFAULT_LABELS,
    formats: DEFAULT_FORMATS,
  }),
}

/** Deep-partial override shape: replace individual keys, never sections. */
interface GanttI18nOverrides {
  labels?: Partial<Omit<GanttI18nConfig["labels"], "scales">> & {
    scales?: Partial<GanttI18nConfig["labels"]["scales"]>
  }
  formats?: Partial<GanttI18nConfig["formats"]>
  functions?: Partial<GanttI18nConfig["functions"]>
}

/**
 * Shallow merge per nested object, matching the filters.tsx i18n contract:
 * a partial override replaces individual keys, never whole sections. Default
 * functions are re-bound to the MERGED labels/formats so a `formats` (or
 * `labels.continues`) override reaches the default renderers; explicit
 * `functions` overrides still win.
 */
function mergeGanttI18n(overrides?: GanttI18nOverrides): GanttI18nConfig {
  if (!overrides) return DEFAULT_GANTT_I18N
  const labels = {
    ...DEFAULT_LABELS,
    ...overrides.labels,
    // nested section: replace individual scale names, never the whole set
    scales: {
      ...DEFAULT_LABELS.scales,
      ...overrides.labels?.scales,
    },
  }
  const formats = { ...DEFAULT_FORMATS, ...overrides.formats }
  return {
    labels,
    formats,
    functions: {
      ...makeDefaultGanttFunctions({ labels, formats }),
      ...overrides.functions,
    },
  }
}

export { DEFAULT_GANTT_I18N, mergeGanttI18n }
export type { GanttI18nConfig, GanttI18nOverrides }
