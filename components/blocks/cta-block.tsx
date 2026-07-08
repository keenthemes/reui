import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CTABlock({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        // Light mode: a bold inverted (near-black) band. Dark mode: that flip
        // would be a glaring white panel between the dark FAQ and footer, so
        // keep it dark - a slightly elevated surface sealed with a hairline -
        // and let the button carry the contrast instead.
        "bg-site-foreground text-site-background relative overflow-hidden py-20",
        "dark:bg-site-card/50 dark:text-site-foreground dark:border-site-border dark:border-y",
        className
      )}
    >
      <div className="relative container flex flex-col items-center text-center">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">
          Start building with ReUI today.
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-pretty opacity-70">
          Free and open-source. Browse the catalog and copy any component
          straight into your project - no account, no license.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Button
            size="lg"
            variant="secondary"
            className="bg-site-background text-site-foreground hover:bg-site-background/90 dark:bg-site-foreground dark:text-site-background dark:hover:bg-site-foreground/90"
            asChild
          >
            <Link href="/components">
              Browse Components
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
