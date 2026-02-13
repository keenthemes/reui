import { Suspense } from "react"
import type { Metadata } from "next"

import { getCategories } from "@/lib/registry"
import { Spinner } from "@/components/ui/spinner"
import { GridSkeleton } from "@/components/grid-skeleton"

import { PatternsCategoryGrid } from "./components/patterns-category-grid"
import { PatternsPageContent } from "./components/patterns-page-content"

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

// Fully static — view switching (category grid vs iframe) happens client-side
export const dynamic = "force-static"
export const revalidate = false

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

export default function PatternsPage() {
  const categories = getCategories()

  return (
    <Suspense
      fallback={
        <GridSkeleton count={categories.length} />
      }
    >
      <PatternsPageContent
        categories={categories}
        categoryGridFallback={
          <PatternsCategoryGrid categories={categories} />
        }
      />
    </Suspense>
  )
}
