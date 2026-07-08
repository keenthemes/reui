"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

/**
 * Global top page-load progress bar (a YouTube / GitHub style loading line).
 *
 * App Router does not expose router navigation events, so we drive the bar
 * from two signals:
 *   • START: a capturing document click listener detects an internal link
 *     click and kicks the bar off INSTANTLY, before the RSC payload for the
 *     next route has even been requested. That removes the "dead 1-2s" where
 *     a click felt unacknowledged.
 *   • DONE: when `usePathname()` / `useSearchParams()` change, the new route
 *     has committed.
 *
 * The ramp is a continuous, optimistic easing curve driven by
 * requestAnimationFrame: `CAP * (1 - e^(-t/TAU))`. It moves quickly at first
 * and eases as it approaches CAP (~90%), so there is no hard stop or stutter,
 * and it never visually "completes" before the route actually lands.
 *
 * The FINISH is deliberately unhurried so it never feels like a flash:
 *   1. A minimum on-screen threshold (MIN_VISIBLE_MS) so very fast loads still
 *      read as a smooth pass rather than a blink.
 *   2. A two-phase close: glide the fill to 100% (FILL_MS, eased), then gently
 *      fade out (FADE_MS).
 * A safety timeout force-finishes the bar if a navigation never lands.
 *
 * Positioning: pinned to the very top of the viewport (top:0) at a z-index
 * above the sticky chrome, so the line sits on top of the announcement banner
 * and header when they are present.
 */

const TAU_MS = 1100 // ramp time-constant: lower = reaches CAP faster
const CAP = 90 // ramp asymptote (%) while waiting for the route
const MIN_VISIBLE_MS = 400 // minimum on-screen time before finishing
const FILL_MS = 350 // smooth glide to 100%
const FADE_MS = 350 // gentle fade after the fill
const SAFETY_MS = 12_000

type Phase = "idle" | "loading" | "filling" | "fading"

function TopProgressBarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname}?${searchParams.toString()}`

  const [phase, setPhase] = React.useState<Phase>("idle")
  const [progress, setProgress] = React.useState(0)

  // Imperative mirrors so the global click listener reads live values without
  // re-subscribing on every render.
  const phaseRef = React.useRef<Phase>("idle")
  const startedAtRef = React.useRef(0)
  const rafRef = React.useRef<number | null>(null)
  const timersRef = React.useRef<number[]>([])
  const prevKeyRef = React.useRef(routeKey)

  const applyPhase = (next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }

  const cancelRaf = () => {
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }
  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }
  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms))
  }

  // Continuous optimistic ramp toward CAP. Per-frame so it never hard-stops.
  const tick = React.useCallback(() => {
    const elapsed = performance.now() - startedAtRef.current
    setProgress(CAP * (1 - Math.exp(-elapsed / TAU_MS)))
    rafRef.current = window.requestAnimationFrame(tick)
  }, [])

  // Glide to 100%, then fade out. Called once the route has committed AND the
  // minimum-visible threshold has elapsed.
  const finish = React.useCallback(() => {
    cancelRaf()
    applyPhase("filling")
    setProgress(100)
    later(() => {
      applyPhase("fading")
      later(() => {
        applyPhase("idle")
        setProgress(0)
      }, FADE_MS)
    }, FILL_MS)
  }, [])

  const done = React.useCallback(() => {
    if (phaseRef.current !== "loading") return
    clearTimers() // drop the safety timeout
    // Even if the page loaded quickly, hold the bar on screen for a beat so it
    // reads as a smooth, intentional finish rather than a flash. The ramp keeps
    // moving during the wait.
    const elapsed = performance.now() - startedAtRef.current
    later(finish, Math.max(0, MIN_VISIBLE_MS - elapsed))
  }, [finish])

  const start = React.useCallback(() => {
    if (phaseRef.current === "loading") return
    cancelRaf()
    clearTimers()
    startedAtRef.current = performance.now()
    applyPhase("loading")
    setProgress(0)
    rafRef.current = window.requestAnimationFrame(tick)
    later(done, SAFETY_MS)
  }, [done, tick])

  // START: capture internal link clicks before navigation begins.
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }
      const anchor = (e.target as Element | null)?.closest("a")
      if (!anchor) return
      const target = anchor.getAttribute("target")
      if (target && target !== "_self") return
      if (anchor.hasAttribute("download")) return
      const rawHref = anchor.getAttribute("href")
      if (!rawHref || rawHref.startsWith("#")) return

      let url: URL
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }
      // External, non-page, or no-op (same URL) targets don't trigger a page
      // load, so skip them; the bar only reflects real route navigations.
      if (url.origin !== window.location.origin) return
      if (url.pathname.startsWith("/api/")) return
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return
      }
      start()
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [start])

  // DONE: the route committed.
  React.useEffect(() => {
    if (prevKeyRef.current !== routeKey) {
      prevKeyRef.current = routeKey
      done()
    }
  }, [routeKey, done])

  React.useEffect(() => {
    return () => {
      cancelRaf()
      clearTimers()
    }
  }, [])

  if (phase === "idle") return null

  // The ramp is already smooth per-frame (rAF), so loading uses a 0s width
  // transition to track the curve exactly. Keeping `width` as the transitioned
  // property (rather than `none`) guarantees the handoff into the eased fill
  // animates instead of snapping. Filling / fading own the eased close.
  const barStyle: React.CSSProperties =
    phase === "loading"
      ? { width: `${progress}%`, opacity: 1, transition: "width 0s" }
      : phase === "filling"
        ? {
            width: "100%",
            opacity: 1,
            transition: `width ${FILL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }
        : {
            width: "100%",
            opacity: 0,
            transition: `opacity ${FADE_MS}ms ease-out`,
          }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
    >
      <div
        className="bg-site-primary h-full origin-left will-change-[width,opacity]"
        style={barStyle}
      />
    </div>
  )
}

export function TopProgressBar() {
  // `useSearchParams()` needs a Suspense ancestor under cacheComponents.
  return (
    <React.Suspense fallback={null}>
      <TopProgressBarInner />
    </React.Suspense>
  )
}
