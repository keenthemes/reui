import { cn } from "@/lib/utils"
import { PageGridBackdrop } from "@/components/page-grid-backdrop"
import { SiteChrome } from "@/components/site-chrome"
import { SiteFooter } from "@/components/site-footer"
import { createFontVariables } from "@/app/(create)/lib/fonts"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        createFontVariables,
        "bg-site-background font-site-sans relative flex min-h-svh flex-col"
      )}
    >
      <PageGridBackdrop />
      <SiteChrome />
      <main className="relative flex min-h-0 flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}
