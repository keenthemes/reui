"use client"

import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { ComponentLivePreviewRuntime } from "@/app/(create)/components/components/component-live-preview-runtime"

/**
 * Tells the host that the example has mounted, so it can cross-fade its
 * spinner away. Mirrors the block preview's signal, including the
 * same-origin target so the message is not broadcast to arbitrary embedders.
 */
function PreviewReadySignal() {
  React.useEffect(() => {
    if (typeof window === "undefined" || window.parent === window) {
      return
    }

    window.parent.postMessage({ type: "iframe-ready" }, window.location.origin)
  }, [])

  return null
}

/**
 * Chromeless render target for a single c-* example.
 *
 * NO min-height and NO centering: the example starts at the top and is free
 * to grow to the full frame width, so the frame height the host authored is
 * exactly the example's box. Centering would spend half of an authored height
 * on dead space above the example (and, for the short filters demos, halve the
 * room their popups get to open into). All real spacing belongs to the host
 * surface: the catalog card's FrameContent padding, or the docs `.preview` box.
 *
 * The one exception is `p-1`, and it is load-bearing. EVERY style draws a
 * card's border as `ring-1`, which is a box-shadow painted OUTSIDE the border
 * box (nova's `.cn-card` computes to `border-width: 0` plus a 1px ring), and
 * luma / sera / rhea / vega add a drop shadow on top of that. With the example
 * flush against the frame viewport those land outside the document and are
 * clipped, so the card renders with no border and square corners. Four pixels
 * clears the ring on all eight styles and most of the shadow; it is invisible
 * against the host card's own padding.
 */
export function ComponentExampleFrame({
  base,
  name,
  category,
}: {
  base: string
  name: string
  category?: string
}) {
  return (
    <div className="w-full p-1" data-slot="component-example">
      <React.Suspense
        fallback={
          <div className="flex w-full items-center justify-center py-8">
            <Spinner className="text-site-muted-foreground/40 size-4" />
          </div>
        }
      >
        <ComponentLivePreviewRuntime
          name={name}
          base={base}
          category={category}
        />
      </React.Suspense>
      <PreviewReadySignal />
    </div>
  )
}
