import { Suspense } from "react"

import { getCategories, getPatternsTotalCount } from "@/lib/registry"
import { SiteHeader } from "@/components/site-header"
import { DesignSystemSyncProvider } from "@/app/(create)/components/design-system-provider"
import { LocksProvider } from "@/app/(create)/hooks/use-locks"
import { PatternsProvider } from "@/app/(create)/patterns/components/patterns-provider"

export default function PatternsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const totalCount = getPatternsTotalCount()
  const categories = getCategories()
  const categoryCounts = categories.reduce(
    (acc, cat) => {
      acc[cat.name] = cat.count
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="bg-background overscroll-behavior- has-[.bordered-sidebar]:[&_header]:border-border/80 has-[.bordered-sidebar]:bg-muted/60 dark:has-[.bordered-sidebar]:bg-background relative flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Suspense fallback={null}>
          <LocksProvider>
            <DesignSystemSyncProvider>
              <PatternsProvider
                totalCount={totalCount}
                categoryCounts={categoryCounts}
              >
                {children}
              </PatternsProvider>
            </DesignSystemSyncProvider>
          </LocksProvider>
        </Suspense>
      </main>
    </div>
  )
}
