import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/config"
import { getCategories } from "@/lib/registry"
import { source } from "@/lib/source"

type PageTreeNode = ReturnType<typeof source.getPageTree>["children"][number]

function collectDocPages(nodes: PageTreeNode[]): string[] {
  const urls: string[] = []
  const seen = new Set<string>()

  function walk(items: PageTreeNode[]) {
    for (const node of items) {
      if (node.type === "page") {
        const key = node.name?.toString() ?? node.url
        if (!seen.has(key)) {
          seen.add(key)
          urls.push(node.url)
        }
      } else if (node.type === "folder" && node.children) {
        walk(node.children)
      }
    }
  }

  walk(nodes)
  return urls
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/patterns`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  // Doc pages from fumadocs source tree
  const tree = source.getPageTree()
  const docUrls = collectDocPages(tree.children)
  const docPages: MetadataRoute.Sitemap = docUrls.map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: url.includes("/components/") ? 0.8 : 0.7,
  }))

  // Pattern category pages
  const categories = getCategories()
  const patternPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/patterns/${category.name}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...docPages, ...patternPages]
}
