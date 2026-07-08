import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import Link from "next/link"
import { notFound } from "next/navigation"

import { isCanonicalComponentDoc } from "@/lib/component-doc-paths"
import {
  getComponentCategoryInfo,
  getComponentCategoryNames,
} from "@/lib/component-stats"
import { getCategoryComponentItems } from "@/lib/components-browse.server"
import { siteConfig } from "@/lib/config"
import { getComponentCategorySeo } from "@/lib/registry-seo-cache"
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo"
import { normalizeSlug } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { JsonLd } from "@/components/json-ld"

import { ComponentCategoryDocsButton } from "../components/component-category-docs-button"
import { ComponentCategoryPager } from "../components/component-category-pager"
import {
  ComponentCategoryHeroIntro,
  ComponentCategorySeoContent,
} from "../components/component-category-seo-content"
import { CategoryPageContent } from "./category-page-content"

export function generateStaticParams() {
  return getComponentCategoryNames().map((category) => ({
    category,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params

  if (!category) {
    return {
      title: "Components",
      description:
        "Components are composed examples showing real-world usage. Filter by category and tags to find the right component for your project.",
    }
  }

  const normalized = normalizeSlug(category)
  const categoryInfo = getComponentCategoryInfo(normalized)

  if (!categoryInfo) {
    return {
      title: "Components",
      description: "Component not found",
    }
  }

  const categoryLabel = categoryInfo?.label ?? category
  const seo = getComponentCategorySeo(normalized)

  return buildPageMetadata({
    // Keep the "UI Components" descriptor inline (it's a descriptor, not
    // the brand); the root `%s - ReUI` template still appends the brand.
    title: `${seo.title} - ${siteConfig.metadata.titleSuffixes.componentCategory}`,
    description: seo.description,
    path: `/components/${normalized}`,
    keywords: [
      seo.title,
      `shadcn ${categoryLabel.toLowerCase()}`,
      `shadcn ${categoryLabel.toLowerCase()} components`,
      `${categoryLabel} React examples`,
      "open source shadcn components",
      "reui components",
      ...seo.keywords,
    ],
  })
}

/**
 * Cache per-category resolution. `getCategoryComponentItems` does the
 * heaviest registry walk on this route; sharing the result across visitors
 * of the same category is the biggest single win.
 */
async function loadCategoryComponentsPageData(normalized: string) {
  "use cache"
  cacheLife("max")

  const seo = getComponentCategorySeo(normalized)
  const components = getCategoryComponentItems(normalized)
  const hasDocs = isCanonicalComponentDoc(normalized)
  const faqJsonLd = seo.content?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.content.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null

  return { seo, components, hasDocs, faqJsonLd }
}

export default async function CategoryComponentsPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const normalized = normalizeSlug(category)
  const categoryInfo = getComponentCategoryInfo(normalized)

  if (!categoryInfo) {
    return notFound()
  }

  const { seo, components, hasDocs, faqJsonLd } =
    await loadCategoryComponentsPageData(normalized)

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ReUI", path: "/" },
          { name: "Components", path: "/components" },
          { name: seo.title, path: `/components/${normalized}` },
        ])}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <section>
        <div className="w-full px-6 pt-8 pb-6 sm:px-8 xl:px-10">
          {/* Browsing breadcrumb, mirroring the blocks listing
              (Blocks > Group > Category): Components > {Category}. */}
          <Breadcrumb className="mb-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/components" prefetch={false}>
                    Components
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{categoryInfo.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex w-full flex-wrap items-end justify-between gap-3">
            <h1 className="text-balanc mt-3 min-w-0 flex-1 text-xl font-bold sm:text-3xl">
              {seo.title}
            </h1>
            {hasDocs ? (
              <ComponentCategoryDocsButton category={normalized} />
            ) : null}
          </div>
          {seo.intro ? <ComponentCategoryHeroIntro intro={seo.intro} /> : null}
        </div>
      </section>
      {/* `CategoryPageContent` is a Client Component that doesn't use any
          Suspense-triggering hook (it reads `window.location.search` in a
          `useEffect`). The previous outer `<Suspense>` boundary made the
          shell prerender with a spinner fallback under `cacheComponents:
          true` and stream the actual grid in afterwards — causing a
          visible blank-flash on first paint. With the boundary removed,
          the cached page now ships the fully rendered grid in its
          initial HTML. The inner `<Suspense>` inside `ComponentsGrid`
          still handles the URL-search-reading path used elsewhere. */}
      <CategoryPageContent components={components} />
      <ComponentCategorySeoContent seo={seo} />
      <ComponentCategoryPager currentCategory={normalized} />
    </>
  )
}
