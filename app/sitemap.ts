import type { MetadataRoute } from "next"
import { cacheLife } from "next/cache"

import { canonicalizeComponentDocUrl } from "@/lib/component-doc-paths"
import { getComponentCategories } from "@/lib/component-stats"
import { siteConfig } from "@/lib/config"
import { source } from "@/lib/source"

function collectDocUrls(): string[] {
  const pages = source.getPages()
  const urls = [
    ...new Set(pages.map((page) => canonicalizeComponentDocUrl(page.url))),
  ]
  return urls.filter(
    (url) =>
      url !== "/docs" &&
      !url.startsWith("http") &&
      !url.startsWith("/docs/radix/")
  )
}

/**
 * Clean `<loc>`-only sitemap — no `<lastmod>`, `<changefreq>`, or
 * `<priority>`. `"use cache"` + `cacheLife("max")` make it generate once per
 * deployment and serve from cache; a new deployment gets a fresh cache.
 */
async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache"
  cacheLife("max")

  const baseUrl = siteConfig.url

  const staticPaths = [
    baseUrl,
    `${baseUrl}/docs`,
    `${baseUrl}/components`,
  ]

  const docPaths = collectDocUrls().map((path) => `${baseUrl}${path}`)

  const componentPaths = getComponentCategories().map(
    (category) => `${baseUrl}/components/${category.slug}`
  )

  return [...staticPaths, ...docPaths, ...componentPaths].map((url) => ({
    url,
  }))
}

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap()
}
