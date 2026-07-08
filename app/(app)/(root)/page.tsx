import { Metadata } from "next"

import {
  getComponentCategories,
  getComponentsTotalCount,
} from "@/lib/component-stats"
import {
  buildOrganizationJsonLd,
  buildPageMetadata,
  buildSoftwareApplicationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo"
import { CTABlock } from "@/components/blocks/cta-block"
import { FAQBlock } from "@/components/blocks/faq-block"
import { HeroBlock } from "@/components/blocks/hero-block"
import { HomeComponentsCategoriesBlock } from "@/components/blocks/home-components-categories-block"
import { HomeSeoBlock } from "@/components/blocks/home-seo-block"
import { ProofBlock } from "@/components/blocks/proof-block"
import { WallOfLoveBlock } from "@/components/blocks/wall-of-love-block"
import { JsonLd } from "@/components/json-ld"

const title = "Free Shadcn UI Components & Primitives"
const description =
  "Free, open-source shadcn/ui components and in-house primitives for React and Tailwind CSS. Copy-and-own the source, install via the shadcn CLI, and ship production apps faster."

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/",
  keywords: [
    "shadcn ui",
    "shadcn ui components",
    "shadcn components",
    "free shadcn components",
    "react ui components",
    "tailwind css components",
    "component library",
    "design system",
    "reui",
  ],
})

export default function IndexPage() {
  const componentsCount = getComponentsTotalCount()
  const componentCategories = getComponentCategories()

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildSoftwareApplicationJsonLd()} />
      <div>
        <HeroBlock />

        <HomeComponentsCategoriesBlock
          categories={componentCategories}
          totalCount={componentsCount}
        />

        <ProofBlock />

        <WallOfLoveBlock />

        <FAQBlock />

        <HomeSeoBlock />

        <CTABlock />
      </div>
    </>
  )
}
