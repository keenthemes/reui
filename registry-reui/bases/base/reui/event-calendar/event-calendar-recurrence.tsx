// Title: Event Calendar Recurrence
// Description: RFC 5545 subset recurrence expansion for the event calendar - structured rules or raw RRULE strings, with a hard occurrence cap.

import type {
  CalendarEvent,
  EventCalendarDateRange,
  EventCalendarOccurrence,
  EventCalendarRecurrenceRule,
  EventCalendarWeekday,
} from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-types"
import { TZDate } from "@date-fns/tz"
import { addDays, addMonths, addWeeks, addYears } from "date-fns"

/** Guard: max window-intersecting occurrences per event per expansion. */
const MAX_OCCURRENCES = 1000

/** Runaway guard: absolute cap on period iterations regardless of visibility. */
const MAX_ITERATIONS = 10000

/** Gregorian mean period lengths for the O(1) fast-forward approximation. */
const PERIOD_MS: Record<EventCalendarRecurrenceRule["freq"], number> = {
  daily: 86400000,
  weekly: 604800000,
  monthly: 2629746000, // 365.2425 / 12 days
  yearly: 31556952000, // 365.2425 days
}

const WEEKDAYS: EventCalendarWeekday[] = [
  "SU",
  "MO",
  "TU",
  "WE",
  "TH",
  "FR",
  "SA",
]

class EventCalendarRecurrenceError extends Error {
  constructor(part: string) {
    super(
      `Unsupported recurrence part: ${part}. Use the getOccurrences prop to plug a full RRULE engine for exotic rules.`
    )
    this.name = "EventCalendarRecurrenceError"
  }
}

/**
 * Parses a raw RRULE line (with or without the "RRULE:" prefix) into the
 * structured subset. Pass the display time zone so Z-less UNTIL values are
 * interpreted as wall time in that zone rather than the machine zone.
 */
function parseRRuleString(
  input: string,
  timeZone?: string
): EventCalendarRecurrenceRule {
  const body = input.trim().replace(/^RRULE:/i, "")
  const rule: Partial<EventCalendarRecurrenceRule> = {}

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
          throw new EventCalendarRecurrenceError(`FREQ=${value}`)
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
          // RFC 5545 3.1: enumerated values are case-insensitive, and FREQ is
          // already folded above - rejecting "mo" here would be inconsistent
          const match = /^(-?\d+)?(SU|MO|TU|WE|TH|FR|SA)$/.exec(
            token.trim().toUpperCase()
          )
          if (!match) throw new EventCalendarRecurrenceError(`BYDAY=${token}`)
          const day = match[2] as EventCalendarWeekday
          return match[1] ? { day, ordinal: parseInt(match[1], 10) } : day
        })
        break
      case "BYMONTHDAY":
        rule.byMonthDay = value.split(",").map((v) => {
          const day = parseInt(v, 10)
          // NaN would survive parsing, match no day in any month and leave the
          // event permanently invisible with no error anywhere
          if (Number.isNaN(day)) {
            throw new EventCalendarRecurrenceError(`BYMONTHDAY=${v}`)
          }
          return day
        })
        break
      case "BYMONTH":
        rule.byMonth = value.split(",").map((v) => parseInt(v, 10))
        break
      case "WKST": {
        const day = value.trim().toUpperCase() as EventCalendarWeekday
        if (!WEEKDAYS.includes(day)) {
          throw new EventCalendarRecurrenceError(`WKST=${value}`)
        }
        rule.weekStart = day
        break
      }
      default:
        throw new EventCalendarRecurrenceError(key ?? pair)
    }
  }

  if (!rule.freq) throw new EventCalendarRecurrenceError("missing FREQ")
  return rule as EventCalendarRecurrenceRule
}

function parseRRuleDate(value: string, timeZone?: string): Date {
  // RFC 5545 basic formats: YYYYMMDD or YYYYMMDDTHHMMSS(Z). The T and Z
  // designators are case-insensitive too (RFC 5545 3.1), so fold before matching.
  const match = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(
    value.trim().toUpperCase()
  )
  if (!match) throw new EventCalendarRecurrenceError(`UNTIL=${value}`)
  const [, y, m, d, hh = "23", mm = "59", ss = "59", z] = match
  // Z-less values (including date-only ones, which mean end of that day
  // inclusive) are wall time in the display zone, not the machine zone.
  const date = z
    ? new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}Z`)
    : timeZone
      ? new Date(new TZDate(+y, +m - 1, +d, +hh, +mm, +ss, timeZone).getTime())
      : new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}`)
  if (Number.isNaN(date.getTime())) {
    throw new EventCalendarRecurrenceError(`UNTIL=${value}`)
  }
  return date
}

/** Serializes the structured subset back to an RRULE line (without prefix). */
function formatRRuleString(rule: EventCalendarRecurrenceRule): string {
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
  recurrence: EventCalendarRecurrenceRule | string,
  timeZone?: string
): EventCalendarRecurrenceRule {
  return typeof recurrence === "string"
    ? parseRRuleString(recurrence, timeZone)
    : recurrence
}

/**
 * Expands one event into its occurrences intersecting the range.
 * Non-recurring events yield at most one occurrence. Recurrence iteration is
 * wall-time based in the display zone (DST-safe day/week/month steps), and a
 * span that is a whole number of local days keeps that day count across a DST
 * transition (timed spans keep their absolute length instead).
 *
 * exDates remove exactly-matching instants (after COUNT numbering,
 * Google-style: an exception still consumes its COUNT slot); rDates add extra
 * instants with the same duration. RECURRENCE-ID override replacement lives
 * in buildEventIndex, where the override event and its parent series meet.
 */
function expandRecurrence<TData>(
  event: CalendarEvent<TData>,
  range: EventCalendarDateRange,
  ctx: { timeZone: string }
): EventCalendarOccurrence<TData>[] {
  const allDay = event.allDay ?? false

  if (!event.recurrence) {
    // The exclusive `end > start` test is right for anything with duration,
    // but it also drops a zero-length milestone pinned to the first visible
    // instant - which reads as an event that randomly disappears until you
    // page one period back. A point occurrence only has to be inside.
    const isPoint = event.end.getTime() === event.start.getTime()
    if (
      event.start < range.end &&
      (event.end > range.start || (isPoint && event.start >= range.start))
    ) {
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
  const interval = Math.max(1, rule.interval ?? 1)
  const durationMs = event.end.getTime() - event.start.getTime()
  const zonedStart = new TZDate(event.start.getTime(), ctx.timeZone)
  // A span of whole local days is wall time, not an absolute delta: a 3 day
  // all-day bar crossing spring forward would otherwise end at 01:00 and
  // occupy a fourth day in the month grid. Timed spans stay absolute so a two
  // hour meeting is still two hours.
  const daySpan = Math.round(durationMs / 86400000)
  const wallDaySpan =
    daySpan > 0 &&
    addDays(zonedStart, daySpan).getTime() === event.end.getTime()
      ? daySpan
      : null
  const endFor = (start: Date): Date =>
    wallDaySpan === null
      ? new Date(start.getTime() + durationMs)
      : new Date(
          addDays(
            new TZDate(start.getTime(), ctx.timeZone),
            wallDaySpan
          ).getTime()
        )
  // Excluded instants matched exactly; filtering happens at push time so an
  // exception still consumes its COUNT slot (Google-style numbering).
  const exTimes = new Set((rule.exDates ?? []).map((d) => d.getTime()))

  const weeklyDays: number[] | null =
    rule.freq === "weekly" && rule.byWeekday?.length
      ? [
          ...new Set(
            rule.byWeekday.map((d) => {
              if (typeof d !== "string") {
                throw new EventCalendarRecurrenceError(
                  "BYDAY ordinal outside monthly/yearly"
                )
              }
              return WEEKDAYS.indexOf(d)
            })
          ),
        ]
      : null

  // BYDAY resolved inside a month: monthly, and yearly within each BYMONTH
  // (FREQ=YEARLY;BYMONTH=11;BYDAY=4TH is Thanksgiving, not "the anchor's day")
  const monthlyByDay =
    (rule.freq === "monthly" || rule.freq === "yearly") &&
    rule.byWeekday?.length
      ? rule.byWeekday
      : null

  // RFC 5545 3.3.10 week numbering: with INTERVAL > 1 the week start decides
  // which selected days share a period, so an ignored WKST puts half of every
  // biweekly series a week off. Default MO, per the RFC.
  const weekStartIndex = WEEKDAYS.indexOf(rule.weekStart ?? "MO")
  /** Days from the WKST-aligned week start to `day` (0-6). */
  const fromWeekStart = (day: number) => (day - weekStartIndex + 7) % 7

  // yearly BYMONTH filter (1-12), ascending; defaults to the anchor's month
  const validByMonth = rule.byMonth?.filter((m) => m >= 1 && m <= 12) ?? []
  const yearlyMonths: number[] =
    validByMonth.length > 0
      ? [...new Set(validByMonth)].sort((a, b) => a - b)
      : [zonedStart.getMonth() + 1]

  // month-shaped BY* parts make the per-period occurrence count variable
  const hasMonthDayParts =
    (rule.freq === "monthly" &&
      Boolean(rule.byMonthDay?.length || monthlyByDay)) ||
    (rule.freq === "yearly" &&
      Boolean(rule.byMonth?.length || rule.byMonthDay?.length || monthlyByDay))

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate()

  // RFC 5545 3.3.10 LIMIT filters: at these frequencies a BY* part narrows the
  // set instead of reshaping it. Dropping them silently expanded the series as
  // if the part were absent (FREQ=DAILY;BYDAY=MO filled every day). Filtering
  // here rather than at push time keeps COUNT numbering RFC-correct: a
  // candidate the filter removes is not an occurrence and consumes no slot.
  const limitByMonth =
    rule.freq !== "yearly" && validByMonth.length > 0 ? validByMonth : null
  const limitByMonthDay =
    rule.freq === "daily" && rule.byMonthDay?.length ? rule.byMonthDay : null
  const limitByWeekday =
    rule.freq === "daily" && rule.byWeekday?.length
      ? rule.byWeekday.map((d) =>
          WEEKDAYS.indexOf(typeof d === "string" ? d : d.day)
        )
      : null
  const hasLimits = Boolean(limitByMonth || limitByMonthDay || limitByWeekday)

  const passesLimits = (candidate: TZDate): boolean => {
    if (limitByMonth && !limitByMonth.includes(candidate.getMonth() + 1)) {
      return false
    }
    if (limitByWeekday && !limitByWeekday.includes(candidate.getDay())) {
      return false
    }
    if (limitByMonthDay) {
      const total = daysInMonth(candidate.getFullYear(), candidate.getMonth())
      const day = candidate.getDate()
      // negative BYMONTHDAY counts back from month end, as in monthDays
      if (!limitByMonthDay.some((n) => (n < 0 ? total + 1 + n : n) === day)) {
        return false
      }
    }
    return true
  }

  /** Wall-clock instant in the display zone carrying DTSTART's time-of-day. */
  const zonedDate = (year: number, month: number, day: number) =>
    new TZDate(
      year,
      month,
      day,
      zonedStart.getHours(),
      zonedStart.getMinutes(),
      zonedStart.getSeconds(),
      zonedStart.getMilliseconds(),
      ctx.timeZone
    )

  /** Selected days-of-month, ascending: BYMONTHDAY (and) BYDAY, else the clamped anchor day. */
  const monthDays = (year: number, month: number): number[] => {
    const total = daysInMonth(year, month)
    let days: number[] | null = null
    if (rule.byMonthDay?.length) {
      // negative BYMONTHDAY counts back from month end; nonexistent days skip
      days = rule.byMonthDay
        .map((n) => (n < 0 ? total + 1 + n : n))
        .filter((n) => n >= 1 && n <= total)
    }
    if (monthlyByDay) {
      const byDayMatches: number[] = []
      for (const entry of monthlyByDay) {
        const day = typeof entry === "string" ? entry : entry.day
        const ordinal = typeof entry === "string" ? 0 : entry.ordinal
        const weekday = WEEKDAYS.indexOf(day)
        const matches: number[] = []
        for (let d = 1; d <= total; d++) {
          if (new Date(year, month, d).getDay() === weekday) matches.push(d)
        }
        if (ordinal === 0) {
          byDayMatches.push(...matches) // plain BYDAY: every matching weekday
        } else {
          // 2TU = 2nd Tuesday, -1FR = last Friday; absent ordinals skip
          const pick =
            ordinal > 0
              ? matches[ordinal - 1]
              : matches[matches.length + ordinal]
          if (pick !== undefined) byDayMatches.push(pick)
        }
      }
      days = days ? days.filter((n) => byDayMatches.includes(n)) : byDayMatches
    }
    if (!days) days = [Math.min(zonedStart.getDate(), total)] // clamp to month end
    return [...new Set(days)].sort((a, b) => a - b)
  }

  /** Chronological candidates of one period, derived from the DTSTART anchor by index (no drift). */
  const periodCandidates = (period: number): TZDate[] => {
    if (rule.freq === "daily") return [addDays(zonedStart, period * interval)]
    if (rule.freq === "weekly") {
      const base = addWeeks(zonedStart, period * interval)
      if (!weeklyDays) return [base]
      const week: TZDate[] = []
      // walk the WKST-aligned week so candidates stay chronological
      const baseOffset = fromWeekStart(base.getDay())
      for (let offset = 0; offset < 7; offset++) {
        const candidate = addDays(base, offset - baseOffset)
        if (!weeklyDays.includes(candidate.getDay())) continue
        // days of the DTSTART week before DTSTART are not part of the series
        if (candidate.getTime() < zonedStart.getTime()) continue
        week.push(candidate)
      }
      return week
    }
    if (rule.freq === "monthly") {
      const anchor = addMonths(zonedStart, period * interval)
      const year = anchor.getFullYear()
      const month = anchor.getMonth()
      return monthDays(year, month)
        .map((day) => zonedDate(year, month, day))
        .filter((c) => c.getTime() >= zonedStart.getTime())
    }
    // yearly
    const year = addYears(zonedStart, period * interval).getFullYear()
    const dates: TZDate[] = []
    for (const month of yearlyMonths) {
      for (const day of monthDays(year, month - 1)) {
        dates.push(zonedDate(year, month - 1, day))
      }
    }
    return dates.filter((c) => c.getTime() >= zonedStart.getTime())
  }

  /** Candidates of one period with the LIMIT filters applied. */
  const candidatesFor = (period: number): TZDate[] =>
    hasLimits
      ? periodCandidates(period).filter(passesLimits)
      : periodCandidates(period)

  /** Earliest/latest instant a period can produce - loop bounds without expanding it. */
  const periodEdge = (period: number, edge: "first" | "last"): TZDate => {
    if (rule.freq === "daily") return addDays(zonedStart, period * interval)
    if (rule.freq === "weekly") {
      const base = addWeeks(zonedStart, period * interval)
      if (!weeklyDays) return base
      return addDays(
        base,
        (edge === "first" ? 0 : 6) - fromWeekStart(base.getDay())
      )
    }
    if (rule.freq === "monthly") {
      const anchor = addMonths(zonedStart, period * interval)
      const year = anchor.getFullYear()
      const month = anchor.getMonth()
      return zonedDate(
        year,
        month,
        edge === "first" ? 1 : daysInMonth(year, month)
      )
    }
    const year = addYears(zonedStart, period * interval).getFullYear()
    const month =
      (edge === "first"
        ? yearlyMonths[0]
        : yearlyMonths[yearlyMonths.length - 1]) - 1
    return zonedDate(
      year,
      month,
      edge === "first" ? 1 : daysInMonth(year, month)
    )
  }

  // O(1) fast-forward: land a couple of periods before the window instead of
  // iterating from DTSTART, so years-old series still reach the visible range.
  const aheadMs = range.start.getTime() - durationMs - zonedStart.getTime()
  const stepMs = PERIOD_MS[rule.freq] * interval
  let startPeriod =
    aheadMs > 0 ? Math.max(0, Math.floor(aheadMs / stepMs) - 2) : 0
  // mean-length drift is bounded well under one period - refine forward
  while (
    periodEdge(startPeriod, "last").getTime() + durationMs <=
    range.start.getTime()
  ) {
    startPeriod++
  }

  // series ordinal at startPeriod, so COUNT and recurrenceIndex stay exact
  let index = 0
  if (startPeriod > 0) {
    if (hasMonthDayParts || hasLimits) {
      // per-period counts vary (skipped days, 4-vs-5 weekday months, a LIMIT
      // filter that empties a whole period) - sum them
      for (let period = 0; period < startPeriod; period++) {
        index += candidatesFor(period).length
      }
    } else if (weeklyDays) {
      // week 0 only counts selected weekdays at/after DTSTART's, inside the
      // WKST-aligned week that holds it
      const anchorOffset = fromWeekStart(zonedStart.getDay())
      const firstWeek = weeklyDays.filter(
        (d) => fromWeekStart(d) >= anchorOffset
      ).length
      index = firstWeek + (startPeriod - 1) * weeklyDays.length
    } else {
      index = startPeriod // one occurrence per period
    }
  }

  const occurrences: EventCalendarOccurrence<TData>[] = []

  const pushIfVisible = (rawStart: Date) => {
    // normalize to a plain instant so consumers never receive zone-carrying
    // TZDate instances (mixed-zone formatting bugs)
    const start = new Date(rawStart.getTime())
    if (exTimes.has(start.getTime())) return
    const end = endFor(start)
    if (start < range.end && end > range.start) {
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

  let iterations = 0
  let period = startPeriod
  while (iterations < MAX_ITERATIONS && occurrences.length < MAX_OCCURRENCES) {
    iterations++
    if (rule.count !== undefined && index >= rule.count) break
    // whole-period bounds: never break on a mid-period weekday/day-of-month,
    // so earlier candidates of the final period are still emitted
    const earliest = periodEdge(period, "first")
    if (earliest.getTime() >= range.end.getTime()) break
    if (rule.until && earliest.getTime() > rule.until.getTime()) break

    let ended = false
    for (const candidate of candidatesFor(period)) {
      if (rule.count !== undefined && index >= rule.count) {
        ended = true
        break
      }
      if (rule.until && candidate.getTime() > rule.until.getTime()) {
        ended = true
        break
      }
      pushIfVisible(candidate)
      index++
      if (occurrences.length >= MAX_OCCURRENCES) {
        ended = true
        break
      }
    }
    if (ended) break
    period++
  }

  // RDATE: extra instants join the set (deduped against generated starts and
  // exclusions) with the same wall-time duration. Sorted so direct consumers
  // still receive chronological order (buildEventIndex re-sorts regardless).
  if (rule.rDates?.length) {
    const seen = new Set(occurrences.map((o) => o.start.getTime()))
    for (const rDate of rule.rDates) {
      const start = new Date(rDate.getTime())
      if (seen.has(start.getTime()) || exTimes.has(start.getTime())) continue
      const end = endFor(start)
      if (start >= range.end || end <= range.start) continue
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
        // would fall back to undefined and break any consumer that identifies
        // an instance by its position in the series
        recurrenceIndex: index++,
      })
    }
    occurrences.sort((a, b) => a.start.getTime() - b.start.getTime())
  }

  return occurrences
}

export {
  EventCalendarRecurrenceError,
  expandRecurrence,
  formatRRuleString,
  MAX_OCCURRENCES,
  parseRRuleString,
}
