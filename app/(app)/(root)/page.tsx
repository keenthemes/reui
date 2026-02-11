import { Metadata } from "next"

import { SiteFooter } from "@/components/site-footer"
import { SiteSubscribe } from "@/components/site-subscribe"

import Hero from "./components/hero"
import { Patterns } from "./components/patterns"
import { Stats } from "./components/stats"
import { WallOfLove } from "./components/wall-of-love"

const title = "The Foundation for your Design System"
const description =
  "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code."

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function IndexPage() {
  return (
    <div className="homepage relative overflow-hidden bg-linear-to-b to-gray-100 to-35% dark:to-zinc-900">
      <Hero />
      <Stats />
      <Patterns />
      <WallOfLove />
      <SiteSubscribe />
      <SiteFooter />
    </div>
  )
}
