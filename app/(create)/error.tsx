"use client"

import * as React from "react"
import { RotateCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Recoverable error boundary for the (create) surfaces (blocks, preview,
 * components, design-system).
 *
 * These routes run under `cacheComponents` (PPR). On a rare deploy-skew resume
 * an "invalid postponed state" invariant can be thrown mid-render; with no
 * boundary the client is left with a blank / half-hydrated document that only a
 * hard refresh clears. This boundary converts that into a visible, resettable
 * state: `reset()` re-renders the segment (a fresh render on the matching build
 * succeeds), and a full reload is offered as the guaranteed fallback. The happy
 * path is untouched — this only renders when a child actually throws.
 */
export default function CreateError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Surface for observability (Vercel captures console.error).
    console.error("[create-error-boundary]", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex flex-col gap-1">
        <h2 className="text-site-foreground text-lg font-semibold tracking-tight">
          Something went wrong loading this page
        </h2>
        <p className="text-site-muted-foreground max-w-md text-sm">
          This is usually a transient hiccup. Try again, or reload the page.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={reset} className="gap-1.5">
          <RotateCwIcon className="size-3.5" aria-hidden="true" />
          Try again
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reload page
        </Button>
      </div>
    </div>
  )
}
