import { siteConfig } from "@/lib/config"
import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteHeader } from "@/components/site-header"

export default function RootAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="sticky top-0 z-50 flex flex-col">
        <AnnouncementBar config={siteConfig.announcementBar} />
        <SiteHeader sticky={false} />
      </div>
      {children}
    </>
  )
}
