import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"

import {
  getCategories,
  getPatternsTotalCount,
  searchPatterns,
} from "@/lib/registry"
import { getPatternIndexSeo } from "@/lib/registry-seo-cache"
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo"
import { GridSkeleton } from "@/components/grid-skeleton"
import { JsonLd } from "@/components/json-ld"

import { PatternCategorySeoContent } from "./components/pattern-category-seo-content"
import { PatternsCategoryGrid } from "./components/patterns-category-grid"
import { PatternsPageContent } from "./components/patterns-page-content"

// Fully static — view switching (category grid vs inline preview) happens client-side
export const dynamic = "force-static"
export const revalidate = false

const totalPatternCount = getPatternsTotalCount()
const allPatterns = searchPatterns("")
const title = "Shadcn UI Component Patterns"
const description = `Browse ${totalPatternCount}+ free open-source shadcn/ui patterns and React component examples for Tailwind CSS, including alerts, data grids, filters, file uploads, and more.`
const featuredCategories = [
  {
    href: "/patterns/data-grid",
    label: "Data Grid",
  },
  {
    href: "/patterns/filters",
    label: "Filters",
  },
  {
    href: "/patterns/kanban",
    label: "Kanban",
  },
  {
    href: "/patterns/file-upload",
    label: "File Upload",
  },
  {
    href: "/patterns/stepper",
    label: "Stepper",
  },
  {
    href: "/patterns/combobox",
    label: "Combobox",
  },
  {
    href: "/patterns/sortable",
    label: "Sortable",
  },
  {
    href: "/patterns/timeline",
    label: "Timeline",
  },
  {
    href: "/patterns/tree",
    label: "Tree",
  },
] as const

export const metadata: Metadata = buildPageMetadata({
  title: title + ' - ReUI',
  description,
  path: "/patterns",
  keywords: [
    "shadcn components",
    "reui components",
    "reui patterns",
    "shadcn patterns",
    "shadcn ui patterns",
    "shadcn ui component",
    "open source shadcn component",
    "React components",
    "Tailwind components",
    "shadcn data grid",
  ],
})

export default function PatternsPage() {
  const categories = getCategories()
  const indexSeo = getPatternIndexSeo()

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ReUI", path: "/" },
          { name: "Patterns", path: "/patterns" },
        ])}
      />
      <section>
        <div className="w-full px-6 pt-8 pb-6 sm:px-8 xl:px-10">
          <h1 className="text-balanc mt-3 max-w-4xl min-w-0 text-xl font-bold sm:text-3xl">
            Shadcn UI Component Patterns
          </h1>
          <p className="text-site-muted-foreground mt-4 text-base leading-7 text-pretty">
            Browse {totalPatternCount}+ free open-source shadcn/ui patterns for
            React and Tailwind CSS. ReUI helps you move from primitives to
            polished product UI with real examples for alerts, data grids,
            filters, file uploads, forms, navigation, and more.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {featuredCategories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="border-site-border bg-site-background hover:bg-site-muted site-rounded-full border px-3 py-1.5 text-sm transition-colors"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Suspense
        fallback={
          <GridSkeleton
            count={categories.length}
            showHeader={false}
            className="px-6 py-6 sm:px-8 xl:px-10"
          />
        }
      >
        <PatternsPageContent
          categoryGridFallback={
            <PatternsCategoryGrid categories={categories} />
          }
          patterns={allPatterns}
        />
      </Suspense>
      <PatternCategorySeoContent seo={indexSeo} />
    </>
  )
}
