import { Suspense } from "react"

import { SiteHeader } from "@/components/site-header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background overscroll-behavior has-[.bordered-sidebar]:[&_header]:border-border/80 has-[.bordered-sidebar]:bg-muted/60 dark:has-[.bordered-sidebar]:bg-background relative flex min-h-svh flex-col overscroll-none">
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
