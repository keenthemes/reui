"use client"

import { useMemo, useState } from "react"
import { Filters } from "@/registry-reui/bases/radix/reui/filters/filters"
import {
  countFilterRules,
  createFilterGroup,
  createFilterQuery,
  createFilterRule,
  isFilterRule,
} from "@/registry-reui/bases/radix/reui/filters/filters-query"
import type {
  FilterField,
  FilterNode,
  FilterOption,
  FilterQuery,
} from "@/registry-reui/bases/radix/reui/filters/filters-types"

import { cn } from "@/registry/bases/radix/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                              Value rendering                               */
/* -------------------------------------------------------------------------- */

/**
 * The builder draws the SAME value output the chip row does.
 *
 * A condition in the advanced builder is the same sentence as a chip, so its
 * value cell gets the same treatment: a coloured dot for a state, a ranked
 * glyph for a priority, faces for people. Left as plain labels it read as a
 * form, and the one thing the builder is for - taking in a whole query at a
 * glance - is exactly what a column of identical grey words defeats.
 */
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

const STATUSES = [
  { value: "todo", label: "To do", dot: "bg-zinc-400" },
  { value: "in-progress", label: "In progress", dot: "bg-amber-500" },
  { value: "blocked", label: "Blocked", dot: "bg-destructive" },
  { value: "done", label: "Done", dot: "bg-emerald-500" },
]

// A ramp rather than a set of labels, so the tones run one way: cool to hot,
// rising in chroma the whole way, which is what puts the four in an order the
// eye can take without reading the words.
const PRIORITIES = [
  { value: "low", label: "Low", tone: "bg-emerald-500" },
  { value: "medium", label: "Medium", tone: "bg-yellow-500" },
  { value: "high", label: "High", tone: "bg-orange-500" },
  { value: "urgent", label: "Urgent", tone: "bg-rose-500" },
]

const TEAM = [
  { value: "ada", label: "Ada Lovelace", img: "women/1" },
  { value: "grace", label: "Grace Hopper", img: "women/2" },
  { value: "alan", label: "Alan Turing", img: "men/3" },
  { value: "katherine", label: "Katherine Johnson", img: "women/4" },
  { value: "edsger", label: "Edsger Dijkstra", img: "men/5" },
  { value: "barbara", label: "Barbara Liskov", img: "women/6" },
]

const LABELS = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "chore", label: "Chore" },
  { value: "regression", label: "Regression" },
]

/** Swatches then a count, so several picks stay one glance rather than a list. */
function StackedDots({
  options,
  palette,
  empty,
}: {
  options: FilterOption[]
  palette: { value: string; dot?: string; tone?: string }[]
  empty: string
}) {
  const swatch = (value: string) => {
    const entry = palette.find((candidate) => candidate.value === value)
    return entry?.dot ?? entry?.tone ?? "bg-muted-foreground"
  }
  if (options.length === 0) return <>{empty}</>
  if (options.length === 1) {
    return (
      <span className="flex min-w-0 items-center gap-1.5">
        <Dot className={swatch(options[0].value)} />
        <span className="truncate">{options[0].label}</span>
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
              swatch(option.value)
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

/** Faces, overlapped, which is what an assignee filter looks like everywhere. */
function StackedPeople({ options }: { options: FilterOption[] }) {
  if (options.length === 0) return <>anyone</>
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <AvatarGroup>
        {options.slice(0, 3).map((option) => {
          const person = TEAM.find((entry) => entry.value === option.value)
          return (
            <Person
              key={option.value}
              img={person?.img ?? "men/1"}
              name={option.label}
            />
          )
        })}
      </AvatarGroup>
      {options.length === 1 ? (
        <span className="truncate">{options[0].label}</span>
      ) : (
        <span className="text-muted-foreground text-xs tabular-nums">
          {options.length}
        </span>
      )}
    </span>
  )
}

// `column` is carried through untouched: the primitive never reads it, and it
// exists for exactly the moment below, where the query is walked back out. A
// picker says "Title" and a path says `title`, but the table says `subject`,
// so without the mapping every rule would come out naming a column the storage
// does not have. A schema whose ids already ARE the storage names can leave it
// off entirely and the walk falls back to the path.
const fields: FilterField[] = [
  {
    id: "title",
    label: "Title",
    type: "text",
    column: "subject",
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
    label: "Status",
    type: "select",
    defaultOperator: "is_any_of",
    options: STATUSES.map((entry) => ({
      value: entry.value,
      label: entry.label,
      icon: <Dot className={entry.dot} />,
    })),
    column: "state",
    renderValue: ({ options }) => (
      <StackedDots options={options} palette={STATUSES} empty="any status" />
    ),
    // Four options, so the built-in editor drops its search box: the input is
    // still there and still owns the keyboard, it is only visually hidden, and
    // typing narrows the list exactly as it does in a native select.
    searchable: false,
    icon: (
      <IconPlaceholder
        lucide="CircleDotIcon"
        tabler="IconCircleDot"
        hugeicons="RecordIcon"
        phosphor="CircleIcon"
        remixicon="RiRecordCircleLine"
      />
    ),
  },
  {
    id: "labels",
    label: "Labels",
    type: "multiselect",
    options: LABELS,
    column: "label_slugs",
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
    id: "priority",
    label: "Priority",
    // A task has ONE priority, so this is a select whose VALUE happens to be a
    // list: `is any of` asks about that single rank, where the `has any of` a
    // multiselect defaults to asks about a set the row does not have.
    type: "select",
    defaultOperator: "is_any_of",
    searchable: false,
    options: PRIORITIES.map((entry) => ({
      value: entry.value,
      label: entry.label,
      icon: <Dot className={entry.tone} />,
    })),
    column: "priority",
    renderValue: ({ options }) => (
      <StackedDots
        options={options}
        palette={PRIORITIES}
        empty="any priority"
      />
    ),
    icon: (
      <IconPlaceholder
        lucide="SignalIcon"
        tabler="IconAntennaBars5"
        hugeicons="ChartUpIcon"
        phosphor="CellSignalHighIcon"
        remixicon="RiSignalTowerLine"
      />
    ),
  },
  {
    id: "assignee",
    label: "Assignee",
    type: "multiselect",
    placeholder: "Search people...",
    // The option panel, widened by the field that needs it. The built-in menu
    // defaults to `w-48`, which holds a status or a tag; these rows carry a
    // 20px face and a full name, and at the default width a two-part name
    // truncates. `className` lands last in the panel's own `cn`, so this wins.
    className: "w-56",
    options: TEAM.map((person) => ({
      value: person.value,
      label: person.label,
      icon: <Person img={person.img} name={person.label} />,
    })),
    column: "assignee_ids",
    // A list of PEOPLE carries no semantic order, unlike the two ramps above.
    pinSelected: true,
    sortSelected: "label",
    renderValue: ({ options }) => <StackedPeople options={options} />,
    icon: (
      <IconPlaceholder
        lucide="UserRoundCheckIcon"
        tabler="IconUserCheck"
        hugeicons="UserCheck01Icon"
        phosphor="UserCheckIcon"
        remixicon="RiUserFollowLine"
      />
    ),
  },
  {
    id: "estimate",
    label: "Estimate",
    type: "number",
    defaultOperator: "lte",
    column: "story_points",
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
  {
    id: "repo",
    label: "Repository",
    icon: (
      <IconPlaceholder
        lucide="FolderGit2Icon"
        tabler="IconGitBranch"
        hugeicons="GitBranchIcon"
        phosphor="GitBranchIcon"
        remixicon="RiGitBranchLine"
      />
    ),
    // A branch carries no column of its own; its LEAVES do. The mapping is
    // collected by dotted path, so `repo.stars` resolves to `repository_stars`
    // while a leaf that omits `column` keeps its own path.
    fields: [
      { id: "name", label: "Name", type: "text", column: "repository_name" },
      {
        id: "branch",
        label: "Branch",
        type: "text",
        column: "repository_branch",
      },
      {
        id: "stars",
        label: "Stars",
        type: "number",
        column: "repository_stars",
      },
    ],
  },
]

// The query model is a boolean TREE and the builder draws it as one, so the
// example opens on a query the chip row could not express:
// `status is any of (in progress, blocked) AND (estimate between 3 and 8 OR
// title contains migration) AND repo.stars >= 100`. The middle term renders as
// an indented, bordered card carrying its own combinator.
// Annotated as FilterNode[], because the rules hold different value shapes and
// the array would otherwise infer the first one for all of them.
const SEED_RULES: FilterNode[] = [
  createFilterRule({
    id: "seed-1",
    path: ["status"],
    operator: "is_any_of",
    value: ["in-progress", "blocked"],
  }),
  createFilterGroup<unknown>({
    id: "seed-group",
    combinator: "or",
    rules: [
      createFilterRule({
        id: "seed-2",
        path: ["estimate"],
        operator: "between",
        value: [3, 8],
      }),
      createFilterRule({
        id: "seed-3",
        path: ["title"],
        operator: "contains",
        value: "migration",
      }),
    ],
  }),
  createFilterRule({
    id: "seed-4",
    path: ["repo", "stars"],
    operator: "gte",
    value: 100,
  }),
]

const SEED: FilterQuery = createFilterQuery(SEED_RULES, "and")

// Two levels down, to show that depth is not capped at one: the inner AND sits
// inside the OR, so `(a OR (b AND c))` survives the round trip through the
// builder and the chip row unchanged.
const DEEP: FilterQuery = createFilterQuery<unknown>(
  [
    createFilterRule({
      id: "deep-1",
      path: ["labels"],
      operator: "has_any_of",
      value: ["bug", "regression"],
    }),
    createFilterGroup<unknown>({
      id: "deep-outer",
      combinator: "or",
      rules: [
        createFilterRule({
          id: "deep-2",
          path: ["status"],
          operator: "is",
          value: "blocked",
        }),
        createFilterGroup<unknown>({
          id: "deep-inner",
          combinator: "and",
          rules: [
            createFilterRule({
              id: "deep-3",
              path: ["estimate"],
              operator: "gte",
              value: 8,
            }),
            createFilterRule({
              id: "deep-4",
              path: ["repo", "branch"],
              operator: "starts_with",
              value: "release/",
            }),
          ],
        }),
      ],
    }),
  ],
  "and"
)

/**
 * Every field's storage name, keyed by dotted path.
 *
 * Collected once from the schema rather than looked up per rule, because a
 * nested field's path is only knowable while walking down to it.
 */
function collectColumns(
  list: FilterField[],
  prefix: string[] = [],
  out: Record<string, string> = {}
): Record<string, string> {
  for (const field of list) {
    const path = [...prefix, field.id]
    if (field.column) out[path.join(".")] = field.column
    if (field.fields) collectColumns(field.fields, path, out)
  }
  return out
}

const COLUMNS = collectColumns(fields)

const OPERATOR_TEXT: Record<string, string> = {
  contains: "contains",
  not_contains: "does not contain",
  starts_with: "starts with",
  ends_with: "ends with",
  is: "is",
  is_not: "is not",
  empty: "is empty",
  not_empty: "is not empty",
  eq: "=",
  neq: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  between: "between",
  not_between: "not between",
  is_any_of: "is any of",
  is_none_of: "is none of",
  has_any_of: "has any of",
  has_all_of: "has all of",
  has_none_of: "has none of",
}

function formatValue(value: unknown): string {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return `'${String(value)}'`
}

/**
 * One node as text, groups parenthesised.
 *
 * The root is NOT wrapped: a query is already an implicit group, and drawing
 * its brackets would suggest a level the tree does not have. Every nested
 * group is, because that is the whole point of one - the reader has to see
 * where the OR stops.
 */
function describeNode(node: FilterNode, depth = 0): string {
  if (isFilterRule(node)) {
    const key = node.path.join(".")
    // A field the schema no longer has still renders, under its own path.
    const column = COLUMNS[key] ?? key
    // A rule exists from the moment an attribute is picked, before a condition
    // has been chosen, so an empty operator is a real state and not a bug.
    if (!node.operator) return `${column} ...`

    const word = OPERATOR_TEXT[node.operator] ?? node.operator
    const values = Array.isArray(node.value) ? node.value : [node.value]

    let text: string
    if (node.value === undefined || node.value === null) {
      text = `${column} ${word}`
    } else if (node.operator === "between" || node.operator === "not_between") {
      text = `${column} ${word} ${formatValue(values[0])} and ${formatValue(values[1])}`
    } else if (values.length > 1) {
      text = `${column} ${word} (${values.map(formatValue).join(", ")})`
    } else {
      text = `${column} ${word} ${formatValue(values[0])}`
    }

    // `negated` is set rather than the operator swapped whenever the operator
    // declares no inverse, which in the built-in catalog means `starts_with`,
    // `ends_with` and `has_all_of`. Reading the query without honouring it
    // would describe the exact opposite of what the chip says.
    return node.negated ? `NOT (${text})` : text
  }

  if (node.rules.length === 0) return ""

  const joiner = ` ${node.combinator.toUpperCase()} `
  const inner = node.rules
    .map((child) => describeNode(child, depth + 1))
    .filter(Boolean)
    .join(joiner)

  return depth === 0 ? inner : `(${inner})`
}

export default function Pattern() {
  const [query, setQuery] = useState<FilterQuery>(SEED)

  const expression = useMemo(
    () => describeNode(query) || "everything",
    [query]
  )

  return (
    <div className="flex w-full flex-col gap-4">
      {/*
        Stacked, not beside the output, and that is a measurement rather than a
        preference. A condition is five cells wide and every nesting level pays
        the leading combinator column, the card border and the indent again, so
        each depth costs roughly 88px off the row. At depth two a 34rem column
        leaves the attribute cell around 45px of text and the row reads
        "# | i. | 8". The builder takes the full width and the output goes
        underneath it, which is the only arrangement where this example's own
        "Nest two levels" button produces something legible.
      */}
      {/*
        The surface is the CONSUMER's, and it is a WRAPPER - the ordinary thing,
        written the ordinary way. The builder owns everything inside itself and
        nothing about the box it sits in, so the box is a `Card` here and could
        be a Frame, a bare section, or nothing at all.

        The primitive used to take this element as an `advancedSurface` prop and
        render itself AS it. That worked, and a wrapper buys the same result
        with no seam to explain: no rule about which way `className` merges, and
        no list of the props the panel has to keep stamping on an element it does
        not own. Inline the panel pads itself by nothing, so the Card's own
        padding is the only padding, which is what makes this read as one box.
      */}
      <Card className="w-full">
        <CardContent>
          <Filters
            variant="advanced"
            advancedMode="inline"
            // Reordering is opt-in, and this is the example it is for: a nested
            // tree somebody is shaping, where the ORDER is part of reading it.
            reorderable
            fields={fields}
            query={query}
            onQueryChange={setQuery}
          />
        </CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setQuery(DEEP)}>
            Nest two levels
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQuery(SEED)}>
            Reset
          </Button>
          <span className="text-muted-foreground ms-auto text-sm tabular-nums">
            {countFilterRules(query)} rules
          </span>
        </div>

        {/*
          ONE output, not two. A group is a parenthesised list joined by ONE
          combinator, so a walk needs no precedence rules to guess at: bracket
          each nested group and the tree reads back exactly as it was built,
          resolved through each field's `column`. That walk is what this example
          is for. The raw `JSON.stringify(query)` panel that used to sit beside
          it was debugger output, not a demonstration: it restated the same tree
          in a shape nobody reads, and it halved the width the readable half had.
        */}
        <code className="bg-muted dark:bg-muted/60 block w-full overflow-x-auto rounded-md border p-3 text-xs">
          {expression}
        </code>
      </div>
    </div>
  )
}
