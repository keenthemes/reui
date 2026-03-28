import { Suspense } from "react"

import {
  getCategories,
  getTotalComponentCount,
  searchCatalog,
} from "@/lib/registry"
import { SiteHeader } from "@/components/site-header"
import { DesignSystemProvider } from "@/app/(create)/customizer/design-system-provider"
import { LocksProvider } from "@/app/(create)/hooks/use-locks"
import { ComponentsProvider } from "@/app/(create)/components/components/components-provider"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const totalCount = getTotalComponentCount()
  const catalogItems = searchCatalog("")
  const categories = getCategories()
  const categoryCounts = categories.reduce(
    (acc, cat) => {
      acc[cat.name] = cat.count
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="bg-site-background font-site-sans overscroll-behavior- has-[.bordered-sidebar]:[&_header]:border-site-border/80 has-[.bordered-sidebar]:bg-site-muted/60 dark:has-[.bordered-sidebar]:bg-site-background relative flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        <Suspense fallback={null}>
          <LocksProvider>
            <DesignSystemProvider>
              <ComponentsProvider
                totalCount={totalCount}
                categoryCounts={categoryCounts}
                catalogItems={catalogItems}
              >
                {children}
              </ComponentsProvider>
            </DesignSystemProvider>
          </LocksProvider>
        </Suspense>
      </main>
    </div>
  )
}
