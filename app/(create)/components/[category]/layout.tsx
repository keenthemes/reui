import { Suspense } from "react"

import {
  getComponentCategories,
  getComponentsTotalCount,
} from "@/lib/component-stats"
import { DEFAULT_COMPONENTS_STATE, DEFAULT_CONFIG } from "@/lib/preferences"
import {
  DesignSystemProvider,
  DesignSystemSyncProvider,
} from "@/app/(create)/design-system/design-system-provider"
import { LocksProvider } from "@/app/(create)/hooks/use-locks"

import { ComponentsLayoutShell } from "../components/components-layout-shell"
import { ComponentsProvider } from "../components/components-provider"

/**
 * Why this layout no longer wraps everything in one `<Suspense fallback={null}>`:
 *
 * `DesignSystemProvider`, `ComponentsHeader`, the sidebar's category menu, and
 * the customizer-sidebar content all read URL search params (`useSearchParams`
 * directly, or via nuqs's `useDesignSystemSearchParams`). Under Next.js 16's
 * `cacheComponents: true`, any subtree that reads search params must sit
 * under a Suspense boundary, and that boundary's fallback is what gets baked
 * into the static cached HTML for the route.
 *
 * Previously the whole provider+shell+children tree shared one outer
 * `<Suspense fallback={null}>`. That made the static prerender for routes
 * like `/components/alert-dialog` contain literally nothing in the content
 * area — the user saw blank until JS loaded, hydrated, and streamed the
 * dynamic content in. Page body (hero, components grid, SEO copy, pager)
 * was forced into the dynamic stream even though it has no per-request
 * inputs of its own.
 *
 * The fix splits the boundary into narrow ones:
 *   1. `DesignSystemProvider` runs in `effectsOnly` mode — returns null,
 *      just applies body classes / CSS vars / fonts as a side effect.
 *      Lives in its own Suspense as a sibling, so the URL read doesn't
 *      gate anything visible.
 *   2. `ComponentsLayoutShell` wraps each chrome consumer (sidebar,
 *      header, customizer) in its own Suspense boundary with a shaped
 *      placeholder, so the children prop renders OUTSIDE every boundary
 *      and ends up in the cached static HTML.
 *
 * Net effect: the cached page now ships hero, grid (with per-card preview
 * spinners), SEO body, and pager in initial HTML. Chrome streams in with
 * size-preserving fallbacks, so there's no layout shift either.
 */
export default async function ComponentCategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialConfig = DEFAULT_CONFIG
  const initialComponentsLayout = DEFAULT_COMPONENTS_STATE
  const totalCount = getComponentsTotalCount()
  const categories = getComponentCategories()
  const categoryCounts = categories.reduce(
    (acc, category) => {
      acc[category.slug] = category.count
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="has-[.bordered-sidebar]:bg-site-muted/60 dark:has-[.bordered-sidebar]:bg-site-background flex min-h-0 flex-1 flex-col">
      <LocksProvider>
        <DesignSystemSyncProvider>
          <ComponentsProvider
            initialConfig={initialConfig}
            initialComponentsLayout={initialComponentsLayout}
            totalCount={totalCount}
            categoryCounts={categoryCounts}
          >
            {/* Side-effects only: applies body classes / CSS vars / fonts
                from URL params, listens for iframe postMessages. Renders
                nothing, so its Suspense fallback is null without hiding
                any UI. */}
            <Suspense fallback={null}>
              <DesignSystemProvider effectsOnly />
            </Suspense>
            <ComponentsLayoutShell>{children}</ComponentsLayoutShell>
          </ComponentsProvider>
        </DesignSystemSyncProvider>
      </LocksProvider>
    </div>
  )
}
