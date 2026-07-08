"use client"

import * as React from "react"
import { RotateCwIcon } from "lucide-react"

import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/**
 * Isolates a single component preview so a failed lazy import (e.g. a missing
 * or stale locally-built `@reui/components-*-<category>` dist, or a cold
 * Turbopack compile failure) degrades to a Retry card instead of crashing the
 * whole /components/<category> route with the Next error overlay. Mirrors
 * BlockErrorBoundary in the blocks grid (block-card-container.tsx).
 */
class ComponentPreviewErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-44 w-full flex-col items-center justify-center gap-3">
          <p className="text-site-muted-foreground text-xs">
            Failed to load preview
          </p>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => this.setState({ hasError: false })}
          >
            <RotateCwIcon className="mr-1.5 size-3" />
            Retry
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

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
    livePreviewModulePromise = import("./component-live-preview-runtime")
  }

  return livePreviewModulePromise
}

export function ComponentCardPreview({
  name,
  title,
  base = "base",
  category,
}: {
  name: string
  title: string
  base?: string
  category?: string
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const idleCallbackRef = React.useRef<number | null>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const isVisible = useIntersectionObserver(containerRef, {
    rootMargin: "300px",
    threshold: 0,
    freezeOnceVisible: true,
  })

  const [LivePreview, setLivePreview] =
    React.useState<LivePreviewComponent | null>(null)

  React.useEffect(() => {
    if (!isVisible || LivePreview) {
      return
    }

    const activate = () => {
      loadLivePreviewModule()
        .then((mod) => {
          React.startTransition(() => {
            setLivePreview(() => mod.ComponentLivePreviewRuntime)
          })
        })
        .catch((error) => {
          console.error("Failed to load live component preview", error)
        })
    }

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleCallbackRef.current = window.requestIdleCallback(activate, {
        timeout: 1500,
      })

      return () => {
        if (idleCallbackRef.current != null) {
          window.cancelIdleCallback(idleCallbackRef.current)
        }
      }
    }

    timeoutRef.current = setTimeout(activate, 150)

    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [LivePreview, isVisible])

  const fallback = (
    <div
      data-slot="preview"
      aria-label={`${title} preview loading`}
      className="flex h-44 w-full items-center justify-center"
    >
      <Spinner className="text-site-muted-foreground/40 size-4" />
    </div>
  )

  return (
    <div
      ref={containerRef}
      data-slot="preview"
      className="flex w-full items-center justify-center"
    >
      {LivePreview ? (
        <ComponentPreviewErrorBoundary>
          <React.Suspense fallback={fallback}>
            <LivePreview name={name} base={base} category={category} />
          </React.Suspense>
        </ComponentPreviewErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
