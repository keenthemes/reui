"use client"

import { useEffect } from "react"

import { isSameOriginEmbed } from "@/app/(create)/hooks/use-iframe-sync"

/**
 * Hands a wheel gesture back to the parent page when the preview iframe has
 * nothing left to scroll.
 *
 * WHY THIS IS NEEDED. A wheel event over an iframe is delivered to the IFRAME's
 * document, and the browser will not continue the gesture in the parent once
 * the inner document is done with it. On a listing page full of previews that
 * makes the previews dead zones: the pointer crosses a block, the page stops
 * moving, and the user has to aim at the gutter to keep scrolling.
 *
 * Two distinct cases produce it here, and both end at the same place:
 *
 *  1. Block previews. `DesignSystemProvider` deliberately locks the embedded
 *     document (`overflow-y: hidden` + `overscroll-behavior: none`) because the
 *     PARENT owns the scroll. Nothing inside can scroll and chaining is
 *     explicitly refused, so the gesture is simply dropped.
 *  2. Previews whose content genuinely scrolls. They scroll normally until they
 *     hit an edge, and then the gesture is dropped at that edge.
 *
 * WHAT IT DOES. On each wheel it walks from the event target to the document
 * root looking for something that can still move in the wheel's direction. If
 * it finds one, it does nothing at all and the iframe scrolls exactly as it
 * does today. Only when nothing can move does it take the event over:
 * `preventDefault()` (so the browser cannot also chain and double the distance)
 * and post the pixel delta to the parent, which applies it to the page.
 *
 * This is the same forward-to-parent contract as `PreviewShortcutForwarder`:
 * same-origin only, posted with an explicit target origin, and validated again
 * on the receiving side.
 *
 * SCOPE. Wheel and trackpad only. Touch is deliberately untouched: iOS and
 * Android already chain a touch scroll out of an iframe, and intercepting
 * `touchmove` to re-implement momentum would be a large behavioural risk for a
 * problem that does not exist there. Horizontal gestures are ignored so
 * horizontal carousels and side-scrolling grids inside a preview keep working.
 *
 * UNITS. The raw `deltaY` is forwarded together with its `deltaMode` rather
 * than converted here. A line- or page-mode delta can only be turned into
 * pixels against the viewport that will actually be scrolled, and that is the
 * PARENT's, not this iframe's. Converting locally made a page-mode notch over a
 * 300px preview move the host page 300px instead of a full screen.
 */

export const PREVIEW_SCROLL_FORWARD_TYPE = "reui:preview-scroll"

export type PreviewScrollForwardMessage = {
  type: typeof PREVIEW_SCROLL_FORWARD_TYPE
  /** Raw `WheelEvent.deltaY`, still in `deltaMode` units. */
  deltaY: number
  /** `WheelEvent.deltaMode`, so the parent can convert against its own viewport. */
  deltaMode: number
}

/**
 * Can this element still move in `direction` (1 down, -1 up)?
 *
 * `scrollHeight - clientHeight` can be a sub-pixel value on fractional zoom, so
 * the comparison carries a 1px tolerance rather than testing equality.
 */
function canScrollFurther(element: Element, direction: number): boolean {
  const style = getComputedStyle(element)
  const overflowY = style.overflowY
  const scrolls =
    overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay"
  if (!scrolls) return false

  const max = element.scrollHeight - element.clientHeight
  if (max <= 1) return false

  return direction > 0 ? element.scrollTop < max - 1 : element.scrollTop > 1
}

/**
 * `overscroll-behavior: contain | none` is an explicit "do not chain out of me"
 * from whoever wrote that element, so we honour it and stop walking. The
 * document root is the exception: the provider sets `none` there precisely
 * BECAUSE the parent owns the scroll, which is the case this component exists
 * to serve.
 *
 * KNOWN LIMITATION. Inside these previews the document is itself scroll-locked,
 * so an inner `contain` has no chain target left and degenerates into `none`:
 * the gesture is swallowed and neither the preview nor the host page moves. A
 * block whose own scroller is exhausted therefore stays a dead zone (the
 * onboarding blocks, whose `<main>` is `overflow-y-auto overscroll-contain`,
 * are the real case). Forwarding anyway would fix it, but the same relaxation
 * would let a wheel over a preview's scroll-TRAPPING overlay (a modal that
 * uses `contain` to hold the background still) scroll the host page behind it.
 * Left as-is deliberately: honouring the author's opt-out is the safer default,
 * and picking the other side of that trade is a product call, not a bug fix.
 */
function refusesChaining(element: Element): boolean {
  const behavior = getComputedStyle(element).overscrollBehaviorY
  return behavior === "contain" || behavior === "none"
}

export function PreviewScrollForwarder() {
  useEffect(() => {
    // Only inside reui's own previews. A cross-origin embedder keeps stock
    // behaviour, and a standalone visit to /preview/... is a normal page.
    if (!isSameOriginEmbed()) return

    const root = document.documentElement
    const body = document.body

    const handleWheel = (event: WheelEvent) => {
      // A pinch-zoom gesture arrives as ctrl+wheel; leave it alone.
      if (event.ctrlKey || event.defaultPrevented) return

      // shift+wheel is the keyboard-modified HORIZONTAL gesture. Chrome and
      // Edge report it with the magnitude still in `deltaY` and `deltaX` at 0,
      // so the axis test below cannot see it: without this guard a shift+wheel
      // over a side-scrolling data grid would be swallowed here and applied to
      // the host page as a vertical scroll instead.
      if (event.shiftKey) return

      const { deltaX, deltaY } = event
      if (deltaY === 0) return
      // Mostly-horizontal gestures belong to whatever is scrolling sideways.
      // Both axes carry the SAME `deltaMode` unit, so the raw values compare
      // directly; converting one side first would make this a 16x mismatch in
      // line mode (Firefox) and misread a horizontal flick as vertical.
      if (Math.abs(deltaX) > Math.abs(deltaY)) return

      const direction = deltaY > 0 ? 1 : -1
      let node: Element | null =
        event.target instanceof Element ? event.target : body

      while (node) {
        if (canScrollFurther(node, direction)) {
          // The iframe still has room: leave the event completely alone.
          return
        }
        if (node !== root && node !== body && refusesChaining(node)) {
          // An inner element opted out of chaining; respect it and stop.
          return
        }
        node = node.parentElement
      }

      // Nothing inside can move. Take ownership so the browser cannot also
      // chain (which would apply the delta twice) and hand it to the parent.
      event.preventDefault()
      window.parent.postMessage(
        {
          type: PREVIEW_SCROLL_FORWARD_TYPE,
          deltaY,
          deltaMode: event.deltaMode,
        } satisfies PreviewScrollForwardMessage,
        window.location.origin
      )
    }

    // Non-passive: preventDefault is the whole point, and a passive listener
    // cannot call it.
    document.addEventListener("wheel", handleWheel, { passive: false })
    return () => document.removeEventListener("wheel", handleWheel)
  }, [])

  return null
}
