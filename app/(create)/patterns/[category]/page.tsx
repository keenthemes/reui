import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getCategoryDescription,
  getCategoryNames,
  getPatternCountByCategory,
  isValidCategory,
} from "@/lib/registry"
import { formatLabel, normalizeSlug } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

import { CategoryPageContent } from "./category-page-content"

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

// Fully static — search filtering happens client-side in the iframe
export const dynamic = "force-static"
export const revalidate = false

// Generate static params for all valid component categories
export async function generateStaticParams() {
  return getCategoryNames().map((category) => ({
    category: normalizeSlug(category),
  }))
}

// Generate metadata for category page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params

  if (!category) {
    return {
      title: "Patterns - ReUI",
      description:
        "Patterns are composed components showing real-world usage. Filter by category and tags to find the perfect pattern for your project.",
    }
  }

  const normalized = normalizeSlug(category)

  if (!isValidCategory(normalized)) {
    return {
      title: "Patterns - ReUI",
      description: "Pattern not found",
    }
  }

  const categoryLabel = formatLabel(category)
  const description = getCategoryDescription(category)
  const title = `${categoryLabel} Patterns`
  const seoDescription =
    description ||
    `Explore professional ${categoryLabel.toLowerCase()} patterns and examples for ReUI. High-quality, accessible React components built with Tailwind CSS.`

  return {
    title,
    description: seoDescription,
    keywords: [
      categoryLabel,
      `${categoryLabel} patterns`,
      `${categoryLabel} examples`,
      "React components",
      "Tailwind CSS",
      "ReUI patterns",
      "shadcn create",
      "shadcn components",
    ],
    openGraph: {
      title: `${title} - ReUI`,
      description: seoDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ReUI`,
      description: seoDescription,
    },
  }
}

export default async function CategoryPatternsPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const normalized = normalizeSlug(category)

  if (!isValidCategory(normalized)) {
    return notFound()
  }

  // Pass total count for the category (search filtering is client-side in the iframe)
  const count = getPatternCountByCategory(normalized)

  return (
    <Suspense fallback={<PatternsIframeViewSkeleton />}>
      <CategoryPageContent category={normalized} count={count} />
    </Suspense>
  )
}
