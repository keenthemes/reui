import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import Link from "next/link"

import {
  getComponentCategories,
  getComponentsTotalCount,
} from "@/lib/component-stats"
import { getComponentIndexSeo } from "@/lib/registry-seo-cache"
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo"
import { CatalogPageHero } from "@/components/catalog-page-hero"
import { JsonLd } from "@/components/json-ld"

import { ComponentCategorySeoContent } from "./components/component-category-seo-content"
import { ComponentsBrowseSearch } from "./components/components-browse-search"
import { ComponentsPageContent } from "./components/components-page-content"

const totalComponentCount = getComponentsTotalCount()
const title = "Free Shadcn UI Components"
const description = `Browse ${totalComponentCount}+ free open-source shadcn/ui components and React examples for Tailwind CSS, including alerts, data grids, filters, file uploads, and more.`
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
    href: "/components/combobox",
    label: "Combobox",
  },
  {
    href: "/components/chart",
    label: "Chart",
  },
  {
    href: "/components/dialog",
    label: "Dialog",
  },
  {
    href: "/components/command",
    label: "Command",
  },
  {
    href: "/components/accordion",
    label: "Accordion",
  },
] as const

export const metadata: Metadata = buildPageMetadata({
  // Clean title — the root `%s - ReUI` template adds the brand. The
  // manual `+ " - ReUI"` here doubled it to "… - ReUI - ReUI".
  title,
  description,
  path: "/components",
  keywords: [
    "shadcn components",
    "reui components",
    "shadcn ui component",
    "open source shadcn component",
    "React components",
    "Tailwind components",
    "shadcn data grid",
  ],
})

/**
 * Cache the registry walk + SEO build so every visitor shares the same
 * computed payload until the next deploy.
 */
async function loadComponentsPageData() {
  "use cache"
  cacheLife("max")

  return {
    categories: getComponentCategories(),
    indexSeo: getComponentIndexSeo(),
  }
}

export default async function ComponentsPage() {
  const { categories, indexSeo } = await loadComponentsPageData()

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ReUI", path: "/" },
          { name: "Components", path: "/components" },
        ])}
      />
      <CatalogPageHero
        badge="Components"
        title={title}
        count={totalComponentCount}
        description={
          <>
            Browse {totalComponentCount}+ free open-source shadcn/ui components
            for React and Tailwind CSS. ReUI helps you move from primitives to
            polished product UI with real examples for alerts, data grids,
            filters, file uploads, forms, navigation, and more.
          </>
        }
        titleId="components-page-title"
      >
        <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-center gap-2">
            {featuredCategories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                prefetch={false}
                className="border-site-border bg-site-background hover:bg-site-muted site-rounded-full border px-3 py-1.5 text-sm transition-colors"
              >
                {category.label}
              </Link>
            ))}
          </div>
          <div className="w-full sm:w-72">
            <ComponentsBrowseSearch placeholder="Search..." />
          </div>
        </div>
      </CatalogPageHero>
      <ComponentsPageContent categories={categories} />
      <ComponentCategorySeoContent seo={indexSeo} />
    </>
  )
}
