import type { Metadata } from "next"

import { PreviewScrollForwarder } from "@/components/preview-scroll-forwarder"
import { BlockPreviewDesignSystemProvider } from "@/app/(create)/design-system/block-preview-design-system-provider"
import { PreviewStyle } from "@/app/(create)/design-system/preview-style"
import { createFontVariables } from "@/app/(create)/lib/fonts"

// Bare iframe render targets, not standalone pages. Same reasoning as the
// sibling block preview layout: keep the thin preview URLs out of the index.
// app/robots.ts already disallows /preview/; this is belt and braces for any
// URL a crawler already knows.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Matches the sibling block preview layout. `base` and `name` ARE the content
// here, so there is no cached UI to show above them and any Suspense fallback
// would just be an empty frame. Nothing client-navigates to these routes
// either: they are iframe render targets. `instant` only opts this segment out
// of instant-navigation validation, so prerendering is unaffected.
export const instant = false

/**
 * Intentionally an empty root: full width, no padding, no min-height, no
 * background of its own. The example fills the frame exactly, and the host
 * card or docs preview box supplies all the surrounding spacing, so nothing
 * is applied twice. The only thing this wrapper carries is the font variable
 * definitions, which the example needs to resolve `font-site-sans`.
 */
export default function ComponentExamplePreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={createFontVariables} data-slot="component-example-preview">
      {/* Hides the frame's own scrollbars, so an example that slightly
          overflows its authored height does not paint a scrollbar gutter
          inside the card. */}
      <PreviewStyle />
      {/*
        The app's root layout is shared by every route, so its chrome renders
        inside this frame too. Crisp and Analytics already opt out of embeds on
        their own, and Toaster / TopProgressBar / ScrollToTop paint nothing
        here, but the dev-only Tailwind breakpoint badge is `position: fixed`
        and shows up as a stray pill in the corner of every preview. Hide it so
        the frame really is a blank page.
      */}
      <style>{`[data-tailwind-indicator]{display:none!important}`}</style>
      {/*
        `BlockPreviewDesignSystemProvider`, not the nuqs-backed
        `DesignSystemProvider` the sibling components workbench route uses.
        This one reads the design params straight off `window.location.search`
        on its FIRST client render, so the example paints in the right style
        immediately instead of waiting for a postMessage round trip, and it
        needs no Suspense boundary. Live customizer changes still arrive by
        postMessage afterwards.
      */}
      <PreviewScrollForwarder />
      <BlockPreviewDesignSystemProvider>
        {children}
      </BlockPreviewDesignSystemProvider>
    </div>
  )
}
