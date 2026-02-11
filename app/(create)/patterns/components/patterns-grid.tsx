"use client"

import { Suspense, useEffect, useMemo } from "react"
import { useQueryStates } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

import type { Pattern, PatternGridMode } from "../types"
import { PatternCard } from "./pattern-card"
import { PatternCardContainer } from "./pattern-card-container"
import { PatternsEmptyState } from "./patterns-empty-state"
import { PatternsGridLoadMore } from "./patterns-grid-load-more"
import { PatternsHeader } from "./patterns-header"

interface PatternsGridProps {
  patterns: Pattern[]
  initialCards?: React.ReactNode
  base?: string
  isIframe?: boolean
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

const ITEMS_PER_PAGE = 48

// Component that reads search query (needs Suspense for static generation)
function PatternsGridContent({
  patterns,
  initialCards,
  base,
  isIframe,
}: {
  patterns: Pattern[]
  initialCards?: React.ReactNode
  base?: string
  isIframe?: boolean
}) {
  const [config, setConfig] = useConfig()
  const gridColumns = (config?.gridColumns ?? 2) as PatternGridMode

  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })
  const basePreference = config.base || "radix"
  const searchQuery = filters.search || ""

  // Listen for grid-columns messages from parent (iframe mode)
  useEffect(() => {
    if (!isIframe) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "grid-columns" && event.data?.columns) {
        setConfig({
          ...config,
          gridColumns: event.data.columns,
        })
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [config, setConfig, isIframe])

  // Client-side search filtering for iframe mode (pages are static, filtering
  // happens here instead of on the server). This keeps pages CDN-served while
  // still supporting ?search= in the iframe URL.
  const filteredPatterns = useMemo(() => {
    if (!searchQuery || !isIframe) return patterns
    const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
    if (terms.length === 0) return patterns
    return patterns.filter((p) => {
      const text =
        p.searchText ||
        [p.name, ...(p.categories || [])].join(" ").toLowerCase()
      return terms.every((term) => {
        if (text.includes(term)) return true
        // If term is plural (ends with s), try singular
        if (term.length > 3 && term.endsWith("s")) {
          return text.includes(term.slice(0, -1))
        }
        return false
      })
    })
  }, [patterns, searchQuery, isIframe])

  // Iframe rendering path
  if (isIframe && base) {
    if (filteredPatterns.length === 0) {
      return (
        <div className="container py-4">
          <PatternsEmptyState
            message={
              searchQuery
                ? `No patterns found for "${searchQuery}"`
                : "No patterns found in this category"
            }
          />
        </div>
      )
    }

    return (
      <div className="container py-4">
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
              base={base}
            />
          ))}
        </div>
      </div>
    )
  }

  // Standard page rendering path
  return (
    <>
      <PatternsHeader count={patterns.length} />

      <div className="container py-4">
        {patterns.length === 0 ? (
          <PatternsEmptyState
            message={
              searchQuery
                ? `No patterns found for "${searchQuery}"`
                : "No patterns found in this category"
            }
          />
        ) : (
          <div
            className={cn(
              "grid items-stretch gap-6 pb-4",
              gridColumns === 1 && "grid-cols-1",
              gridColumns === 2 && "grid-cols-1 md:grid-cols-2"
            )}
          >
            {initialCards}
            <PatternsGridLoadMore
              key={`${patterns.length}-${gridColumns}-${searchQuery}-${basePreference}`}
              allPatterns={patterns}
              initialCount={ITEMS_PER_PAGE}
              itemsPerPage={ITEMS_PER_PAGE}
              gridColumns={gridColumns}
            />
          </div>
        )}
      </div>
    </>
  )
}

export function PatternsGrid({
  patterns,
  initialCards,
  base,
  isIframe,
}: PatternsGridProps) {
  if (isIframe) {
    return (
      <Suspense fallback={null}>
        <PatternsGridContent
          patterns={patterns}
          base={base}
          isIframe={isIframe}
        />
      </Suspense>
    )
  }

  return (
    <div className="flex flex-col">
      <Suspense
        fallback={
          <>
            <PatternsHeader />
            <div className="container py-4">
              <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
                {/* Show only a few skeletons during loading */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <PatternCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </>
        }
      >
        <PatternsGridContent patterns={patterns} initialCards={initialCards} />
      </Suspense>
    </div>
  )
}
