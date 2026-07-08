import { type ReactNode } from "react"
import Link from "next/link"

import { getFAQCategories } from "@/lib/data/faq-data"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heading } from "@/components/custom/heading"
import { PageGridBackdrop } from "@/components/page-grid-backdrop"

/**
 * FAQ answers are plain strings (they also feed the FAQ JSON-LD verbatim), but
 * may embed links with a markdown-style `[Label](href)` syntax. This renders
 * those into styled links (underline, primary) and leaves the rest as text.
 * Internal paths use next/link; mailto and external links use a plain anchor.
 */
const FAQ_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

function renderAnswer(answer: string): ReactNode {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null
  FAQ_LINK_RE.lastIndex = 0
  while ((match = FAQ_LINK_RE.exec(answer)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(answer.slice(lastIndex, match.index))
    }
    const [, label, href] = match
    const linkClass = "text-site-primary underline underline-offset-2"
    nodes.push(
      href.startsWith("/") ? (
        <Link key={key++} href={href} className={linkClass}>
          {label}
        </Link>
      ) : (
        <a key={key++} href={href} className={linkClass}>
          {label}
        </a>
      )
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < answer.length) {
    nodes.push(answer.slice(lastIndex))
  }
  return nodes
}

export async function FAQBlock() {
  const categories = await getFAQCategories()

  if (categories.length === 0) return null

  const defaultCategory = categories[0]?.id

  return (
    <section className="container-wrapper relative overflow-hidden py-16 lg:py-24">
      {/* Section heading halo: shared grid texture with an early top fade. */}
      <PageGridBackdrop variant="section" />
      <div className="relative z-10 container">
        {/*
          Override Heading's default `mb-12` (48px) with `mb-6`
          (24px). 8px was too tight (subtitle and tabs felt glued);
          48px was too loose (felt like two separated zones). 24px
          gives a comfortable "here's the section, now pick a topic"
          breath without breaking the visual flow.
        */}
        <Heading
          badge="FAQ"
          title="Frequently Asked Questions"
          description="Browse questions by topic. Pick a tab, then click any question to reveal the answer."
          className="mb-6"
        />

        <div className="mx-auto max-w-3xl">
          <Tabs defaultValue={defaultCategory}>
            {/*
              Tab strip is a verbatim port of `legal-nav-links` so
              the FAQ pills match the chrome on /legal/* pages. The
              outer wrapper centers and enables horizontal scroll on
              narrow viewports; the inner TabsList is sized to its
              content so the pills never break lines.
            */}
            <div className="flex justify-center overflow-x-auto">
              <TabsList
                className={cn(
                  // Override shadcn's default `bg-site-muted h-9 p-[3px]
                  // site-rounded-lg`. The `rounded-full!` uses
                  // Tailwind 4's `!` important modifier because
                  // `site-rounded-lg` is a project-custom utility that
                  // twMerge can't recognize as a conflict with
                  // `rounded-full`, so without `!` both would apply
                  // and the custom one would win by source order.
                  "bg-site-muted/60 dark:bg-site-muted/40 border-site-border/60",
                  "inline-flex h-auto w-fit items-center gap-1 rounded-full! border p-0.5"
                )}
              >
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className={cn(
                      // Reset shadcn's `flex-1`, fixed height, and
                      // border. `rounded-full!` overrides the base
                      // `site-rounded-md` (same custom-utility
                      // conflict as above) so each trigger renders as
                      // a true pill, not a slightly-rounded cell.
                      "h-auto flex-none rounded-full! border-0",
                      // Match legal-nav: same padding, type, transition,
                      // and focus ring tokens for a 1:1 visual.
                      "focus-visible:ring-site-ring relative inline-flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none",
                      // Active pill / inactive label states.
                      "data-[state=active]:bg-site-primary data-[state=active]:text-site-primary-foreground data-[state=active]:shadow-sm",
                      "text-site-muted-foreground hover:text-site-foreground"
                    )}
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-8"
              >
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left text-base">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-site-accent-foreground text-base leading-relaxed">
                        {renderAnswer(faq.answer)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}
