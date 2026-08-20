"use client"

import { useState, type KeyboardEvent } from "react"
import { Filters } from "@/registry-reui/bases/radix/reui/filters/filters"
import {
  createFilterQuery,
  createFilterRule,
} from "@/registry-reui/bases/radix/reui/filters/filters-query"
import type {
  FilterEditorProps,
  FilterField,
  FilterQuery,
  FilterValueDisplayContext,
} from "@/registry-reui/bases/radix/reui/filters/filters-types"

import { Button } from "@/registry/bases/radix/ui/button"
import { Slider } from "@/registry/bases/radix/ui/slider"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/**
 * A field's bounds and its formatter, declared once.
 *
 * Three things measure against them - the thumb, the miniature rail the closed
 * chip draws, and the sentence the chip announces - so a scale that lived
 * inside the editor would let the other two be drawn against bounds the thumb
 * never moved in.
 */
type Scale = {
  min: number
  max: number
  step: number
  format: (value: number) => string
}

const SCORE: Scale = {
  min: 0,
  max: 100,
  step: 1,
  format: (value) => String(value),
}

const PRICE: Scale = {
  min: 0,
  max: 5000,
  step: 50,
  format: (value) => `$${value.toLocaleString()}`,
}

/**
 * A control with its own pointer model, as the value editor.
 *
 * The editor renders into a plain panel, never into a combobox, so a slider
 * keeps its own drag, its own arrow keys and its own focus ring. It receives
 * the shared services (`options`, `labels`) whether it uses them or not, and it
 * decides for itself what commit means: here the draft moves with the thumb and
 * only Apply writes it into the query, so a controlled parent is not asked to
 * re-render once per pixel.
 */
function makeSliderEditor({ min, max, step, format }: Scale) {
  function SliderEditor({
    value,
    onValueChange,
    commit,
    cancel,
    labels,
    field,
    operator,
    autoFocusProps,
  }: FilterEditorProps<number | number[]>) {
    // Arity decides the shape: a range operator carries two bounds, everything
    // else carries one. The same editor answers both, so a field does not need
    // a second component to be filtered "between 30 and 70".
    const dual = operator.arity === "range"
    const current = dual
      ? Array.isArray(value)
        ? (value as number[])
        : [min, max]
      : typeof value === "number"
        ? value
        : min

    const reading = dual
      ? labels.valueRange(
          format((current as number[])[0]),
          format((current as number[])[1])
        )
      : format(current as number)

    // On the slider rather than on the panel, and that is the whole of it: the
    // arrows are the thumb's, so Enter is free to mean Apply for the keyboard
    // user who is standing on it, while the footer's own buttons keep answering
    // their own Enter. Escape stops here too, so a dialog around the bar does
    // not close along with the popover.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault()
        commit(current)
        return
      }
      if (event.key !== "Escape") return
      event.preventDefault()
      event.stopPropagation()
      cancel()
    }

    return (
      // `gap-2 p-2` is the primitive's own editor panel, and the width sits in
      // the band its built-ins use (w-56 for a number, w-64 for text), so the
      // popover does not resize between a shipped editor and this one.
      <div className="flex w-64 flex-col gap-2 p-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground min-w-0 truncate text-xs font-medium">
            {field.label}
          </span>
          {/* The one dark thing in the panel: the number being edited. */}
          <span className="shrink-0 text-sm font-medium tabular-nums">
            {reading}
          </span>
        </div>

        {/*
          The bounds FLANK the track instead of sitting on a row of their own.
          They belong at the ends they name, the panel loses a row for it, and
          the only sizes left in the panel are then sm for the value and xs for
          everything that labels it.
        */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {format(min)}
          </span>
          <Slider
            {...autoFocusProps}
            className="min-w-0 flex-1"
            // An ARRAY even for the single-value operators. The shadcn Slider
            // counts its thumbs off the value it is handed, and a bare number is
            // not a list, so it fell back to `[min, max]` and drew a SECOND
            // thumb on top of the first: one slider with two tab stops, both
            // moving the same number.
            value={dual ? (current as number[]) : [current as number]}
            min={min}
            max={max}
            step={step}
            // How the value comes back is the whole of the twin difference.
            // Base UI types this callback as `number | readonly number[]`
            // whatever it was handed, so the base twin casts on the way back;
            // the Radix slider types it `number[]` and needs no assertion.
            // Either twin then digs the single thumb out of the array.
            onValueChange={(next) => onValueChange(dual ? next : next[0])}
            onKeyDown={onKeyDown}
          />
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {format(max)}
          </span>
        </div>

        <div className="flex items-center justify-end gap-1.5 pt-1">
          <Button variant="ghost" size="sm" onClick={cancel}>
            {labels.discard}
          </Button>
          <Button size="sm" onClick={() => commit(current)}>
            {labels.apply}
          </Button>
        </div>
      </div>
    )
  }

  return SliderEditor
}

/* -------------------------------------------------------------------------- */
/*                             The closed chip                                */
/* -------------------------------------------------------------------------- */

/** The selected span as a rail. `bg-muted` and `bg-primary` are the Slider's own. */
function MiniTrack({
  min,
  max,
  from,
  to,
}: {
  min: number
  max: number
  from: number
  to: number
}) {
  const span = max - min
  // Total on purpose: a restored query can hold whatever was persisted, and a
  // non-finite bound here would reach the style attribute as "left: NaN%".
  const at = (value: number) =>
    span <= 0 || !Number.isFinite(value)
      ? 0
      : Math.min(Math.max((value - min) / span, 0), 1)
  const start = at(from)
  const end = Math.max(start, at(to))

  return (
    <span
      aria-hidden="true"
      className="bg-muted relative inline-block h-1 w-8 shrink-0 rounded-full"
    >
      <span
        className="bg-primary absolute inset-y-0 rounded-full"
        style={{ left: `${start * 100}%`, right: `${(1 - end) * 100}%` }}
      />
    </span>
  )
}

/**
 * The one reading behind both halves of the chip.
 *
 * The rail is drawn from it and the accessible name is spoken from it, so the
 * parse that turns a stored value into a band happens once rather than twice
 * and the two cannot drift.
 *
 * The context is typed as the primitive hands it over, `unknown` value and all,
 * and narrowed here: declaring the parameter as the narrower shape would put a
 * contravariant function in a `renderValue` slot that promises to accept any
 * value.
 */
function readBand(
  { min, max, format }: Scale,
  { value, operator, labels }: FilterValueDisplayContext
) {
  if (Array.isArray(value)) {
    const from = Number(value[0])
    const to = Number(value[1])
    return { from, to, text: labels.valueRange(format(from), format(to)) }
  }
  if (typeof value !== "number") return null

  // Which side of the value the matching range lies on: "at least $1,500"
  // fills from the value up, "at most" fills from the floor to it.
  const upward = operator.value === "gte" || operator.value === "gt"
  return {
    from: upward ? value : min,
    to: upward ? max : value,
    text: format(value),
  }
}

/**
 * A slider readout on the chip, not just the number the slider produced.
 *
 * "$1,500" alone says nothing about where in the field's range the rule sits,
 * which is the one thing a slider is picked for, so the closed chip carries a
 * miniature of the control behind it and the scale that miniature is measured
 * against follows the value as SECONDARY text - the muted, smaller companion
 * the first example sets beside its stacked avatars. `renderValue` returns a
 * NODE, so all of it costs the primitive nothing.
 *
 * `valueText` is the same reading as a sentence, and it is supplied for a
 * reason: the built-in name is `String(value)`, which announces "1500" where
 * the chip shows "$1,500", so a field that formats its value owns the
 * accessible name too. The scale is left out of THAT half, because it describes
 * a miniature a screen reader user is not being shown.
 */
function makeSliderDisplay(scale: Scale, empty: string) {
  const { min, max, format } = scale

  return {
    renderValue: (context: FilterValueDisplayContext) => {
      const band = readBand(scale, context)
      if (!band) return empty

      return (
        <span className="flex items-center gap-1.5">
          <MiniTrack min={min} max={max} from={band.from} to={band.to} />
          <span className="flex items-baseline gap-1">
            <span className="tabular-nums">{band.text}</span>
            {/*
              Dropped when the value already names the ceiling ("0 to 100"), so
              no chip ever prints one number twice - the same restraint that
              keeps a "+2" off a stack showing every face it has. A slash rather
              than a word, so the secondary text needs no label to translate.
            */}
            {band.text.includes(format(max)) ? null : (
              <span className="text-muted-foreground text-xs tabular-nums">
                / {format(max)}
              </span>
            )}
          </span>
        </span>
      )
    },
    valueText: (context: FilterValueDisplayContext) =>
      readBand(scale, context)?.text ?? empty,
  }
}

const ScoreSlider = makeSliderEditor(SCORE)
const scoreDisplay = makeSliderDisplay(SCORE, "any score")

const PriceSlider = makeSliderEditor(PRICE)
const priceDisplay = makeSliderDisplay(PRICE, "any amount")

const fields: FilterField[] = [
  {
    id: "score",
    label: "Health score",
    type: "range",
    defaultOperator: "between",
    // A component, so no registration is needed. A string here would look the
    // editor up in the `editors` map instead, and a concrete editor assigns
    // directly: `FilterEditorRef` widens for it.
    editor: ScoreSlider,
    renderValue: scoreDisplay.renderValue,
    valueText: scoreDisplay.valueText,
    icon: (
      <IconPlaceholder
        lucide="ActivityIcon"
        tabler="IconActivity"
        hugeicons="PulseRectangle01Icon"
        phosphor="PulseIcon"
        remixicon="RiPulseLine"
      />
    ),
  },
  {
    id: "mrr",
    label: "Monthly spend",
    type: "number",
    // Single-value operators, so the same editor renders one thumb.
    defaultOperator: "gte",
    editor: PriceSlider,
    renderValue: priceDisplay.renderValue,
    valueText: priceDisplay.valueText,
    icon: (
      <IconPlaceholder
        lucide="BanknoteIcon"
        tabler="IconCash"
        hugeicons="MoneyBag02Icon"
        phosphor="MoneyIcon"
        remixicon="RiMoneyDollarCircleLine"
      />
    ),
  },
  {
    id: "account",
    label: "Account",
    type: "text",
    icon: (
      <IconPlaceholder
        lucide="Building2Icon"
        tabler="IconBuilding"
        hugeicons="Building02Icon"
        phosphor="BuildingsIcon"
        remixicon="RiBuilding2Line"
      />
    ),
  },
]

export default function Pattern() {
  const [query, setQuery] = useState<FilterQuery>(() =>
    createFilterQuery<unknown>([
      createFilterRule({
        id: "seed-1",
        path: ["score"],
        operator: "between",
        value: [30, 70],
      }),
    ])
  )

  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  )
}
