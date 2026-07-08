import { SiteHeader } from "@/components/site-header"
import { StickySiteChrome } from "@/components/sticky-site-chrome"

export function SiteChrome() {
  return <StickySiteChrome announcement={null} header={<SiteHeader />} />
}
