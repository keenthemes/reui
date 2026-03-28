"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { renderSeoLinkedText } from "@/app/(create)/components/components/component-category-seo-content"

interface DocsComponentCatalogCtaProps {
  label: string
  componentCount: number
  catalogHref: string
  intro: string
  className?: string
}

/**
 * SEO-friendly block linking component docs to the matching catalog category.
 */
export function DocsComponentCatalogCta({
  label,
  componentCount,
  catalogHref,
  intro,
  className,
}: DocsComponentCatalogCtaProps) {
  return (
    <section
      className={cn("border-site-border/70 mt-14 border-t pt-10", className)}
      aria-labelledby="docs-components-heading"
    >
      <h2
        id="docs-components-heading"
        className="scroll-m-20 text-2xl font-semibold tracking-tight"
      >
        More Shadcn {label} components
      </h2>
      <div className="text-site-muted-foreground mt-4 space-y-4 text-[1.05rem] leading-7 text-pretty sm:text-base">
        <p>{renderSeoLinkedText(intro, "docs-components-intro")}</p>
        <p>
          <Link
            href={catalogHref}
            className="text-site-primary decoration-site-primary/60 hover:decoration-site-primary font-medium underline underline-offset-[3px]"
          >
            Browse all {componentCount} Shadcn {label} components
          </Link>{" "}
          for copy-ready layouts, dashboards, and forms built with Tailwind CSS
          in the ReUI library.
        </p>
      </div>
    </section>
  )
}
