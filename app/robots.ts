import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep API + bare iframe render targets out of the index. These are also
      // `noindex` at the page level; disallowing here stops crawl budget being
      // spent on them in the first place.
      disallow: [
        "/api/",
        // Bare iframe render targets (~3k URLs), already page-level noindex
        // and absent from the sitemap. Disallowing stops crawlers re-fetching
        // the whole preview space after every deploy - each un-warmed hit
        // writes an on-demand ISR cache entry ('use cache' + cacheLife("max")
        // with no generateStaticParams), so the re-crawl was a standing ISR
        // write cost. Browsers ignore robots.txt for iframe src, so the
        // catalog pages' embedded previews are unaffected.
        "/preview/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
