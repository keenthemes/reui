"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ComponentPreviewTabs({
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  component,
  source,
  ...props
}: React.ComponentProps<"div"> & {
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  chromeLessOnMobile?: boolean
  component: React.ReactNode
  source: React.ReactNode
}) {
  const [isMobileCodeVisible, setIsMobileCodeVisible] = React.useState(false)

  return (
    <div
      data-slot="component-preview"
      className={cn(
        "group site-rounded-xl relative mt-4 mb-12 flex flex-col gap-2 overflow-hidden border",
        className
      )}
      {...props}
    >
      <div data-slot="preview">
        <div
          data-align={align}
          data-chromeless={chromeLessOnMobile}
          className={cn(
            "preview flex h-72 w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start data-[chromeless=true]:h-auto data-[chromeless=true]:p-0",
            previewClassName
          )}
        >
          {component}
        </div>
        {!hideCode && (
          <div
            data-slot="code"
            data-mobile-code-visible={isMobileCodeVisible}
            className="relative overflow-hidden **:data-rehype-pretty-code-figure:m-0! **:data-rehype-pretty-code-figure:rounded-t-none **:data-rehype-pretty-code-figure:border-t"
          >
            <div
              data-expanded={isMobileCodeVisible}
              className={cn(
                "relative transition-[max-height] duration-200 ease-out [&_pre]:max-h-none",
                isMobileCodeVisible
                  ? "no-scrollbar max-h-[28rem] overflow-y-auto"
                  : "max-h-28 overflow-hidden"
              )}
            >
              {/*
                `source` is rendered directly into the initial HTML.

                Previously we hid it behind an intersection-observer +
                idle-callback gate that swapped a 4-bar skeleton
                (`CollapsedCodePlaceholder`) for the actual server-
                highlighted code after ~200ms. The gate avoided shipping
                the full Shiki HTML on first paint, but in practice it
                created a visible flicker: skeleton → fade → real code,
                even though the real markup was already part of the React
                tree the whole time. Rendering `source` inline removes
                the swap and the page reads as "done" from the first
                frame. The collapsed `max-h-28` clipping still hides the
                bulk of the code behind the "View Code" affordance, so
                the layout footprint hasn't changed.
              */}
              <div
                className={cn(
                  "relative",
                  !isMobileCodeVisible && "[&_[data-slot=copy-button]]:hidden"
                )}
              >
                {source}
              </div>
              {!isMobileCodeVisible && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pb-4">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, var(--color-code), color-mix(in oklab, var(--color-code) 60%, transparent), transparent)",
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="bg-site-background text-site-foreground dark:bg-site-background dark:text-site-foreground hover:bg-site-muted dark:hover:bg-site-muted relative z-10"
                    onClick={() => setIsMobileCodeVisible(true)}
                  >
                    View Code
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
