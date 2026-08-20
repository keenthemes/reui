"use client"

import { useId, useState, type KeyboardEvent, type ReactNode } from "react"
import { Filters } from "@/registry-reui/bases/base/reui/filters/filters"
import {
  createFilterQuery,
  createFilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-query"
import type {
  FilterEditorProps,
  FilterField,
  FilterQuery,
} from "@/registry-reui/bases/base/reui/filters/filters-types"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Input } from "@/registry/bases/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/base/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/bases/base/ui/input-otp"
import { Textarea } from "@/registry/bases/base/ui/textarea"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const asArray = (value: unknown): string[] =>
  Array.isArray(value) ? (value as string[]) : []

const toNumber = (raw: string): number | undefined => {
  const parsed = Number(raw.replace(/,/g, ""))
  return raw.trim() === "" || Number.isNaN(parsed) ? undefined : parsed
}

/**
 * One panel width for the whole example, and it is the shipped text editor's.
 *
 * These four editors replace built-in ones, so they are measured against them
 * rather than against each other: `w-64` is what `FilterTextEditor` sizes its
 * panel to, and a bar whose custom editors each picked their own width would
 * resize its popover every time a different chip was opened. The access code
 * editor below is the one exception, and it says why.
 */
const PANEL = "flex w-64 flex-col gap-2 p-2"

/** The footer the shipped editors draw, to the pixel. */
const FOOTER = "flex items-center justify-end gap-1.5 pt-1"

/** A helper line under a control. Carries the error wording too. */
const HELPER = "text-muted-foreground text-xs"

/* -------------------------------------------------------------------------- */
/*                              Money, one or two                             */
/* -------------------------------------------------------------------------- */

/**
 * An input group carrying the unit, so the value never has to.
 *
 * Storing "$1,200/mo" would make every consumer parse the display back out
 * again. The currency and the period are ADDONS instead: the input holds a bare
 * number, the group says what the number means, and the chip's `renderValue`
 * puts the symbol back for reading.
 *
 * One editor answers both arities. `range` renders two groups joined by
 * `rangeSeparator`, which is the word `valueRange` puts between the bounds on
 * the chip, so the editor and the chip read as one sentence. It used to say
 * `and`, and the chip has never said that.
 */
function AmountEditor({
  value,
  onValueChange,
  commit,
  cancel,
  labels,
  field,
  operator,
  autoFocusProps,
}: FilterEditorProps<number | number[]>) {
  const dual = operator.arity === "range"
  const tuple = Array.isArray(value) ? (value as number[]) : []
  const single = typeof value === "number" ? value : undefined

  const [from, setFrom] = useState(() =>
    dual ? String(tuple[0] ?? "") : String(single ?? "")
  )
  const [to, setTo] = useState(() => (dual ? String(tuple[1] ?? "") : ""))

  // Takes both halves rather than reading state, because a change handler runs
  // BEFORE its own setState lands: deriving the draft from `from` inside the
  // `from` handler would publish the previous keystroke every time.
  const draft = (low: string, high: string): number | number[] | undefined => {
    if (!dual) return toNumber(low)
    const start = toNumber(low)
    const end = toNumber(high)
    return start === undefined || end === undefined ? undefined : [start, end]
  }

  const money = (children: ReactNode) => (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      {children}
      <InputGroupAddon align="inline-end">
        {/* No type overrides on either addon: `InputGroupText` is already the
            muted, input-sized treatment, and shrinking one of the two made the
            unit read as a footnote beside its own currency. */}
        <InputGroupText>/mo</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      commit(draft(from, to))
    }
    if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      cancel()
    }
  }

  return (
    <div className={PANEL}>
      {money(
        <InputGroupInput
          {...(autoFocusProps as object)}
          inputMode="decimal"
          value={from}
          // `rangeFrom` and `rangeTo`, not a composed `${label} from`: the two
          // bounds' names are `FilterLabels` keys precisely so a translator can
          // reach them, and the built-in range editor names its own boxes the
          // same way.
          aria-label={dual ? labels.rangeFrom(field.label) : field.label}
          placeholder={field.placeholder}
          onChange={(event) => {
            setFrom(event.target.value)
            onValueChange(draft(event.target.value, to))
          }}
          onKeyDown={onKeyDown}
        />
      )}

      {dual ? (
        <>
          <span className={cn(HELPER, "ps-1")}>{labels.rangeSeparator}</span>
          {money(
            <InputGroupInput
              inputMode="decimal"
              value={to}
              aria-label={labels.rangeTo(field.label)}
              onChange={(event) => {
                setTo(event.target.value)
                onValueChange(draft(from, event.target.value))
              }}
              onKeyDown={onKeyDown}
            />
          )}
        </>
      ) : null}

      <div className={FOOTER}>
        <Button variant="ghost" size="sm" onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size="sm" onClick={() => commit(draft(from, to))}>
          {labels.apply}
        </Button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              A pasted term list                            */
/* -------------------------------------------------------------------------- */

/** A textarea, so a list of terms is pasted rather than typed one at a time. */
function KeywordList({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
  field,
}: FilterEditorProps<string[]>) {
  const current = asArray(value)
  const [text, setText] = useState(() => current.join("\n"))
  const hintId = useId()

  const parse = (raw: string) =>
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

  return (
    <div className={PANEL}>
      <Textarea
        {...(autoFocusProps as object)}
        rows={4}
        value={text}
        aria-label={field.label}
        aria-describedby={hintId}
        placeholder={field.placeholder}
        onChange={(event) => {
          setText(event.target.value)
          onValueChange(parse(event.target.value))
        }}
        onKeyDown={(event) => {
          // Enter is a newline here, so the commit key has to be the modified
          // one. Escape still discards, as it does in every other editor.
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault()
            commit(parse(text))
          }
          if (event.key === "Escape") {
            event.preventDefault()
            event.stopPropagation()
            cancel()
          }
        }}
      />
      {/* On its own line rather than squeezed in beside the buttons. The pair
          is as wide as its longest translation, so a rule sharing that row is
          one long word away from wrapping under it. */}
      <span id={hintId} className={HELPER}>
        One per line
      </span>
      <div className={FOOTER}>
        <Button variant="ghost" size="sm" onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size="sm" onClick={() => commit(parse(text))}>
          {labels.apply}
        </Button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                             A fixed width code                             */
/* -------------------------------------------------------------------------- */

/**
 * A value with a known LENGTH, so completion is the commit.
 *
 * There is no Apply here and no Escape handler either: the control knows when
 * the value is whole, so `onComplete` closes the popover, and an incomplete code
 * is never written into the query at all. Dismissing by clicking away discards
 * the draft the same way `cancel` would.
 *
 * The one panel here that is NOT `PANEL`. Six slots are a measured object whose
 * width is the style's own control size, from mira's 28px to sera's 40px, so
 * the panel takes its width from the control rather than the other way round.
 * At `w-64` the slots would sit in a pool of empty space in mira and overflow
 * it in sera.
 */
function AccessCodeEditor({
  value,
  onValueChange,
  commit,
  field,
  autoFocusProps,
}: FilterEditorProps<string>) {
  return (
    <div className="p-2">
      <InputOTP
        {...(autoFocusProps as object)}
        maxLength={6}
        value={typeof value === "string" ? value : ""}
        aria-label={field.label}
        // The control defaults to a numeric keypad, which would be wrong for a
        // code that carries letters, so both the mode and the accepted set are
        // stated rather than inherited.
        inputMode="text"
        pattern="^[a-zA-Z0-9]*$"
        onChange={(next) => onValueChange(next.toUpperCase())}
        onComplete={(next) => commit(next.toUpperCase())}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                            A validated free text                           */
/* -------------------------------------------------------------------------- */

const DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i

/**
 * Free text that refuses to commit while it is wrong.
 *
 * Validation belongs to the editor, not to the primitive: what counts as a
 * legal value is a field's own business, and a core that tried to own it would
 * need a schema language nobody asked for. The editor simply declines to call
 * `commit`, so an invalid draft can never reach the query and the chip never
 * shows a value the backend will reject.
 */
function DomainEditor({
  value,
  onValueChange,
  commit,
  cancel,
  labels,
  field,
  autoFocusProps,
}: FilterEditorProps<string>) {
  const [text, setText] = useState(() =>
    typeof value === "string" ? value : ""
  )
  const hintId = useId()
  const invalid = text.trim() !== "" && !DOMAIN.test(text.trim())

  const submit = () => {
    if (invalid || text.trim() === "") return
    commit(text.trim().toLowerCase())
  }

  return (
    <div className={PANEL}>
      <Input
        {...(autoFocusProps as object)}
        value={text}
        aria-label={field.label}
        aria-invalid={invalid}
        aria-describedby={hintId}
        placeholder={field.placeholder}
        onChange={(event) => {
          setText(event.target.value)
          onValueChange(event.target.value)
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            submit()
          }
          if (event.key === "Escape") {
            event.preventDefault()
            event.stopPropagation()
            cancel()
          }
        }}
      />
      {/* Under the field it judges, which is where a form error belongs, and
          `aria-describedby` so the rejection is spoken rather than only
          coloured. The line is a live region rather than a `role="alert"` that
          appears with the error: a region that is always mounted announces the
          CHANGE from the example to the complaint, where a role toggled onto a
          node that was already there is not reliably picked up at all. */}
      <span
        id={hintId}
        aria-live="polite"
        className={cn(HELPER, invalid && "text-destructive")}
      >
        {invalid ? "Needs a dot, as in acme.com" : "example.com"}
      </span>
      <div className={FOOTER}>
        <Button variant="ghost" size="sm" onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size="sm" disabled={invalid} onClick={submit}>
          {labels.apply}
        </Button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const fields: FilterField[] = [
  {
    id: "spend",
    label: "Monthly spend",
    type: "number",
    // Ships with a range operator selected, so the editor opens as two groups.
    defaultOperator: "between",
    placeholder: "0",
    editor: AmountEditor as never,
    renderValue: ({ value, labels }) =>
      Array.isArray(value)
        ? labels.valueRange(
            `$${Number(value[0]).toLocaleString()}`,
            `$${Number(value[1]).toLocaleString()}`
          )
        : typeof value === "number"
          ? `$${value.toLocaleString()}`
          : "any amount",
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
    id: "keywords",
    label: "Keywords",
    type: "multiselect",
    defaultOperator: "has_any_of",
    placeholder: "onboarding\nchurn\nrenewal",
    editor: KeywordList as never,
    // The first term, plus what it stands in for. A pasted list collapses to
    // "5 selected" by default, which names none of them; the leading term with
    // an overflow count beside it is the same treatment c-filters-1 gives a
    // stack of people, and it fits in the same space.
    renderValue: ({ values }) =>
      values.length === 0 ? (
        "none"
      ) : (
        <span className="flex items-center gap-1.5">
          {String(values[0])}
          {values.length > 1 ? (
            <span className="text-muted-foreground text-xs tabular-nums">
              +{values.length - 1}
            </span>
          ) : null}
        </span>
      ),
    icon: (
      <IconPlaceholder
        lucide="TagsIcon"
        tabler="IconTags"
        hugeicons="Tag01Icon"
        phosphor="TagIcon"
        remixicon="RiPriceTag3Line"
      />
    ),
  },
  {
    id: "accessCode",
    label: "Access code",
    type: "text",
    // Only the two operators a fixed width code can answer. A `contains` on a
    // six character code would be a filter nobody means.
    operators: [
      { value: "is", label: "is", inverse: "is_not" },
      { value: "is_not", label: "is not", inverse: "is" },
    ],
    defaultOperator: "is",
    editor: AccessCodeEditor as never,
    renderValue: ({ value }) =>
      typeof value === "string" && value ? (
        <span className="font-mono tracking-wider">{value}</span>
      ) : (
        "any code"
      ),
    icon: (
      <IconPlaceholder
        lucide="KeyRoundIcon"
        tabler="IconKey"
        hugeicons="SquareLock02Icon"
        phosphor="KeyIcon"
        remixicon="RiKey2Line"
      />
    ),
  },
  {
    id: "domain",
    label: "Domain",
    type: "text",
    defaultOperator: "is",
    placeholder: "acme.com",
    editor: DomainEditor as never,
    icon: (
      <IconPlaceholder
        lucide="GlobeIcon"
        tabler="IconWorld"
        hugeicons="Globe02Icon"
        phosphor="GlobeSimpleIcon"
        remixicon="RiGlobalLine"
      />
    ),
  },
]

export default function Pattern() {
  const [query, setQuery] = useState<FilterQuery>(() =>
    createFilterQuery<unknown>([
      createFilterRule({
        id: "seed-1",
        path: ["spend"],
        operator: "between",
        value: [500, 2500],
      }),
      createFilterRule({
        id: "seed-2",
        path: ["accessCode"],
        operator: "is",
        value: "R7K2QX",
      }),
      /*
        THREE chips, not four, and the arithmetic decides which three.

        The bar is a wrapping row whose chips sit in an inner toolbar, and a
        flex child that wraps internally claims its whole line, so a fourth chip
        that spills does not simply take a second row: it hands the toolbar both
        rows and strands Add filter and Clear alone on a third. At the width a
        catalog card gives this bar (1128px) the four chips run 1164 to 1314
        across the styles, against a budget of 977 to 1036.

        Keywords is the one that goes, and the arithmetic picks it rather than
        taste. Spend is the widest chip in every style, but it is the input
        group this example leads with, so it stays and one of the other three
        goes. Only dropping Keywords clears the budget in all eight: spend, code
        and domain run 839 to 943. Keeping Keywords instead wraps in four styles
        (with domain) or six (with code). Its editor and its overflow display
        are one press of Add filter away.
      */
      createFilterRule({
        id: "seed-3",
        path: ["domain"],
        operator: "is",
        value: "acme.com",
      }),
    ])
  )

  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  )
}
