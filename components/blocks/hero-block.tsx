import Link from "next/link"
import { ArrowRight, RocketIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const SHADCN_AVATAR = "https://github.com/shadcn.png"

export function HeroBlock() {
  return (
    <section
      className="container-wrapper relative overflow-hidden py-16 lg:py-24"
      aria-labelledby="hero-heading"
    >
      {/*
        `gap-5` (20px) ties the announcement pill, heading, subtitle,
        CTAs, and tagline together as a single hero column. The
        previous `gap-8` (32px) over-spaced each element so the hero
        read as 5 separated zones instead of one cohesive entry.
      */}
      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        {/* Release announcement card */}
        <div className="bg-site-background border-site-border site-rounded-full flex items-center justify-center border shadow-xs shadow-black/5">
          <Link
            href="/docs/changelog"
            className="group bg-site-muted/40 hover:bg-site-muted/60 site-rounded-full flex items-center gap-2 p-1 transition-colors duration-200"
          >
            <span className="flex items-center justify-center pl-2">
              <RocketIcon
                className="text-site-foreground size-4"
                aria-hidden="true"
              />
            </span>
            <span className="text-site-foreground text-sm font-medium">
              1,000+ free shadcn components, MIT licensed
            </span>
            <span className="bg-site-border/80 h-4 w-px" aria-hidden="true" />
            <span className="bg-site-background group-hover:bg-site-background site-rounded-full flex size-6 items-center justify-center shadow-sm transition-colors duration-200">
              <ArrowRight
                className="text-site-foreground size-3.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>

        {/*
          Main heading. Progressive scale: 30 → 36 → 48 across base /
          sm / lg viewports — one notch smaller than before so the
          headline reads as confident rather than oversized. The
          shadcn avatar sits inline next to the word "shadcn" as a
          visual anchor (same treatment as earlier versions of this
          hero) so the brand association reads at a glance.
          `inline-flex flex-wrap` lets the heading re-flow across
          multiple lines while keeping avatar + label glued together
          as one unbreakable token.
        */}
        <h1
          id="hero-heading"
          className="inline-flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
        >
          <span>Design-forward</span>
          <span className="inline-flex items-center gap-1.5">
            <Avatar className="mt-0.5 size-9 shrink-0" aria-hidden="true">
              <AvatarImage
                src={SHADCN_AVATAR}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <AvatarFallback className="text-sm">S</AvatarFallback>
            </Avatar>
            <span>shadcn/ui</span>
          </span>
          <span>platform for interfaces that stand out</span>
        </h1>

        {/* Subheading */}
        <p className="text-site-accent-foreground/80 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
          Free, open-source shadcn/ui components and in-house primitives,
          curated by senior design engineers and ready to copy into your project
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild className="min-w-36">
            <Link href="/components">Browse Components</Link>
          </Button>
          <Button asChild variant="outline" className="min-w-36">
            <Link href="/docs">Read the Docs</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
