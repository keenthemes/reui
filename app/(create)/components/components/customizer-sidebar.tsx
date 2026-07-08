"use client"

import * as React from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"

import { useCustomizer } from "./components-provider"
import { CustomizerSidebarContent } from "./customizer-sidebar-content"
import { CustomizerSidebarHeader } from "./customizer-sidebar-header"

/**
 * Floating customizer panel for /components.
 * See blocks/customizer-sidebar.tsx for the design rationale (non-modal
 * Sheet, hidden built-in close, custom sizing).
 *
 * No `useIsMobile()` gate any more — the Customize trigger lives in
 * chrome that's `hidden lg:flex`, so mobile users can't open this
 * Sheet in the first place. `hidden lg:flex` on the `SheetContent`
 * itself is the belt-and-braces guard for the edge case of opening
 * on desktop and then resizing below `lg`, replacing the previous
 * matchMedia listener that drove the mobile null-return.
 */
export function CustomizerSidebar() {
  const { customizerOpen, setCustomizerOpen } = useCustomizer()
  const anchorRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <Sheet
      open={customizerOpen}
      onOpenChange={setCustomizerOpen}
      modal={false}
    >
      <SheetContent
        side="left"
        overlay={false}
        showClose={false}
        className={
          "fixed left-2 z-40 inset-y-auto top-[calc(var(--site-top-offset)+0.5rem)] bottom-2 w-(--customizer-sidebar-width) max-w-[calc(100vw-1rem)] h-auto hidden lg:flex flex-col gap-0 border-r-0 border bg-site-background border-site-border/80 site-rounded-lg overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/60"
        }
        onOpenAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <SheetTitle className="sr-only">Customize</SheetTitle>
        <SheetDescription className="sr-only">
          Customize themes, fonts, radius, and other style tokens for
          the previews.
        </SheetDescription>

        <div ref={anchorRef} className="flex h-full min-h-0 flex-col">
          <CustomizerSidebarHeader />
          {/* `isMobile={false}` literal — this desktop sidebar is never the
              mobile drawer, so the flag is a constant. */}
          <CustomizerSidebarContent isMobile={false} anchorRef={anchorRef} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
