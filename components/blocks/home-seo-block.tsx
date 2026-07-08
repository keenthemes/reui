import Link from "next/link"
import {
  ArrowRightIcon,
  BlocksIcon,
  ComponentIcon,
  LayersIcon,
  TerminalIcon,
} from "lucide-react"

import { COMPONENTS_TOTAL, CUSTOM_PRIMITIVES_TOTAL } from "@/lib/registry-stats"
import { Card } from "@/components/custom/card"
import { Heading } from "@/components/custom/heading"
import { PageGridBackdrop } from "@/components/page-grid-backdrop"

/**
 * Dedicated SEO section on the home page, just before the CTA. Reuses the site
 * shell (`Heading` + container) and the signature Frame-based `Card` (same as
 * the Wall of Love testimonials, in linked `url` mode with the hover lift) to
 * present the free component offering as four stat-forward cards.
 *
 * The `variant="section"` grid backdrop is 2600px tall, so it is wrapped in its
 * own `overflow-hidden` layer that clips the texture WITHOUT clipping the
 * cards' hover shadow/translate. Counts come from build-generated registry
 * stats. Card titles and descriptions are length-matched so the four cards read
 * as an even row.
 */
const fmt = (n: number) => n.toLocaleString("en-US")

export function HomeSeoBlock() {
  const offerings = [
    {
      icon: ComponentIcon,
      stat: `${fmt(COMPONENTS_TOTAL)}+`,
      title: "Free Shadcn Components",
      description:
        "Free shadcn/ui components and copy-paste examples you own outright, forever.",
      cta: "Browse components",
      href: "/components",
    },
    {
      icon: BlocksIcon,
      stat: `${CUSTOM_PRIMITIVES_TOTAL}`,
      title: "In-House Primitives",
      description:
        "Custom ReUI primitives not in base shadcn/ui - Data Grid, Kanban, Filters, Tree, and more.",
      cta: "Read the docs",
      href: "/docs",
    },
    {
      icon: LayersIcon,
      stat: "Dual",
      title: "Radix UI & Base UI",
      description:
        "Every in-house primitive ships in both Radix UI and Base UI flavors, fully documented.",
      cta: "Compare APIs",
      href: "/docs",
    },
    {
      icon: TerminalIcon,
      stat: "MIT",
      title: "shadcn CLI Ready",
      description:
        "Install with the shadcn CLI just like the official set. No npm package, no lock-in.",
      cta: "Get started",
      href: "/docs",
    },
  ]

  return (
    <section className="relative isolate">
      {/* Clip the tall (2600px) grid-texture backdrop to the section WITHOUT
          clipping the cards' hover shadow/lift - so the section itself keeps
          overflow visible. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <PageGridBackdrop variant="section" />
      </div>

      <div className="container-wrapper relative z-10 py-16 lg:py-24">
        <div className="container">
          <Heading
            className="[&_h2]:max-w-none"
            badge="Built for shadcn/ui"
            title="Everything you need to ship with shadcn/ui"
            description="Production-ready components and in-house primitives, in the API you already use."
          />

          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map(
              ({ icon: Icon, stat, title, description, cta, href }) => (
                <Card
                  key={title}
                  url={href}
                  outerClassName="group h-full hover:shadow-[0_10px_28px_-14px_rgba(0,0,0,0.12)]!"
                  className="h-full gap-5 [--frame-panel-bg:var(--color-site-card)]"
                >
                  {/* Stat row: icon tile on the left, registry count on the right. */}
                  <div className="flex items-center justify-between">
                    <span className="border-site-background bg-site-muted [&_svg]:text-site-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border-2 shadow-[0_1px_3px_0_rgba(0,0,0,0.14)] dark:border [&_svg]:size-4">
                      <Icon aria-hidden />
                    </span>
                    <span className="text-site-foreground text-2xl font-semibold tracking-tight tabular-nums">
                      {stat}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-site-foreground text-sm font-semibold">
                      {title}
                    </h3>
                    <p className="text-site-muted-foreground text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <span className="text-site-muted-foreground group-hover:text-site-foreground mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium transition-colors">
                    {cta}
                    <ArrowRightIcon
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Card>
              )
            )}
          </div>

          <p className="text-site-muted-foreground mt-10 text-center text-sm">
            Free and open-source under the MIT license.{" "}
            <Link
              href="/components"
              className="text-site-foreground hover:text-site-foreground/70 font-medium underline underline-offset-4 transition-colors"
            >
              Explore the catalog
            </Link>{" "}
            and copy any component straight into your project.
          </p>
        </div>
      </div>
    </section>
  )
}
