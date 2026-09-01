// Title: Gantt Recurrence
// Description: RFC 5545 subset recurrence expansion for the event calendar - structured rules or raw RRULE strings, with a hard occurrence cap.

import type {
  GanttDateRange,
  GanttEvent,
  GanttOccurrence,
  GanttRecurrenceRule,
  GanttWeekday,
} from "@/registry-reui/bases/radix/reui/gantt/gantt-types"
import { TZDate } from "@date-fns/tz"
import { addDays, addMonths, addWeeks, addYears } from "date-fns"

/** Guard: max occurrences per event per expansion. */
const MAX_OCCURRENCES = 1000

const WEEKDAYS: GanttWeekday[] = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]

class GanttRecurrenceError extends Error {
  constructor(part: string) {
    super(
      `Unsupported recurrence part: ${part}. Use the getOccurrences prop to plug a full RRULE engine for exotic rules.`
    )
    this.name = "GanttRecurrenceError"
  }
}

/**
 * Parses a raw RRULE line (with or without the "RRULE:" prefix) into the
 * structured subset. Pass the display time zone so a floating UNTIL
 * (no trailing Z) resolves there instead of in the runtime's local zone.
 */
function parseRRuleString(
  input: string,
  timeZone?: string
): GanttRecurrenceRule {
  const body = input.trim().replace(/^RRULE:/i, "")
  const rule: Partial<GanttRecurrenceRule> = {}

  for (const pair of body.split(";")) {
    if (!pair) continue
    const [rawKey, rawValue] = pair.split("=")
    const key = rawKey?.toUpperCase()
    const value = rawValue ?? ""

    switch (key) {
      case "FREQ": {
        const freq = value.toLowerCase()
        if (
          freq !== "daily" &&
          freq !== "weekly" &&
          freq !== "monthly" &&
          freq !== "yearly"
        ) {
          throw new GanttRecurrenceError(`FREQ=${value}`)
        }
        rule.freq = freq
        break
      }
      case "INTERVAL":
        rule.interval = Math.max(1, parseInt(value, 10) || 1)
        break
      case "COUNT":
        rule.count = Math.max(1, parseInt(value, 10) || 1)
        break
      case "UNTIL":
        rule.until = parseRRuleDate(value, timeZone)
        break
      case "BYDAY":
        rule.byWeekday = value.split(",").map((token) => {
          const match = /^(-?\d+)?(SU|MO|TU|WE|TH|FR|SA)$/.exec(token.trim())
          if (!match) throw new GanttRecurrenceError(`BYDAY=${token}`)
          const day = match[2] as GanttWeekday
          return match[1] ? { day, ordinal: parseInt(match[1], 10) } : day
        })
        break
      case "BYMONTHDAY":
        rule.byMonthDay = value.split(",").map((v) => parseInt(v, 10))
        break
      case "BYMONTH":
        rule.byMonth = value.split(",").map((v) => parseInt(v, 10))
        break
      case "WKST": {
        if (!WEEKDAYS.includes(value as GanttWeekday)) {
          throw new GanttRecurrenceError(`WKST=${value}`)
        }
        rule.weekStart = value as GanttWeekday
        break
      }
      default:
        throw new GanttRecurrenceError(key ?? pair)
    }
  }

  if (!rule.freq) throw new GanttRecurrenceError("missing FREQ")
  return rule as GanttRecurrenceRule
}

function parseRRuleDate(value: string, timeZone?: string): Date {
  // RFC 5545 basic formats: YYYYMMDD or YYYYMMDDTHHMMSS(Z)
  const match = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(
    value
  )
  if (!match) throw new GanttRecurrenceError(`UNTIL=${value}`)
  const [, y, m, d, hh = "23", mm = "59", ss = "59", z] = match
  // Floating (non-Z) boundaries resolve in the DISPLAY zone when known -
  // local-zone parsing would shift the series end per visitor machine.
  const date =
    !z && timeZone
      ? new TZDate(+y, +m - 1, +d, +hh, +mm, +ss, timeZone)
      : new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}${z ? "Z" : ""}`)
  if (Number.isNaN(date.getTime())) {
    throw new GanttRecurrenceError(`UNTIL=${value}`)
  }
  return new Date(date.getTime())
}

/** Serializes the structured subset back to an RRULE line (without prefix). */
function formatRRuleString(rule: GanttRecurrenceRule): string {
  const parts: string[] = [`FREQ=${rule.freq.toUpperCase()}`]
  if (rule.interval && rule.interval > 1)
    parts.push(`INTERVAL=${rule.interval}`)
  if (rule.count) parts.push(`COUNT=${rule.count}`)
  if (rule.until) {
    const u = rule.until
    const pad = (n: number) => String(n).padStart(2, "0")
    parts.push(
      `UNTIL=${u.getUTCFullYear()}${pad(u.getUTCMonth() + 1)}${pad(u.getUTCDate())}T${pad(u.getUTCHours())}${pad(u.getUTCMinutes())}${pad(u.getUTCSeconds())}Z`
    )
  }
  if (rule.byWeekday?.length) {
    parts.push(
      `BYDAY=${rule.byWeekday
        .map((d) => (typeof d === "string" ? d : `${d.ordinal}${d.day}`))
        .join(",")}`
    )
  }
  if (rule.byMonthDay?.length)
    parts.push(`BYMONTHDAY=${rule.byMonthDay.join(",")}`)
  if (rule.byMonth?.length) parts.push(`BYMONTH=${rule.byMonth.join(",")}`)
  if (rule.weekStart) parts.push(`WKST=${rule.weekStart}`)
  return parts.join(";")
}

function resolveRule(
  recurrence: GanttRecurrenceRule | string,
  timeZone?: string
): GanttRecurrenceRule {
  return typeof recurrence === "string"
    ? parseRRuleString(recurrence, timeZone)
    : recurrence
}

/**
 * Expands one event into its occurrences intersecting the range.
 * Non-recurring events yield at most one occurrence. Recurrence iteration is
 * wall-time based in the display zone (DST-safe day/week/month steps).
 *
 * Supported subset: FREQ daily/weekly/monthly/yearly, INTERVAL, COUNT, UNTIL,
 * weekly BYDAY (no ordinals). Parsed-but-unimplemented filters (BYMONTHDAY,
 * BYMONTH, BYDAY outside weekly) throw a GanttRecurrenceError instead of
 * silently mis-expanding; plug the getOccurrences prop for a full engine.
 * WKST parses and round-trips; week emission is Sunday-anchored.
 *
 * exDates remove exactly-matching instants (after COUNT numbering,
 * Google-style: an exception still consumes its COUNT slot); rDates add extra
 * instants with the same duration. RECURRENCE-ID override replacement lives
 * in buildEventIndex, where the override event and its parent series meet.
 */
function expandRecurrence<TData>(
  event: GanttEvent<TData>,
  range: GanttDateRange,
  ctx: { timeZone: string }
): GanttOccurrence<TData>[] {
  const allDay = event.allDay ?? false

  if (!event.recurrence) {
    // Same rule as occurrenceIntersects in gantt-lib, inlined (importing it
    // back would cycle the modules): half-open, except a zero-length
    // milestone sitting exactly on the range start stays visible.
    const visible =
      event.end.getTime() === event.start.getTime()
        ? event.start >= range.start && event.start < range.end
        : event.start < range.end && event.end > range.start
    if (visible) {
      return [
        {
          key: `${event.id}::${event.start.toISOString()}`,
          eventId: event.id,
          event,
          start: event.start,
          end: event.end,
          allDay,
          isRecurring: false,
        },
      ]
    }
    return []
  }

  const rule = resolveRule(event.recurrence, ctx.timeZone)
  // Loud contract: silently ignoring a filter would emit WRONG occurrences.
  if (rule.byMonthDay?.length) throw new GanttRecurrenceError("BYMONTHDAY")
  if (rule.byMonth?.length) throw new GanttRecurrenceError("BYMONTH")
  if (rule.byWeekday?.length && rule.freq !== "weekly") {
    throw new GanttRecurrenceError("BYDAY outside FREQ=WEEKLY")
  }
  const interval = Math.max(1, rule.interval ?? 1)
  const durationMs = event.end.getTime() - event.start.getTime()
  const zonedStart = new TZDate(event.start.getTime(), ctx.timeZone)
  // Excluded instants matched exactly; filtering happens at push time so an
  // exception still consumes its COUNT slot (Google-style numbering).
  const exTimes = new Set((rule.exDates ?? []).map((d) => d.getTime()))

  const weeklyDays: number[] | null =
    rule.freq === "weekly" && rule.byWeekday?.length
      ? rule.byWeekday.map((d) => {
          if (typeof d !== "string") {
            throw new GanttRecurrenceError(
              "BYDAY ordinal outside monthly/yearly"
            )
          }
          return WEEKDAYS.indexOf(d)
        })
      : null

  const occurrences: GanttOccurrence<TData>[] = []
  let produced = 0
  let index = 0
  let cursor = zonedStart

  const advance = (from: TZDate, steps: number): TZDate =>
    rule.freq === "daily"
      ? addDays(from, steps * interval)
      : rule.freq === "weekly"
        ? addWeeks(from, steps * interval)
        : rule.freq === "monthly"
          ? addMonths(from, steps * interval)
          : addYears(from, steps * interval)

  // Fast-forward past periods entirely before the range: they produce
  // nothing and must not consume the occurrence cap (an old-enough daily
  // series would otherwise exhaust MAX_OCCURRENCES before reaching the
  // window and silently vanish). COUNT rules jump too: the skipped periods
  // are credited to `index`, which is what terminates the series, so the
  // count still ends it on exactly the right instant. Leaving them on full
  // iteration would hide any series whose count exceeds MAX_OCCURRENCES.
  //
  // Daily and weekly ONLY. Their step is a fixed wall-time length, so one jump
  // of N steps lands exactly where N single steps land. addMonths/addYears
  // CLAMP instead: a Jan 31 monthly anchor steps to Feb 28 and never returns to
  // the 31st, while a single jump from the anchor clamps at most once. Jumping
  // those would make the same occurrence render on a different day depending on
  // which window the viewer scrolled in from, so they always iterate.
  const canFastForward = rule.freq === "daily" || rule.freq === "weekly"
  // weekly BYDAY emits across the cursor's whole Sunday week
  const weekSlackMs = weeklyDays ? 6 * 86_400_000 : 0
  // divide by the LONGEST possible step so the jump can never overshoot
  const maxStepMs =
    (rule.freq === "daily"
      ? 24
      : rule.freq === "weekly"
        ? 7 * 24
        : rule.freq === "monthly"
          ? 31 * 24
          : 366 * 24) *
      3_600_000 *
      interval +
    3_600_000
  for (let pass = 0; canFastForward && pass < 2; pass++) {
    const gap =
      range.start.getTime() - durationMs - weekSlackMs - cursor.getTime()
    const skip = Math.floor(gap / maxStepMs)
    if (skip <= 0) break
    cursor = advance(cursor, skip)
    index += skip * (weeklyDays ? weeklyDays.length : 1)
  }
  // close the remainder step by step (bounded by the jump math)
  let guard = 0
  while (
    guard++ < 10_000 &&
    !(rule.until && cursor.getTime() > rule.until.getTime()) &&
    cursor.getTime() + durationMs + weekSlackMs < range.start.getTime()
  ) {
    cursor = advance(cursor, 1)
    index += weeklyDays ? weeklyDays.length : 1
  }
  // The jump credits a whole week of selected days per skipped week, but full
  // iteration never counts the selected days that fall BEFORE the anchor
  // inside the anchor's own week. Drop them once so both paths number the
  // same instant identically (index counts occurrences at or after the
  // anchor, and only those).
  if (weeklyDays && index > 0) {
    index -= weeklyDays.filter((day) => day < zonedStart.getDay()).length
  }

  const pushIfVisible = (rawStart: Date) => {
    // normalize to a plain instant so consumers never receive zone-carrying
    // TZDate instances (mixed-zone formatting bugs)
    const start = new Date(rawStart.getTime())
    if (exTimes.has(start.getTime())) return
    const end = new Date(start.getTime() + durationMs)
    // zero-length instances (milestones) keep the closed-start visibility
    // rule; see the non-recurring branch above
    const visible =
      durationMs === 0
        ? start >= range.start && start < range.end
        : start < range.end && end > range.start
    if (visible) {
      occurrences.push({
        key: `${event.id}::${start.toISOString()}`,
        eventId: event.id,
        event,
        start,
        end,
        allDay,
        isRecurring: true,
        recurrenceIndex: index,
      })
    }
  }

  while (produced < MAX_OCCURRENCES) {
    if (rule.until && cursor.getTime() > rule.until.getTime()) break
    // COUNT is series-absolute, so it reads `index` (the position in the
    // series, fast-forward included) rather than `produced` (emissions in
    // this loop, which MAX_OCCURRENCES caps).
    if (rule.count !== undefined && index >= rule.count) break
    // Past the visible window with no count to honor - stop iterating. For
    // weekly BYDAY the WEEK START decides: selected days earlier in the
    // anchor's week can still fall before range.end.
    const horizonMs = weeklyDays
      ? addDays(cursor, -cursor.getDay()).getTime()
      : cursor.getTime()
    if (horizonMs >= range.end.getTime() && rule.count === undefined) {
      break
    }

    if (rule.freq === "weekly" && weeklyDays) {
      // Emit each selected weekday within the cursor's week
      for (let d = 0; d < 7; d++) {
        const candidate = addDays(cursor, d - cursor.getDay())
        if (!weeklyDays.includes(candidate.getDay())) continue
        if (candidate.getTime() < zonedStart.getTime()) continue
        if (rule.until && candidate.getTime() > rule.until.getTime()) continue
        // the cap is checked here too, or a week that crosses it mid-loop
        // still emits its remaining selected days
        if (produced >= MAX_OCCURRENCES) break
        if (rule.count !== undefined && index >= rule.count) break
        pushIfVisible(candidate)
        produced++
        index++
      }
    } else {
      pushIfVisible(cursor)
      produced++
      index++
    }

    cursor = advance(cursor, 1)
  }

  // RDATE: extra instants join the set (deduped against generated starts and
  // exclusions) with the same wall-time duration. Sorted so direct consumers
  // still receive chronological order (buildEventIndex re-sorts regardless).
  if (rule.rDates?.length) {
    const seen = new Set(occurrences.map((o) => o.start.getTime()))
    for (const rDate of rule.rDates) {
      const start = new Date(rDate.getTime())
      if (seen.has(start.getTime()) || exTimes.has(start.getTime())) continue
      const end = new Date(start.getTime() + durationMs)
      // mirrored visibility rule: zero-length RDATEs stay closed at the start
      const hidden =
        durationMs === 0
          ? start < range.start || start >= range.end
          : start >= range.end || end <= range.start
      if (hidden) continue
      seen.add(start.getTime())
      occurrences.push({
        key: `${event.id}::${start.toISOString()}`,
        eventId: event.id,
        event,
        start,
        end,
        allDay,
        isRecurring: true,
        // keep counting past the generated instants: an RDATE with no index
        // would fall back to 0 and collide with the series' first occurrence
        // in any consumer that identifies an instance by its position
        recurrenceIndex: index++,
      })
    }
    occurrences.sort((a, b) => a.start.getTime() - b.start.getTime())
  }

  return occurrences
}

export {
  GanttRecurrenceError,
  expandRecurrence,
  formatRRuleString,
  MAX_OCCURRENCES,
  parseRRuleString,
}
