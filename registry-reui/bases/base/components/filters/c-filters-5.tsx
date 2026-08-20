"use client"

import { useState, type ReactNode } from "react"
import { Filters } from "@/registry-reui/bases/base/reui/filters/filters"
import {
  formatFilterDate,
  parseFilterDate,
  resolveFilterDate,
  toFilterDateValue,
  type FilterDateValue,
} from "@/registry-reui/bases/base/reui/filters/filters-date"
import {
  createFilterQuery,
  createFilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-query"
import type {
  FilterEditorProps,
  FilterField,
  FilterOperator,
  FilterQuery,
} from "@/registry-reui/bases/base/reui/filters/filters-types"

import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Input } from "@/registry/bases/base/ui/input"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/**
 * One date value, or two.
 *
 * The tuple is what an `arity: "range"` operator carries, matching how every
 * other range in the primitive is stored: a plain array the host normalises to
 * `values` for free.
 */
type DateValue = FilterDateValue | [FilterDateValue, FilterDateValue]

const isRange = (
  value: DateValue | undefined
): value is [FilterDateValue, FilterDateValue] => Array.isArray(value)

/* -------------------------------------------------------------------------- */
/*                              Panel geometry                                */
/* -------------------------------------------------------------------------- */

/**
 * The grid IS the panel's width, and its height is the whole budget.
 *
 * The chip's value popover is `w-auto`, so whatever this editor measures, the
 * popover measures. An earlier version put a fixed `w-72` on the panel and left
 * the calendar at its natural size inside it, and a calendar is seven columns
 * of `--cell-size`: 224px in most styles, 196 in nova and lyra, 168 in mira,
 * never 288. So every style drew a strip of empty popover down one side of the
 * grid. The cell is PINNED here instead, so seven of them is a width this file
 * knows, and the calendar's own padding goes to zero because the panel already
 * carries some.
 *
 * The row gap is the height half, and it was the one that overflowed. The
 * shadcn calendar gives every week `mt-2`, so a 28px cell runs on a 36px pitch:
 * flush across, airy down, and six of those gaps are 48px of a popover that has
 * roughly 380 to spend before it flips up over the bar it is anchored to. The
 * two arbitrary variants below out-specify the defaults they replace (both are
 * a descendant selector against a bare utility class), so the grid tightens
 * without the primitive being touched. `tbody tr` rather than `.rdp-week`
 * because the table is the calendar's own markup, not a class name it happens
 * to carry.
 *
 * One constant, both panels: a single date and a range are the same grid at the
 * same density, and the range simply draws two of them.
 */
const DAY_GRID =
  "p-0 [--cell-size:--spacing(7)] [&_.rdp-month]:gap-2 [&_tbody_tr]:mt-1"

/* -------------------------------------------------------------------------- */
/*                                One date                                    */
/* -------------------------------------------------------------------------- */

/**
 * Two ways to say one day, and no third.
 *
 * A box that parses a phrase and a grid that takes a click. The panel used to
 * carry a Today / Yesterday pair under the grid as well, and both of those are
 * words the box above already understands, so the row was a third route to a
 * value that had two - and 44px of a popover that has to open inside the card
 * without covering the chip it belongs to. The placeholder is what carries the
 * vocabulary now, which is where a control's own instructions belong.
 */
function SingleDateBody({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  field,
}: FilterEditorProps<DateValue>) {
  const current = isRange(value) ? value[0] : value
  const [text, setText] = useState(() => formatFilterDate(current))
  const selected = resolveFilterDate(current) ?? undefined

  return (
    <div className="flex flex-col gap-2 p-2">
      <Input
        {...autoFocusProps}
        value={text}
        placeholder="today, next friday..."
        aria-label={field.label}
        onChange={(event) => {
          setText(event.target.value)
          // Null means nothing matched, so a half-typed phrase never wipes the
          // value the user already had.
          const parsed = parseFilterDate(event.target.value)
          if (parsed) onValueChange(parsed)
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            commit(parseFilterDate(text) ?? current)
          }
          if (event.key === "Escape") {
            event.preventDefault()
            event.stopPropagation()
            cancel()
          }
        }}
      />

      <Calendar
        mode="single"
        className={DAY_GRID}
        selected={selected}
        // `defaultMonth`, not `month`. A CONTROLLED month with no
        // `onMonthChange` beside it is a calendar whose arrows do nothing,
        // which is what this editor shipped with.
        defaultMonth={selected}
        // A day is a COMPLETE pick, so it commits rather than waiting for an
        // Apply. That is what lets this panel drop the confirm row the range
        // panel below keeps: both a typed phrase and a click on a day finish
        // the filter, so the only thing a footer would add here is a second way
        // to do what the click already did. Escape and a click outside still
        // leave without writing.
        onSelect={(date) => {
          if (date) commit(toFilterDateValue(date))
        }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Two dates                                   */
/* -------------------------------------------------------------------------- */

/** Relative on both ends, so a saved view keeps meaning "the last 7 days". */
const RANGE_PRESETS: [string, [FilterDateValue, FilterDateValue]][] = [
  [
    "Last 7 days",
    [
      { relative: { unit: "day", offset: -6 } },
      { relative: { unit: "day", offset: 0 } },
    ],
  ],
  [
    "Last 30 days",
    [
      { relative: { unit: "day", offset: -29 } },
      { relative: { unit: "day", offset: 0 } },
    ],
  ],
]

function DateRangeBody({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
}: FilterEditorProps<DateValue>) {
  const tuple = isRange(value) ? value : undefined
  const from = resolveFilterDate(tuple?.[0]) ?? undefined
  const to = resolveFilterDate(tuple?.[1]) ?? undefined

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="grid grid-cols-2 gap-1.5">
        {RANGE_PRESETS.map(([label, preset], index) => (
          <Button
            key={label}
            {...(index === 0 ? autoFocusProps : {})}
            variant="outline"
            size="sm"
            onClick={() => commit(preset)}
          >
            {label}
          </Button>
        ))}
      </div>

      <Calendar
        mode="range"
        numberOfMonths={2}
        className={DAY_GRID}
        selected={{ from, to }}
        defaultMonth={from}
        onSelect={(range) => {
          if (!range?.from) return
          onValueChange([
            toFilterDateValue(range.from),
            toFilterDateValue(range.to ?? range.from),
          ])
        }}
      />

      {/*
        A range keeps its confirm, for the reason the primitive's own range
        editor gives: it takes TWO clicks to say, and a panel that closed on the
        first one would commit a bound the user had not finished choosing. The
        rule is bled to the panel edge because a calendar sits above it.
      */}
      <div className="-mx-2 flex items-center justify-end gap-1.5 border-t px-2 pt-2">
        <Button variant="ghost" size="sm" onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size="sm" disabled={!tuple} onClick={() => commit()}>
          {labels.apply}
        </Button>
      </div>
    </div>
  )
}

/**
 * A date control the CONSUMER owns.
 *
 * The primitive deliberately ships no date editor: every product wants a
 * different one, and baking a half-opinionated calendar into the core would put
 * a date library in every install. An editor is a plain component that receives
 * the draft value, the chosen OPERATOR and what commit means, so this one reads
 * the operator's arity and shows one calendar or two without the primitive
 * knowing anything about dates.
 */
function DateEditor(props: FilterEditorProps<DateValue>) {
  return props.operator.arity === "range" ? (
    <DateRangeBody {...props} />
  ) : (
    <SingleDateBody {...props} />
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

/** Dates need their own operator set, since the core ships none. */
const dateOperators: FilterOperator[] = [
  { value: "is", label: "is", inverse: "is_not" },
  { value: "is_not", label: "is not", inverse: "is" },
  { value: "is_before", label: "is before", inverse: "is_on_or_after" },
  { value: "is_after", label: "is after", inverse: "is_on_or_before" },
  { value: "is_on_or_before", label: "is on or before", inverse: "is_after" },
  { value: "is_on_or_after", label: "is on or after", inverse: "is_before" },
  {
    value: "between",
    label: "is between",
    arity: "range",
    inverse: "not_between",
  },
  {
    value: "not_between",
    label: "is not between",
    arity: "range",
    inverse: "between",
  },
  { value: "empty", label: "is empty", arity: "none", inverse: "not_empty" },
  {
    value: "not_empty",
    label: "is not empty",
    arity: "none",
    inverse: "empty",
  },
]

/**
 * The value as one plain string. `renderValue` draws the chip, but the
 * ACCESSIBLE name falls back to `String(value)`, and a date token is an
 * object, so without this the chip announced "[object Object]" to exactly the
 * audience the visible phrase is hidden from. One function serves both hooks.
 */
const dateText = (
  value: unknown,
  valueRange: (from: string, to: string) => string
): string => {
  const typed = value as DateValue | undefined
  if (isRange(typed)) {
    return valueRange(formatFilterDate(typed[0]), formatFilterDate(typed[1]))
  }
  return formatFilterDate(typed) || "Select time"
}

/**
 * The icon arrives as an argument rather than being built inside.
 *
 * The shadcn CLI rewrites an `IconPlaceholder` attribute to a real import at
 * install time and only accepts string LITERALS, so the five names have to be
 * written out at the call site. Everything the two fields genuinely share - the
 * operator catalog, the editor, both value hooks - stays here.
 */
const dateField = (
  id: string,
  label: string,
  defaultOperator: string,
  icon: ReactNode
): FilterField => ({
  id,
  label,
  operators: dateOperators,
  defaultOperator,
  // A component, assignable directly: `FilterEditorRef` accepts a concrete
  // editor on an unknown-typed field.
  editor: DateEditor,
  // The chip shows the PHRASE, so "today" keeps saying today rather than
  // freezing to the day the filter was made.
  renderValue: ({ value, labels }) => dateText(value, labels.valueRange),
  // And the same phrase as TEXT, which is what the accessible names, the
  // titles and the advanced builder's cell read. Required alongside a
  // `renderValue` whenever the stored value does not stringify.
  valueText: ({ value, labels }) => dateText(value, labels.valueRange),
  icon,
})

// Two fields, one per control: the single picker opens on "is", the two-month
// picker on "is between". Either field reaches either control by changing the
// condition, which is the point of an editor that reads the operator's arity.
const fields: FilterField[] = [
  dateField(
    "createdAt",
    "Created",
    "is",
    <IconPlaceholder
      lucide="CalendarIcon"
      tabler="IconCalendar"
      hugeicons="Calendar03Icon"
      phosphor="CalendarBlankIcon"
      remixicon="RiCalendarLine"
    />
  ),
  dateField(
    "window",
    "Active window",
    "between",
    <IconPlaceholder
      lucide="CalendarRangeIcon"
      tabler="IconCalendarWeek"
      hugeicons="CalendarDaysIcon"
      phosphor="CalendarDotsIcon"
      remixicon="RiCalendar2Line"
    />
  ),
]

export default function Pattern() {
  const [query, setQuery] = useState<FilterQuery>(() =>
    createFilterQuery<unknown>([
      createFilterRule({
        id: "seed-1",
        path: ["window"],
        operator: "between",
        value: [
          { relative: { unit: "day", offset: -6 } },
          { relative: { unit: "day", offset: 0 } },
        ],
      }),
    ])
  )

  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  )
}
