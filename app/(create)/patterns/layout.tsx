import { Suspense } from "react"

import {
  getCategories,
  getPatternsTotalCount,
  searchPatterns,
} from "@/lib/registry"
import { SiteHeader } from "@/components/site-header"
import { DesignSystemProvider } from "@/app/(create)/components/design-system-provider"
import { LocksProvider } from "@/app/(create)/hooks/use-locks"
import { PatternsProvider } from "@/app/(create)/patterns/components/patterns-provider"

export default function PatternsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const totalCount = getPatternsTotalCount()
  const allPatterns = searchPatterns("")
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
      <main className="flex flex-1 flex-col">
        <Suspense fallback={null}>
          <LocksProvider>
            <DesignSystemProvider>
              <PatternsProvider
                totalCount={totalCount}
                categoryCounts={categoryCounts}
                allPatterns={allPatterns}
              >
                {children}
              </PatternsProvider>
            </DesignSystemProvider>
          </LocksProvider>
        </Suspense>
      </main>
    </div>
  )
}
