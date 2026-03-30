import { Metadata } from "next"

import { buildPageMetadata } from "@/lib/seo"
import { SiteFooter } from "@/components/site-footer"
import { SiteSubscribe } from "@/components/site-subscribe"

import { HomeComponents } from "./components/components"
import { FAQSection } from "./components/faq-section"
import Hero from "./components/hero"
import { Stats } from "./components/stats"
import { WallOfLove } from "./components/wall-of-love"

const title = "ReUI – Shadcn UI Components and Blocks"
const description =
  "Discover the 1000+ free shadcn/ui components and blocks for React and Tailwind CSS."

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/",
  keywords: [
    "shadcn catalog",
    "shadcn components",
    "reui components",
    "reui blocks",
    "shadcn create",
    "shadcn ui extensions",
    "shadcn ui examples",
    "shadcn ui components",
    "free shadcn components",
    "open-source shadcn components",
    "shadcn data grid",
    "shadcn datagrid",
    "shadcn filters",
    "shadcn file upload",
    "shadcn stepper",
    "shadcn timeline",
    "shadcn rating",
    "shadcn sortable",
    "shadcn kanban",
  ],
})

export default function IndexPage() {
  return (
    <div className="homepage relative overflow-hidden bg-linear-to-b to-gray-100 to-35% dark:to-zinc-900">
      <Hero />
      <Stats />
      <HomeComponents />
      <WallOfLove />
      <FAQSection />
      <SiteSubscribe />
      <SiteFooter />
    </div>
  )
}
