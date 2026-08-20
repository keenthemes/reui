"use client"

import * as React from "react"

import {
  CATALOG_FRAME_DESIGN_KEYS,
  getComponentPreviewFramePath,
} from "@/lib/component-preview-frame"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Spinner } from "@/components/ui/spinner"
import { sendToIframe } from "@/app/(create)/hooks/use-iframe-sync"
import { useIframeWatchdog } from "@/app/(create)/hooks/use-iframe-watchdog"

/**
 * How many preview documents may be booting at the same time.
 *
 * Each frame evaluates its category bundle in its own realm (data-grid's is
 * ~533 KB, and it has no code splitting), and same-origin frames share the
 * host's renderer main thread, so they do not boot in parallel no matter how
 * many are mounted. Letting all 30 data-grid cards start at once would just
 * queue 30 bundle evaluations ahead of anything the user is trying to do.
 * The cap keeps the mount pass incremental; the intersection observer below
 * already keeps it near-viewport.
 */
const MAX_CONCURRENT_PREVIEW_FRAMES = 3

interface FrameSlotTask {
  onGranted: () => void
  granted: boolean
  released: boolean
}

let activeFrameSlots = 0
const frameSlotQueue: FrameSlotTask[] = []

function drainFrameSlots() {
  while (
    activeFrameSlots < MAX_CONCURRENT_PREVIEW_FRAMES &&
    frameSlotQueue.length > 0
  ) {
    const task = frameSlotQueue.shift()
    if (!task || task.released) {
      continue
    }
    task.granted = true
    activeFrameSlots += 1
    task.onGranted()
  }
}

/**
 * Queue a frame for mounting. Returns a release function that MUST be called
 * once the frame has loaded (or given up), otherwise the queue stalls.
 */
function requestPreviewFrameSlot(onGranted: () => void) {
  const task: FrameSlotTask = { onGranted, granted: false, released: false }
  frameSlotQueue.push(task)
  drainFrameSlots()

  return () => {
    if (task.released) {
      return
    }
    task.released = true

    if (!task.granted) {
      const index = frameSlotQueue.indexOf(task)
      if (index >= 0) {
        frameSlotQueue.splice(index, 1)
      }
      return
    }

    activeFrameSlots = Math.max(0, activeFrameSlots - 1)
    drainFrameSlots()
  }
}

export interface ComponentPreviewFrameProps {
  name: string
  base: string
  title: string
  /** Resolved by resolveComponentPreviewFrameHeight. Content height in px. */
  height: number
  /** Design keys seeded into the src. Scoped per host surface. */
  designKeys?: readonly string[]
  /**
   * The inline preview this frame replaces. Rendered only if the frame never
   * loads, so a broken preview route degrades to exactly today's behavior
   * rather than to an error card.
   */
  fallback: React.ReactNode
  className?: string
  /**
   * `data-slot` on the wrapper. The catalog card keeps "preview" so the
   * FrameContent selectors that center and cap the preview slot still apply.
   * Docs passes its own value: ComponentPreviewTabs already has an outer
   * `data-slot="preview"`, and nesting a second one would double-match.
   */
  slot?: string
}

/**
 * Renders one c-* example inside a same-origin iframe.
 *
 * Only used for the categories listed for the calling SURFACE in
 * COMPONENT_PREVIEW_FRAME_CATEGORIES, which maps "catalog" and "docs"
 * separately. See lib/component-preview-frame.ts for why those and not others.
 */
export function ComponentPreviewFrame({
  name,
  base,
  title,
  height,
  designKeys,
  fallback,
  className,
  slot = "preview",
}: ComponentPreviewFrameProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [config] = useConfig()

  // NOTE: the wrapper below is rendered unconditionally, and only its CONTENTS
  // switch. useIntersectionObserver bails when the ref is null and its deps are
  // all stable, so it never re-runs; returning early above the ref'd element
  // would leave the observer permanently unattached and the frame would never
  // mount.
  const isVisible = useIntersectionObserver(wrapperRef, {
    rootMargin: "300px",
    threshold: 0,
    freezeOnceVisible: true,
  })

  // Frozen at mount. Later customizer changes flow through postMessage: a
  // changing `src` would reload the frame, which is the one thing this must
  // never do while the user is dragging a picker.
  const [initialDesignParams] = React.useState(() => config)
  const src = React.useMemo(
    () =>
      getComponentPreviewFramePath(base, name, {
        designParams: initialDesignParams as Record<string, unknown>,
        designKeys,
      }),
    [base, designKeys, initialDesignParams, name]
  )

  const [mountedSrc, setMountedSrc] = React.useState<string | null>(null)
  const [ready, setReady] = React.useState(false)
  const startedRef = React.useRef(false)
  const releaseRef = React.useRef<(() => void) | null>(null)

  // The watchdog must stay DISARMED until this frame actually starts loading.
  // With a concurrency cap, most frames sit queued with no iframe yet; arming
  // on mount would count their queue wait against the load timeout and time
  // them out before they ever got a slot. Reporting "ready" while queued keeps
  // the timer parked until `mountedSrc` exists.
  //
  // The per-attempt grace is well above the hook's 8s default: a preview
  // document boots its own React runtime and evaluates the whole category
  // bundle (data-grid's is ~533 KB), which on a cold dev compile is far slower
  // than the block previews the default was tuned for.
  const { retryNonce, timedOut } = useIframeWatchdog({
    ready: ready || !mountedSrc,
    loadId: src,
    timeoutMs: 20000,
  })

  // Take a slot, then mount. `mountedSrc` is deliberately NOT a dependency:
  // setting it inside the callback would otherwise re-run this effect and fire
  // its cleanup, releasing the slot one commit after taking it and making the
  // concurrency cap a no-op. `startedRef` makes this run at most once, so the
  // cleanup only fires on unmount.
  React.useEffect(() => {
    if (!isVisible || startedRef.current) {
      return
    }

    startedRef.current = true
    releaseRef.current = requestPreviewFrameSlot(() => {
      setMountedSrc(src)
    })

    return () => {
      releaseRef.current?.()
      releaseRef.current = null
    }
  }, [isVisible, src])

  // Hand the slot back as soon as this frame has loaded or has given up, so
  // the next queued frame can start.
  React.useEffect(() => {
    if (!ready && !timedOut) {
      return
    }

    releaseRef.current?.()
    releaseRef.current = null
  }, [ready, timedOut])

  React.useEffect(() => {
    setReady(false)
  }, [retryNonce])

  // Live design-system sync. Sent on every config change and again on load,
  // because a frame that mounts after a change would otherwise keep the stale
  // params baked into its src.
  //
  // Scoped to the SAME keys as the src seeding. Broadcasting the whole config
  // would undo that scoping on the first customizer change: a docs frame
  // seeded with only style and fonts would suddenly pick up a baseColor,
  // radius and theme the docs page itself never applies.
  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !mountedSrc) {
      return
    }

    const keys = designKeys ?? CATALOG_FRAME_DESIGN_KEYS
    const scoped: Record<string, unknown> = {}
    for (const key of keys) {
      const value = (config as Record<string, unknown>)[key]
      if (value !== undefined) {
        scoped[key] = value
      }
    }

    const send = () => {
      sendToIframe(iframe, "design-system-params", scoped as never)
    }

    send()
    iframe.addEventListener("load", send)

    return () => {
      iframe.removeEventListener("load", send)
    }
  }, [config, designKeys, mountedSrc])

  React.useEffect(() => {
    if (!mountedSrc) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }
      if (event.data?.type === "iframe-ready") {
        setReady(true)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [mountedSrc])

  // Every automatic retry elapsed without a load signal. Rather than showing
  // an error card, fall all the way back to the inline preview: worst case the
  // surface behaves exactly as it did before this change.
  if (timedOut && !ready) {
    return <>{fallback}</>
  }

  return (
    <div
      ref={wrapperRef}
      data-slot={slot}
      className={cn("relative w-full", className)}
      style={{ height }}
    >
      <div
        aria-hidden="true"
        className={cn(
          "bg-site-background absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300",
          ready ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        <Spinner className="text-site-muted-foreground/40 size-4" />
      </div>

      {mountedSrc ? (
        <iframe
          ref={iframeRef}
          key={`${src}-${retryNonce}`}
          src={mountedSrc}
          loading="lazy"
          title={`${title} preview`}
          className="h-full w-full border-0 bg-transparent"
          onLoad={() => {
            // Backstop only. The real reveal is the example's `iframe-ready`
            // message, which fires once it has actually rendered.
            window.setTimeout(() => setReady(true), 200)
          }}
        />
      ) : null}
    </div>
  )
}
