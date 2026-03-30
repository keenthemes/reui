import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/seo"
import { SiteHeader } from "@/components/site-header"

const title = "Projects Built with ReUI"
const description =
  "Explore production-ready templates, admin dashboards, and websites built with ReUI, shadcn/ui, Next.js, and Tailwind CSS."

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/built-with-reui",
})

export default function BuiltWithReuiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
