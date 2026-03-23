"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { renderSeoLinkedText } from "@/app/(create)/patterns/components/pattern-category-seo-content"

interface DocsComponentPatternsCtaProps {
  label: string
  patternCount: number
  patternsHref: string
  intro: string
  className?: string
}

/**
 * SEO-friendly block linking component docs to the matching pattern category.
 */
export function DocsComponentPatternsCta({
  label,
  patternCount,
  patternsHref,
  intro,
  className,
}: DocsComponentPatternsCtaProps) {
  return (
    <section
      className={cn("border-site-border/70 mt-14 border-t pt-10", className)}
      aria-labelledby="docs-patterns-heading"
    >
      <h2
        id="docs-patterns-heading"
        className="scroll-m-20 text-2xl font-semibold tracking-tight"
      >
        More Shadcn {label} Patterns
      </h2>
      <div className="text-site-muted-foreground mt-4 space-y-4 text-[1.05rem] leading-7 text-pretty sm:text-base">
        <p>{renderSeoLinkedText(intro, "docs-patterns-intro")}</p>
        <p>
          <Link
            href={patternsHref}
            className="text-site-primary decoration-site-primary/60 hover:decoration-site-primary font-medium underline underline-offset-[3px]"
          >
            Browse all {patternCount} Shadcn {label} patterns
          </Link>{" "}
          for copy-ready layouts, dashboards, and forms built with Tailwind CSS
          in the ReUI library.
        </p>
      </div>
    </section>
  )
}
