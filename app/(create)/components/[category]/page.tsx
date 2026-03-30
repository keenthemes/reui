import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/lib/config"
import {
  getCategoryInfo,
  getCategoryNames,
  getComponentsByCategory,
} from "@/lib/registry"
import { getComponentCategorySeo } from "@/lib/registry-seo-cache"
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo"
import { normalizeSlug } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { JsonLd } from "@/components/json-ld"

import { ComponentCategoryPager } from "../components/component-category-pager"
import {
  ComponentCategoryHeroIntro,
  ComponentCategorySeoContent,
} from "../components/component-category-seo-content"
import { ComponentDocsLink } from "../components/component-docs-link"
import { CategoryPageContent } from "./category-page-content"

function ComponentPreviewSkeleton() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <Spinner className="size-5 opacity-60" />
    </div>
  )
}

// Fully static — search filtering happens client-side in ComponentGrid
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
      title: "Components",
      description:
        "Browse composed shadcn/ui examples by category and tags to find the right component for your project.",
    }
  }

  const normalized = normalizeSlug(category)
  const categoryInfo = getCategoryInfo(normalized)

  if (!categoryInfo) {
    return {
      title: "Components",
      description: "Category not found",
    }
  }

  const categoryLabel = categoryInfo?.label ?? category
  const seo = getComponentCategorySeo(normalized)

  return buildPageMetadata({
    title: seo.title,
    titleSuffix: siteConfig.metadata.titleSuffixes.componentCategory,
    description: seo.description,
    path: `/components/${normalized}`,
    keywords: [
      seo.title,
      `shadcn ${categoryLabel.toLowerCase()}`,
      `shadcn ${categoryLabel.toLowerCase()} components`,
      `${categoryLabel} React examples`,
      "open source shadcn components",
      ...seo.keywords,
    ],
  })
}

export default async function CategoryComponentsPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const normalized = normalizeSlug(category)
  const categoryInfo = getCategoryInfo(normalized)

  if (!categoryInfo) {
    return notFound()
  }

  const seo = getComponentCategorySeo(normalized)
  const catalogItems = getComponentsByCategory(normalized)
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
          <div className="flex w-full flex-wrap items-end justify-between gap-3">
            <h1 className="text-balanc mt-3 min-w-0 flex-1 text-xl font-bold sm:text-3xl">
              {seo.title}
            </h1>
            <ComponentDocsLink slug={normalized} />
          </div>
          {seo.intro ? <ComponentCategoryHeroIntro intro={seo.intro} /> : null}
        </div>
      </section>
      <Suspense fallback={<ComponentPreviewSkeleton />}>
        <CategoryPageContent catalogItems={catalogItems} />
      </Suspense>
      <ComponentCategorySeoContent seo={seo} />
      <ComponentCategoryPager currentCategory={normalized} />
    </>
  )
}
