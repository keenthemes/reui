"use client"

import { useEffect } from "react"

import {
  PREVIEW_SCROLL_FORWARD_TYPE,
  type PreviewScrollForwardMessage,
} from "@/components/preview-scroll-forwarder"

/**
 * Applies wheel deltas handed back by a preview iframe that had nothing left to
 * scroll. Counterpart to `PreviewScrollForwarder`; see that file for why the
 * hand-off is needed at all.
 *
 * Mounted ONCE in the root layout rather than per page, because previews appear
 * on both /components and /docs and the behaviour should be identical
 * everywhere. It costs one `message` listener and does nothing at all until a
 * preview actually posts.
 *
 * `behavior: "instant"` IS LOAD-BEARING - do not "simplify" it to `"auto"`.
 * Per CSSOM-View, `auto` does not mean "no animation": it defers to the
 * scrolling box's computed `scroll-behavior`, and `styles/globals.css` sets
 * `html { scroll-smooth }` site-wide with no reduced-motion guard. Under `auto`
 * every forwarded tick would start a ~300ms animation and the next tick (8-16ms
 * later on a trackpad) would abort it and retarget from the still-moving
 * offset, discarding the pending distance. The page would crawl far behind the
 * fingers - exactly the dead-zone feel this component exists to remove.
 * `components/scroll-to-top.tsx` uses `"instant"` for the same reason.
 */

/**
 * Line-mode deltas are expressed in line boxes; resolve one against the host
 * document. `line-height: normal` computes to the string "normal", which parses
 * to NaN, so fall back to the conventional 16px.
 */
function rootLineHeightPx(): number {
  const parsed = Number.parseFloat(
    getComputedStyle(document.documentElement).lineHeight
  )
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 16
}

/**
 * Wheel deltas arrive in three units. The conversion happens HERE rather than
 * in the iframe because line and page units only mean anything relative to the
 * viewport being scrolled, which is this one.
 */
function toPixels(deltaY: number, deltaMode: number): number {
  // DOM_DELTA_LINE
  if (deltaMode === 1) return deltaY * rootLineHeightPx()
  // DOM_DELTA_PAGE
  if (deltaMode === 2) return deltaY * window.innerHeight
  return deltaY
}

export function PreviewScrollReceiver() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Same-origin only. The forwarder posts with an explicit target origin,
      // and this is the matching check on the receiving end.
      if (event.origin !== window.location.origin) return

      const data = event.data as Partial<PreviewScrollForwardMessage> | null
      if (!data || data.type !== PREVIEW_SCROLL_FORWARD_TYPE) return
      if (typeof data.deltaY !== "number" || !Number.isFinite(data.deltaY)) {
        return
      }

      const deltaMode = typeof data.deltaMode === "number" ? data.deltaMode : 0

      window.scrollBy({
        top: toPixels(data.deltaY, deltaMode),
        behavior: "instant",
      })
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return null
}
