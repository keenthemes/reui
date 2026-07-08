"use client"

import * as React from "react"

import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Spinner } from "@/components/ui/spinner"

type LivePreviewComponent = React.ComponentType<{
  name: string
  base?: string
  category?: string
}>

let livePreviewModulePromise: Promise<{
  ComponentLivePreviewRuntime: LivePreviewComponent
}> | null = null

function loadLivePreviewModule() {
  if (!livePreviewModulePromise) {
    livePreviewModulePromise = import(
      "@/app/(create)/components/components/component-live-preview-runtime"
    )
  }

  return livePreviewModulePromise
}

function LivePreviewFallback() {
  return (
    <div className="flex h-full min-h-20 w-full items-center justify-center">
      <Spinner className="size-4 opacity-60" />
    </div>
  )
}

/**
 * Live preview shown above the code panel on docs/components pages.
 *
 * Loading strategy — three competing pressures all addressed below:
 *
 *   1. **Don't hang the browser.** Heavy docs pages (data-grid is
 *      ~30 previews, table is similar) used to mount every preview at
 *      once. With ~30 previews × per-block dynamic imports + Suspense
 *      re-renders, the main thread sat busy long enough to feel like a
 *      hang. So loading is gated by intersection observation.
 *
 *   2. **Stay mounted once loaded.** `freezeOnceVisible: true` on the
 *      observer fires exactly once. After that, the `LivePreview`
 *      state is set and never reset, the JSX always lands on the
 *      `<LivePreview/>` branch, and scrolling back doesn't trigger a
 *      remount or re-import. Previously rendered previews stay live
 *      no matter how far the user scrolls.
 *
 *   3. **Never show empty space.** The outer container is always
 *      rendered (height inherited from the `h-72` parent in
 *      `ComponentPreviewTabs`). It holds `LivePreviewFallback`
 *      (a centred spinner) until `LivePreview` resolves, then holds
 *      the actual preview. Users see a spinner-in-frame as soon as
 *      the preview slot enters the viewport, never an empty card.
 *
 * `rootMargin: "400px"` gives the import + Suspense fallback chain a
 * head-start: by the time the preview is actually on screen, the
 * runtime module is usually parsed and the block is rendering.
 *
 * The runtime module itself (`ComponentLivePreviewRuntime`) is cached
 * at module scope (`livePreviewModulePromise`), so the import cost is
 * paid exactly once per page — every subsequent preview reuses the
 * resolved promise.
 */
export function DocsComponentLivePreview({
  name,
  base,
  category,
}: {
  name: string
  base: string
  category?: string | null
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [LivePreview, setLivePreview] =
    React.useState<LivePreviewComponent | null>(null)
  const isVisible = useIntersectionObserver(containerRef, {
    rootMargin: "400px",
    threshold: 0,
    freezeOnceVisible: true,
  })

  React.useEffect(() => {
    if (!category || !isVisible || LivePreview) {
      return
    }

    let cancelled = false
    loadLivePreviewModule()
      .then((mod) => {
        if (cancelled) return
        React.startTransition(() => {
          setLivePreview(() => mod.ComponentLivePreviewRuntime)
        })
      })
      .catch((error) => {
        console.error("Failed to load docs live component preview", error)
      })

    return () => {
      cancelled = true
    }
  }, [LivePreview, category, isVisible])

  if (!category) {
    return (
      <div className="text-site-muted-foreground flex h-full min-h-20 w-full items-center justify-center p-6 text-sm">
        Component {name} not found in {base}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      data-slot="docs-live-preview"
      className="flex h-full w-full items-center justify-center"
    >
      {LivePreview ? (
        <React.Suspense fallback={<LivePreviewFallback />}>
          <LivePreview name={name} base={base} category={category} />
        </React.Suspense>
      ) : (
        // Render the spinner placeholder unconditionally while we're
        // waiting on either the intersection observer (off-screen) or
        // the module import (loading). Either way the slot is visibly
        // "owned" rather than blank, so the user reads it as "this
        // preview is loading" instead of "this preview is broken".
        <LivePreviewFallback />
      )}
    </div>
  )
}
