import { siteConfig } from "@/lib/config"
import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteHeader } from "@/components/site-header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background overscroll-behavior has-[.bordered-sidebar]:[&_header]:border-border/80 has-[.bordered-sidebar]:bg-muted/60 dark:has-[.bordered-sidebar]:bg-background relative flex min-h-svh flex-col overscroll-none">
      <div className="sticky top-0 z-50 flex flex-col">
        <AnnouncementBar config={siteConfig.announcementBar} />
        <SiteHeader sticky={false} />
      </div>
      <main className="relative flex flex-1 flex-col">{children}</main>
    </div>
  )
}
