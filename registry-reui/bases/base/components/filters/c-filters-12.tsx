"use client"

import { useId, useState } from "react"
import { Filters } from "@/registry-reui/bases/base/reui/filters/filters"
import type { FilterOperatorLabels } from "@/registry-reui/bases/base/reui/filters/filters-operators"
import {
  createFilterQuery,
  createFilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-query"
import type {
  FilterChangeReason,
  FilterField,
  FilterLabels,
  FilterOption,
  FilterQuery,
} from "@/registry-reui/bases/base/reui/filters/filters-types"

import { cn } from "@/registry/bases/base/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type Locale = "en" | "de" | "ja"

/* -------------------------------------------------------------------------- */
/*                                    Copy                                    */
/* -------------------------------------------------------------------------- */

// Every operator the four field types below can offer, and no more. The
// primitive's own English list carries 25; the four it holds beyond these,
// is_before through is_on_or_after, belong to no entry in the operator catalog
// at all, so no field of any type can put one on screen. A dictionary padded
// with keys nothing renders is the fossil the shipped English copy was pruned
// of.
const OPERATORS: Record<Locale, FilterOperatorLabels> = {
  en: {},
  de: {
    contains: "enthält",
    not_contains: "enthält nicht",
    starts_with: "beginnt mit",
    ends_with: "endet mit",
    is: "ist",
    is_not: "ist nicht",
    is_any_of: "ist eines von",
    is_none_of: "ist keines von",
    has_any_of: "enthält eines von",
    has_all_of: "enthält alle von",
    has_none_of: "enthält keines von",
    eq: "ist gleich",
    neq: "ist ungleich",
    gt: "ist größer als",
    gte: "ist mindestens",
    lt: "ist kleiner als",
    lte: "ist höchstens",
    between: "liegt zwischen",
    not_between: "liegt nicht zwischen",
    empty: "ist leer",
    not_empty: "ist nicht leer",
  },
  ja: {
    contains: "を含む",
    not_contains: "を含まない",
    starts_with: "で始まる",
    ends_with: "で終わる",
    is: "と等しい",
    is_not: "と等しくない",
    is_any_of: "のいずれか",
    is_none_of: "のいずれでもない",
    has_any_of: "のいずれかを含む",
    has_all_of: "のすべてを含む",
    has_none_of: "のいずれも含まない",
    eq: "と等しい",
    neq: "と等しくない",
    gt: "より大きい",
    gte: "以上",
    lt: "より小さい",
    lte: "以下",
    between: "の範囲内",
    not_between: "の範囲外",
    empty: "が空",
    not_empty: "が空でない",
  },
}

/**
 * Why `labels.negated` is a FUNCTION, demonstrated rather than asserted.
 *
 * Negate flips to the catalog's `inverse` where one exists, so `negated` is
 * only ever asked about the three operators here that have none: starts with,
 * ends with, and has all of. A prefix composes them in English ("not starts
 * with" is at worst clumsy) and composes in NEITHER of these languages: German
 * puts nicht after the verb, and Japanese conjugates the verb itself. Keyed by
 * the localised label because that is all the primitive hands the function, and
 * the labels it is keyed on are the ones declared directly above.
 */
const NEGATED_DE: Record<string, string> = {
  "beginnt mit": "beginnt nicht mit",
  "endet mit": "endet nicht mit",
  "enthält alle von": "enthält nicht alle von",
}

const NEGATED_JA: Record<string, string> = {
  で始まる: "で始まらない",
  で終わる: "で終わらない",
  のすべてを含む: "のすべては含まない",
}

// Chrome copy and operator wording are two separate surfaces. A team routinely
// rewords "contains" for their domain without translating anything else, and a
// translator localises the chrome without touching the operator catalog.
//
// The keys below are exactly the ones the chip row can reach with the schema in
// this file. `FilterLabels` carries 76. Thirty three of them are drawn only by
// the advanced builder, which this example does not offer. Fourteen more want a
// nested field, an async option list or an exclusive option, none of which this
// schema declares, or name a slot the primitive no longer renders anywhere.
// `filterLabel` is the last one out: it wraps a chip's accessible name and
// defaults to the identity, so what it returns is already assembled from the
// words below. That leaves these 28, every one of which this file's own bar can
// put on screen or into an accessible name. A dictionary padded past that is
// the fossil the shipped English copy was pruned of: work a translator is paid
// for and nobody ever sees.
const CHROME: Record<Locale, Partial<FilterLabels>> = {
  en: {},
  de: {
    addFilter: "Filter hinzufügen",
    searchFields: "Attribute suchen...",
    searchOperators: "Bedingungen suchen...",
    searchOptions: "Optionen suchen...",
    fieldsLabel: "Attribute",
    filtersLabel: "Filter",
    chipMenu: (fieldLabel) => `Optionen für ${fieldLabel}`,
    clear: "Zurücksetzen",
    apply: "Übernehmen",
    discard: "Verwerfen",
    remove: "Entfernen",
    duplicate: "Duplizieren",
    negate: "Umkehren",
    negated: (operatorLabel) => NEGATED_DE[operatorLabel] ?? operatorLabel,
    empty: "Keine Ergebnisse",
    valuePlaceholder: "Text eingeben...",
    noValue: "kein Wert",
    incomplete: "unvollständiger Filter",
    selectCondition: "Bedingung wählen",
    readOnly: "Schreibgeschützt. Diese Filter können nicht geändert werden.",
    valueCount: (count) => `${count} ausgewählt`,
    valueDetail: (summary, values) => `${summary}: ${values.join(", ")}`,
    valueRange: (from, to) => `${from} bis ${to}`,
    rangeFrom: (fieldLabel) => `${fieldLabel} von`,
    rangeTo: (fieldLabel) => `${fieldLabel} bis`,
    rangeSeparator: "bis",
    countAnnouncement: (count) =>
      count === 1 ? "1 Filter aktiv" : `${count} Filter aktiv`,
    resultsAnnouncement: (count) =>
      count === 1 ? "1 Ergebnis" : `${count} Ergebnisse`,
  },
  ja: {
    addFilter: "フィルターを追加",
    searchFields: "属性を検索...",
    searchOperators: "条件を検索...",
    searchOptions: "オプションを検索...",
    fieldsLabel: "属性",
    filtersLabel: "フィルター",
    chipMenu: (fieldLabel) => `${fieldLabel}のフィルターオプション`,
    clear: "クリア",
    apply: "適用",
    discard: "破棄",
    remove: "削除",
    duplicate: "複製",
    negate: "反転",
    negated: (operatorLabel) => NEGATED_JA[operatorLabel] ?? operatorLabel,
    empty: "結果がありません",
    valuePlaceholder: "テキストを入力...",
    noValue: "値なし",
    incomplete: "不完全なフィルター",
    selectCondition: "条件を選択",
    readOnly: "読み取り専用です。これらのフィルターは変更できません。",
    valueCount: (count) => `${count}件選択`,
    valueDetail: (summary, values) => `${summary}: ${values.join("、")}`,
    valueRange: (from, to) => `${from}から${to}`,
    rangeFrom: (fieldLabel) => `${fieldLabel}（開始）`,
    rangeTo: (fieldLabel) => `${fieldLabel}（終了）`,
    rangeSeparator: "から",
    countAnnouncement: (count) => `フィルター${count}件を適用中`,
    resultsAnnouncement: (count) => `${count}件の結果`,
  },
}

const FIELD_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    title: "Title",
    status: "Status",
    priority: "Priority",
    assignee: "Assignee",
    score: "Score",
  },
  de: {
    title: "Titel",
    status: "Status",
    priority: "Priorität",
    assignee: "Bearbeiter",
    score: "Punktzahl",
  },
  ja: {
    title: "タイトル",
    status: "ステータス",
    priority: "優先度",
    assignee: "担当者",
    score: "スコア",
  },
}

// Status and priority share one dictionary, keyed by option value, because
// their values are disjoint and because the colour map below is keyed the same
// way. Two maps over one key space, one holding what translates and one holding
// what does not.
const OPTION_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    todo: "To Do",
    "in-progress": "In Progress",
    review: "In Review",
    done: "Done",
    cancelled: "Cancelled",
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
    critical: "Critical",
  },
  de: {
    todo: "Offen",
    "in-progress": "In Bearbeitung",
    review: "In Prüfung",
    done: "Erledigt",
    cancelled: "Abgebrochen",
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",
    urgent: "Dringend",
    critical: "Kritisch",
  },
  ja: {
    todo: "未着手",
    "in-progress": "進行中",
    review: "レビュー中",
    done: "完了",
    cancelled: "中止",
    low: "低",
    medium: "中",
    high: "高",
    urgent: "緊急",
    critical: "重大",
  },
}

// What a stacked display says when nothing is picked yet. It arrives through
// `renderValue`, so it belongs to the CONSUMER rather than to `labels`, and a
// consumer who translates the chrome and forgets this ships a German bar with
// an English chip in it.
const ANY_LABELS: Record<Locale, Record<string, string>> = {
  en: { status: "any status", priority: "any priority", assignee: "anyone" },
  de: {
    status: "beliebiger Status",
    priority: "beliebige Priorität",
    assignee: "alle",
  },
  ja: {
    status: "すべてのステータス",
    priority: "すべての優先度",
    assignee: "全員",
  },
}

// How many times `onQueryChange` has fired, in words. Consumer copy again, for
// the same reason `ANY_LABELS` is: it is drawn over a CALLBACK's output, which
// no key in `labels` covers, so a locale switch reaches it only if the consumer
// wired it. Pluralisation is why each entry is a function rather than a string:
// German inflects the noun, and Japanese counts with a suffix and does not
// inflect at all, so the count cannot be concatenated onto a fixed word.
const CHANGE_LABELS: Record<Locale, (count: number) => string> = {
  en: (count) => (count === 1 ? "1 change" : `${count} changes`),
  de: (count) => (count === 1 ? "1 Änderung" : `${count} Änderungen`),
  ja: (count) => `変更${count}件`,
}

/* -------------------------------------------------------------------------- */
/*                                  Fixtures                                  */
/* -------------------------------------------------------------------------- */

// The colour is keyed by value and NOT by locale, which is the whole point of
// the pairing: swapping locale rewrites every label on screen and moves none of
// these.
const TONES: Record<string, string> = {
  todo: "bg-zinc-400",
  "in-progress": "bg-amber-500",
  review: "bg-sky-500",
  done: "bg-emerald-500",
  cancelled: "bg-destructive",
  low: "bg-emerald-500",
  medium: "bg-yellow-500",
  high: "bg-violet-500",
  urgent: "bg-orange-500",
  critical: "bg-destructive",
}

const STATUSES = ["todo", "in-progress", "review", "done", "cancelled"]
const PRIORITIES = ["low", "medium", "high", "urgent", "critical"]

// Names are proper nouns, so they are the one set of option labels that stays
// put across all three locales, exactly as the faces do. The FIELD label above
// them still translates.
const TEAM = [
  { value: "ada", label: "Ada Lovelace", img: "women/1" },
  { value: "grace", label: "Grace Hopper", img: "women/2" },
  { value: "alan", label: "Alan Turing", img: "men/3" },
  { value: "katherine", label: "Katherine Johnson", img: "women/4" },
  { value: "edsger", label: "Edsger Dijkstra", img: "men/5" },
  { value: "barbara", label: "Barbara Liskov", img: "women/6" },
  { value: "tim", label: "Tim Berners-Lee", img: "men/7" },
  { value: "margaret", label: "Margaret Hamilton", img: "women/8" },
]

function Dot({ className }: { className: string }) {
  return <span className={cn("size-2 shrink-0 rounded-full", className)} />
}

function Person({ img, name }: { img: string; name: string }) {
  return (
    <Avatar className="size-5">
      <AvatarImage
        src={`https://randomuser.me/api/portraits/${img}.jpg`}
        alt={name}
      />
      <AvatarFallback className="text-[10px]">
        {name
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * Overlapping swatches plus a count, instead of "3 selected". The empty word is
 * a prop because the same renderer serves Status and Priority: a hardcoded noun
 * would put "any status" on the Priority chip, and a hardcoded ENGLISH noun
 * would put it there in every locale.
 */
function StackedDots({
  options,
  empty,
}: {
  options: FilterOption[]
  empty: string
}) {
  if (options.length === 0) return <>{empty}</>
  if (options.length === 1) {
    return (
      <span className="flex items-center gap-1.5">
        <Dot className={TONES[options[0].value] ?? "bg-muted-foreground"} />
        {options[0].label}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center">
        {options.slice(0, 4).map((option) => (
          <span
            key={option.value}
            className={cn(
              "ring-background -ml-1 size-2.5 rounded-full ring-2 first:ml-0",
              TONES[option.value] ?? "bg-muted-foreground"
            )}
          />
        ))}
      </span>
      <span className="text-muted-foreground text-xs tabular-nums">
        {options.length}
      </span>
    </span>
  )
}

/** A teammate's face, resolved from the option the query stored. */
function Face({ option }: { option: FilterOption }) {
  const entry = TEAM.find((candidate) => candidate.value === option.value)
  return <Person img={entry?.img ?? "men/1"} name={option.label} />
}

/**
 * A real `AvatarGroup`, plus an overflow count.
 *
 * The group keeps its default `ring-2`, which reads as a wider collar once the
 * faces drop to 16px, and the two overrides both follow from that size: the
 * stack tightens to `-space-x-1`, because the default `-space-x-2` hides half
 * of a 16px face, and `size-4` beats `Person`'s own `size-5` on specificity
 * exactly as the group's own ring does. Both selectors reach DIRECT children,
 * so the faces are rendered as components rather than wrapped in a keyed span,
 * which would put a wrapper between the group and every avatar it styles. The
 * count appears only on genuine overflow, so three picks show three faces and
 * no redundant "3" beside them.
 */
function StackedPeople({
  options,
  empty,
}: {
  options: FilterOption[]
  empty: string
}) {
  if (options.length === 0) return <>{empty}</>
  if (options.length === 1) {
    return (
      <span className="flex items-center gap-1.5">
        <Face option={options[0]} />
        {options[0].label}
      </span>
    )
  }

  const overflow = options.length - 3

  return (
    <span className="flex items-center gap-1.5">
      <AvatarGroup className="-space-x-1 *:data-[slot=avatar]:size-4">
        {options.slice(0, 3).map((option) => (
          <Face key={option.value} option={option} />
        ))}
      </AvatarGroup>
      {overflow > 0 ? (
        <span className="text-muted-foreground text-xs tabular-nums">
          +{overflow}
        </span>
      ) : null}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

/**
 * Rebuilt per locale, and declared inline on purpose.
 *
 * The schema index is memoized on a content SIGNATURE rather than on the array
 * identity, so a rebuild that changes nothing structural returns the identical
 * index object. Changing a label DOES change the signature, which is exactly
 * when the index should be rebuilt, and it is why the chips redraw in the new
 * language without the query being touched.
 *
 * Icon names are written out per field rather than built by a helper: the
 * shadcn CLI rewrites these attributes to a real import at install time and
 * only accepts string literals.
 */
function buildFields(locale: Locale): FilterField[] {
  return [
    {
      id: "title",
      label: FIELD_LABELS[locale].title,
      type: "text",
      icon: (
        <IconPlaceholder
          lucide="TypeIcon"
          tabler="IconLetterT"
          hugeicons="TextIcon"
          phosphor="TextTIcon"
          remixicon="RiText"
        />
      ),
    },
    {
      id: "status",
      label: FIELD_LABELS[locale].status,
      type: "select",
      defaultOperator: "is_any_of",
      icon: (
        <IconPlaceholder
          lucide="CircleDotIcon"
          tabler="IconCircleDot"
          hugeicons="RecordIcon"
          phosphor="CircleIcon"
          remixicon="RiRecordCircleLine"
        />
      ),
      options: STATUSES.map((value) => ({
        value,
        label: OPTION_LABELS[locale][value],
        icon: <Dot className={TONES[value]} />,
      })),
      // Five options, so the search box is more chrome than the rows under it.
      searchable: false,
      renderValue: ({ options }) => (
        <StackedDots options={options} empty={ANY_LABELS[locale].status} />
      ),
    },
    {
      id: "priority",
      label: FIELD_LABELS[locale].priority,
      type: "multiselect",
      icon: (
        <IconPlaceholder
          lucide="FlagIcon"
          tabler="IconFlag"
          hugeicons="Flag01Icon"
          phosphor="FlagIcon"
          remixicon="RiFlagLine"
        />
      ),
      options: PRIORITIES.map((value) => ({
        value,
        label: OPTION_LABELS[locale][value],
        icon: <Dot className={TONES[value]} />,
      })),
      searchable: false,
      renderValue: ({ options }) => (
        <StackedDots options={options} empty={ANY_LABELS[locale].priority} />
      ),
    },
    {
      id: "assignee",
      label: FIELD_LABELS[locale].assignee,
      type: "multiselect",
      // Wider than the panel's own `w-48`: a face plus a full name is the
      // widest row the option menu draws, and this example runs in three
      // locales, where a name that fits in one may not in another.
      className: "w-56",
      icon: (
        <IconPlaceholder
          lucide="UserRoundCheckIcon"
          tabler="IconUserCheck"
          hugeicons="UserCheck01Icon"
          phosphor="UserCheckIcon"
          remixicon="RiUserFollowLine"
        />
      ),
      options: TEAM.map((person) => ({
        value: person.value,
        label: person.label,
        icon: <Person img={person.img} name={person.label} />,
      })),
      // A list of PEOPLE carries no semantic order, unlike Priority above.
      sortSelected: "label",
      renderValue: ({ options }) => (
        <StackedPeople options={options} empty={ANY_LABELS[locale].assignee} />
      ),
    },
    {
      id: "score",
      label: FIELD_LABELS[locale].score,
      type: "number",
      icon: (
        <IconPlaceholder
          lucide="HashIcon"
          tabler="IconHash"
          hugeicons="HashtagIcon"
          phosphor="HashIcon"
          remixicon="RiHashtag"
        />
      ),
    },
  ]
}

/* -------------------------------------------------------------------------- */
/*                                   Query                                    */
/* -------------------------------------------------------------------------- */

// Four rules, chosen for what each one says under a locale swap. Status
// collapses to two dots and a count, which is the case `labels.valueDetail`
// spells out for a screen reader once the bar is read only. Priority holds one
// pick, so its chip shows a colour AND a translated word side by side. Assignee
// holds four people, so the faces and their names stay put while the attribute
// above them changes language. Score holds neither a colour nor a face, so it
// is the control case: every glyph in it is copy, and every glyph changes.
const SEED: FilterQuery = createFilterQuery<unknown>(
  [
    createFilterRule({
      id: "seed-1",
      path: ["status"],
      operator: "is_any_of",
      value: ["in-progress", "review"],
    }),
    createFilterRule({
      id: "seed-2",
      path: ["priority"],
      operator: "has_any_of",
      value: ["urgent"],
    }),
    createFilterRule({
      id: "seed-3",
      path: ["assignee"],
      operator: "has_any_of",
      value: ["ada", "grace", "alan", "katherine"],
    }),
    createFilterRule({
      id: "seed-4",
      path: ["score"],
      operator: "gte",
      value: 60,
    }),
  ],
  "and"
)

/* -------------------------------------------------------------------------- */
/*                                  Controls                                  */
/* -------------------------------------------------------------------------- */

type Size = "sm" | "default"

/**
 * `readOnly` and `disabled` as ONE control with three states.
 *
 * Two switches would let a reader set both at once, which the primitive answers
 * by disabling the bar and which says nothing about either prop. Three mutually
 * exclusive states cannot be combined into that, and putting them in one group
 * is what makes the pair legible: the difference between locked and off is only
 * visible when you can flip straight from one to the other.
 */
type Interaction = "editable" | "readOnly" | "disabled"

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
]

const SIZE_OPTIONS: { value: Size; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "default", label: "Default" },
]

const INTERACTION_OPTIONS: { value: Interaction; label: string }[] = [
  { value: "editable", label: "Editable" },
  { value: "readOnly", label: "Read only" },
  { value: "disabled", label: "Disabled" },
]

/**
 * One control of the toolbar: the PROP, and every value it can take as one
 * segmented group beside it.
 *
 * The name is load-bearing. Three unlabelled segments reading sm and default
 * leave a reader to infer the prop from the values, which almost works for
 * `size` and fails completely for a group that reads English, Deutsch, 日本語.
 * Naming the prop costs one span and removes the inference entirely, and a
 * segmented group is what keeps every value on screen while still reading as
 * one control: a demo setting hidden behind a select is one more click between
 * a reader and the thing they came to see, and three loose radios are three
 * controls where the prop has one.
 *
 * ABOVE the group rather than beside it, which is what buys the row. Beside,
 * a control is its name plus its segments end to end, and the three of them
 * come to 921px against the 889 the catalog frame is wide - so the toolbar
 * this is meant to form wrapped on the very frame it was drawn for, and the
 * two prop pairs would have had to give up half their names to fit. Stacked,
 * each control is only as wide as the WIDER of its two lines, the three come to
 * about 590px, and every prop keeps the name it actually has in the API.
 *
 * The label is a span rather than `FieldSet` plus `FieldLegend`. The thing it
 * names is the toggle group, which is already named through `aria-labelledby`,
 * so a fieldset around it would be a second group announcing the same words
 * twice.
 *
 * It is also NOT a `ButtonGroupText` addon fused onto the group, which is the
 * obvious way to draw a labelled segmented control and the wrong one here:
 * every style paints that addon `bg-muted` and every style paints a pressed
 * segment `bg-muted` too, so the label and a selected FIRST value would merge
 * into one unreadable block in each of these three groups. A plain span keeps
 * the fill meaning exactly one thing.
 *
 * `shrink-0` on the whole control, so a toolbar too narrow to hold three of
 * them wraps between controls rather than squeezing a group until its segments
 * clip.
 */
function PropControl<T extends string>({
  prop,
  value,
  options,
  onValueChange,
}: {
  prop: string
  value: T
  options: readonly { value: T; label: string }[]
  onValueChange: (value: T) => void
}) {
  const id = useId()

  return (
    <div className="flex shrink-0 flex-col gap-1.5">
      {/*
        A LABEL, in the page's own type. It was the prop name set in mono,
        which is how an API reference writes an identifier and not how a
        control introduces itself: `labels + operatorLabels` above three
        language names is a reader being asked to hold the implementation in
        their head to use the demo. The name of the setting goes here and the
        prop it drives is the example's own code, one tab away.
      */}
      <span id={id} className="text-muted-foreground text-xs font-medium">
        {prop}
      </span>
      <ToggleGroup
        aria-labelledby={id}
        variant="outline"
        size="sm"
        // Fused, because the segments are the values of ONE prop and exactly
        // one of them is true at a time. Gapped pills would draw three
        // independent switches over a single-valued setting.
        spacing={0}
        // Single-select, and pressing the pressed segment CLEARS the group.
        // None of these three props has a way to hold nothing, so the current
        // value is kept when that happens: this control chooses between values
        // and cannot unset one.
        //
        // The two props below are the whole base/radix split in this file.
        // Radix's ToggleGroup is a discriminated union on `type`, so the radix
        // twin names the single-select variant and exchanges a string where
        // Base UI's group takes and returns an array whether it is
        // single-select or not.
        //
        // That split reaches the accessibility tree, and neither side is this
        // file's to fix. Radix knows it is single-select, so it publishes
        // `role="radiogroup"` over `role="radio"` items and announces the
        // choice as one of three. Base UI's group has no single-select mode: it
        // publishes `role="group"` over `aria-pressed` toggles, which is three
        // buttons that happen to agree. `aria-labelledby` names the group on
        // both sides either way, and hand-writing radio roles onto Base UI's
        // toggles would leave `aria-pressed` on a radio, which is worse than
        // the honest difference.
        value={[value]}
        onValueChange={(next: string[]) =>
          onValueChange((next[0] ?? value) as T)
        }
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Pattern                                   */
/* -------------------------------------------------------------------------- */

/**
 * One entry of the change readout.
 *
 * Holds the field's ID rather than its label, and a COUNT rather than one entry
 * per call. Four edits to one value are four calls with identical details, and
 * four identical badges read as a rendering fault rather than as four events.
 */
type Change = {
  reason: FilterChangeReason
  field: string | null
  count: number
}

/**
 * The readout's whole state: how many times the callback fired, and the last
 * three distinct things it said.
 *
 * `fires` is counted separately rather than summed out of `entries`, because
 * entries are folded and then capped at three, so the sum stops being the
 * number of calls the moment a fourth distinct one arrives. It is also what
 * removes the empty state: a count is a real measurement at zero, where a word
 * standing in for "nothing has happened" is filler that has to be written in
 * every language this file speaks.
 */
type Changes = { fires: number; entries: Change[] }

export default function Pattern() {
  const [locale, setLocale] = useState<Locale>("en")
  const [size, setSize] = useState<Size>("default")
  const [interaction, setInteraction] = useState<Interaction>("editable")
  const [changes, setChanges] = useState<Changes>({ fires: 0, entries: [] })
  const [query, setQuery] = useState<FilterQuery>(SEED)

  return (
    // Spacing tightens below the breakpoint the toolbar already wraps at, and
    // is restored above it. The catalog frames this example at one authored
    // height, and a phone-width frame spends 244 of it on a five-row bar and
    // the rest on a toolbar that has folded into a column, so the gaps are the
    // only budget left to give back. Nothing changes at the widths where there
    // is room.
    <div className="flex w-full flex-col gap-2.5 min-[30rem]:gap-4">
      {/*
        `labels` and `operatorLabels` are two independent surfaces over one
        catalog, so a locale change redraws every chip and never touches the
        query.

        `readOnly` and `disabled` are not two words for one state. `disabled`
        turns the bar off natively. `readOnly` blocks every mutation while
        leaving the bar focusable, readable and navigable, carries
        `labels.readOnly` as the toolbar's description, and hands a collapsed
        value its full contents as an accessible name, because the editor that
        would have revealed them is locked shut.
      */}
      <Filters
        fields={buildFields(locale)}
        query={query}
        size={size}
        readOnly={interaction === "readOnly"}
        disabled={interaction === "disabled"}
        labels={CHROME[locale]}
        operatorLabels={OPERATORS[locale]}
        showClear
        className={cn(
          // Padding first, so the two states below differ in FILL alone and the
          // bar does not move when one is flipped on. The negative margin pulls
          // that padding back out, so the first chip still lines up with the
          // tray's outside edge underneath it.
          "-mx-1.5 rounded-md p-1.5 transition-colors",
          // `data-readonly` is the container hook the primitive puts on the bar
          // for exactly this, and tint is the right treatment for it: a
          // read-only control keeps full contrast, the same way a read-only
          // input does, because everything in it is still legible and every
          // control in it is still reachable.
          //
          // The ring comes with it because the tint alone is 3% of lightness in
          // the light theme, which is the difference between a state a reader
          // notices on the flip and one they do not. Inset, so it is drawn
          // inside the padding declared above and the bar still does not move.
          "data-readonly:bg-muted data-readonly:inset-ring-border data-readonly:inset-ring",
          // `disabled` gets no such hook, so it is painted from the flag this
          // file already holds. Dimming is the honest word for it, and the two
          // treatments have to differ or the control below has three states and
          // two appearances.
          interaction === "disabled" && "opacity-60"
        )}
        // Fully controlled. The second argument says WHAT happened and WHICH
        // field it happened to, so a consumer does not have to diff two trees
        // to find out.
        onQueryChange={(next, details) => {
          setQuery(next)
          setChanges((current) => {
            const field = details.field?.id ?? null
            const [newest, ...rest] = current.entries
            // Repeats fold into the newest entry instead of pushing a copy of
            // it, which is what keeps a slider or a text field from filling the
            // strip with one reason.
            const entries =
              newest?.reason === details.reason && newest.field === field
                ? [{ ...newest, count: newest.count + 1 }, ...rest]
                : [
                    { reason: details.reason, field, count: 1 },
                    ...current.entries,
                  ].slice(0, 3)

            return { fires: current.fires + 1, entries }
          })
        }}
      />

      {/*
        ONE surface for the whole API, so the bar above it reads as the subject
        rather than as the first of several stacked rows. Every prop this
        example writes sits on one toolbar line, the strip under it reads the
        callback back, and the hairline between them comes from the card's own
        `divide-y` so the two are one object.

        A ROW and not the three stacked rows this replaces. Stacked, each prop
        got a full-width line and the three controls were left hanging off the
        tray's right edge with a lane of dead space between every name and the
        group it named. Set side by side each name sits against its own control,
        the toolbar costs one line instead of three, and the whole demo fits the
        frame without the bar above it scrolling out of view.

        A `Card` and not the muted panel this replaces, and the reason is a
        collision rather than a preference: every style paints a pressed segment
        with `bg-muted`, so a muted tray would have hidden the selected value in
        each of the three groups it holds. The card's surface is what makes the
        selection legible, `gap-0 py-0` undoes the stacking spacing it ships
        with, and each part carries its own padding because `--card-spacing` is
        a per-style token that reaches 32px in sera.
      */}
      {/*
        NO CARD. The controls are the page talking about the demo, not part of
        it: boxing them made a second panel above the one this example is
        actually about, and two stacked surfaces of similar weight leave a
        reader deciding which is the subject.

        They keep their own grouping - a name over each segmented group, one
        rule under the whole strip - which is all the containment a toolbar
        needs. The bar below is the thing in a box, because it is the thing.
      */}
      <div className="w-full">
        {/*
          The toolbar. `items-end`, so the three segmented groups sit on one
          baseline whatever their names do above them - a prop whose name wraps
          would otherwise push its own control down and break the line the row
          is made of.

          One row in seven of the eight styles, where the three controls come to
          about 590px against the 880 the catalog frame leaves inside this card.
          SERA IS THE EIGHTH and it does not fit: it sets every segment
          uppercase with 1.2px of tracking and 24px of padding a side, which
          takes a two-letter value like sm to 71px and the three groups to 856px
          of controls before a single gap between them. That is a style deciding
          how big its own controls are, not something for this file to override,
          so the row folds to two lines there and `flex-wrap` is what makes the
          fold tidy rather than a clipped third control.

          Gaps and NO separators, which is the same decision. A vertical rule
          reads as a divider BETWEEN two things on one line, so the moment sera
          or a phone folds the row, the rule that was dividing the second and
          third control is left hanging off the end of the first line pointing
          at nothing. The stacked names already group each control with its own
          segments, so `gap-x-6` says everything the rules were there to say and
          says it at every width.
        */}
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 pb-3">
          <PropControl
            prop="Language"
            value={locale}
            options={LOCALE_OPTIONS}
            onValueChange={setLocale}
          />
          <PropControl
            prop="Size"
            value={size}
            options={SIZE_OPTIONS}
            onValueChange={setSize}
          />
          <PropControl
            prop="State"
            value={interaction}
            options={INTERACTION_OPTIONS}
            onValueChange={setInteraction}
          />
        </div>

        {/*
          The tray's status line: what `onQueryChange` handed back, most recent
          first. Three props go in through the toolbar above and one callback
          comes out here, which is why the readout belongs on this surface and
          not floating between the bar and the tray.

          Its own line rather than the end of the toolbar row, because it is the
          one part of this card whose width is not knowable: three badges naming
          a reason, a field and a repeat count are wider than the three controls
          beside them on a bad day. Trailing the toolbar it would have pushed
          the controls onto a second line and then pulled them back as the
          badges folded, so the row a reader is aiming at would move under the
          pointer every time they used it.

          The count carries the strip. It names what the badges are without a
          heading over them, it is a measurement rather than a placeholder at
          zero, and it translates, because a number the consumer renders is the
          consumer's copy. Each entry keeps the field's ID and resolves its
          label at render, so the badges retranslate with everything else. The
          reason does not: it is an API value rather than copy, and a translated
          one would be a lie about what `details.reason` holds.
        */}
        <div className="border-border/60 flex flex-wrap items-center gap-1.5 border-t py-2">
          <span className="text-muted-foreground text-xs tabular-nums">
            {CHANGE_LABELS[locale](changes.fires)}
          </span>
          {changes.entries.map((entry, index) => (
            <Badge
              key={`${entry.reason}-${entry.field}-${index}`}
              variant={index === 0 ? "default" : "secondary"}
              className="gap-1.5"
            >
              <span className="font-mono">{entry.reason}</span>
              {entry.field ? (
                <span className="opacity-75">
                  {FIELD_LABELS[locale][entry.field] ?? entry.field}
                </span>
              ) : null}
              {entry.count > 1 ? (
                <span className="tabular-nums opacity-75">×{entry.count}</span>
              ) : null}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
