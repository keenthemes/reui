"use client"

import { useState } from "react"
import { Filters } from "@/registry-reui/bases/radix/reui/filters/filters"
import {
  createFilterQuery,
  createFilterRule,
} from "@/registry-reui/bases/radix/reui/filters/filters-query"
import type {
  FilterField,
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
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                  Fixtures                                  */
/* -------------------------------------------------------------------------- */

function Dot({ className }: { className: string }) {
  return <span className={cn("size-2 shrink-0 rounded-full", className)} />
}

/**
 * Priority's swatch, and the reason it is a star rather than a second `Dot`:
 * Status and Priority are both "pick some of a short list", so drawing both
 * with a coloured circle made one chip read as the other. A rank is not a
 * state.
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
 * Nobody, as a real `Avatar` rather than a lookalike span.
 *
 * `AvatarGroup` rings and overlaps its `[data-slot=avatar]` children only, so a
 * hand-rolled circle would sit in the stack without the ring the others get.
 */
function Unassigned() {
  return (
    <Avatar className="size-5">
      <AvatarFallback className="text-muted-foreground [&_svg]:size-3">
        <IconPlaceholder
          lucide="UserMinusIcon"
          tabler="IconUserMinus"
          hugeicons="UserRemove01Icon"
          phosphor="UserMinusIcon"
          remixicon="RiUserUnfollowLine"
        />
      </AvatarFallback>
    </Avatar>
  )
}

// The colour class each entry wears is named for the glyph that wears it, so a
// swatch and a rank can never be read off the same key by accident.
const STATUSES = [
  { value: "todo", label: "To Do", dot: "bg-zinc-400" },
  { value: "in-progress", label: "In Progress", dot: "bg-amber-500" },
  { value: "review", label: "In Review", dot: "bg-sky-500" },
  { value: "done", label: "Done", dot: "bg-emerald-500" },
  { value: "cancelled", label: "Cancelled", dot: "bg-destructive" },
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

// Long enough that the menu scrolls, which is the point: this is the field
// that opts into both the pinned stack and a taller panel, and neither is
// legible on a list that fits whole.
const TEAM = [
  { value: "ada", label: "Ada Lovelace", img: "women/1" },
  { value: "grace", label: "Grace Hopper", img: "women/2" },
  { value: "alan", label: "Alan Turing", img: "men/3" },
  { value: "katherine", label: "Katherine Johnson", img: "women/4" },
  { value: "edsger", label: "Edsger Dijkstra", img: "men/5" },
  { value: "barbara", label: "Barbara Liskov", img: "women/6" },
  { value: "tim", label: "Tim Berners-Lee", img: "men/7" },
  { value: "margaret", label: "Margaret Hamilton", img: "women/8" },
  { value: "donald", label: "Donald Knuth", img: "men/9" },
  { value: "radia", label: "Radia Perlman", img: "women/10" },
  { value: "linus", label: "Linus Torvalds", img: "men/11" },
  { value: "anita", label: "Anita Borg", img: "women/12" },
  { value: "ken", label: "Ken Thompson", img: "men/13" },
  { value: "frances", label: "Frances Allen", img: "women/14" },
  { value: "dennis", label: "Dennis Ritchie", img: "men/15" },
  { value: "shafi", label: "Shafi Goldwasser", img: "women/16" },
  { value: "vint", label: "Vint Cerf", img: "men/17" },
  { value: "carol", label: "Carol Shaw", img: "women/18" },
  { value: "guido", label: "Guido van Rossum", img: "men/19" },
  { value: "jean", label: "Jean Bartik", img: "women/20" },
]

/** 120 rows, so the list genuinely searches and scrolls. */
const COUNTRIES: FilterOption[] = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados",
  "Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Botswana","Brazil",
  "Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada",
  "Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia",
  "Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Ecuador","Egypt",
  "Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia",
  "Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
  "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya",
  "Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali",
  "Malta","Mexico","Moldova","Monaco","Mongolia","Morocco","Mozambique",
  "Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Nigeria","Norway",
  "Oman","Pakistan","Panama","Paraguay","Peru","Philippines","Poland",
  "Portugal","Qatar","Romania","Rwanda","Senegal","Serbia","Singapore",
].map((name) => ({ value: name.toLowerCase().replace(/\s+/g, "-"), label: name }))

/** A directory too large to ship to the client, so it pages over the wire. */
const DIRECTORY: FilterOption[] = Array.from({ length: 4000 }, (_, index) => ({
  value: `u-${index}`,
  label: `Contact ${index + 1}`,
}))

function searchDirectory(query: string, signal: AbortSignal, cursor?: string) {
  const needle = query.trim().toLowerCase()
  const matches = DIRECTORY.filter((option) =>
    option.label.toLowerCase().includes(needle)
  )
  const start = cursor ? Number(cursor) : 0
  const page = matches.slice(start, start + 25)
  const next = start + 25
  return new Promise<{ items: FilterOption[]; nextCursor?: string }>(
    (resolve, reject) => {
      const timer = setTimeout(
        () =>
          resolve({
            items: page,
            nextCursor: next < matches.length ? String(next) : undefined,
          }),
        260
      )
      signal.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(new DOMException("Aborted", "AbortError"))
      })
    }
  )
}

/* -------------------------------------------------------------------------- */
/*                        Stacked value display renderers                     */
/* -------------------------------------------------------------------------- */

/**
 * Overlapping swatches plus a count, instead of "3 selected".
 *
 * Status only. Priority used to share this renderer behind an `empty` prop,
 * which meant sharing the lookup too: both branches searched
 * `STATUSES.concat(PRIORITIES)` and took the first hit, so the day the two
 * tables happened to share a value one field would silently have worn the
 * other's colour. Each renderer now reads its own table, and since one table
 * keys its class as `dot` and the other as `star`, that concat no longer even
 * type-checks.
 */
function StackedDots({ options }: { options: FilterOption[] }) {
  if (options.length === 0) return <>any status</>
  if (options.length === 1) {
    const only = STATUSES.find((entry) => entry.value === options[0].value)
    return (
      <span className="flex items-center gap-1.5">
        <Dot className={only?.dot ?? "bg-muted-foreground"} />
        {options[0].label}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center">
        {options.slice(0, 4).map((option) => {
          const entry = STATUSES.find(
            (candidate) => candidate.value === option.value
          )
          return (
            <span
              key={option.value}
              className={cn(
                "ring-background -ml-1 size-2.5 rounded-full ring-2 first:ml-0",
                entry?.dot ?? "bg-muted-foreground"
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

/**
 * The same three branches as `StackedDots`, in the other visual language.
 *
 * Split rather than parameterised because the two glyphs do not stack the same
 * way. A dot cuts itself out of its neighbour with `ring-2 ring-background`; a
 * ring around a star draws a rounded RECTANGLE around the icon's box, so these
 * lean on each other far less instead and keep their outlines readable. Folding
 * that into one renderer would have meant passing the swatch, the table, the
 * overlap and the empty word, which is the entire component as arguments.
 * `StackedPeople` below already settled this question the same way.
 *
 * Priority is one field with one ladder, so this renderer, the table it reads
 * and the empty word it falls back to are kept identical here and in
 * c-filters-7. One concept, one implementation, across both examples.
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

/** A teammate's face, or the icon that stands in for nobody. */
function Face({ option }: { option: FilterOption }) {
  const entry = TEAM.find((candidate) => candidate.value === option.value)
  return entry ? <Person img={entry.img} name={entry.label} /> : <Unassigned />
}

/**
 * A real `AvatarGroup`, plus an overflow count.
 *
 * The group keeps its default `ring-2`, which reads as a wider collar once the
 * faces drop to 16px, and the two overrides both follow from that size: the
 * stack tightens to `-space-x-1`, because the default `-space-x-2` hides half
 * of a 16px face, and `size-4` beats `Person`'s own `size-5` on specificity
 * exactly as the group's own ring does. The count appears only on genuine
 * overflow, so three picks show three faces and no redundant "3" beside them.
 */
function StackedPeople({ options }: { options: FilterOption[] }) {
  if (options.length === 0) return <>anyone</>
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
          <Face key={String(option.value)} option={option} />
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

// Icon names are written out per field rather than built by a helper: the
// shadcn CLI rewrites these attributes to a real import at install time and
// only accepts string literals, so a shared `icon(...)` factory would break
// `shadcn add` for everyone installing this example.
const fields: FilterField[] = [
  {
    id: "description",
    label: "Description",
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
    label: "Status",
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
    options: STATUSES.map((entry) => ({
      value: entry.value,
      label: entry.label,
      icon: <Dot className={entry.dot} />,
    })),
    // The one field here that turns its search box off, so the treatment is
    // visible next to the two that keep theirs. The input is still rendered,
    // only visually hidden: it is what owns focus and `aria-activedescendant`,
    // so removing it would take the keyboard with it, and typing still narrows
    // exactly as it does in a native select. Priority below keeps its box, and
    // Country needs one, because 120 rows are not scanned by eye.
    searchable: false,
    // Stack the picks at the top, with a rule under them. Off by default in
    // the primitive, because a list short enough to read whole should not
    // reorder itself under the reader; this example turns it on across every
    // option field so the treatment can be compared on a five row status, a
    // people list with an exclusive row, 120 countries and a paged directory.
    pinSelected: true,
    renderValue: ({ options }) => <StackedDots options={options} />,
  },
  {
    id: "priority",
    label: "Priority",
    // A task has ONE priority, so this is a select - and `is`, the SINGLE-valued
    // operator, is what says so. `is any of` is a question about a set, which
    // reads oddly against a rank a row can only hold one of; it is still in the
    // menu for anyone filtering on two of them at once. Assignee below is the
    // real multiselect, because a task can genuinely carry several people.
    type: "select",
    defaultOperator: "is",
    // The value menu's search box, named for the list under it instead of the
    // generic "Search...".
    //
    // The primitive will not compose this for you, on purpose: a built in
    // `Search ${label}...` is hardcoded English that no `labels` override can
    // reach, and lowercasing a label is locale hostile besides (Turkish dotted
    // i, German nouns). So the wording is the schema's to give, and every
    // searchable field here gives it.
    placeholder: "Search priority...",
    // A star, matching the glyph its options wear. The field icon rides in the
    // chip and in the attribute list, so a flag here would announce one thing
    // and the menu under it another.
    icon: (
      <IconPlaceholder
        lucide="StarIcon"
        tabler="IconStar"
        hugeicons="StarIcon"
        phosphor="StarIcon"
        remixicon="RiStarLine"
      />
    ),
    options: PRIORITIES.map((entry) => ({
      value: entry.value,
      label: entry.label,
      icon: <Star className={cn("size-3.5", entry.star)} />,
    })),
    pinSelected: true,
    renderValue: ({ options }) => <StackedStars options={options} />,
  },
  {
    id: "assignee",
    label: "Assignee",
    type: "multiselect",
    placeholder: "Search people...",
    icon: (
      <IconPlaceholder
        lucide="UserRoundCheckIcon"
        tabler="IconUserCheck"
        hugeicons="UserCheck01Icon"
        phosphor="UserCheckIcon"
        remixicon="RiUserFollowLine"
      />
    ),
    options: [
      ...TEAM.map((person) => ({
        value: person.value,
        label: person.label,
        icon: <Person img={person.img} name={person.label} />,
      })),
      // "Nobody" is a real filter, not the absence of one, and `exclusive` is
      // what makes it behave like one: it clears the other picks, they clear
      // it, and it sits under a rule of its own below the people.
      {
        value: "unassigned",
        label: "Unassigned",
        icon: <Unassigned />,
        exclusive: true,
      },
    ],
    pinSelected: true,
    // Inside each group the order is the schema's by default, because option
    // order is usually semantic - Priority reads Low to Urgent above and
    // sorting it would destroy that. A list of PEOPLE carries no such order,
    // so this one opts into alphabetical. "Unassigned" sits outside both
    // groups either way: it is grouped by role, not by whether it is ticked.
    sortSelected: "label",
    // BIGGER on both axes than the defaults, because this is the one field where
    // the stack has to be readable and the rows are the widest the primitive
    // draws: an avatar, then a full name. At the panel's own `w-48` a name like
    // "Katherine Johnson" truncates, and at the default height the rule under
    // the pinned picks lands near the bottom edge with barely a row of "the
    // rest" below it. Both land on the panel after the primitive's own, so a
    // `w-*` and the height variable simply win.
    className: "w-64 [--cascader-max-height:26rem]",
    renderValue: ({ options }) => <StackedPeople options={options} />,
  },
  {
    id: "country",
    label: "Country",
    type: "select",
    defaultOperator: "is_any_of",
    placeholder: "Search countries...",
    // 120 options, so the editor shows its search box and the list scrolls.
    // This is the length the stack is actually for: without it a pick made an
    // hour ago is somewhere behind a scrollbar.
    options: COUNTRIES,
    pinSelected: true,
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
  {
    id: "contact",
    label: "Contact",
    type: "select",
    defaultOperator: "is_any_of",
    placeholder: "Search contacts...",
    // Paged over the wire, with abort and a Load more row.
    loadOptions: (query, { signal, cursor }) =>
      searchDirectory(query, signal, cursor),
    // Load more APPENDS, so without the stack a pick made on the first page
    // sinks a little further with every page fetched after it. Pinning holds
    // it at the top of whatever has been loaded. It cannot do more than that:
    // an async list only ever shows the pages it has, so a pick that is in no
    // loaded page is not a row here at all, stacked or otherwise. The chip
    // still draws it, off the resolved-option cache.
    pinSelected: true,
    icon: (
      <IconPlaceholder
        lucide="BookUserIcon"
        tabler="IconAddressBook"
        hugeicons="ContactBookIcon"
        phosphor="AddressBookIcon"
        remixicon="RiContactsBookLine"
      />
    ),
  },
  {
    id: "company",
    label: "Company",
    icon: (
      <IconPlaceholder
        lucide="Building2Icon"
        tabler="IconBuilding"
        hugeicons="Building02Icon"
        phosphor="BuildingsIcon"
        remixicon="RiBuilding2Line"
      />
    ),
    // Nested. A branch NAVIGATES: pressing it opens its attributes, which is
    // what its chevron and its count promise, and it never commits a filter on
    // itself. Filtering on the company as a whole is the explicit leaf below.
    fields: [
      { id: "name", label: "Name", type: "text" },
      { id: "domain", label: "Domain", type: "text" },
      {
        id: "team",
        label: "Team",
        count: 26,
        fields: [
          { id: "lead", label: "Lead", type: "text" },
          { id: "size", label: "Size", type: "number" },
        ],
      },
      {
        id: "location",
        label: "Primary location",
        count: 3,
        fields: [
          { id: "city", label: "City", type: "text" },
          { id: "country", label: "Country", type: "text" },
        ],
      },
    ],
  },
  {
    id: "score",
    label: "Score",
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
  {
    id: "archived",
    label: "Archived",
    type: "boolean",
    icon: (
      <IconPlaceholder
        lucide="ArchiveIcon"
        tabler="IconArchive"
        hugeicons="Archive02Icon"
        phosphor="ArchiveIcon"
        remixicon="RiArchiveLine"
      />
    ),
  },
]

export default function Pattern() {
  const [query, setQuery] = useState<FilterQuery>(() =>
    createFilterQuery([
      // Two chips, because the two stacked treatments are the thing on show and
      // neither survives a screenshot of an empty bar. Four assignees overflow
      // the group and print the "+1", two priorities collapse to overlapping
      // stars and a count, so a reader arriving at the closed bar can already
      // see both languages and how each one counts.
      createFilterRule({
        id: "seed-1",
        path: ["assignee"],
        operator: "has_any_of",
        value: ["ada", "grace", "alan", "katherine"],
      }),
      createFilterRule({
        id: "seed-2",
        path: ["priority"],
        // `is`, matching the field's own default: a rank a row can only hold
        // one of reads oddly under a question about a set.
        operator: "is",
        value: ["urgent"],
      }),
    ])
  )

  return (
    <div className="flex w-full flex-col gap-5">
      <Filters
        fields={fields}
        query={query}
        onQueryChange={setQuery}
        showClear
      />

      {/*
        `max-h-80` is the largest step that still clears the frame. Measured in
        sera, the tallest style, at the narrowest card: the bar wraps to three
        rows and stops there at 136px, which puts this box at y=160 inside the
        560px `previewHeight`. 320px of readout leaves an 80px cushion. Going
        further would clip the box off the bottom SILENTLY, because the preview
        frame hides its own scrollbar, so re-measure before raising it again.
      */}
      <pre className="bg-muted dark:bg-muted/60 max-h-80 w-full overflow-auto rounded-md border p-3 text-xs">
        {JSON.stringify(query, null, 2)}
      </pre>
    </div>
  )
}
