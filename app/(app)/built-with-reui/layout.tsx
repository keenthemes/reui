import type { Metadata } from "next"

import { absoluteUrl, getOgImageUrl } from "@/lib/seo"

const title = "Projects Built with ReUI"
const description =
  "Explore production-ready templates, admin dashboards, and websites built with ReUI, shadcn/ui, Next.js, and Tailwind CSS."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/built-with-reui",
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/built-with-reui"),
    type: "website",
    images: [
      {
        url: getOgImageUrl(title, description),
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: getOgImageUrl(title, description),
      },
    ],
  },
}

export default function BuiltWithReuiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
