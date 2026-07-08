"use client"

import * as React from "react"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"

/**
 * Scrolls the active nav item into its ScrollArea viewport on mount and
 * whenever `activeKey` changes - but only when the item is currently out of
 * view, and only the viewport scrolls (never the page).
 *
 * Usage:
 *   - attach the returned ref to any element inside the `ScrollArea`
 *     (the hook walks up to the `data-slot="scroll-area-viewport"` element),
 *   - mark the active item with `data-active="true"`,
 *   - pass the active identity (e.g. pathname or category slug) as `activeKey`
 *     so the scroll re-runs on client-side navigation too.
 *
 * Why a layout effect: on a fresh page load the active item can sit far down a
 * long list, so the viewport renders scrolled to the top. Adjusting scrollTop
 * before paint brings the active item into view with no visible jump.
 */
export function useScrollActiveIntoView<T extends HTMLElement>(
  activeKey: unknown
) {
  const ref = React.useRef<T>(null)

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    const viewport = node.closest<HTMLElement>(
      '[data-slot="scroll-area-viewport"]'
    )
    if (!viewport) return

    const active = viewport.querySelector<HTMLElement>('[data-active="true"]')
    if (!active) return

    const v = viewport.getBoundingClientRect()
    const a = active.getBoundingClientRect()

    // A zero-height viewport means this instance is hidden (e.g. the mobile
    // sheet's copy while closed) - nothing to scroll.
    if (v.height === 0) return

    // Already fully visible -> leave the user's scroll position untouched.
    if (a.top >= v.top && a.bottom <= v.bottom) return

    // Center the active item in the viewport. The browser clamps scrollTop to
    // [0, maxScroll], so items near either end stay pinned to their edge.
    viewport.scrollTop += a.top - v.top - (v.height - a.height) / 2
  }, [activeKey])

  return ref
}
