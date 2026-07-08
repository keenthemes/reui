import { PageGridBackdrop } from "@/components/page-grid-backdrop"
import { SiteChrome } from "@/components/site-chrome"
import { SiteFooter } from "@/components/site-footer"

export async function AppSiteShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="site-theme-container bg-site-background font-site-sans overscroll-behavior has-[.bordered-sidebar]:[&_header]:border-site-border/80 has-[.bordered-sidebar]:bg-site-muted/60 dark:has-[.bordered-sidebar]:bg-site-background relative flex min-h-svh flex-col overscroll-none">
      <a
        href="#main-content"
        className="sr-only rounded-md px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-site-background focus:text-site-foreground focus:shadow-lg focus:ring-2 focus:ring-site-ring focus:outline-none"
      >
        Skip to content
      </a>
      <PageGridBackdrop />
      <SiteChrome />
      <main
        id="main-content"
        className="relative flex min-h-0 flex-1 flex-col"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
