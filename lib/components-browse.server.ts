import "server-only"

import fs from "node:fs"

import { devCached } from "@/lib/dev-cache"
import { projectPath, readJsonCached } from "@/lib/dev-cache.server"
import { normalizeSlug } from "@/lib/utils"

interface RegistryComponentMeta {
  className?: string
  colSpan?: number
  gridSize?: 1 | 2
  order?: number
}

interface RegistryComponentItem {
  name: string
  title?: string
  description?: string
  categories?: string[]
  meta?: RegistryComponentMeta
}

export interface BrowseComponentItem {
  name: string
  title: string
  description: string
  categories: string[]
  primaryCategory: string
  meta?: RegistryComponentMeta
  searchText: string
}

/**
 * Load a single category shard via `fs.readFileSync` (invisible to Turbopack).
 * Each category is cached independently so only visited categories pay the cost.
 */
function loadComponentCategoryShard(category: string): RegistryComponentItem[] {
  const normalizedCategory = normalizeSlug(category)
  const shardPath = projectPath(
    "registry-reui",
    "_meta",
    "components",
    "bases",
    "base",
    `${normalizedCategory}.json`
  )

  try {
    if (!fs.existsSync(shardPath)) {
      return []
    }

    const mod = readJsonCached<{ items?: RegistryComponentItem[] }>(
      `category-shard:${normalizedCategory}`,
      shardPath
    )

    return Array.isArray(mod.items) ? mod.items : []
  } catch (error) {
    console.error(
      `Failed to load component registry shard for category "${normalizedCategory}"`,
      error
    )
    return []
  }
}

export function getComponentsByCategoryServer(
  category: string
): BrowseComponentItem[] {
  const normalizedCategory = normalizeSlug(category)
  const items = loadComponentCategoryShard(normalizedCategory)

  return items
    .map((item) => ({
      name: item.name,
      title: item.title || item.name,
      description: item.description || "",
      categories: Array.isArray(item.categories)
        ? item.categories.map((candidate) => normalizeSlug(candidate))
        : [normalizedCategory],
      primaryCategory: normalizedCategory,
      meta: item.meta,
      searchText: [
        item.name,
        item.title || "",
        item.description || "",
        normalizedCategory,
        ...(item.categories ?? []),
      ]
        .join(" ")
        .toLowerCase(),
    }))
    .sort((a, b) => (a.meta?.order ?? 9_999) - (b.meta?.order ?? 9_999))
}

export function getCategoryComponentItems(category: string) {
  return getComponentsByCategoryServer(category)
}

function loadComponentNameIndex(base: string = "base") {
  return devCached(`component-name-index:${base}`, () => {
    const indexPath = projectPath(
      "registry-reui",
      "_meta",
      "components",
      "bases",
      base,
      "name-index.json"
    )

    try {
      if (fs.existsSync(indexPath)) {
        return readJsonCached<Record<string, string>>(
          `component-name-index-json:${base}`,
          indexPath
        )
      }

      // Fallback for older/generated registries that do not yet emit
      // `name-index.json`. We derive the lookup from the category shards and
      // cache it once so docs/category preview lookups stay fast in dev.
      const shardsDir = projectPath(
        "registry-reui",
        "_meta",
        "components",
        "bases",
        base
      )

      if (!fs.existsSync(shardsDir)) {
        return {} as Record<string, string>
      }

      const derivedIndex: Record<string, string> = {}
      for (const entry of fs.readdirSync(shardsDir)) {
        if (!entry.endsWith(".json") || entry === "name-index.json") {
          continue
        }

        const category = entry.replace(/\.json$/, "")
        const shardPath = projectPath(
          "registry-reui",
          "_meta",
          "components",
          "bases",
          base,
          entry
        )

        try {
          const raw = fs.readFileSync(shardPath, "utf-8")
          const mod = JSON.parse(raw) as { items?: RegistryComponentItem[] }

          for (const item of mod.items ?? []) {
            if (item?.name) {
              derivedIndex[item.name] = category
            }
          }
        } catch (error) {
          console.error(
            `Failed to derive component name index from shard "${entry}" for base "${base}"`,
            error
          )
        }
      }

      return derivedIndex
    } catch (error) {
      console.error(
        `Failed to load component name index for base "${base}"`,
        error
      )
      return {} as Record<string, string>
    }
  })
}

export function getComponentByNameServer(name: string, base: string = "base") {
  const normalizedName = name.trim()

  return devCached(`component-item:${base}:${normalizedName}`, () => {
    try {
      const categoryByName = loadComponentNameIndex(base)
      const indexedCategory = categoryByName[normalizedName]

      if (!indexedCategory) {
        return null
      }

      return (
        getComponentsByCategoryServer(indexedCategory).find(
          (candidate) => candidate.name === normalizedName
        ) ?? null
      )
    } catch (error) {
      console.error(
        `Failed to resolve component "${normalizedName}" for base "${base}"`,
        error
      )
      return null
    }
  }) as BrowseComponentItem | null
}
