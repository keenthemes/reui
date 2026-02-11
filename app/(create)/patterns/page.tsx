import { Suspense } from "react"
import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"

import { searchParamsCache } from "@/lib/nuqs-server"
import { getCategories, searchPatterns } from "@/lib/registry"
import { Spinner } from "@/components/ui/spinner"
import { GridSkeleton } from "@/components/grid-skeleton"

import { PatternsCategoryGrid } from "./components/patterns-category-grid"
import { PatternsIframeView } from "./components/patterns-iframe-view"

function PatternsIframeViewSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-border/80 bg-background sticky top-(--header-height) z-10 flex h-[51px] items-center gap-2 border-b px-6">
        <div className="bg-muted h-4 w-48 animate-pulse rounded" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-5 opacity-60" />
      </div>
    </div>
  )
}

// Enable ISR - revalidate every hour for fresh data while keeping pages cached
export const revalidate = 3600

const title = "Browse Patterns"
const description =
  "Discover a collection of 600+ high-quality React patterns and components built with Tailwind CSS. Perfect for building modern, accessible web applications."

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "React patterns",
    "Tailwind components",
    "UI components",
    "shadcn customizer",
    "web design patterns",
    "accessible UI",
  ],
  openGraph: {
    title: `${title} - ReUI`,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} - ReUI`,
    description,
  },
}

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const parsed = await searchParamsCache.parse(searchParams)
  const searchQuery = parsed.search

  // Check if any filters are applied
  const hasFilters = searchQuery.trim() !== ""

  // If filters are applied, show filtered patterns in iframe
  if (hasFilters) {
    const patterns = searchPatterns(searchQuery)

    return (
      <Suspense fallback={<PatternsIframeViewSkeleton />}>
        <PatternsIframeView searchQuery={searchQuery} count={patterns.length} />
      </Suspense>
    )
  }

  // Otherwise, show category grid - use getCategories() which has all info pre-computed
  const categories = getCategories()

  return (
    <Suspense fallback={<GridSkeleton count={categories.length} />}>
      <PatternsCategoryGrid categories={categories} />
    </Suspense>
  )
}
