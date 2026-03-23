import { Metadata } from "next"

import { buildPageMetadata } from "@/lib/seo"
import { SiteFooter } from "@/components/site-footer"
import { SiteSubscribe } from "@/components/site-subscribe"

import { FAQSection } from "./components/faq-section"
import Hero from "./components/hero"
import { Patterns } from "./components/patterns"
import { Stats } from "./components/stats"
import { WallOfLove } from "./components/wall-of-love"

const title =
  "ReUI – Free Shadcn UI Components, Patterns, Blocks and Extensions"
const description =
  "Discover the free 1000+ open-source shadcn/ui component patterns for React and Tailwind CSS."

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/",
  keywords: [
    "shadcn patterns",
    "shadcn components",
    "shadcn create",
    "shadcn ui extensions",
    "shadcn ui examples",
    "shadcn ui patterns",
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
      <Patterns />
      <WallOfLove />
      <FAQSection />
      <SiteSubscribe />
      <SiteFooter />
    </div>
  )
}
