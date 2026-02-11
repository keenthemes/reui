"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import { useQueryStates } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Skeleton } from "@/components/ui/skeleton"

import { getMorePatternsAction } from "../actions"
import type { Pattern } from "../types"
import { PatternCardContainer } from "./pattern-card-container"

interface PatternsGridLoadMoreProps {
  allPatterns: Pattern[]
  initialCount: number
  itemsPerPage: number
  gridColumns: 1 | 2
}

function PatternsGridLoadMoreSkeleton() {
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
      <Loader2Icon className="text-muted-foreground/20 size-6 animate-spin" />
    </PatternCardContainer>
  )
}

export function PatternsGridLoadMore({
  allPatterns,
  initialCount,
  itemsPerPage,
  gridColumns,
}: PatternsGridLoadMoreProps) {
  const [renderedPatterns, setRenderedPatterns] = React.useState<
    React.ReactNode[]
  >([])
  const [visibleCount, setVisibleCount] = React.useState(initialCount)
  const [loading, setLoading] = React.useState(false)
  const hasMore = visibleCount < allPatterns.length

  const params = useParams()
  const category = params?.category as string | undefined

  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })

  const searchQuery = filters.search || ""

  const loadMore = React.useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextBatch = await getMorePatternsAction(
        category ? [category] : [],
        searchQuery,
        visibleCount,
        itemsPerPage
      )
      setRenderedPatterns((prev) => [...prev, ...nextBatch])
      setVisibleCount((prev) => prev + itemsPerPage)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, visibleCount, itemsPerPage, loading, hasMore, category])

  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const isIntersecting = useIntersectionObserver(sentinelRef, {
    rootMargin: "1200px", // Load much earlier to prevent flickering/jumping at the bottom
  })

  React.useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore()
    }
  }, [isIntersecting, hasMore, loading, loadMore])

  return (
    <>
      {renderedPatterns}

      {hasMore && (
        <div
          ref={sentinelRef}
          className={cn(
            "col-span-full grid gap-6 pt-6",
            gridColumns === 1 && "grid-cols-1",
            gridColumns === 2 && "grid-cols-1 md:grid-cols-2"
          )}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <PatternsGridLoadMoreSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}
    </>
  )
}
