import Link from "next/link"
import { ArrowRightIcon, CheckIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/custom/heading"
import { PageGridBackdrop } from "@/components/page-grid-backdrop"
import { Frame, FramePanel } from "@/components/reui/frame"

interface CompareCard {
  variant: "without" | "with"
  badge: string
  tagline: string
  title: string
  stat: { value: string; context: string }
  bullets: string[]
}

const WITHOUT: CompareCard = {
  variant: "without",
  badge: "Without ReUI",
  tagline: "AI generated slop, endlessly revised",
  title: "Sloppy, brittle, generic.",
  stat: { value: "70+ hrs", context: "lost to prompts, reviews, and fixes" },
  bullets: [
    "AI token bills climbing every month",
    "Most AI tokens burn on UI, not business logic",
    "Hallucinated props and broken state logic",
    "Accessibility treated as an afterthought",
    "Brittle code you will rewrite anyway",
    "Hours lost to prompt, review, revise loops",
  ],
}

export function ProofBlock() {
  const WITH: CompareCard = {
    variant: "with",
    badge: "With ReUI",
    tagline: "Handcrafted by senior design engineers",
    title: "Production grade, every aspect.",
    stat: { value: "MIT", context: "open-source, source yours forever" },
    bullets: [
      "Zero AI tokens spent on UI, ever",
      "Reserve your AI budget for product logic",
      "Production patterns tested in real apps",
      "Accessibility, keyboard, and ARIA baked in",
      "Clean source in your repo, yours forever",
      "Free and open-source under the MIT license",
    ],
  }

  const withoutCard: CompareCard = WITHOUT
  const withCard: CompareCard = WITH

  return (
    <section className="bg-site-muted/40 border-site-border/50 relative isolate overflow-hidden border-b">
      {/*
        Tinted band treatment: `bg-site-muted/40` tints the section so it reads
        as a distinct band and `border-y` seals the edges. The shared grid
        texture sits behind the heading with an early top fade that dissolves
        into the tint, matching the other lower sections. `isolate` keeps its
        stacking context local.
      */}
      <PageGridBackdrop variant="section" />

      <div className="container-wrapper relative z-10 overflow-hidden py-16 lg:py-24">
        <div className="container">
          <Heading
            badge="Crafted, not generated"
            title="ReUI or the Grind"
            description="Skip the AI grind. ReUI is crafted by senior design engineers and proven in real production apps."
          />

          {/* Two separate ReUI frames with the VS marker spaced between them. */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-10">
            <CompareCard card={withoutCard} />

            <div className="flex items-center justify-center py-1 lg:py-0">
              <div
                aria-hidden="true"
                className="from-site-background to-site-muted border-site-border relative flex size-14 items-center justify-center rounded-full border bg-gradient-to-b shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_22px_-6px_rgba(0,0,0,0.18)]"
              >
                {/* Glossy top sheen for a coin-like finish. */}
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/60 via-transparent to-transparent dark:from-white/[0.08]" />
                <span className="text-site-foreground relative text-[13px] font-bold tracking-[0.14em]">
                  VS
                </span>
              </div>
            </div>

            <CompareCard card={withCard} />
          </div>

          <p className="text-site-muted-foreground mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed">
            Every component is crafted and curated by a team of senior design
            engineers. Each one is derived from real product use cases: SaaS,
            marketing, ecommerce, and more.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/components">
                Browse components
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs">Read the docs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function CompareCard({ card }: { card: CompareCard }) {
  const isWith = card.variant === "with"

  return (
    <Frame className="h-full">
      {/* In dark mode the default panel fill is the base background, which reads
          darker than this section's `bg-site-muted/40` band and makes the cards
          look like cut-out holes. Lift the dark fill to the band's muted tone so
          the cards sit close to the container. */}
      <FramePanel className="dark:bg-site-muted/40 flex h-full flex-col gap-6">
        <span
          className={cn(
            "site-rounded-full inline-flex w-fit items-center gap-1.5 border px-3 py-1 text-xs font-semibold",
            isWith
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-site-border/70 bg-site-muted/40 text-site-muted-foreground"
          )}
        >
          {isWith ? (
            <CheckIcon
              className="size-3.5"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          ) : (
            <XIcon className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
          )}
          {card.badge}
        </span>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-site-foreground text-xl font-semibold tracking-tight lg:text-2xl">
            {card.title}
          </h3>
          <p className="text-site-muted-foreground text-sm leading-snug">
            {card.tagline}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span
            className={cn(
              // Stat numerals scaled down: 70+ hrs / $249 were
              // dominating the layout at ~68px. Dialed to a more
              // balanced 40/44/48px ladder that still reads as a
              // hero stat without overwhelming the comparison bullets.
              "text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.04em] tabular-nums sm:text-[2.75rem] lg:text-[3rem]",
              isWith
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-site-foreground"
            )}
          >
            {card.stat.value}
          </span>
          <span className="text-site-muted-foreground text-sm leading-snug font-medium">
            {card.stat.context}
          </span>
        </div>

        <ul className="mt-auto flex flex-col gap-2.5">
          {card.bullets.map((bullet) => (
            <li
              key={bullet}
              className="text-site-foreground/90 flex items-start gap-2.5 text-sm leading-snug"
            >
              {isWith ? (
                <CheckIcon
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              ) : (
                <XIcon
                  className="text-site-muted-foreground/70 mt-0.5 size-4 shrink-0"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </FramePanel>
    </Frame>
  )
}
