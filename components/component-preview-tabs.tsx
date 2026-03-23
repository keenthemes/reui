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
  sourcePreview,
  ...props
}: React.ComponentProps<"div"> & {
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  chromeLessOnMobile?: boolean
  component: React.ReactNode
  source: React.ReactNode
  sourcePreview?: React.ReactNode
}) {
  const [isCodeExpanded, setIsCodeExpanded] = React.useState(false)

  return (
    <div
      data-slot="component-preview"
      className={cn(
        "group site-rounded-xl border-site-border relative mt-4 mb-12 flex flex-col gap-2 overflow-hidden border",
        className
      )}
      {...props}
    >
      <div data-slot="preview">
        <div
          data-align={align}
          data-chromeless={chromeLessOnMobile}
          className={cn(
            "preview flex h-72 w-full justify-center p-10 font-sans data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start data-[chromeless=true]:h-auto data-[chromeless=true]:p-0",
            previewClassName
          )}
        >
          {component}
        </div>
        {!hideCode && (
          <div
            data-slot="code"
            data-mobile-code-visible={isCodeExpanded}
            className="**:data-rehype-pretty-code-figure:site-rounded-none relative overflow-hidden **:data-rehype-pretty-code-figure:m-0! **:data-rehype-pretty-code-figure:border-t [&_pre]:max-h-72"
          >
            {isCodeExpanded ? (
              source
            ) : (
              <div className="relative">
                {sourcePreview}
                <div className="absolute inset-0 flex items-center justify-center pb-4">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, var(--color-site-code), color-mix(in oklab, var(--color-site-code) 60%, transparent), transparent)",
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="bg-site-background text-site-foreground dark:bg-site-background dark:text-site-foreground hover:bg-site-muted dark:hover:bg-site-muted relative z-10"
                    onClick={() => {
                      setIsCodeExpanded(true)
                    }}
                  >
                    View Code
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
