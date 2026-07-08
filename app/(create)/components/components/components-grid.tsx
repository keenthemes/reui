"use client"

import { Suspense, useEffect, useMemo } from "react"
import { useQueryStates } from "nuqs"

import {
  filterComponentsBySearchQuery,
  hasActiveComponentSearch,
  normalizeComponentSearchQuery,
} from "@/lib/component-search-filter"
import { parseAsSearchStringClient } from "@/lib/nuqs"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

import type { Component, ComponentGridMode } from "../types"
import { ComponentCard } from "./component-card"
import { ComponentCardContainer } from "./component-card-container"
import { ComponentsEmptyState } from "./components-empty-state"
import { useComponents } from "./components-provider"

interface ComponentsGridProps {
  components: Component[]
  searchQuery?: string
  preFiltered?: boolean
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
 * Static-friendly component grid: `?search=` is filtered on the client so pages
 * stay CDN-cacheable without a dedicated iframe preview route.
 */
function ComponentsGridContent({
  components,
  searchQuery,
  preFiltered = false,
}: {
  components: Component[]
  searchQuery: string
  preFiltered?: boolean
}) {
  const [config] = useConfig()
  const { setSearchResultCount } = useComponents()
  const gridColumns = (config?.gridColumns ?? 2) as ComponentGridMode
  const hasActiveSearch = hasActiveComponentSearch(searchQuery)

  const filteredComponents = useMemo(
    () =>
      preFiltered
        ? components
        : filterComponentsBySearchQuery(components, searchQuery),
    [components, preFiltered, searchQuery]
  )

  useEffect(() => {
    setSearchResultCount(hasActiveSearch ? filteredComponents.length : null)

    return () => {
      setSearchResultCount(null)
    }
  }, [filteredComponents.length, hasActiveSearch, setSearchResultCount])

  if (filteredComponents.length === 0) {
    return (
      <div className="w-full px-6 py-6 sm:px-8 xl:px-10">
        <ComponentsEmptyState
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
        {filteredComponents.map((component) => (
          <ComponentCard
            key={component.name}
            component={component}
            className={component.meta?.className}
          />
        ))}
      </div>
    </div>
  )
}

function UrlSearchAwareComponentsGrid({
  components,
}: {
  components: Component[]
}) {
  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })

  const searchQuery = normalizeComponentSearchQuery(filters.search || "")

  return (
    <ComponentsGridContent components={components} searchQuery={searchQuery} />
  )
}

export function ComponentsGrid({
  components,
  searchQuery,
  preFiltered = false,
}: ComponentsGridProps) {
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
        {searchQuery !== undefined ? (
          <ComponentsGridContent
            components={components}
            searchQuery={normalizeComponentSearchQuery(searchQuery)}
            preFiltered={preFiltered}
          />
        ) : (
          <UrlSearchAwareComponentsGrid components={components} />
        )}
      </Suspense>
    </div>
  )
}
