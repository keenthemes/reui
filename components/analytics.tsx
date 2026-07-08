"use client"

import * as React from "react"
import { Analytics as VercelAnalytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export function Analytics() {
  // Decide once, on the client, how this document is being framed. The
  // component renders no DOM in any branch, so this cannot cause a hydration
  // mismatch (the server render and the first client render both output
  // nothing until Vercel's own scripts mount).
  //
  //   • Top-level page     -> track everything (a normal visit).
  //   • Same-origin embed  -> our OWN /preview iframes. A category page renders
  //                           dozens of them; letting each fire a pageview /
  //                           Web Vitals sample pollutes the data and inflates
  //                           Web Analytics billing.
  //   • Cross-origin embed -> a third party framing us. The CSP frame-ancestors
  //                           allowlist only permits shoogle.dev, and that embed
  //                           is real referral traffic we WANT counted (it is
  //                           the "shoogle.dev" referral source in Vercel Web
  //                           Analytics). The old open-source build tracked it
  //                           because it had no embed guard at all; blanket-
  //                           skipping every iframe silently killed it.
  //
  // Same vs cross origin is detected by reading the parent frame's location:
  // it succeeds for a same-origin parent and throws a cross-origin
  // SecurityError otherwise.
  const [context] = React.useState<{ embedded: boolean; sameOrigin: boolean }>(
    () => {
      if (typeof window === "undefined") {
        return { embedded: false, sameOrigin: false }
      }
      if (window.self === window.top) {
        return { embedded: false, sameOrigin: false }
      }
      try {
        return {
          embedded: true,
          sameOrigin: window.top!.location.origin === window.location.origin,
        }
      } catch {
        // Reading a cross-origin parent's location throws: treat it as a real
        // external embed (e.g. shoogle.dev) so its referral is tracked.
        return { embedded: true, sameOrigin: false }
      }
    }
  )

  // Web Analytics: track top-level visits and cross-origin embeds (referrals);
  // skip only our own same-origin preview iframes.
  const trackAnalytics = !context.embedded || !context.sameOrigin
  // Speed Insights: top-level only. Web Vitals sampled inside any iframe do not
  // reflect a real user session, so keep them out of the performance data.
  const trackSpeed = !context.embedded

  return (
    <>
      {trackAnalytics && <VercelAnalytics />}
      {trackSpeed && <SpeedInsights />}
    </>
  )
}
