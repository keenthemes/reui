"use client"

import * as React from "react"

/**
 * Announces that a preview has actually PAINTED, on the two channels that need
 * to know: a `postMessage` for an embedding host, and a `<html>` attribute for
 * a headless capture.
 *
 * THE RULE: render this INSIDE the `<React.Suspense>` boundary that wraps the
 * lazy preview, never beside it.
 *
 * That is the whole point of this component, and it is the bug it was written
 * to fix. All three preview frames used to render their own signal as
 * a SIBLING of the boundary. React commits the siblings of a suspended
 * boundary immediately - only the boundary's own subtree is held back - so the
 * effect fired while the spinner was still on screen. Hosts cross-faded their
 * spinner away over an empty frame, and `useIframeWatchdog` was disarmed before
 * there was anything to watch. Rendered as a CHILD, the effect cannot run until
 * the lazy chunk has resolved and its component has committed, which is exactly
 * the moment both consumers are asking about.
 *
 * The double `requestAnimationFrame` buys one more guarantee on top of commit:
 * the first callback runs before the paint that includes this commit, the
 * second after it. So by the time the attribute is set the browser has actually
 * put pixels on the screen, which is what a screenshot needs and what a
 * cross-fade wants.
 *
 * `data-preview-ready` is on `<html>` rather than on a wrapper element because
 * the capture script waits on it before it knows anything about the page's
 * structure, and because a top-level load has no parent to message: the
 * `postMessage` below is skipped entirely when `window.parent === window`, so
 * the attribute is the only signal a headless run ever sees.
 */
export function PreviewReadyMarker() {
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    let secondFrame = 0
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        document.documentElement.setAttribute("data-preview-ready", "true")

        // Same-origin target rather than "*", so the signal is not broadcast to
        // an arbitrary embedder. Skipped at top level, where there is no host.
        if (window.parent !== window) {
          window.parent.postMessage(
            { type: "iframe-ready" },
            window.location.origin
          )
        }
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [])

  return null
}
