"use client"

import { Suspense, useMemo } from "react"
import { useQueryStates } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"
import {
  filterPatternsBySearchQuery,
  hasActivePatternSearch,
  normalizePatternSearchQuery,
} from "@/lib/pattern-search-filter"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

import type { Pattern, PatternGridMode } from "../types"
import { PatternCard } from "./pattern-card"
import { PatternCardContainer } from "./pattern-card-container"
import { PatternsEmptyState } from "./patterns-empty-state"

interface PatternsGridProps {
  patterns: Pattern[]
}

function PatternCardSkeleton() {
  return (
    <PatternCardContainer
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
    </PatternCardContainer>
  )
}

/**
 * Static-friendly pattern grid: `?search=` is filtered on the client so pages
 * stay CDN-cacheable without a dedicated iframe preview route.
 */
function PatternsGridContent({ patterns }: { patterns: Pattern[] }) {
  const [config] = useConfig()
  const gridColumns = (config?.gridColumns ?? 2) as PatternGridMode

  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })
  const searchQuery = normalizePatternSearchQuery(filters.search || "")
  const hasActiveSearch = hasActivePatternSearch(searchQuery)

  const filteredPatterns = useMemo(
    () => filterPatternsBySearchQuery(patterns, searchQuery),
    [patterns, searchQuery]
  )

  if (filteredPatterns.length === 0) {
    return (
      <div className="w-full px-6 py-6 sm:px-8 xl:px-10">
        <PatternsEmptyState
          message={
            hasActiveSearch
              ? `No patterns found for "${searchQuery}"`
              : "No patterns found in this category"
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
        {filteredPatterns.map((pattern) => (
          <PatternCard
            key={pattern.name}
            name={pattern.name}
            className={pattern.meta?.className}
          />
        ))}
      </div>
    </div>
  )
}

export function PatternsGrid({ patterns }: PatternsGridProps) {
  return (
    <div className="flex flex-col">
      <Suspense
        fallback={
          <div className="w-full px-6 py-6 sm:px-8 xl:px-10">
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <PatternCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <PatternsGridContent patterns={patterns} />
      </Suspense>
    </div>
  )
}
