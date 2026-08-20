"use client"

import { useState } from "react"
import { Filters } from "@/registry-reui/bases/base/reui/filters/filters"
import {
  createFilterQuery,
  createFilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-query"
import type {
  FilterField,
  FilterOption,
  FilterQuery,
} from "@/registry-reui/bases/base/reui/filters/filters-types"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                  Fixtures                                  */
/* -------------------------------------------------------------------------- */

interface Person {
  value: string
  label: string
  img: string
}

function Face({ img, name }: { img: string; name: string }) {
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

const TEAM = [
  { value: "ada", label: "Ada Lovelace", img: "women/1", role: "Engineering" },
  { value: "grace", label: "Grace Hopper", img: "women/2", role: "Engineering" },
  { value: "alan", label: "Alan Turing", img: "men/3", role: "Research" },
  {
    value: "katherine",
    label: "Katherine Johnson",
    img: "women/4",
    role: "Research",
  },
  { value: "edsger", label: "Edsger Dijkstra", img: "men/5", role: "Platform" },
  { value: "barbara", label: "Barbara Liskov", img: "women/6", role: "Platform" },
  { value: "tim", label: "Tim Berners-Lee", img: "men/7", role: "Design" },
  {
    value: "margaret",
    label: "Margaret Hamilton",
    img: "women/8",
    role: "Design",
  },
]

/** A directory far too large to ship to the client, so it pages over the wire. */
const DIRECTORY: Person[] = Array.from({ length: 5000 }, (_, index) => ({
  value: `u-${index}`,
  label: `Contact ${index + 1}`,
  img: `${index % 2 === 0 ? "women" : "men"}/${index % 90}`,
}))

function toOption(person: Person): FilterOption {
  return {
    value: person.value,
    label: person.label,
    icon: <Face img={person.img} name={person.label} />,
    // The whole person rides along, so `renderValue` can draw the face from
    // the RESOLVED option rather than keeping a lookup of its own.
    data: person,
  }
}

/**
 * One page of the directory, over a fake wire.
 *
 * `loadOptions` receives an AbortSignal and an optional cursor. Debouncing the
 * search, aborting a superseded request, appending the next page and caching a
 * loaded value's label all come from the shared option service, so a field only
 * has to fetch.
 */
function searchDirectory(query: string, signal: AbortSignal, cursor?: string) {
  const needle = query.trim().toLowerCase()
  const matches = DIRECTORY.filter((person) =>
    person.label.toLowerCase().includes(needle)
  )
  const start = cursor ? Number(cursor) : 0
  const next = start + 25

  return new Promise<{ items: FilterOption[]; nextCursor?: string }>(
    (resolve, reject) => {
      const timer = setTimeout(
        () =>
          resolve({
            items: matches.slice(start, next).map(toOption),
            nextCursor: next < matches.length ? String(next) : undefined,
          }),
        280
      )
      signal.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(new DOMException("Aborted", "AbortError"))
      })
    }
  )
}

/** Names for ids nobody has searched for. The saved-view half of the problem. */
function fetchPeople(ids: string[]): Promise<Person[]> {
  const wanted = new Set(ids)
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(DIRECTORY.filter((person) => wanted.has(person.value))),
      240
    )
  })
}

/* -------------------------------------------------------------------------- */
/*                             Stacked avatars                                */
/* -------------------------------------------------------------------------- */

/**
 * Overlapping avatars plus a count, instead of "4 selected". The same treatment
 * the first example uses, on the faces this one already has.
 *
 * A real `AvatarGroup`, so the overlap and the ring come from the part rather
 * than from a wrapper span pretending to be one. The two overrides both follow
 * from the size: the stack tightens to `-space-x-1`, because the default
 * `-space-x-2` hides half of a 16px face, and `size-4` beats `Face`'s own
 * `size-5` on specificity exactly as the group's own `ring-2` does. The count
 * appears only on genuine overflow, so three picks show three faces and no
 * redundant "3" beside them.
 */
function StackedFaces({ people }: { people: Person[] }) {
  if (people.length === 0) return <>anyone</>

  if (people.length === 1) {
    return (
      <span className="flex items-center gap-1.5">
        <Face img={people[0].img} name={people[0].label} />
        {people[0].label}
      </span>
    )
  }

  const overflow = people.length - 3

  return (
    <span className="flex items-center gap-1.5">
      <AvatarGroup className="-space-x-1 *:data-[slot=avatar]:size-4">
        {people.slice(0, 3).map((person) => (
          <Face key={person.value} img={person.img} name={person.label} />
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
/*                                  Queries                                   */
/* -------------------------------------------------------------------------- */

/**
 * What a persisted view actually looks like: ids only, no labels.
 *
 * Two rules, because the ids in them resolve by two different routes. The team
 * is closed, so its labels ship with the schema; the contacts are ids out of a
 * directory nobody has searched yet, and only the field's own `resolveValues`
 * can turn those into names.
 */
const SAVED_VIEW: FilterQuery = createFilterQuery([
  createFilterRule({
    id: "saved-1",
    path: ["assignee"],
    operator: "has_any_of",
    value: ["edsger", "barbara", "tim"],
  }),
  createFilterRule({
    id: "saved-2",
    path: ["contact"],
    operator: "is_any_of",
    value: ["u-41", "u-1200", "u-3311", "u-4802"],
  }),
])

const SEED: FilterQuery = createFilterQuery([
  createFilterRule({
    id: "seed-1",
    path: ["assignee"],
    operator: "has_any_of",
    value: ["ada", "grace", "alan", "katherine"],
  }),
])

const fields: FilterField[] = [
  {
    id: "assignee",
    label: "Assignee",
    type: "multiselect",
    // The option panel, widened by the field that needs it. The built-in menu
    // defaults to `w-48`, which holds a status or a tag; these rows carry a
    // 20px face, a full name and a role beneath it, and at the default width
    // "Katherine Johnson" truncated to "Katherine Johns...". `className` lands
    // last in the panel's own `cn`, so this resolves the two widths in the
    // schema's favour rather than by source order.
    className: "w-56",
    // A closed team: options ship with the schema, each row carrying a face
    // and the person's group as its description.
    options: TEAM.map((person) => ({
      ...toOption(person),
      description: person.role,
    })),
    renderValue: ({ options }) => (
      <StackedFaces people={options.map((option) => option.data as Person)} />
    ),
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
    id: "contact",
    label: "Contact",
    type: "select",
    defaultOperator: "is_any_of",
    placeholder: "Search 5,000 contacts...",
    loadOptions: (search, { signal, cursor }) =>
      searchDirectory(search, signal, cursor),
    /**
     * The saved-view half. A restored query holds ids the loader has never
     * returned, so the primitive asks for exactly the values it is holding,
     * caches what comes back, and every chip under this root reads the
     * result: no app-level id cache, no effect watching the query.
     */
    resolveValues: (ids) =>
      fetchPeople(ids).then((people) => people.map(toOption)),
    renderValue: ({ values, options, labels }) => {
      // Between restore and resolution there are values but no options yet;
      // the count keeps the chip honest until the names land.
      if (values.length > 0 && options.length === 0) {
        return labels.valueCount(values.length)
      }
      return (
        <StackedFaces people={options.map((option) => option.data as Person)} />
      )
    },
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
  const [query, setQuery] = useState<FilterQuery>(SEED)

  return (
    <div className="flex w-full flex-col gap-4">
      <Filters
        fields={fields}
        query={query}
        onQueryChange={setQuery}
        showClear
      />

      {/*
        Below the bar, and at the default size the bar itself runs at. These two
        act ON the query the bar owns, so they read as its footer rather than as
        a second toolbar above it, and a `sm` button beside a default-size bar
        was the only control on screen at a different height.
      */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={() => setQuery(SAVED_VIEW)}>
          Restore saved view
        </Button>
        <Button variant="ghost" onClick={() => setQuery(SEED)}>
          Reset
        </Button>
      </div>
    </div>
  )
}
