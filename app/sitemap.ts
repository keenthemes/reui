import type { MetadataRoute } from "next"

import { getCategories } from "@/lib/registry"
import { getSiteUrl } from "@/lib/seo"
import { source } from "@/lib/source"

/**
 * All published doc routes (same set as `source.generateParams()`), including
 * every `/docs/components/base/...` and `/docs/components/radix/...` page. Using `getPages()` avoids
 * dropping URLs when two pages share the same `name` in the page tree.
 */
function collectDocUrls(): string[] {
  const pages = source.getPages()
  const urls = [...new Set(pages.map((p) => p.url))]
  return urls.filter((url) => url !== "/docs" && !url.startsWith("http"))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()

  const staticPaths = [
    baseUrl,
    `${baseUrl}/docs`,
    `${baseUrl}/components`,
    `${baseUrl}/built-with-reui`,
    "https://v1.reui.io",
  ]

  const docPaths = collectDocUrls().map((path) => `${baseUrl}${path}`)

  const componentCategoryPaths = getCategories().map(
    (category) => `${baseUrl}/components/${category.name}`
  )

  const allUrls = [...staticPaths, ...docPaths, ...componentCategoryPaths]

  return allUrls.map((url) => ({ url }))
}
