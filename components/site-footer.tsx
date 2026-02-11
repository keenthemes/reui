import Link from "next/link"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="group-has-[.section-soft]/body:bg-surface/40 3xl:fixed:bg-transparent group-has-[.docs-nav]/body:pb-20 group-has-[[data-variant=sidebar][data-state=expanded]]/body:ml-[16rem] group-has-[.docs-nav]/body:sm:pb-0 dark:bg-transparent">
      <div className={cn("container-wrapper")}>
        <div className="container flex flex-col items-center justify-between gap-2 py-4 group-has-[.docs-nav]/body:max-w-none group-has-[.docs-nav]/body:px-0 md:h-16 md:flex-row md:gap-4">
          <div className="text-muted-foreground order-2 text-center text-sm leading-loose text-balance md:order-1 md:flex-none md:text-left">
            &copy;
            {new Date().getFullYear()} ReUI. All rights reserved.
          </div>

          <div className="order-1 flex items-center gap-2.5 text-sm leading-loose text-balance md:order-2">
            <div className="inline-flex items-center gap-1">
              <span className="text-muted-foreground">A project by</span>{" "}
              <Link
                className="text-foreground font-medium hover:underline hover:underline-offset-2"
                href="https://keenthemes.com"
                target="_blank"
              >
                Keenthemes
              </Link>
            </div>
            <Separator orientation="vertical" className="h-4!" />
            <Link
              className="text-foreground font-medium hover:underline hover:underline-offset-2"
              href="https://keenthemes.studio"
              target="_blank"
            >
              Hire Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
