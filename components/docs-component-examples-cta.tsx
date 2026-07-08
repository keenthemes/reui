"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { renderSeoLinkedText } from "@/components/seo-linked-text"

interface DocsComponentExamplesCtaProps {
  label: string
  componentCount: number
  componentsHref: string
  intro: string
  className?: string
}

/**
 * SEO-friendly block linking component docs to the matching component category.
 */
export function DocsComponentExamplesCta({
  label,
  componentCount,
  componentsHref,
  intro,
  className,
}: DocsComponentExamplesCtaProps) {
  return (
    <section
      className={cn("border-site-border/70 mt-14 border-t pt-10", className)}
      aria-labelledby="docs-components-heading"
    >
      <h2
        id="docs-components-heading"
        className="scroll-m-20 text-2xl font-semibold tracking-tight"
      >
        More Shadcn {label} Components
      </h2>
      <div className="text-site-muted-foreground mt-4 space-y-4 text-[1.05rem] leading-7 text-pretty sm:text-base">
        <p>{renderSeoLinkedText(intro, "docs-components-intro")}</p>
        <p>
          <Link
            href={componentsHref}
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

/** @deprecated Use DocsComponentExamplesCta. */
export const DocsComponentPatternsCta = DocsComponentExamplesCta
