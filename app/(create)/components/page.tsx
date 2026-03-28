import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"

import {
  getCategories,
  getTotalComponentCount,
  searchCatalog,
} from "@/lib/registry"
import { getComponentIndexSeo } from "@/lib/registry-seo-cache"
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo"
import { GridSkeleton } from "@/components/grid-skeleton"
import { JsonLd } from "@/components/json-ld"

import { ComponentCategorySeoContent } from "./components/component-category-seo-content"
import { ComponentCategoryGrid } from "./components/component-category-grid"
import { ComponentPageContent } from "./components/component-page-content"

// Fully static — view switching (category grid vs inline preview) happens client-side
export const dynamic = "force-static"
export const revalidate = false

const totalComponentCount = getTotalComponentCount()
const allCatalogItems = searchCatalog("")
const title = "Shadcn UI Components"
const description = `Browse ${totalComponentCount}+ free shadcn/ui components for React and Tailwind CSS`
const featuredCategories = [
  {
    href: "/components/data-grid",
    label: "Data Grid",
  },
  {
    href: "/components/filters",
    label: "Filters",
  },
  {
    href: "/components/kanban",
    label: "Kanban",
  },
  {
    href: "/components/file-upload",
    label: "File Upload",
  },
  {
    href: "/components/stepper",
    label: "Stepper",
  },
  {
    href: "/components/combobox",
    label: "Combobox",
  },
  {
    href: "/components/sortable",
    label: "Sortable",
  },
  {
    href: "/components/timeline",
    label: "Timeline",
  },
  {
    href: "/components/tree",
    label: "Tree",
  },
] as const

export const metadata: Metadata = buildPageMetadata({
  title: title + ' - ReUI',
  description,
  path: "/components",
  keywords: [
    "shadcn components",
    "reui components",
    "reui components",
    "shadcn components",
    "shadcn ui components",
    "shadcn ui component",
    "open source shadcn component",
    "React components",
    "Tailwind components",
    "shadcn data grid",
  ],
})

export default function ComponentsPage() {
  const categories = getCategories()
  const indexSeo = getComponentIndexSeo()

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ReUI", path: "/" },
          { name: "Components", path: "/components" },
        ])}
      />
      <section>
        <div className="w-full px-6 pt-8 pb-6 sm:px-8 xl:px-10">
          <h1 className="text-balanc mt-3 max-w-4xl min-w-0 text-xl font-bold sm:text-3xl">
            Shadcn UI Components
          </h1>
          <p className="text-site-muted-foreground mt-4 text-base leading-7 text-pretty">
            Browse {totalComponentCount}+ free open-source shadcn/ui components for
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
        <ComponentPageContent
          categoryGridFallback={
            <ComponentCategoryGrid categories={categories} />
          }
          catalogItems={allCatalogItems}
        />
      </Suspense>
      <ComponentCategorySeoContent seo={indexSeo} />
    </>
  )
}
