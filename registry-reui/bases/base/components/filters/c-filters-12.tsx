"use client"

import { useCallback, useMemo, useState } from "react"
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
  type FilterOption,
} from "@/registry-reui/bases/base/reui/filters"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// When the full list is too large to prefetch, pass a `loadOptions(query)` that
// searches server-side and returns a bounded page. It is debounced, guards
// against out-of-order responses, and keeps already-selected values labelled
// via an internal value->label cache. `options` seeds the initial view and any
// pre-selected chips.
const FIRST_NAMES = [
  "Alex",
  "Bailey",
  "Casey",
  "Dana",
  "Emerson",
  "Finley",
  "Gray",
  "Harper",
  "Indira",
  "Jordan",
  "Kai",
  "Logan",
  "Morgan",
  "Noor",
  "Parker",
  "Quinn",
  "Riley",
  "Sasha",
  "Taylor",
  "Umi",
  "Val",
  "Wren",
  "Xan",
  "Yuki",
  "Zephyr",
]
const LAST_NAMES = [
  "Ahmed",
  "Brooks",
  "Chen",
  "Diaz",
  "Evans",
  "Ferreira",
  "Gupta",
  "Hansen",
  "Ito",
  "Johnson",
  "Kowalski",
  "Lopez",
  "Mensah",
  "Novak",
  "Okafor",
  "Park",
]

// Simulate a large remote directory that cannot be fully prefetched.
const DIRECTORY: FilterOption[] = Array.from({ length: 10000 }, (_, index) => {
  const first = FIRST_NAMES[index % FIRST_NAMES.length]
  const last =
    LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length]
  return {
    value: `user-${index + 1}`,
    label: `${first} ${last} #${index + 1}`,
  }
})

export default function Pattern() {
  const fields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "assignee",
        label: "Assignee",
        icon: (
          <IconPlaceholder
            lucide="UserSearchIcon"
            tabler="IconUserSearch"
            hugeicons="UserSearch01Icon"
            phosphor="UserFocusIcon"
            remixicon="RiUserSearchLine"
            className="size-3.5"
          />
        ),
        type: "multiselect",
        // Seed only the initially selected value so its chip stays labelled.
        options: [DIRECTORY[0]],
        // Server-side search: return only the top matches for the query.
        loadOptions: async (query: string) => {
          await new Promise((resolve) => setTimeout(resolve, 400))
          const q = query.trim().toLowerCase()
          const matches = q
            ? DIRECTORY.filter((option) =>
                option.label.toLowerCase().includes(q)
              )
            : DIRECTORY
          return matches.slice(0, 50)
        },
      },
    ],
    []
  )

  const [filters, setFilters] = useState<Filter[]>([
    createFilter("assignee", "is_any_of", ["user-1"]),
  ])

  const handleFiltersChange = useCallback((next: Filter[]) => {
    setFilters(next)
  }, [])

  return (
    <div className="flex grow content-start items-start self-start">
      <Filters
        filters={filters}
        fields={fields}
        onChange={handleFiltersChange}
      />
    </div>
  )
}
