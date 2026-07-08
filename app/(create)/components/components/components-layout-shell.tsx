"use client"

import { Suspense } from "react"

import { SidebarInset } from "@/components/ui/sidebar"

import { ComponentsHeader } from "./components-header"
import { ComponentsSidebar } from "./components-sidebar"
import { CustomizerSidebar } from "./customizer-sidebar"

/**
 * Static placeholder for `<ComponentsSidebar />` while it streams in.
 *
 * Matches the open sidebar's outer aside dimensions (sidebar width, sticky
 * top offset, full viewport height) so the children column doesn't reflow
 * from full-width to grid-width once the real sidebar hydrates. Hidden on
 * small screens — same `min-[992px]:flex` gate the real sidebar uses.
 */
function ComponentsSidebarFallback() {
  return (
    <aside
      aria-hidden="true"
      className="bg-site-background sticky top-[var(--site-top-offset)] bottom-0 hidden h-[calc(100svh-var(--site-top-offset))] w-(--sidebar-width) shrink-0 flex-col overflow-hidden min-[992px]:flex"
    />
  )
}

/**
 * Static placeholder for `<ComponentsHeader />` while it streams in.
 *
 * Reserves the 51px sticky header band (with the bottom hairline) so the
 * grid below doesn't jump up by one row's worth of height when the real
 * header lands.
 */
function ComponentsHeaderFallback() {
  return (
    <div
      aria-hidden="true"
      className="border-site-border/80 bg-site-background sticky top-[var(--site-top-offset)] z-10 h-[51px] border-b"
    />
  )
}

/**
 * Chrome (sidebar / header / customizer) lives in this client shell. Each
 * piece reads `useSearchParams` (or nuqs, which calls it) somewhere in its
 * subtree, so under `cacheComponents: true` they all need their own Suspense
 * boundary. We wrap them individually rather than wrapping the whole shell
 * with one boundary: that keeps `{children}` — the page's prerendered hero,
 * components grid, SEO body, and pager — entirely outside any Suspense, so
 * the cached static HTML actually carries the content instead of a blank
 * fallback.
 */
export function ComponentsLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={<ComponentsSidebarFallback />}>
        <ComponentsSidebar />
      </Suspense>
      <SidebarInset className="bg-transparent">
        <Suspense fallback={<ComponentsHeaderFallback />}>
          <ComponentsHeader />
        </Suspense>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
      <Suspense fallback={null}>
        <CustomizerSidebar />
      </Suspense>
    </>
  )
}
