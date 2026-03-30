import { Suspense } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Provider as JotaiProvider } from "jotai"

import {
  getCategories,
  getTotalComponentCount,
  searchCatalog,
} from "@/lib/registry"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { GridSkeleton } from "@/components/grid-skeleton"
import { SiteHeader } from "@/components/site-header"
import { ComponentsProvider } from "@/app/(create)/components/components/components-provider"
import { DesignSystemProvider } from "@/app/(create)/customizer/design-system-provider"
import { LocksProvider } from "@/app/(create)/hooks/use-locks"
import { CREATE_PREVIEW_FONTS_ATTR } from "@/app/(create)/lib/fonts"

const createPreviewSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const createPreviewMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400"],
})

const createPreviewFontAttrs = {
  [CREATE_PREVIEW_FONTS_ATTR]: "",
}

function ComponentsLayoutFallback() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-site-border/80 bg-site-background sticky top-(--header-height) z-10 flex h-[51px] items-center gap-2 border-b px-6 sm:px-8 xl:px-10">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="size-8 shrink-0" />
        <Skeleton className="size-8 shrink-0" />
      </div>
      <GridSkeleton
        count={8}
        showHeader={false}
        className="px-6 py-6 sm:px-8 xl:px-10"
      />
    </div>
  )
}

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
    <div
      {...createPreviewFontAttrs}
      className={cn(
        createPreviewSans.variable,
        createPreviewMono.variable,
        "bg-site-background font-site-sans overscroll-behavior- has-[.bordered-sidebar]:[&_header]:border-site-border/80 has-[.bordered-sidebar]:bg-site-muted/60 dark:has-[.bordered-sidebar]:bg-site-background relative flex min-h-svh flex-col"
      )}
    >
      <SiteHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        <Suspense fallback={<ComponentsLayoutFallback />}>
          <JotaiProvider>
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
          </JotaiProvider>
        </Suspense>
      </main>
    </div>
  )
}
