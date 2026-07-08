/**
 * Registry - Client-safe registry operations
 *
 * This module provides client-safe access to the component registry data.
 *
 * Data source (single source of truth):
 * - registry-reui/_meta/components/bases/{base} — per-category component metadata with files
 *
 * Components are lazy-loaded on-demand.
 */

import * as React from "react"
import baseComponentNameIndex from "@/registry-reui/_meta/components/bases/base/name-index.json"
import radixComponentNameIndex from "@/registry-reui/_meta/components/bases/radix/name-index.json"
import { LRUCache } from "lru-cache"
import { registryItemSchema } from "shadcn/schema"

import { devCached } from "@/lib/dev-cache"
import { componentPreviewCategoryLoaders } from "@/lib/generated/component-preview-loaders"
import { isStyleAwareRegistryItemName } from "@/lib/public-registry"
import { getRegistryDeploymentId } from "@/lib/registry-deployment"
import { normalizeAbsoluteUrl } from "@/lib/site-url"
import { normalizeSlug } from "@/lib/utils"
import { BASES } from "@/registry/bases"
import { PRESETS, type IconLibraryName } from "@/registry/config"
import { STYLES } from "@/registry/styles"

/**
 * Static name -> category lookup for client-side getComponent. Built by
 * build-components.mts, ~30KB per base, JSON-imported so Turbopack can
 * inline it. This replaces a dynamic template import() that previously
 * forced the bundler to discover and chunk every block/component source
 * file under registry-reui, making production builds OOM at ~10k blocks.
 */
const componentNameToCategory: Record<string, Record<string, string>> = {
  base: baseComponentNameIndex as Record<string, string>,
  radix: radixComponentNameIndex as Record<string, string>,
}

/**
 * Slim manifest entry mirrors SlimBlockEntry from block-manifest-index,
 * duplicated here to keep this module client-safe. block-manifest-index
 * imports fs at module scope, and importing it from this file would
 * taint the client bundle (reachable from component-client.tsx via
 * getRegistryComponent).
 */
interface SlimManifestEntry {
  name: string
  title: string
  description?: string
  group: string
  primaryCategory: string
  categories?: string[]
  meta?: {
    order?: number
    gridSize?: 1 | 2
    previewHeight?: string
    className?: string
    colSpan?: number
  }
  searchText: string
}

// ============================================================================
// Server-side modules (lazy-loaded to avoid client-side bundling issues)
// ============================================================================

// Server-only Node modules. Resolved lazily so the file can still be
// imported (statically analyzed) by client builds — the actual require()
// only runs when we're in the server runtime. Using `createRequire` here
// instead of `eval('require(...)')` is friendlier to CSP and bundler
// security scanners (no `unsafe-eval`).
const pathNode: typeof import("node:path") | null = (() => {
  if (typeof window !== "undefined") return null
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createRequire } =
    require("node:module") as typeof import("node:module")
  const req = createRequire(import.meta.url)
  return req("node:path") as typeof import("node:path")
})()

const fsNode: typeof import("node:fs") | null = (() => {
  if (typeof window !== "undefined") return null
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createRequire } =
    require("node:module") as typeof import("node:module")
  const req = createRequire(import.meta.url)
  return req("node:fs") as typeof import("node:fs")
})()

const fs: typeof import("node:fs/promises") | null = (() => {
  if (typeof window !== "undefined") return null
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createRequire } =
    require("node:module") as typeof import("node:module")
  const req = createRequire(import.meta.url)
  return req("node:fs/promises") as typeof import("node:fs/promises")
})()

// Path-traversal hardening: a registry segment must match this pattern.
// Rejects `..`, `/`, `\`, %-encoded sneaky bits, leading/trailing dots.
const SAFE_REGISTRY_SEGMENT = /^[a-z0-9][a-z0-9_-]*$/i

function isSafeRegistrySegment(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false
  if (value.includes("..") || value.includes("/") || value.includes("\\")) {
    return false
  }
  return SAFE_REGISTRY_SEGMENT.test(value)
}

function normalizeRegistryOrigin(origin: string) {
  const normalized = normalizeAbsoluteUrl(origin)

  return normalized.endsWith("/") ? normalized : `${normalized}/`
}

export function getRegistryJsonUrl(styleName: string, name: string): string {
  const path = `/r/styles/${styleName}/${encodeURIComponent(name)}.json`
  return `${path}?v=${encodeURIComponent(getRegistryDeploymentId())}`
}

export function getRegistryJsonAbsoluteUrl(
  origin: string,
  styleName: string,
  name: string
) {
  return new URL(
    getRegistryJsonUrl(styleName, name),
    normalizeRegistryOrigin(origin)
  ).toString()
}

// ============================================================================
// Types
// ============================================================================

export interface CategoryInfo {
  name: string
  slug: string
  label: string
  description: string
  icon: string
  count: number
  groupSlug: string
}

export interface BlockGroup {
  slug: string
  label: string
  icon: string
  totalBlocks: number
  categories: BlockCategory[]
}

export interface BlockCategory {
  slug: string
  label: string
  description: string
  icon: string
  count: number
}

export interface BlocksData {
  groups: BlockGroup[]
  totalBlocks: number
}

export interface IconEntry {
  name: string
  slug: string
  category: string
  styles: string[]
}

export interface IconCategory {
  slug: string
  label: string
  count: number
  /** Whether this category's animated icon set is ready. See lib/registry-data.ts. */
  animated?: boolean
}

export interface IconsData {
  styles: string[]
  categories: IconCategory[]
  icons: IconEntry[]
  totalIcons: number
}

export interface BlockData {
  name: string
  title: string
  description: string | undefined
  docs: string | undefined
  /** npm package dependencies (e.g. ["lucide-react", "date-fns"]) */
  dependencies: string[]
  /** shadcn/ui registry component dependencies (e.g. ["button", "badge"]) */
  registryDependencies: string[]
  group: string
  categories: string[]
  primaryCategory: string
  meta:
    | {
        className?: string
        colSpan?: number
        gridSize?: 1 | 2
        order?: number
        previewHeight?: string
      }
    | undefined
  searchText: string
}

interface RegistryItemFile {
  path: string
  type: string
  content?: string
  highlightedContent?: string
  target?: string
}

export interface RegistryItem {
  name: string
  title: string
  type: string
  description?: string
  files?: RegistryItemFile[]
  registryDependencies?: string[]
  dependencies?: string[]
  devDependencies?: string[]
  categories?: string[]
  group?: string
  meta?: Record<string, unknown>
  cssVars?: Record<string, any>
}

export type ComponentCategory = string
export type Category = string

// ============================================================================
// Lazy-loaded data (cached at module level)
// ============================================================================

interface MetadataData {
  Metadata: Record<string, Record<string, RegistryItem>>
}

// All caches use devCached (globalThis) to survive dev module re-evaluations.

// ============================================================================
// Core data loader — categories.json (single source of truth)
// ============================================================================

/**
 * Legacy category-hierarchy accessor. The open-source build ships components
 * only, so this returns an empty set; category data for the component catalog
 * comes from `lib/component-stats.ts`.
 */
export function getBlocksData(): BlocksData {
  return { groups: [], totalBlocks: 0 }
}

/**
 * Derive flat category list from the group/category hierarchy.
 */
function getFlatCategories(): CategoryInfo[] {
  return devCached("registry-flat-categories", () => {
    const data = getBlocksData()
    const cats: CategoryInfo[] = []
    for (const group of data.groups) {
      for (const cat of group.categories) {
        cats.push({
          name: cat.slug,
          slug: cat.slug,
          label: cat.label,
          description: cat.description,
          icon: cat.icon,
          count: cat.count,
          groupSlug: group.slug,
        })
      }
    }
    // Order follows categories.json (the single source of truth used by every
    // surface); never re-sort alphabetically, or this helper diverges from the
    // canonical group/category order returned by lib/registry-data.ts.
    return cats
  })
}

// ============================================================================
// Metadata loading (per-base metadata shards plus shared reui/hooks registries)
// ============================================================================

function readRegistryShardItemsSync(
  entity: "components" | "blocks",
  base: string
): RegistryItem[] {
  if (!pathNode || !fsNode) {
    return []
  }

  const dirPath = pathNode.join(
    process.cwd(),
    "registry-reui",
    "_meta",
    entity,
    "bases",
    base
  )

  try {
    const files: string[] = []
    const walk = (currentDir: string) => {
      const entries = fsNode.readdirSync(currentDir, { withFileTypes: true })

      for (const entry of entries) {
        const entryPath = pathNode.join(currentDir, entry.name)

        if (entry.isDirectory()) {
          walk(entryPath)
          continue
        }

        if (entry.isFile() && entry.name.endsWith(".json")) {
          files.push(entryPath)
        }
      }
    }

    walk(dirPath)
    files.sort((a: string, b: string) => a.localeCompare(b))

    const items: RegistryItem[] = []

    for (const file of files) {
      const raw = fsNode.readFileSync(file, "utf-8")
      const mod = JSON.parse(raw) as { items?: RegistryItem[] }
      if (Array.isArray(mod.items)) {
        items.push(...mod.items)
      }
    }

    return items
  } catch {
    return []
  }
}

function getMetadata(base: string = "base"): MetadataData {
  return devCached(`registry-metadata:${base}`, () => {
    try {
      const metadata: Record<string, RegistryItem> = {}

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const hooksMod = require(
          `../registry-reui/bases/${base}/hooks/_registry`
        )
        const hookItems = hooksMod.hooks || []
        for (const item of hookItems) metadata[item.name] = item
      } catch (e) {
        console.warn(`Could not load hooks registry for ${base}`, e)
      }

      try {
        const componentItems = readRegistryShardItemsSync("components", base)
        for (const item of componentItems) metadata[item.name] = item
      } catch (e) {
        console.warn(`Could not load component metadata shards for ${base}`, e)
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const reuiMod = require(`../registry-reui/bases/${base}/reui/_registry`)
        const reuiItems = reuiMod.reui || []
        for (const item of reuiItems) metadata[item.name] = item
      } catch (e) {
        console.warn(`Could not load reui registry for ${base}`, e)
      }

      try {
        const blockItems = readRegistryShardItemsSync("blocks", base)
        for (const item of blockItems) metadata[item.name] = item
      } catch (e) {
        console.warn(`Could not load block metadata shards for ${base}`, e)
      }

      return { Metadata: { [base]: metadata } }
    } catch (e) {
      console.error(`Failed to load registry for base: ${base}`, e)
      return { Metadata: { [base]: {} } }
    }
  })
}

export function getRegistryMetadata(base?: string) {
  if (base) {
    const { Metadata } = getMetadata(base)
    return Metadata[base] || {}
  }

  const allMetadata: Record<string, Record<string, RegistryItem>> = {}
  const bases = ["base", "radix"]
  for (const b of bases) {
    const { Metadata } = getMetadata(b)
    if (Metadata[b]) allMetadata[b] = Metadata[b]
  }
  return allMetadata
}

export function getRegistryItemMetadata(name: string, base: string = "base") {
  const { Metadata } = getMetadata(base)
  return Metadata[base]?.[name]
}

// ============================================================================
// Component loading
// ============================================================================

const componentCache = new Map<string, React.LazyExoticComponent<any>>()

const MAX_CONCURRENT_IMPORTS = 6
let activeImports = 0
const importQueue: Array<{
  resolve: (mod: any) => void
  reject: (err: any) => void
  loader: () => Promise<any>
}> = []

function flushImportQueue() {
  while (activeImports < MAX_CONCURRENT_IMPORTS && importQueue.length > 0) {
    const next = importQueue.shift()!
    activeImports++
    next
      .loader()
      .then(next.resolve, next.reject)
      .finally(() => {
        activeImports--
        flushImportQueue()
      })
  }
}

function throttledImport(loader: () => Promise<any>): Promise<any> {
  if (activeImports < MAX_CONCURRENT_IMPORTS) {
    activeImports++
    return loader().finally(() => {
      activeImports--
      flushImportQueue()
    })
  }
  return new Promise((resolve, reject) => {
    importQueue.push({ resolve, reject, loader })
  })
}

export function getComponent(
  base: string,
  name: string,
  category?: string
): React.LazyExoticComponent<any> | null {
  const normalizedCategory = category
    ? normalizeSlug(category)
    : componentNameToCategory[base]?.[name]

  if (!normalizedCategory) {
    // Hooks / reui shared modules don't have a category — they aren't
    // browsable previews. The catalog never asks for these via this path
    // (server code handles them directly), so returning null here is safe.
    return null
  }

  const cacheKey = `${base}:${normalizedCategory}:${name}`
  if (componentCache.has(cacheKey)) return componentCache.get(cacheKey)!

  const categoryLoaderKey = `${base}:${normalizedCategory}`
  const categoryLoader = componentPreviewCategoryLoaders[categoryLoaderKey]
  if (!categoryLoader) return null

  const lazyComponent = React.lazy(() =>
    throttledImport(() =>
      categoryLoader().then((mod) => {
        const loader = mod.componentPreviewLoaders?.[name]
        if (!loader) {
          throw new Error(
            `Component preview loader not found for ${base}/${normalizedCategory}/${name}`
          )
        }
        return throttledImport(() => loader())
      })
    )
  )

  componentCache.set(cacheKey, lazyComponent)
  return lazyComponent
}

export function hasComponent(base: string, name: string): boolean {
  return !!getRegistryItemMetadata(name, base)
}

// ============================================================================
// LRU Cache for cross-request caching
// ============================================================================

const registryCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 20,
})

const inFlightRequests = new Map<string, Promise<any>>()

// ============================================================================
// Category Functions — derived from block metadata categories.json
// ============================================================================

/**
 * Get all categories with full info (name, label, description, icon, count, groupSlug)
 */
export function getCategories(): CategoryInfo[] {
  return getFlatCategories()
}

export function getCategoryNames(): string[] {
  return getFlatCategories().map((c) => c.name)
}

export function getCategoryInfo(category: string): CategoryInfo | undefined {
  const normalized = normalizeSlug(category)
  return getFlatCategories().find((c) => c.name === normalized)
}

export function getBlocksTotalCount(): number {
  return getBlocksData().totalBlocks
}

export function getBlockCountByCategory(category: string): number {
  const normalized = normalizeSlug(category)
  const cat = getFlatCategories().find((c) => c.name === normalized)
  return cat?.count ?? 0
}

export function getCategoryDescription(category: string): string | undefined {
  const normalized = normalizeSlug(category)
  const cat = getFlatCategories().find((c) => c.name === normalized)
  return cat?.description
}

export function getCategoryIcon(category: string): string | undefined {
  const normalized = normalizeSlug(category)
  const cat = getFlatCategories().find((c) => c.name === normalized)
  return cat?.icon
}

export function isValidCategory(category: string): boolean {
  const normalized = normalizeSlug(category)
  return getFlatCategories().some((c) => c.name === normalized)
}

export function getCategorySortOrder(category: string): number {
  const normalized = normalizeSlug(category)
  const index = getFlatCategories().findIndex((c) => c.name === normalized)
  return index === -1 ? Number.POSITIVE_INFINITY : index
}

// Legacy exports for backwards compatibility
export const componentCategories = new Proxy([] as string[], {
  get(target, prop) {
    const names = getFlatCategories().map((c) => c.name)
    if (prop === "length") return names.length
    if (prop === Symbol.iterator) return names[Symbol.iterator].bind(names)
    if (typeof prop === "string" && !isNaN(Number(prop)))
      return names[Number(prop)]
    if (typeof prop === "string" && prop in Array.prototype)
      return (names as any)[prop]
    return undefined
  },
  has(target, prop) {
    return getFlatCategories().some((c) => c.name === prop)
  },
}) as unknown as readonly string[]

export const registryCategories = componentCategories
export const isComponentCategory = isValidCategory
export function categories<T extends Category[]>(...cats: T): T {
  return cats
}

// ============================================================================
// Component registry functions
// ============================================================================

interface BlockIndexes {
  blocksArray: BlockData[]
  blockByNameIndex: Map<string, BlockData>
  blockCategoryIndex: Map<string, BlockData[]>
  blockGroupCategoryIndex: Map<string, BlockData[]>
}

function summaryToBlockData(summary: SlimManifestEntry): BlockData {
  const itemCategories =
    summary.categories && summary.categories.length > 0
      ? summary.categories
      : [summary.primaryCategory]
  return {
    name: summary.name,
    title: summary.title || "",
    description: summary.description || "",
    docs: undefined,
    dependencies: [],
    registryDependencies: [],
    group: summary.group,
    categories: itemCategories,
    primaryCategory: summary.primaryCategory,
    meta: summary.meta,
    searchText: summary.searchText,
  }
}

function readSlimManifestEntries(): SlimManifestEntry[] {
  if (!fsNode || !pathNode) {
    return []
  }

  try {
    const indexPath = pathNode.join(
      process.cwd(),
      "registry-reui",
      "_meta",
      "blocks",
      "manifest-index.json"
    )

    if (!fsNode.existsSync(indexPath)) {
      return []
    }

    const raw = fsNode.readFileSync(indexPath, "utf-8")
    const parsed = JSON.parse(raw) as { items?: SlimManifestEntry[] }
    return Array.isArray(parsed.items) ? parsed.items : []
  } catch (e) {
    console.error("Failed to load manifest-index.json", e)
    return []
  }
}

function getBlockIndexes(): BlockIndexes {
  return devCached("registry-block-indexes", () => {
    const blocksMap = new Map<string, BlockData>()
    const categoryIndex = new Map<string, BlockData[]>()
    const groupCategoryIndex = new Map<string, BlockData[]>()

    for (const summary of readSlimManifestEntries()) {
      blocksMap.set(summary.name, summaryToBlockData(summary))
    }

    const sorted = Array.from(blocksMap.values()).sort((a, b) => {
      if (a.primaryCategory !== b.primaryCategory)
        return a.primaryCategory.localeCompare(b.primaryCategory)
      return (a.meta?.order ?? 9999) - (b.meta?.order ?? 9999)
    })

    for (const block of sorted) {
      const normalizedPrimary = normalizeSlug(block.primaryCategory)
      if (!categoryIndex.has(normalizedPrimary))
        categoryIndex.set(normalizedPrimary, [])
      categoryIndex.get(normalizedPrimary)!.push(block)

      const groupCategoryKey = `${block.group}/${normalizedPrimary}`
      if (!groupCategoryIndex.has(groupCategoryKey))
        groupCategoryIndex.set(groupCategoryKey, [])
      groupCategoryIndex.get(groupCategoryKey)!.push(block)

      for (const cat of block.categories) {
        const normalizedCat = normalizeSlug(cat)
        if (normalizedCat !== normalizedPrimary) {
          if (!categoryIndex.has(normalizedCat))
            categoryIndex.set(normalizedCat, [])
          categoryIndex.get(normalizedCat)!.push(block)

          const alternateKey = `${block.group}/${normalizedCat}`
          if (!groupCategoryIndex.has(alternateKey))
            groupCategoryIndex.set(alternateKey, [])
          groupCategoryIndex.get(alternateKey)!.push(block)
        }
      }
    }

    return {
      blocksArray: sorted,
      blockByNameIndex: blocksMap,
      blockCategoryIndex: categoryIndex,
      blockGroupCategoryIndex: groupCategoryIndex,
    }
  })
}

export function getAllBlocks(): BlockData[] {
  return getBlockIndexes().blocksArray
}

export function getBlocksByCategory(category: string): BlockData[] {
  return getBlockIndexes().blockCategoryIndex.get(normalizeSlug(category)) ?? []
}

export function searchBlocks(query: string): BlockData[] {
  const { blocksArray, blockCategoryIndex } = getBlockIndexes()
  if (!query.trim()) return blocksArray

  const lowerQuery = query.toLowerCase().trim()
  const exactMatch = blockCategoryIndex.get(lowerQuery)
  if (exactMatch) return exactMatch

  const terms = lowerQuery.split(/\s+/).filter(Boolean)
  if (terms.length === 0) return blocksArray

  return blocksArray.filter((p) =>
    terms.every((term) => {
      if (p.searchText.includes(term)) return true
      if (term.length > 3 && term.endsWith("s")) {
        const singular = term.slice(0, -1)
        if (p.searchText.includes(singular)) return true
      }
      return false
    })
  )
}

export function filterBlocks(
  blocksSource: BlockData[],
  filterCategories: string[],
  query: string
): BlockData[] {
  const { blocksArray, blockCategoryIndex } = getBlockIndexes()

  let result: BlockData[]

  if (filterCategories && filterCategories.length > 0) {
    const normalizedFilters = filterCategories.map((c) => normalizeSlug(c))
    const seen = new Set<string>()
    result = []
    for (const cat of normalizedFilters) {
      const categoryBlocks = blockCategoryIndex.get(cat) ?? []
      for (const p of categoryBlocks) {
        if (!seen.has(p.name)) {
          seen.add(p.name)
          result.push(p)
        }
      }
    }
  } else {
    result = blocksSource || blocksArray
  }

  if (query && query.trim()) {
    const lowerQuery = query.toLowerCase().trim()
    const terms = lowerQuery.split(/\s+/).filter(Boolean)
    if (terms.length > 0) {
      result = result.filter((p) =>
        terms.every((term) => {
          if (p.searchText.includes(term)) return true
          if (term.length > 3 && term.endsWith("s")) {
            const singular = term.slice(0, -1)
            if (p.searchText.includes(singular)) return true
          }
          return false
        })
      )
    }
  }

  return result
}

export function getPaginatedBlocks(
  category: string | null,
  search: string,
  offset: number,
  limit: number
): { patterns: BlockData[]; total: number; hasMore: boolean } {
  const { blocksArray } = getBlockIndexes()

  let filtered: BlockData[]
  if (category) {
    filtered = filterBlocks(blocksArray, [category], search)
  } else if (search.trim()) {
    filtered = searchBlocks(search)
  } else {
    filtered = blocksArray
  }

  return {
    patterns: filtered.slice(offset, offset + limit),
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
  }
}

// ============================================================================
// Component Functions
// ============================================================================

export function getRegistryComponent(
  name: string,
  styleName: string = "radix"
) {
  const base = getRegistryKey(styleName)
  return getComponent(base, name)
}

// ============================================================================
// Registry Item Functions (for code display, etc.)
// ============================================================================

const DEFAULT_STYLE_NAME = "base-nova"
const DEFAULT_REGISTRY_STYLE_VARIANT = "nova"
const REGISTRY_STYLE_VARIANTS = new Set([
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
])

function getStaticRegistryStyleCandidates(styleName: string, name: string) {
  const candidates = [styleName]

  if (!isStyleAwareRegistryItemName(name)) {
    const [base, ...variantParts] = styleName.split("-")
    const variant = variantParts.join("-")
    if (
      base &&
      variant !== DEFAULT_REGISTRY_STYLE_VARIANT &&
      REGISTRY_STYLE_VARIANTS.has(variant)
    ) {
      candidates.push(`${base}-${DEFAULT_REGISTRY_STYLE_VARIANT}`)
    }
  }

  return candidates
}

function getRegistryKey(styleName: string): string {
  if (styleName.startsWith("base-")) return "base"
  if (styleName.startsWith("radix-")) return "radix"
  return styleName
}

function transformReuiPath(filePath: string, _styleName: string): string {
  if (filePath.includes("/__generated/")) {
    return filePath.replace(
      /registry-reui\/bases\/__generated\/[^/]+\//,
      (match) => {
        if (match.includes("base-")) return "registry-reui/bases/base/"
        if (match.includes("radix-")) return "registry-reui/bases/radix/"
        return match
      }
    )
  }
  return filePath
}

export async function getRegistryItem(
  name: string,
  styleName: string = DEFAULT_STYLE_NAME,
  iconLibrary?: string
) {
  const cacheKey = `${styleName}:${iconLibrary || ""}:${name}`

  if (registryCache.has(cacheKey)) return registryCache.get(cacheKey)
  if (inFlightRequests.has(cacheKey)) return inFlightRequests.get(cacheKey)

  const requestPromise = (async () => {
    try {
      if (typeof window !== "undefined") {
        try {
          const url = `/r/styles/${styleName}/${encodeURIComponent(name)}.json`
          const res = await fetch(url)
          if (res.ok) {
            const data = await res.json()
            const rawCode = data.files?.[0]?.content
            const item: RegistryItem = {
              name: data.name || name,
              title: data.title || data.name || name,
              type: "registry:ui",
              files: [
                {
                  path: "",
                  type: "registry:ui",
                  content: rawCode,
                },
              ],
            }
            registryCache.set(cacheKey, item)
            return item
          }
        } catch (error) {
          console.error("Error fetching registry item from API:", error)
        }
        return null
      }

      // Path-traversal hardening: both segments MUST match the safe-name
      // pattern, otherwise we refuse to touch the disk. Attacker input
      // like `?name=../../etc/passwd` or `?styleName=../foo` is killed
      // here. Returns null cleanly (caller already handles missing).
      if (!isSafeRegistrySegment(name)) {
        registryCache.set(cacheKey, null)
        return null
      }

      const projectRoot = process.cwd()
      let item: RegistryItem | undefined

      for (const candidateStyleName of getStaticRegistryStyleCandidates(
        styleName,
        name
      )) {
        if (!isSafeRegistrySegment(candidateStyleName)) continue
        try {
          const registryPath = pathNode.join(
            projectRoot,
            "public",
            "r",
            "styles",
            candidateStyleName,
            `${name}.json`
          )
          const content = await fs.readFile(registryPath, "utf-8")
          item = JSON.parse(content)
          break
        } catch {
          // Try the next candidate, then fall back to metadata.
        }
      }

      if (!item) {
        const registryKey = getRegistryKey(styleName)
        const { Metadata } = getMetadata(registryKey)
        item = Metadata[registryKey]?.[name] as RegistryItem | undefined

        if (item) {
          const metadataItemName = item.name
          for (const candidateStyleName of getStaticRegistryStyleCandidates(
            styleName,
            metadataItemName
          )) {
            try {
              const registryPath = pathNode.join(
                projectRoot,
                "public",
                "r",
                "styles",
                candidateStyleName,
                `${metadataItemName}.json`
              )
              const content = await fs.readFile(registryPath, "utf-8")
              const jsonItem = JSON.parse(content)
              if (jsonItem?.files) item = jsonItem
              break
            } catch {
              // Use metadata version after all candidates miss.
            }
          }
        }
      }

      if (!item) {
        registryCache.set(cacheKey, null)
        return null
      }

      const files: RegistryItemFile[] = (item.files ?? []).map((file) => {
        const fileObj =
          typeof file === "string"
            ? { path: file, type: "registry:file" }
            : { ...file }
        fileObj.path = transformReuiPath(fileObj.path, styleName)
        return fileObj
      })

      const result = registryItemSchema.safeParse({ ...item, files })
      if (!result.success) {
        registryCache.set(cacheKey, null)
        return null
      }

      const processedFiles: RegistryItemFile[] = await Promise.all(
        files.map(async (file) => {
          let content = file.content ?? ""
          if (!content) content = await getFileContent(file)
          return {
            ...file,
            path: pathNode.relative(process.cwd(), file.path),
            content,
          }
        })
      )

      const fixedFiles = fixFilePaths(processedFiles)
      const parsed = registryItemSchema.safeParse({
        ...result.data,
        files: fixedFiles,
      })

      if (!parsed.success) {
        registryCache.set(cacheKey, null)
        return null
      }

      registryCache.set(cacheKey, parsed.data)
      return parsed.data
    } finally {
      inFlightRequests.delete(cacheKey)
    }
  })()

  inFlightRequests.set(cacheKey, requestPromise)
  return requestPromise
}

async function getFileContent(file: RegistryItemFile) {
  const filePath = pathNode.resolve(process.cwd(), file.path)

  let code = ""
  try {
    code = await fs.readFile(filePath, "utf-8")
  } catch {
    return ""
  }

  if (file.type !== "registry:page") {
    code = code.replaceAll("export default", "export")
  }

  code = fixImport(code)

  return code.trim()
}

function getFileTarget(file: RegistryItemFile) {
  let target = file.target
  if (!target || target === "") {
    const fileName = file.path.split("/").pop()
    if (
      ["registry:block", "registry:component", "registry:example"].includes(
        file.type
      )
    ) {
      target = `components/${fileName}`
    } else if (file.type === "registry:ui") {
      target = `components/ui/${fileName}`
    } else if (file.type === "registry:hook") {
      target = `hooks/${fileName}`
    } else if (file.type === "registry:lib") {
      target = `lib/${fileName}`
    }
  }
  return target ?? ""
}

function fixFilePaths(files: RegistryItemFile[]) {
  if (!files?.length) return []
  const firstFilePathDir = pathNode.dirname(files[0].path)
  return files.map((file) => ({
    ...file,
    path: pathNode.relative(firstFilePathDir, file.path),
    target: getFileTarget(file),
  }))
}

export function fixImport(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g
  const replacement = (
    match: string,
    _path: string,
    type: string,
    component: string
  ) => {
    if (type.endsWith("components")) return `@/components/${component}`
    if (type.endsWith("ui")) return `@/components/ui/${component}`
    if (type.endsWith("hooks")) return `@/hooks/${component}`
    if (type.endsWith("lib")) return `@/lib/${component}`
    return match
  }

  return content
    .replaceAll("@/registry/shadcn/base/", "@/components/ui/")
    .replaceAll("@/registry/shadcn/radix/", "@/components/ui/")
    .replaceAll("@/registry/default/", "@/components/")
    .replaceAll("@/registry/bases/base/", "@/components/")
    .replaceAll("@/registry/bases/radix/", "@/components/")
    .replaceAll("/* eslint-disable react/no-children-prop */\n", "")
    .replace(regex, replacement)
}

export type FileTree = { name: string; path?: string; children?: FileTree[] }

export function createFileTreeForRegistryItemFiles(
  files: Array<{ path: string; target?: string }>
) {
  const root: FileTree[] = []

  for (const file of files) {
    const filePath = file.target ?? file.path
    const parts = filePath.split("/")
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      const existingNode = currentLevel.find((n) => n.name === part)

      if (existingNode) {
        if (isFile) existingNode.path = filePath
        else currentLevel = existingNode.children!
      } else {
        const newNode: FileTree = isFile
          ? { name: part, path: filePath }
          : { name: part, children: [] }
        currentLevel.push(newNode)
        if (!isFile) currentLevel = newNode.children!
      }
    }
  }

  return root
}

/**
 * Resolve an array of block names against the live registry.
 * Returns BlockData only for names that still exist, preserving input order.
 * Used by favorites to silently skip blocks removed from the registry.
 */
export function resolveBlockNames(names: string[]): BlockData[] {
  const { blockByNameIndex } = getBlockIndexes()
  const result: BlockData[] = []
  for (const name of names) {
    const block = blockByNameIndex.get(name)
    if (block) result.push(block)
  }
  return result
}

/**
 * Check whether a single block name exists in the registry.
 */
export function isValidBlockName(name: string): boolean {
  return getBlockIndexes().blockByNameIndex.has(name)
}

// Legacy aliases retained while older imports are phased out.
export type PatternData = BlockData
export const getAllPatterns = getAllBlocks
export const getPatternsTotalCount = getBlocksTotalCount
export const getPatternCountByCategory = getBlockCountByCategory
export const getPatternsByCategory = getBlocksByCategory
export const searchPatterns = searchBlocks
export const filterPatterns = filterBlocks
export const getPaginatedPatterns = getPaginatedBlocks

// ============================================================================
// Blocks Group/Category Functions — all from block metadata categories.json
// ============================================================================

export function getBlockGroups(): BlockGroup[] {
  return getBlocksData().groups
}

export function getBlockGroupCategories(groupSlug: string): BlockCategory[] {
  const group = getBlocksData().groups.find((g) => g.slug === groupSlug)
  return group?.categories ?? []
}

export function getBlocksByGroupAndCategory(
  group: string,
  category: string
): BlockData[] {
  const key = `${normalizeSlug(group)}/${normalizeSlug(category)}`
  return getBlockIndexes().blockGroupCategoryIndex.get(key) ?? []
}

export function getBlocksByGroup(group: string): BlockData[] {
  const normalizedGroup = normalizeSlug(group)
  return getBlockIndexes().blocksArray.filter(
    (p) => p.group === normalizedGroup
  )
}

export function isValidGroup(group: string): boolean {
  return getBlocksData().groups.some((g) => g.slug === normalizeSlug(group))
}

export function isValidGroupCategory(group: string, category: string): boolean {
  const groupData = getBlocksData().groups.find(
    (g) => g.slug === normalizeSlug(group)
  )
  if (!groupData) return false
  return groupData.categories.some((c) => c.slug === normalizeSlug(category))
}

export function getGroupForCategory(category: string): string | null {
  const normalized = normalizeSlug(category)
  for (const group of getBlocksData().groups) {
    if (group.categories.some((c) => c.slug === normalized)) {
      return group.slug
    }
  }
  return null
}

