"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Sheet } from "@/components/ui/sheet"
import { DARK_MODE_FORWARD_TYPE } from "@/components/mode-switcher"
import { DESIGN_SYSTEM_URL_KEYS } from "@/app/(create)/components/design-system-provider"
import { CMD_K_FORWARD_TYPE } from "@/app/(create)/components/item-picker"
import { RANDOMIZE_FORWARD_TYPE } from "@/app/(create)/components/random-button"
import { sendToIframe } from "@/app/(create)/hooks/use-iframe-sync"
import {
  serializeDesignSystemSearchParams,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

import { CUSTOMIZER_FORWARD_TYPE } from "./customizer-sidebar-script"
import { PatternSourceSheetContent } from "./pattern-source-sheet-content"
import { PatternsHeader } from "./patterns-header"
import { PATTERNS_SIDEBAR_FORWARD_TYPE } from "./patterns-sidebar-script"

// Helper to build iframe URL
function buildIframeSrc(
  category: string | undefined,
  base: string,
  searchQuery: string | undefined,
  params?: Record<string, string | null>
): string {
  const basePath = category
    ? `/preview/${base}/patterns/${category}`
    : `/preview/${base}/patterns`

  const urlParams: Record<string, string> = {}

  // If params are provided (e.g. from nuqs), use them
  if (params) {
    DESIGN_SYSTEM_URL_KEYS.forEach((key) => {
      const value = params[key]
      if (value !== null && value !== undefined) {
        urlParams[key] = String(value)
      }
    })
  } else if (typeof window !== "undefined") {
    // Fallback to browser params only on client
    const browserParams = new URLSearchParams(window.location.search)
    DESIGN_SYSTEM_URL_KEYS.forEach((key) => {
      const value = browserParams.get(key)
      if (value !== null) {
        urlParams[key] = value
      }
    })
  }

  // Add search query if present
  if (searchQuery) {
    urlParams.search = searchQuery
  }

  return serializeDesignSystemSearchParams(basePath, urlParams as any)
}

interface PatternsIframeViewProps {
  category?: string
  searchQuery?: string
  count?: number
}

export function PatternsIframeView({
  category,
  searchQuery,
  count,
}: PatternsIframeViewProps) {
  const [params] = useDesignSystemSearchParams()
  const [config] = useConfig()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [iframeReady, setIframeReady] = React.useState(false)
  const [sourceSheetOpen, setSourceSheetOpen] = React.useState(false)
  const [selectedPattern, setSelectedPattern] = React.useState<{
    name: string
    base: string
  } | null>(null)

  // Get base from URL params or config
  const base = params.base ?? config.base ?? "base"

  // Merge params with config for postMessage sync (includes all design system params)
  const effectiveParams = React.useMemo(() => {
    const next = { ...params }
    DESIGN_SYSTEM_URL_KEYS.forEach((key) => {
      // @ts-ignore
      if (next[key] === null || next[key] === undefined) {
        // @ts-ignore
        next[key] = config[key]
      }
    })
    return next
  }, [params, config])

  // Debounce search query to avoid too many iframe reloads
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    React.useState(searchQuery)

  React.useEffect(() => {
    // If searchQuery is empty/null, update immediately to show categories
    if (!searchQuery) {
      setDebouncedSearchQuery(searchQuery)
      return
    }

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Build initial iframe URL using SSR-safe default base ("base").
  // category and searchQuery are server props (stable across SSR/client).
  // After mount, we update only if the real base/params differ from defaults.
  const [iframeSrc, setIframeSrc] = React.useState(() => {
    const initialBase = "base"
    const basePath = category
      ? `/preview/${initialBase}/patterns/${category}`
      : `/preview/${initialBase}/patterns`

    if (debouncedSearchQuery) {
      return `${basePath}?search=${encodeURIComponent(debouncedSearchQuery)}`
    }
    return basePath
  })

  // After mount, update src only if the real params produce a different URL.
  // This avoids a wasted iframe reload when base is already "base" with no extra params.
  const isMountedRef = React.useRef(false)

  React.useEffect(() => {
    const newSrc = buildIframeSrc(category, base, debouncedSearchQuery, params)
    if (!isMountedRef.current) {
      isMountedRef.current = true
      // Only update if the real URL differs from the SSR default
      if (newSrc !== iframeSrc) {
        setIframeSrc(newSrc)
      }
      return
    }
    setIframeSrc(newSrc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, base, debouncedSearchQuery])

  // Track previous iframe src to detect actual changes
  const prevIframeSrcRef = React.useRef(iframeSrc)

  // Sync design system params to iframe via postMessage (for non-URL changes)
  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !iframeReady) return

    // Send current effective params to iframe
    sendToIframe(iframe, "design-system-params", effectiveParams)
  }, [effectiveParams, iframeReady])

  // Stable message event listener (vercel-react-best-practices: client-event-listeners)
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "iframe-ready") {
        setIframeReady(true)
        setIsLoading(false)
      }

      if (event.data?.type === CMD_K_FORWARD_TYPE) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: event.data.key,
            metaKey: true,
            ctrlKey: true,
          })
        )
      }

      if (
        event.data?.type === RANDOMIZE_FORWARD_TYPE ||
        event.data?.type === DARK_MODE_FORWARD_TYPE ||
        event.data?.type === CUSTOMIZER_FORWARD_TYPE ||
        event.data?.type === PATTERNS_SIDEBAR_FORWARD_TYPE
      ) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: event.data.key,
          })
        )
      }

      if (event.data?.type === "open-pattern-source") {
        setSelectedPattern({
          name: event.data.name,
          base: event.data.base,
        })
        setSourceSheetOpen(true)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, []) // Empty deps - handler uses only setState which is stable

  // Handle iframe load event — acts as fallback if iframe-ready postMessage
  // arrives first (which is preferred), onLoad still marks ready immediately.
  const handleIframeLoad = React.useCallback(() => {
    setIframeReady(true)
    setIsLoading(false)
  }, [])

  // Reset loading state only when iframe source actually changes
  React.useEffect(() => {
    // Only reset if the URL actually changed
    if (prevIframeSrcRef.current !== iframeSrc) {
      prevIframeSrcRef.current = iframeSrc
      setIsLoading(true)
      setIframeReady(false)
    }
  }, [iframeSrc])

  return (
    <div className="flex flex-1 flex-col">
      <PatternsHeader iframeRef={iframeRef} count={count} />
      <div className="flex flex-1">
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Loading overlay with spinner */}
          <div
            className={cn(
              "absolute inset-0 z-20 flex items-center justify-center",
              isLoading ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <span className="text-muted-foreground text-sm">
              Loading patterns...
            </span>
          </div>
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            loading="eager"
            onLoad={handleIframeLoad}
            className="z-10 size-full min-h-[calc(100vh-140px)] flex-1"
            title={`${category || "All"} patterns preview`}
          />
        </div>
      </div>
      <Sheet open={sourceSheetOpen} onOpenChange={setSourceSheetOpen}>
        {selectedPattern && (
          <PatternSourceSheetContent
            name={selectedPattern.name}
            base={selectedPattern.base}
          />
        )}
      </Sheet>
    </div>
  )
}
