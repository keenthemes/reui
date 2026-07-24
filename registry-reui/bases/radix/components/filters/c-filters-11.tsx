"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import {
  Filters,
  type Filter,
  type FilterFieldConfig,
  type FilterOption,
} from "@/registry-reui/bases/radix/reui/filters"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// A field can take `loadOptions` instead of a static `options` list. Here it
// prefetches the whole remote list once (the query is ignored) and caches it,
// so opening the filter shows a loading state on the first open only.
const TEAMS: FilterOption[] = [
  { value: "eng", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Customer Support" },
  { value: "finance", label: "Finance" },
  { value: "people", label: "People Ops" },
  { value: "legal", label: "Legal" },
  { value: "it", label: "IT" },
  { value: "data", label: "Data & Analytics" },
  { value: "security", label: "Security" },
]

export default function Pattern() {
  const cacheRef = useRef<FilterOption[] | null>(null)

  const fields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "team",
        label: "Team",
        icon: (
          <IconPlaceholder
            lucide="UsersIcon"
            tabler="IconUsers"
            hugeicons="UserGroupIcon"
            phosphor="UsersIcon"
            remixicon="RiTeamLine"
            className="size-3.5"
          />
        ),
        type: "multiselect",
        // Prefetch the whole list once, then filter the cached copy by the
        // query so the search box still works without more requests.
        loadOptions: async (query: string) => {
          if (!cacheRef.current) {
            await new Promise((resolve) => setTimeout(resolve, 600))
            cacheRef.current = TEAMS
          }
          const q = query.trim().toLowerCase()
          return q
            ? cacheRef.current.filter((team) =>
                team.label.toLowerCase().includes(q)
              )
            : cacheRef.current
        },
      },
    ],
    []
  )

  const [filters, setFilters] = useState<Filter[]>([])

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
