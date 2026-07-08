"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Copy button for docs code panels. Reads the code straight from the rendered
 * `<pre>` in the same figure, so it does not depend on any build-time prop
 * being threaded through the highlight pipeline. Rendered by the `figure`
 * override in mdx-components; globals.css positions it in the title header for
 * blocks that have a title (top of the code otherwise).
 */
export function CopyCodeButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [copied, setCopied] = React.useState(false)

  const copy = React.useCallback(() => {
    const figure = ref.current?.closest("[data-rehype-pretty-code-figure]")
    const code = figure?.querySelector("pre")?.textContent ?? ""
    if (!code) return
    navigator.clipboard.writeText(code).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      () => {}
    )
  }, [])

  // Base = visuals only. Positioning is passed by the caller: an inline flex
  // item in the title header (vertically centered), or an absolute fallback for
  // code blocks without a title.
  return (
    <button
      ref={ref}
      type="button"
      onClick={copy}
      data-slot="copy-button"
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "text-site-muted-foreground hover:bg-site-muted hover:text-site-foreground focus-visible:ring-site-ring z-10 flex size-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {copied ? (
        <CheckIcon className="size-3.5" aria-hidden="true" />
      ) : (
        <CopyIcon className="size-3.5" aria-hidden="true" />
      )}
    </button>
  )
}
