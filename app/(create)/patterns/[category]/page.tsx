import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BookOpenTextIcon } from "lucide-react"

import {
  getCategoryInfo,
  getCategoryNames,
  getPatternsByCategory,
} from "@/lib/registry"
import { getPatternCategorySeo } from "@/lib/registry-seo-cache"
import {
  buildPageMetadata,
  buildBreadcrumbJsonLd,
  isCanonicalComponentDoc,
} from "@/lib/seo"
import { siteConfig } from "@/lib/config"
import { normalizeSlug } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { JsonLd } from "@/components/json-ld"

import { PatternCategoryPager } from "../components/pattern-category-pager"
import {
  PatternCategoryHeroIntro,
  PatternCategorySeoContent,
} from "../components/pattern-category-seo-content"
import { CategoryPageContent } from "./category-page-content"

function PatternsPreviewSkeleton() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <Spinner className="size-5 opacity-60" />
    </div>
  )
}

// Fully static — search filtering happens client-side in PatternsGrid
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
      title: "Patterns",
      description:
        "Patterns are composed components showing real-world usage. Filter by category and tags to find the perfect pattern for your project.",
    }
  }

  const normalized = normalizeSlug(category)
  const categoryInfo = getCategoryInfo(normalized)

  if (!categoryInfo) {
    return {
      title: "Patterns",
      description: "Pattern not found",
    }
  }

  const categoryLabel = categoryInfo?.label ?? category
  const seo = getPatternCategorySeo(normalized)

  return buildPageMetadata({
    title: seo.title,
    titleSuffix: siteConfig.metadata.titleSuffixes.patternCategory,
    description: seo.description,
    path: `/patterns/${normalized}`,
    keywords: [
      seo.title,
      `shadcn ${categoryLabel.toLowerCase()}`,
      `shadcn ${categoryLabel.toLowerCase()} patterns`,
      `${categoryLabel} React examples`,
      "open source shadcn patterns",
      ...seo.keywords,
    ],
  })
}

export default async function CategoryPatternsPage({
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

  const seo = getPatternCategorySeo(normalized)
  const patterns = getPatternsByCategory(normalized)
  const docsHref = isCanonicalComponentDoc(normalized)
    ? `/docs/base/${normalized}`
    : null
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
          { name: "Patterns", path: "/patterns" },
          { name: seo.title, path: `/patterns/${normalized}` },
        ])}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <section>
        <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-6 sm:px-8 xl:px-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-balanc mt-3 max-w-4xl min-w-0 text-xl font-bold sm:text-3xl">
              {seo.title}
            </h1>
            {docsHref ? (
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href={docsHref}>
                  <BookOpenTextIcon className="size-3.5 opacity-60" />
                  View docs
                </Link>
              </Button>
            ) : null}
          </div>
          {seo.intro ? <PatternCategoryHeroIntro intro={seo.intro} /> : null}
        </div>
      </section>
      <Suspense fallback={<PatternsPreviewSkeleton />}>
        <CategoryPageContent patterns={patterns} />
      </Suspense>
      <PatternCategorySeoContent seo={seo} />
      <PatternCategoryPager currentCategory={normalized} />
    </>
  )
}
