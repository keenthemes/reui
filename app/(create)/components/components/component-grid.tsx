"use client"

import { Suspense, useMemo } from "react"
import { useQueryStates } from "nuqs"

import {
  filterCatalogBySearchQuery,
  hasActiveCatalogSearch,
  normalizeCatalogSearchQuery,
} from "@/lib/catalog-search-filter"
import { parseAsSearchStringClient } from "@/lib/nuqs"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

import type { CatalogGridMode, CatalogItem } from "../types"
import { ComponentCard } from "./component-card"
import { ComponentCardContainer } from "./component-card-container"
import { ComponentEmptyState } from "./component-empty-state"

interface ComponentGridProps {
  catalogItems: CatalogItem[]
}

function ComponentCardSkeleton() {
  return (
    <ComponentCardContainer
      footer={
        <>
          <div className="flex flex-1 gap-1">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-20" />
          </div>
        </>
      }
    >
      <Spinner className="size-4 opacity-60" />
    </ComponentCardContainer>
  )
}

/**
 * Static-friendly catalog grid: `?search=` is filtered on the client so pages
 * stay CDN-cacheable without a dedicated iframe preview route.
 */
function ComponentGridContent({
  catalogItems,
}: {
  catalogItems: CatalogItem[]
}) {
  const [config] = useConfig()
  const gridColumns = (config?.gridColumns ?? 2) as CatalogGridMode

  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })
  const searchQuery = normalizeCatalogSearchQuery(filters.search || "")
  const hasActiveSearch = hasActiveCatalogSearch(searchQuery)

  const filteredItems = useMemo(
    () => filterCatalogBySearchQuery(catalogItems, searchQuery),
    [catalogItems, searchQuery]
  )

  if (filteredItems.length === 0) {
    return (
      <div className="w-full px-6 py-6 sm:px-8 xl:px-10">
        <ComponentEmptyState
          message={
            hasActiveSearch
              ? `No components found for "${searchQuery}"`
              : "No components found in this category"
          }
        />
      </div>
    )
  }

  return (
    <div className="w-full px-6 py-6 sm:px-8 xl:px-10">
      <div
        className={cn(
          "grid items-stretch gap-6 pb-4",
          gridColumns === 1 && "grid-cols-1",
          gridColumns === 2 && "grid-cols-1 md:grid-cols-2"
        )}
      >
        {filteredItems.map((item) => (
          <ComponentCard
            key={item.name}
            name={item.name}
            className={item.meta?.className}
          />
        ))}
      </div>
    </div>
  )
}

export function ComponentGrid({ catalogItems }: ComponentGridProps) {
  return (
    <div className="flex flex-col">
      <Suspense
        fallback={
          <div className="w-full px-6 py-6 sm:px-8 xl:px-10">
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <ComponentCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <ComponentGridContent catalogItems={catalogItems} />
      </Suspense>
    </div>
  )
}
