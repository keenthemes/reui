"use client"

import { useMemo, useState } from "react"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/base/reui/data-grid/data-grid-column-header"
import { DataGridPagination } from "@/registry-reui/bases/base/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/registry-reui/bases/base/reui/data-grid/data-grid-scroll-area"
import { DataGridTable } from "@/registry-reui/bases/base/reui/data-grid/data-grid-table"
import { Filters } from "@/registry-reui/bases/base/reui/filters/filters"
import {
  createFilterQuery,
  createFilterRule,
  isFilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-query"
import type {
  FilterField,
  FilterNode,
  FilterOption,
  FilterQuery,
  FilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-types"
import {
  ColumnDef,
  PaginationState,
  SortingState,
  useTable,
} from "@tanstack/react-table"

import { cn } from "@/registry/bases/base/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import { Card } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                    Tones                                   */
/* -------------------------------------------------------------------------- */

/** A filled swatch, at c-filters-1's size. */
function Dot({ className }: { className: string }) {
  return <span className={cn("size-2 shrink-0 rounded-full", className)} />
}

/**
 * Priority's glyph, and the reason it is a star rather than a third `Dot`:
 * Status, Priority and Availability are all "pick some of a short list", so a
 * third coloured circle would have made one chip read as another. A rank is not
 * a state.
 *
 * OUTLINE in all five icon sets, deliberately. lucide, tabler and hugeicons
 * draw their star with a stroke and would take a `fill-current`, but phosphor
 * and remixicon draw theirs as an already filled RING, which no class can
 * solidify. Filling would therefore give three libraries a solid star and two a
 * hollow one, so all five stay hollow.
 *
 * The colour arrives with its own `!`, and the paths are pinned to inherit it,
 * because every style sheet repaints a highlighted row's descendants with
 * `color: var(--accent-foreground)` at a specificity no plain utility beats.
 * Unpinned, the star greys out under the cursor, and each path's `currentColor`
 * resolves against the repaint rather than against the star. Dots never met
 * this: a `bg-*` swatch has no `color` to repaint.
 */
function Star({ className }: { className: string }) {
  return (
    <IconPlaceholder
      lucide="StarIcon"
      tabler="IconStar"
      hugeicons="StarIcon"
      phosphor="StarIcon"
      remixicon="RiStarLine"
      className={cn("shrink-0 **:text-inherit!", className)}
    />
  )
}

/**
 * The country's flag, drawn the same way in the option row and in the cell.
 *
 * A plain `<img>`, and it stays one: `next/image` would tie a registry example
 * to a framework, and these are 16px SVGs from a CDN, which is the case its
 * optimizer has nothing to offer.
 */
function Flag({ code, className }: { code: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      className={cn("size-4 shrink-0 rounded-full object-cover", className)}
    />
  )
}

/**
 * Three palettes, each settled inside itself.
 *
 * Hues repeat ACROSS the sets (active and online are both green, and in a staff
 * table they should be) but never inside one of the two LABEL sets: the moment
 * two rows of one such menu read as the same colour, the colour has stopped
 * being an identifier there. Priority answers to a different rule again, set
 * out over its own table below.
 *
 * Written out as whole class names because Tailwind scans source text, so a
 * `bg-${hue}-500` assembled at runtime reaches the browser as a class nothing
 * generated.
 */
const STATUSES = [
  { value: "active", label: "Active", dot: "bg-emerald-500" },
  { value: "invited", label: "Invited", dot: "bg-sky-500" },
  { value: "suspended", label: "Suspended", dot: "bg-rose-500" },
]

const AVAILABILITIES = [
  { value: "online", label: "Online", dot: "bg-emerald-500" },
  { value: "away", label: "Away", dot: "bg-amber-500" },
  { value: "busy", label: "Busy", dot: "bg-rose-500" },
  { value: "offline", label: "Offline", dot: "bg-zinc-400" },
]

// Priority is a ramp rather than a set of labels, so its tones run one way and
// the star wears them as `text-*` carrying its own `!`. Cool to hot by hue
// (160, 83, 44, 17 in OKLCH) and rising in chroma the whole way, which is what
// puts the four in an order the eye can take without reading the words.
//
// The top step is `rose-500` and NOT the theme's own `destructive`, which is
// the obvious pick and the wrong one: destructive measures hue 22 in light and
// dark, so it lands BETWEEN High and Urgent and a ladder ending on it doubles
// back. In dark mode it is lighter and less saturated than the step below it
// too, so the worst rank would read as the milder colour. A ramp's last step
// has to be its most intense in every theme, and only a fixed palette step
// promises that.
const PRIORITIES = [
  { value: "low", label: "Low", star: "text-emerald-500!" },
  { value: "medium", label: "Medium", star: "text-yellow-500!" },
  { value: "high", label: "High", star: "text-orange-500!" },
  { value: "urgent", label: "Urgent", star: "text-rose-500!" },
]

const ROLES = [
  { value: "Product Manager", label: "Product Manager" },
  { value: "Data Scientist", label: "Data Scientist" },
  { value: "Designer", label: "Designer" },
  { value: "Developer", label: "Developer" },
]

const DOTS = new Map(
  [...STATUSES, ...AVAILABILITIES].map((tone) => [tone.value, tone.dot])
)

/* -------------------------------------------------------------------------- */
/*                                  The rows                                  */
/* -------------------------------------------------------------------------- */

interface Staff {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  priority: string
  status: string
  availability: string
  location: string
  flag: string
}

const STAFF: Staff[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@apple.com",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    role: "Product Manager",
    priority: "urgent",
    status: "active",
    availability: "online",
    location: "United States",
    flag: "us",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@openai.com",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    role: "Data Scientist",
    priority: "high",
    status: "active",
    availability: "away",
    location: "United Kingdom",
    flag: "gb",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@meta.com",
    avatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    role: "Designer",
    priority: "medium",
    status: "invited",
    availability: "busy",
    location: "Canada",
    flag: "ca",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@tesla.com",
    avatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    role: "Developer",
    priority: "low",
    status: "suspended",
    availability: "offline",
    location: "Australia",
    flag: "au",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@sap.com",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    role: "Developer",
    priority: "high",
    status: "active",
    availability: "online",
    location: "Germany",
    flag: "de",
  },
  {
    id: "6",
    name: "Aron Thompson",
    email: "aron@keenthemes.com",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    role: "Designer",
    priority: "medium",
    status: "active",
    availability: "away",
    location: "Malaysia",
    flag: "my",
  },
  {
    id: "7",
    name: "James Brown",
    email: "james@bbva.es",
    avatar:
      "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    role: "Product Manager",
    priority: "low",
    status: "invited",
    availability: "busy",
    location: "Spain",
    flag: "es",
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "maria@sony.jp",
    avatar:
      "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    role: "Data Scientist",
    priority: "urgent",
    status: "active",
    availability: "offline",
    location: "Japan",
    flag: "jp",
  },
  {
    id: "9",
    name: "Nick Johnson",
    email: "nick@lvmh.fr",
    avatar:
      "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
    role: "Developer",
    priority: "medium",
    status: "active",
    availability: "online",
    location: "France",
    flag: "fr",
  },
  {
    id: "10",
    name: "Liam Thompson",
    email: "liam@eni.it",
    avatar:
      "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
    role: "Designer",
    priority: "low",
    status: "suspended",
    availability: "away",
    location: "Italy",
    flag: "it",
  },
  {
    id: "11",
    name: "Olivia Martinez",
    email: "olivia@vale.br",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
    role: "Data Scientist",
    priority: "high",
    status: "active",
    availability: "busy",
    location: "Brazil",
    flag: "br",
  },
  {
    id: "12",
    name: "Ethan Park",
    email: "ethan@tata.in",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80",
    role: "Product Manager",
    priority: "medium",
    status: "invited",
    availability: "online",
    location: "India",
    flag: "in",
  },
]

/**
 * Every country the rows mention, once each, in the order they introduce them.
 *
 * Derived rather than declared, so a country cannot be offered that no row
 * carries: an option that matches nothing is a filter that looks broken.
 */
const LOCATIONS: FilterOption[] = Array.from(
  new Map(
    STAFF.map((person) => [
      person.location,
      {
        value: person.location,
        label: person.location,
        icon: <Flag code={person.flag} />,
      },
    ])
  ).values()
)

/* -------------------------------------------------------------------------- */
/*                        Stacked value display renderers                     */
/* -------------------------------------------------------------------------- */

/**
 * c-filters-1's treatment, reused rather than re-invented: one pick reads as
 * its swatch and its word, several collapse to overlapping swatches plus a
 * count, so the chip is one width whether two statuses are picked or all three.
 * The empty word is a prop because the same renderer serves two fields.
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
        <Dot className={DOTS.get(options[0].value) ?? "bg-muted-foreground"} />
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
              DOTS.get(option.value) ?? "bg-muted-foreground"
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

/**
 * The same collapse, in priority's own glyph.
 *
 * Split from `StackedDots` rather than parameterised, because the two glyphs do
 * not stack the same way. A dot cuts itself out of its neighbour with `ring-2
 * ring-background`; a ring around a star draws a rounded RECTANGLE around the
 * icon's box, so these lean on each other far less instead and keep their
 * outlines readable.
 *
 * Priority is one field with one ladder, so this renderer, the table it reads
 * and the empty word it falls back to are kept identical here and in
 * c-filters-1. One concept, one implementation, across both examples. That is
 * also why the empty word is written in rather than taken as a prop the way
 * `StackedDots` above takes its: this renderer serves ONE field, that one
 * serves two.
 */
function StackedStars({ options }: { options: FilterOption[] }) {
  if (options.length === 0) return <>any priority</>
  if (options.length === 1) {
    const only = PRIORITIES.find((entry) => entry.value === options[0].value)
    return (
      <span className="flex items-center gap-1.5">
        <Star
          className={cn("size-3.5", only?.star ?? "text-muted-foreground")}
        />
        {options[0].label}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center">
        {options.slice(0, 4).map((option) => {
          const entry = PRIORITIES.find(
            (candidate) => candidate.value === option.value
          )
          return (
            <Star
              key={option.value}
              className={cn(
                "-ml-0.5 size-3.5 first:ml-0",
                entry?.star ?? "text-muted-foreground"
              )}
            />
          )
        })}
      </span>
      <span className="text-muted-foreground text-xs tabular-nums">
        {options.length}
      </span>
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

// One field per column, and no field without a column. That is what makes the
// grid underneath a check on the query rather than an illustration beside it:
// every chip narrows something the table prints, and nothing filters on an
// attribute it does not.
//
// Printed is not the same as on screen, and this note used to claim it was. Six
// columns of real content need about 830px, so in a card narrower than that the
// tail of the row sits past the right edge, behind the scroll area's own
// horizontal scrollbar: about one column short at the ~700px catalog width, two
// in a 560px docs frame. The sizes below are each the widest line that column
// actually holds, which is what keeps the overhang to the tail rather than a
// third of the row.
//
// Icon names are written out per library rather than built by a helper: the
// shadcn CLI rewrites these attributes to a real import at install time and
// only accepts string literals, so a shared `icon(...)` factory would break
// `shadcn add` for everyone installing this example.
const fields: FilterField[] = [
  {
    id: "staff",
    label: "Staff",
    type: "text",
    icon: (
      <IconPlaceholder
        lucide="UserRoundIcon"
        tabler="IconUser"
        hugeicons="UserIcon"
        phosphor="UserIcon"
        remixicon="RiUserLine"
      />
    ),
  },
  {
    id: "role",
    label: "Occupation",
    type: "select",
    // Arity, not the field's type, is what opens a multi-select editor: `is any
    // of` takes many values, so a `select` field edits as a checklist under it.
    defaultOperator: "is_any_of",
    options: ROLES,
    // Four rows are read, not searched. The input is hidden rather than
    // removed: it owns focus and `aria-activedescendant`, so taking it out
    // would take the keyboard with it, and typing still narrows the list.
    searchable: false,
    icon: (
      <IconPlaceholder
        lucide="BriefcaseBusinessIcon"
        tabler="IconBriefcase"
        hugeicons="Briefcase01Icon"
        phosphor="BriefcaseIcon"
        remixicon="RiBriefcaseLine"
      />
    ),
  },
  {
    // A person has ONE priority, so this is a select whose VALUE happens to be
    // a list: `is any of` asks a question about that single rank, where the
    // `has any of` a multiselect would default to asks about a set the row does
    // not have.
    id: "priority",
    label: "Priority",
    type: "select",
    defaultOperator: "is_any_of",
    options: PRIORITIES.map((tone) => ({
      value: tone.value,
      label: tone.label,
      icon: <Star className={cn("size-3.5", tone.star)} />,
    })),
    // No `searchable` key, so the search box stays. Four ranks are few enough
    // to read, so this is the treatment on show rather than a necessity:
    // Occupation, Status and Availability all hide their box, and Priority and
    // Location are what keep the other half of that choice visible.
    //
    // And a box that stays gets a word of its own instead of the generic
    // "Search...". The primitive will not compose one: a built in
    // `Search ${label}...` is hardcoded English no `labels` override can reach,
    // and lowercasing a label is locale hostile besides (Turkish dotted i,
    // German nouns), so the wording belongs to the schema.
    placeholder: "Search priority...",
    renderValue: ({ options }) => <StackedStars options={options} />,
    icon: (
      <IconPlaceholder
        lucide="StarIcon"
        tabler="IconStar"
        hugeicons="StarIcon"
        phosphor="StarIcon"
        remixicon="RiStarLine"
      />
    ),
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    defaultOperator: "is_any_of",
    options: STATUSES.map((tone) => ({
      value: tone.value,
      label: tone.label,
      icon: <Dot className={tone.dot} />,
    })),
    searchable: false,
    renderValue: ({ options }) => (
      <StackedDots options={options} empty="any status" />
    ),
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
    id: "availability",
    label: "Availability",
    type: "select",
    defaultOperator: "is_any_of",
    options: AVAILABILITIES.map((tone) => ({
      value: tone.value,
      label: tone.label,
      icon: <Dot className={tone.dot} />,
    })),
    searchable: false,
    renderValue: ({ options }) => (
      <StackedDots options={options} empty="any availability" />
    ),
    icon: (
      <IconPlaceholder
        lucide="WifiIcon"
        tabler="IconWifi"
        hugeicons="Wifi01Icon"
        phosphor="WifiHighIcon"
        remixicon="RiWifiLine"
      />
    ),
  },
  {
    id: "location",
    label: "Location",
    type: "select",
    defaultOperator: "is_any_of",
    // Twelve countries, so this one keeps its search box: a list that long is
    // typed at rather than scanned.
    options: LOCATIONS,
    placeholder: "Search locations...",
    // A country list carries no order of its own, unlike the ladders above, so
    // it is the one field here that asks for alphabetical.
    //
    // `sortSelected` stands on its own: this field does not set `pinSelected`,
    // so there is one group and the whole menu reads A to Z. On a field that
    // did stack its picks, the same setting would order each group instead.
    // The ladders keep their schema order either way: sorting one would print
    // Low, Medium, High, Urgent as High, Low, Medium, Urgent, and destroy the
    // only thing the rank had going for it.
    sortSelected: "label",
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

/* -------------------------------------------------------------------------- */
/*                          Query tree to row predicate                       */
/* -------------------------------------------------------------------------- */

/**
 * The value one field reads from one row.
 *
 * A lookup rather than `row[path]` because the Staff column prints a name AND
 * an email: a filter named after that column has to search both, or it hides a
 * row whose visible cell holds exactly what was typed.
 */
function readField(row: Staff, path: string): unknown {
  if (path === "staff") return `${row.name} ${row.email}`
  return row[path as keyof Staff]
}

/**
 * Compiling the query to a row predicate.
 *
 * The primitive ships no compilers on purpose: every backend wants a different
 * shape, and a half-right SQL emitter is worse than none. What it does
 * guarantee is that the query is a plain serialisable tree, so a compiler is a
 * short recursive function like this one. Note it handles GROUPS as well as
 * rules, so the same code keeps working when nested groups are turned on.
 *
 * The switch covers the whole OPERATOR CATALOG rather than only the operators
 * this schema's six fields offer, which is why the numeric arms are here with
 * no number field in sight: the catalog is fixed, so a compiler written against
 * it is complete, and adding a Salary column later needs no change here.
 */
function matchesRule(row: Staff, rule: FilterRule): boolean {
  const actual = readField(row, rule.path[0])
  const value = rule.value

  const result = (() => {
    switch (rule.operator) {
      case "contains":
        return String(actual)
          .toLowerCase()
          .includes(String(value).toLowerCase())
      case "not_contains":
        return !String(actual)
          .toLowerCase()
          .includes(String(value).toLowerCase())
      case "starts_with":
        return String(actual)
          .toLowerCase()
          .startsWith(String(value).toLowerCase())
      case "ends_with":
        return String(actual)
          .toLowerCase()
          .endsWith(String(value).toLowerCase())
      case "is":
      case "eq":
        return String(actual) === String(value)
      case "is_not":
      case "neq":
        return String(actual) !== String(value)
      case "is_any_of":
        return (value as string[] | undefined)?.includes(String(actual)) ?? true
      case "is_none_of":
        return !(
          (value as string[] | undefined)?.includes(String(actual)) ?? false
        )
      case "gt":
        return Number(actual) > Number(value)
      case "gte":
        return Number(actual) >= Number(value)
      case "lt":
        return Number(actual) < Number(value)
      case "lte":
        return Number(actual) <= Number(value)
      case "between": {
        const [from, to] = (value as number[] | undefined) ?? []
        return Number(actual) >= Number(from) && Number(actual) <= Number(to)
      }
      case "not_between": {
        const [from, to] = (value as number[] | undefined) ?? []
        return !(Number(actual) >= Number(from) && Number(actual) <= Number(to))
      }
      case "empty":
        return actual === undefined || actual === null || actual === ""
      case "not_empty":
        return !(actual === undefined || actual === null || actual === "")
      default:
        return true
    }
  })()

  return rule.negated ? !result : result
}

/**
 * A rule with nothing to test yet, which matches everything.
 *
 * `undefined` is the obvious case: the grid must not empty out while a value is
 * still being chosen. The EMPTY LIST is the one that actually bit. Unchecking
 * the last option of a many-arity operator commits `[]`, not `undefined`, so
 * `Availability is any of` was reachable with an empty value, and there the chip
 * printed "any availability" while a literal `[].includes(...)` matched no row
 * at all: the same words as an unfinished rule, and the opposite result.
 *
 * An empty list is the absence of a constraint, exactly as the chip says. Fixing
 * it here rather than in the renderer is deliberate - the word is right, the
 * predicate was wrong.
 *
 * `empty` and `not_empty` are excluded because they carry no value: for those
 * two, having none is the whole test.
 */
function isIncomplete(rule: FilterRule): boolean {
  if (rule.operator === "empty" || rule.operator === "not_empty") return false
  return (
    rule.value === undefined ||
    (Array.isArray(rule.value) && rule.value.length === 0)
  )
}

function matches(row: Staff, node: FilterNode): boolean {
  if (isFilterRule(node)) {
    if (isIncomplete(node)) return true
    return matchesRule(row, node)
  }
  if (node.rules.length === 0) return true
  return node.combinator === "and"
    ? node.rules.every((child) => matches(row, child))
    : node.rules.some((child) => matches(row, child))
}

/* -------------------------------------------------------------------------- */
/*                                  The page                                  */
/* -------------------------------------------------------------------------- */

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

/** Where a value sits in its ladder. The sort key for the three ranked columns. */
function rankIn(ladder: { value: string }[], value: string) {
  return ladder.findIndex((entry) => entry.value === value)
}

export default function Pattern() {
  const [query, setQuery] = useState<FilterQuery>(() =>
    createFilterQuery([
      createFilterRule({
        id: "seed-1",
        path: ["status"],
        operator: "is_any_of",
        value: ["active", "invited"],
      }),
    ])
  )
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])

  const rows = useMemo(
    () => STAFF.filter((row) => matches(row, query)),
    [query]
  )

  const columns = useMemo<ColumnDef<DataGridFeatures, Staff>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Staff" column={column} />
        ),
        // `min-w-0` on the text block and `truncate` on both lines, because a
        // flex child's default `min-width: auto` refuses to shrink below its
        // content: without it the longest address here pushes out of its column
        // and prints across Occupation instead of ending in an ellipsis.
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-foreground truncate font-medium">
                {row.original.name}
              </div>
              <div className="text-muted-foreground truncate text-xs">
                {row.original.email}
              </div>
            </div>
          </div>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataGridColumnHeader title="Occupation" column={column} />
        ),
        // Wide enough for the longest title on ONE line. A column sized to the
        // average wraps its outliers, and a wrapped cell is a taller row for
        // every other row in the page.
        cell: (info) => (
          <span className="whitespace-nowrap">{info.getValue() as string}</span>
        ),
        size: 155,
        enableSorting: true,
      },
      {
        // Sorted by the ladder's own order, not by the word. An `accessorKey`
        // would sort a priority column High, Low, Medium, Urgent, which is
        // alphabetical and meaningless; the three ranked columns here all sort
        // on their rank and print their label from the row.
        id: "priority",
        accessorFn: (row) => rankIn(PRIORITIES, row.priority),
        header: ({ column }) => (
          <DataGridColumnHeader title="Priority" column={column} />
        ),
        // `size-3.5`, the same star the menu row and the chip draw. Every other
        // glyph here is already one size in both places - the flag is `size-4`
        // in the option list and in its cell, the dot `size-2` in both - and a
        // priority that changed size on its way from the filter to the row
        // would be the only one that did.
        cell: ({ row }) => {
          const tone = PRIORITIES.find(
            (entry) => entry.value === row.original.priority
          )
          return (
            <span className="flex items-center gap-1.5">
              <Star className={cn("size-3.5", tone?.star)} />
              {tone?.label}
            </span>
          )
        },
        size: 110,
        enableSorting: true,
      },
      {
        id: "status",
        accessorFn: (row) => rankIn(STATUSES, row.status),
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        // A badge here and a bare swatch in the menu, deliberately: the option
        // row prints the word beside the swatch already, so a badge there would
        // say "Invited" twice, while a cell holding nothing but the word needs
        // the box to keep it from reading as ordinary text.
        cell: ({ row }) => {
          const tone = STATUSES.find(
            (entry) => entry.value === row.original.status
          )
          return (
            <Badge variant="outline" className="gap-1.5">
              <Dot className={tone?.dot ?? "bg-muted-foreground"} />
              {tone?.label}
            </Badge>
          )
        },
        size: 110,
        enableSorting: true,
      },
      {
        id: "availability",
        accessorFn: (row) => rankIn(AVAILABILITIES, row.availability),
        header: ({ column }) => (
          <DataGridColumnHeader title="Availability" column={column} />
        ),
        cell: ({ row }) => {
          const tone = AVAILABILITIES.find(
            (entry) => entry.value === row.original.availability
          )
          return (
            <span className="flex items-center gap-1.5">
              <Dot className={tone?.dot ?? "bg-muted-foreground"} />
              {tone?.label}
            </span>
          )
        },
        size: 115,
        enableSorting: true,
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <DataGridColumnHeader title="Location" column={column} />
        ),
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5">
            <Flag code={row.original.flag} />
            {row.original.location}
          </span>
        ),
        size: 140,
        enableSorting: true,
      },
    ],
    []
  )

  const table = useTable({
    features: dataGridFeatures,
    columns,
    // The FILTERED rows, not the full set, so sorting, paging and the record
    // count are all taken over what the query left standing.
    data: rows,
    pageCount: Math.ceil(rows.length / pagination.pageSize),
    getRowId: (row: Staff) => row.id,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  return (
    <DataGrid
      table={table}
      recordCount={rows.length}
      emptyMessage="No staff match these filters"
      // Dense, because the toolbar above it is the subject and the rows are the
      // evidence: five rows at the default rung cost about 60px more, and this
      // whole card has to hold its height inside one authored frame.
      //
      // Density is NOT what keeps the pager visible, and the note here used to
      // say it was. `DataGridPagination` goes single row at `sm`, which is a
      // VIEWPORT query, not a container one, so in any frame narrower than
      // 640px it stacks its three parts however short the rows are: page
      // buttons, record range, then rows-per-page, about 140px of it. Nothing
      // this example can pass shortens that, so the example's `previewHeight`
      // is what pays for it, and 360 was never enough.
      tableLayout={{ dense: true }}
    >
      <Card className="w-full gap-0 py-0">
        <div className="border-b p-3">
          <Filters
            fields={fields}
            query={query}
            onQueryChange={(next) => {
              setQuery(next)
              // Back to page one on every edit. A narrower query can leave the
              // current page past the end of the result set, and a grid drawing
              // nothing under a pager that reports rows is worse than a grid
              // that moved.
              setPagination((current) => ({ ...current, pageIndex: 0 }))
            }}
            showClear
          />
        </div>

        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>

        <div className="border-t p-3">
          {/*
            Four overrides, and every one of them undoes the same bug.
            `DataGridPagination` goes single row at `sm`, which is a VIEWPORT
            query rather than a container one, so inside a card narrower than
            640px it stacks its three parts however wide the card itself is:
            page buttons, then the record range, then rows-per-page, reversed by
            `order-*` and about 140px tall. In a preview frame that is most of
            the height this example has to spend, and a pager nobody can see
            cannot show that the query changed the page count.
              flex-row py-0      the parent's own axis and padding. Plain
                                 utilities, because the primitive merges this
                                 className through `cn`, so tailwind-merge drops
                                 the `flex-col` and `py-2.5` it replaces.
              **:order-none!     source order at every depth. Two levels need
                                 it, the two halves of the bar and the range
                                 against the buttons inside the right half.
              *:py-0!            the two halves' own stacking padding.
              *:last:flex-row!   the right half, which stacks internally too.
            The three `!` are load-bearing: those classes live on the
            primitive's own children, out of tailwind-merge's reach, so nothing
            else can win against them.

            `flex-wrap` is left alone deliberately, so this degrades rather than
            breaks: on a genuinely narrow phone the two halves wrap to two rows
            instead of forcing a 400px row into 375px.
          */}
          <DataGridPagination
            sizes={[5, 10, 25]}
            className="flex-row py-0 **:order-none! *:py-0! *:last:flex-row!"
          />
        </div>
      </Card>
    </DataGrid>
  )
}
