/**
 * Registry - Client-safe registry operations
 *
 * This module provides client-safe access to registry data.
 * For server-only API functions, use @/lib/registry-server instead.
 *
 * Performance optimization:
 * - Categories are loaded from registry.json (small JSON manifest)
 * - Component category SEO copy is in seo.json (lazy-loaded in helpers)
 * - Metadata is loaded per-base from base/registry.ts
 * - Components are lazy-loaded on-demand
 */

import * as React from "react"
import { LRUCache } from "lru-cache"
import { registryItemSchema } from "shadcn/schema"

import { transformStyleClassNames } from "@/lib/code-utils"
import { BASES } from "@/registry/bases"
import { PRESETS, type IconLibraryName } from "@/registry/config"
import { STYLES } from "@/registry/styles"

// ============================================================================
// Server-side modules (lazy-loaded to avoid client-side bundling issues)
// ============================================================================

const pathNode =
  typeof window === "undefined" ? eval('require("node:path")') : null
const fs = typeof window === "undefined" ? eval('require("fs").promises') : null

function normalizeRegistrySlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-")
}

/**
 * Client and server must use the same deployment-scoped registry URL so a new
 * Vercel deploy gets a new cache key without turning /r/styles into a function.
 */
export function getRegistryDeploymentId(): string {
  return (
    process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID ??
    process.env.VERCEL_DEPLOYMENT_ID ??
    "local"
  )
}

export function getRegistryJsonUrl(styleName: string, name: string): string {
  const path = `/r/styles/${styleName}/${encodeURIComponent(name)}.json`
  return `${path}?v=${encodeURIComponent(getRegistryDeploymentId())}`
}

export function getRegistryJsonAbsoluteUrl(
  origin: string,
  styleName: string,
  name: string
): string {
  const normalizedOrigin = origin.endsWith("/") ? origin : `${origin}/`
  return new URL(
    getRegistryJsonUrl(styleName, name),
    normalizedOrigin
  ).toString()
}

// ============================================================================
// Types
// ============================================================================

export interface CategorySeoInfo {
  title?: string
  /** Optional; use `{{count}}` (or legacy `[[count]]`) for the live component count from `registry.json` (same as `intro`). */
  description?: string
  /** Use `{{count}}` where the live component count from registry should appear (replaced at runtime). */
  intro?: string
  highlights?: string[]
  keywords?: string[]
  content?: CategorySeoContent
  docsDescription?: string
  relatedComponents?: RelatedComponentsBlock
}

/** Title + inline description (features list) */
export interface CategorySeoFeatureItem {
  title: string
  description: string
}

export interface CategorySeoComponentListItem {
  slug: string
  title: string
  badge?: string
  description: string
  href: string
}

export interface CategorySeoSection {
  title: string
  /** Lead-in paragraph before structured lists (e.g. catalog index "Popular Components") */
  intro?: string
  paragraphs?: string[]
  bullets?: string[]
  /** Structured features: bold title + description on one line each */
  featureItems?: CategorySeoFeatureItem[]
  /** Rich cards linking to component category pages (catalog index SEO) */
  componentList?: CategorySeoComponentListItem[]
}

export interface CategorySeoFaq {
  question: string
  answer: string
}

export interface CategorySeoContent {
  title: string
  summary: string[]
  sections: CategorySeoSection[]
  faqs?: CategorySeoFaq[]
}

export interface RelatedComponentRef {
  slug: string
  label: string
}

/**
 * Integration block: prose with `[[slug|Label]]` links.
 * Use **Shadcn {Name}** in the visible label (e.g. `[[button|Shadcn Button]]`, `[[alert-dialog|Shadcn Alert Dialog]]`).
 */
export interface RelatedComponentsBlock {
  /** e.g. "Integrating With Other Components" (Title Case) */
  title: string
  /** Optional reference list for authors only; not rendered on the page */
  items?: RelatedComponentRef[]
  /** Component catalog index: internal links to `/components/{slug}` */
  links?: RelatedComponentRef[]
  /** 2–3 paragraphs; `[[slug|Label]]` renders as internal links */
  integrationBody?: string[]
}

export interface CategoryInfo {
  name: string
  label: string
  description: string
  count: number
}

export interface ComponentCategorySeo {
  title: string
  description: string
  intro: string
  /** @deprecated Category pages no longer surface highlight chips; kept optional for compatibility */
  highlights?: string[]
  keywords: string[]
  content?: CategorySeoContent
  relatedComponents?: RelatedComponentsBlock
}

export interface ComponentCatalogItem {
  name: string
  title: string
  description: string | undefined
  categories: string[]
  primaryCategory: string
  meta:
    | {
        className?: string
        colSpan?: number
        gridSize?: 1 | 2
        order?: number
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
  meta?: Record<string, unknown>
  cssVars?: Record<string, any>
}

// Legacy type aliases for backwards compatibility
export type ComponentCategory = string
export type Category = string

// ============================================================================
// Lazy-loaded modules (using JSON for zero compilation overhead)
// ============================================================================

interface StatsData {
  categories: CategoryInfo[]
  totalComponents: number
}

let _registrySeo: Record<string, CategorySeoInfo> | null = null

/**
 * Lazy-load `seo.json` once per runtime (Node / edge worker).
 * Keeps the large SEO blob out of the client bundle unless these helpers run.
 */
function getRegistrySeoMapCached(): Record<string, CategorySeoInfo> {
  if (!_registrySeo) {
    _registrySeo = require("../registry-reui/bases/seo.json") as Record<
      string,
      CategorySeoInfo
    >
  }
  return _registrySeo
}

interface MetadataData {
  Metadata: Record<string, Record<string, RegistryItem>>
}

let _stats: StatsData | null = null
const _metadataCache: Record<string, MetadataData> = {}
let _catalogItems: ComponentCatalogItem[] | null = null
let _categoryIndex: Map<string, ComponentCatalogItem[]> | null = null

function getStats(): StatsData {
  if (!_stats) {
    try {
      const raw =
        require("../registry-reui/bases/registry.json") as StatsData & {
          totalPatterns?: number
        }
      _stats = {
        categories: raw.categories ?? [],
        totalComponents: raw.totalComponents ?? raw.totalPatterns ?? 0,
      }
    } catch (e) {
      console.error("Failed to load registry stats", e)
      _stats = { categories: [], totalComponents: 0 }
    }
  }
  return _stats
}

function getMetadata(base: string = "base"): MetadataData {
  if (!_metadataCache[base]) {
    try {
      const metadata: Record<string, RegistryItem> = {}

      // Directly load catalog blocks and reui registries for reliability and performance
      // This avoids potential issues with the aggregate registry.ts file
      try {
        const reuiMod = require(`../registry-reui/bases/${base}/reui/_registry`)
        const reuiItems = reuiMod.reui || []
        for (const item of reuiItems) {
          metadata[item.name] = item
        }
      } catch (e) {
        console.warn(`Could not load reui registry for ${base}`, e)
      }

      try {
        const componentsMod = require(
          `../registry-reui/bases/${base}/components/_registry`
        )
        const blockItems = componentsMod.components || []
        for (const item of blockItems) {
          metadata[item.name] = item
        }
      } catch (e) {
        console.warn(`Could not load components registry for ${base}`, e)
      }

      _metadataCache[base] = { Metadata: { [base]: metadata } }
    } catch (e) {
      console.error(`Failed to load registry for base: ${base}`, e)
      // Fallback to empty if not found
      _metadataCache[base] = { Metadata: { [base]: {} } }
    }
  }
  return _metadataCache[base]
}

/**
 * Get full metadata for all bases or a specific base
 */
export function getRegistryMetadata(base?: string) {
  if (base) {
    const { Metadata } = getMetadata(base)
    return Metadata[base] || {}
  }

  const allMetadata: Record<string, Record<string, RegistryItem>> = {}
  const bases = ["base", "radix"]

  for (const b of bases) {
    const { Metadata } = getMetadata(b)
    if (Metadata[b]) {
      allMetadata[b] = Metadata[b]
    }
  }
  return allMetadata
}

/**
 * Get metadata for a specific registry item
 */
export function getRegistryItemMetadata(name: string, base: string = "base") {
  const { Metadata } = getMetadata(base)
  return Metadata[base]?.[name]
}

const componentCache = new Map<string, React.LazyExoticComponent<any>>()

/**
 * Get a lazy-loaded component by base and name
 */
export function getComponent(
  base: string,
  name: string
): React.LazyExoticComponent<any> | null {
  const cacheKey = `${base}:${name}`

  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey)!
  }

  const item = getRegistryItemMetadata(name, base)
  if (!item || !item.files?.[0]?.path) {
    return null
  }

  // Extract relative path from metadata
  // e.g., "registry-reui/bases/base/reui/alert.tsx" -> "reui/alert.tsx"
  const path = item.files[0].path.replace(`registry-reui/bases/${base}/`, "")

  const lazyComponent = React.lazy(
    () => import(`@/registry-reui/bases/${base}/${path}`)
  )

  componentCache.set(cacheKey, lazyComponent)
  return lazyComponent
}

/**
 * Check if a component exists in the registry
 */
export function hasComponent(base: string, name: string): boolean {
  return !!getRegistryItemMetadata(name, base)
}

// ============================================================================
// LRU Cache for cross-request caching
// ============================================================================

const registryCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 20, // 20 minutes
})

// Track in-flight requests to prevent duplicate network calls (e.g. from StrictMode)
const inFlightRequests = new Map<string, Promise<any>>()

// ============================================================================
// Category Functions - Use registry.json category manifest
// ============================================================================

function fallbackCategoryLabel(category: string) {
  return category
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/**
 * Get all categories with full info (name, label, description, count, seo)
 * This is the primary way to get category data
 */
export function getCategories(): CategoryInfo[] {
  return getStats().categories
}

/**
 * Get full category info for a single category
 */
export function getCategoryInfo(category: string): CategoryInfo | undefined {
  const normalized = normalizeRegistrySlug(category)
  return getStats().categories.find((c) => c.name === normalized)
}

/**
 * Get category names only
 */
export function getCategoryNames(): string[] {
  return getStats().categories.map((c) => c.name)
}

/**
 * Total number of c-* catalog blocks in `registry.json`.
 */
export function getTotalComponentCount(): number {
  return getStats().totalComponents
}

/**
 * Catalog block count for a category
 */
export function getComponentCountByCategory(category: string): number {
  return getCategoryInfo(category)?.count ?? 0
}

/**
 * Get category description
 */
export function getCategoryDescription(category: string): string | undefined {
  return getCategoryInfo(category)?.description
}

/**
 * Replaces `{{count}}` or legacy `[[count]]` in SEO copy with the live component count from `registry.json`.
 * When count is 0, removes the placeholder and collapses extra spaces.
 * Strings without either placeholder are returned unchanged (avoid accidental word injection).
 */
export function applySeoCountPlaceholder(text: string, count: number): string {
  if (!text.includes("[[count]]") && !text.includes("{{count}}")) {
    return text
  }
  if (count > 0) {
    return text
      .replace(/\{\{count\}\}/g, String(count))
      .replace(/\[\[count\]\]/g, String(count))
  }
  return text
    .replace(/\s*\{\{count\}\}\s*/g, " ")
    .replace(/\s*\[\[count\]\]\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

/**
 * Build computed SEO metadata for a category page using `seo.json`
 * (lazy-loaded once per runtime) plus category stats from `registry.json`.
 */
export function getComponentCategorySeo(
  category: string
): ComponentCategorySeo {
  const normalized = normalizeRegistrySlug(category)
  const categoryInfo = getCategoryInfo(normalized)
  const label = categoryInfo?.label ?? fallbackCategoryLabel(normalized)
  const count = categoryInfo?.count ?? 0
  const seo = getRegistrySeoMapCached()[normalized]
  const title = seo?.title ?? `Shadcn ${label}`

  if (
    seo?.description ||
    seo?.intro ||
    seo?.keywords?.length ||
    seo?.content ||
    seo?.relatedComponents
  ) {
    const genericIntro =
      count > 0
        ? `Browse {{count}} production-ready shadcn ${label.toLowerCase()} components built to help you move from primitives to polished product UI faster.`
        : `Browse production-ready shadcn ${label.toLowerCase()} components built to help you move from primitives to polished product UI faster.`
    const rawDescription =
      seo?.description ||
      categoryInfo?.description ||
      `Explore free open-source shadcn/ui ${label.toLowerCase()} components for React and Tailwind CSS in ReUI.`
    const baseDescription = applySeoCountPlaceholder(rawDescription, count)
    const intro = applySeoCountPlaceholder(seo.intro || genericIntro, count)

    return {
      title,
      description: baseDescription,
      intro,
      keywords: seo?.keywords ?? [],
      content: seo?.content,
      relatedComponents: seo?.relatedComponents,
    }
  }

  const genericDescription =
    categoryInfo?.description ||
    `Explore free open-source shadcn/ui ${label.toLowerCase()} components for React and Tailwind CSS in ReUI.`
  const genericIntro =
    count > 0
      ? `Browse {{count}} production-ready shadcn ${label.toLowerCase()} components built to help you move from primitives to polished product UI faster.`
      : `Browse production-ready shadcn ${label.toLowerCase()} components built to help you move from primitives to polished product UI faster.`

  return {
    title,
    description: applySeoCountPlaceholder(genericDescription, count),
    intro: applySeoCountPlaceholder(genericIntro, count),
    keywords: [],
    content: seo?.content,
    relatedComponents: seo?.relatedComponents,
  }
}

function applyCountToSeoContent(
  content: CategorySeoContent,
  count: number
): CategorySeoContent {
  return {
    ...content,
    title: applySeoCountPlaceholder(content.title, count),
    summary: content.summary.map((s) => applySeoCountPlaceholder(s, count)),
    sections: content.sections.map((section) => ({
      ...section,
      title: applySeoCountPlaceholder(section.title, count),
      intro: section.intro
        ? applySeoCountPlaceholder(section.intro, count)
        : undefined,
      paragraphs: section.paragraphs?.map((p) =>
        applySeoCountPlaceholder(p, count)
      ),
      bullets: section.bullets?.map((b) => applySeoCountPlaceholder(b, count)),
      featureItems: section.featureItems?.map((fi) => ({
        ...fi,
        title: applySeoCountPlaceholder(fi.title, count),
        description: applySeoCountPlaceholder(fi.description, count),
      })),
      componentList: section.componentList?.map((item) => ({
        ...item,
        title: applySeoCountPlaceholder(item.title, count),
        description: applySeoCountPlaceholder(item.description, count),
      })),
    })),
    faqs: content.faqs?.map((faq) => ({
      ...faq,
      question: applySeoCountPlaceholder(faq.question, count),
      answer: applySeoCountPlaceholder(faq.answer, count),
    })),
  }
}

/**
 * SEO for `/components` (index): uses the `root` entry in `seo.json` and total component count.
 */
export function getComponentIndexSeo(): ComponentCategorySeo {
  const count = getTotalComponentCount()
  const root = getRegistrySeoMapCached()["root"]
  const fallbackDescription = `Browse ${count}+ free open-source shadcn/ui components for React and Tailwind CSS.`

  if (!root?.content && !root?.description && !root?.intro) {
    return {
      title: "Shadcn UI Components",
      description: fallbackDescription,
      intro: fallbackDescription,
      keywords: [],
    }
  }

  const title = root.title ?? root.content?.title ?? "Shadcn UI Components"
  const description = applySeoCountPlaceholder(
    root.description ?? fallbackDescription,
    count
  )
  const intro = applySeoCountPlaceholder(
    root.intro ?? root.description ?? fallbackDescription,
    count
  )
  const keywords = root.keywords ?? []
  const content = root.content
    ? applyCountToSeoContent(root.content, count)
    : undefined
  const relatedComponents = root.relatedComponents
    ? {
        title: root.relatedComponents.title,
        links: root.relatedComponents.links,
        integrationBody: root.relatedComponents.integrationBody,
        items: root.relatedComponents.items,
      }
    : undefined

  return {
    title,
    description,
    intro,
    keywords,
    content,
    relatedComponents,
  }
}

/**
 * Check if a category is valid
 */
export function isValidCategory(category: string): boolean {
  return !!getCategoryInfo(category)
}

/**
 * Get category sort order
 */
export function getCategorySortOrder(category: string): number {
  const normalized = normalizeRegistrySlug(category)
  const index = getStats().categories.findIndex((c) => c.name === normalized)
  return index === -1 ? Number.POSITIVE_INFINITY : index
}

export function getCategoryDocsDescription(category: string) {
  const normalized = normalizeRegistrySlug(category)
  const raw = getRegistrySeoMapCached()[normalized]?.docsDescription
  if (typeof raw !== "string") return undefined
  const count = getCategoryInfo(normalized)?.count ?? 0
  return applySeoCountPlaceholder(raw, count)
}

// Legacy exports for backwards compatibility
export const componentCategories = new Proxy([] as string[], {
  get(target, prop) {
    const names = getStats().categories.map((c) => c.name)
    if (prop === "length") return names.length
    if (prop === Symbol.iterator) return names[Symbol.iterator].bind(names)
    if (typeof prop === "string" && !isNaN(Number(prop))) {
      return names[Number(prop)]
    }
    if (typeof prop === "string" && prop in Array.prototype) {
      return (names as any)[prop]
    }
    return undefined
  },
  has(target, prop) {
    return getStats().categories.some((c) => c.name === prop)
  },
}) as unknown as readonly string[]

export const registryCategories = componentCategories
export const isComponentCategory = isValidCategory
export function categories<T extends Category[]>(...cats: T): T {
  return cats
}

// ============================================================================
// Catalog (c-*) — lazy index from components.json
// ============================================================================

function ensureCatalogIndexes() {
  if (_catalogItems !== null) return

  const itemsByName = new Map<string, ComponentCatalogItem>()
  const catIndex = new Map<string, ComponentCatalogItem[]>()

  try {
    // Load from components.json - Compact manifest for high performance
    const manifest = require("../registry-reui/bases/components.json")

    for (const item of manifest) {
      const itemCategories = item.categories || []
      let primaryCategory = itemCategories[0]

      if (!primaryCategory) {
        const nameParts = item.name.split("-")
        primaryCategory = nameParts.slice(1, -1).join("-")
      }

      // Smart search text: include name, title, categories
      const searchText = [
        item.name,
        item.title || "",
        ...itemCategories,
        primaryCategory,
      ]
        .join(" ")
        .toLowerCase()

      const row: ComponentCatalogItem = {
        name: item.name,
        title: item.title || "",
        description: item.description || "",
        categories: itemCategories,
        primaryCategory,
        meta: item.meta,
        searchText,
      }

      itemsByName.set(item.name, row)
    }
  } catch (e) {
    console.error("Failed to load components.json manifest", e)
  }

  const sorted = Array.from(itemsByName.values()).sort((a, b) => {
    if (a.primaryCategory !== b.primaryCategory) {
      return a.primaryCategory.localeCompare(b.primaryCategory)
    }
    return (a.meta?.order ?? 9999) - (b.meta?.order ?? 9999)
  })

  for (const item of sorted) {
    const normalizedPrimary = normalizeRegistrySlug(item.primaryCategory)
    if (!catIndex.has(normalizedPrimary)) {
      catIndex.set(normalizedPrimary, [])
    }
    catIndex.get(normalizedPrimary)!.push(item)

    for (const cat of item.categories) {
      const normalizedCat = normalizeRegistrySlug(cat)
      if (normalizedCat !== normalizedPrimary) {
        if (!catIndex.has(normalizedCat)) {
          catIndex.set(normalizedCat, [])
        }
        catIndex.get(normalizedCat)!.push(item)
      }
    }
  }

  _catalogItems = sorted
  _categoryIndex = catIndex
}

/**
 * All catalog items (c-* blocks) — loads full metadata from `components.json`.
 */
export function getAllCatalogItems(): ComponentCatalogItem[] {
  ensureCatalogIndexes()
  return _catalogItems!
}

/**
 * Catalog items for a category slug
 */
export function getComponentsByCategory(
  category: string
): ComponentCatalogItem[] {
  ensureCatalogIndexes()
  return _categoryIndex!.get(normalizeRegistrySlug(category)) ?? []
}

/**
 * Search catalog blocks (name, title, categories)
 */
export function searchCatalog(query: string): ComponentCatalogItem[] {
  ensureCatalogIndexes()

  if (!query.trim()) return _catalogItems!

  const lowerQuery = query.toLowerCase().trim()

  // Exact category match gets priority
  const exactMatch = _categoryIndex!.get(lowerQuery)
  if (exactMatch) return exactMatch

  // Smart multi-term search
  const terms = lowerQuery.split(/\s+/).filter(Boolean)
  if (terms.length === 0) return _catalogItems!

  return _catalogItems!.filter((p) => {
    // All terms must match at least something in the search text
    // We check for partial matches of each term
    return terms.every((term) => {
      // Direct inclusion check
      if (p.searchText.includes(term)) return true

      // If term is plural (ends with s), try singular
      if (term.length > 3 && term.endsWith("s")) {
        const singular = term.slice(0, -1)
        if (p.searchText.includes(singular)) return true
      }

      return false
    })
  })
}

// ============================================================================
// Component Functions
// ============================================================================

/**
 * Get a lazy-loaded component by name
 */
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
  const cacheKey = `${getRegistryDeploymentId()}:${styleName}:${iconLibrary || ""}:${name}`

  if (registryCache.has(cacheKey)) {
    return registryCache.get(cacheKey)
  }

  // Deduplicate in-flight requests
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)
  }

  const requestPromise = (async () => {
    try {
      if (typeof window !== "undefined") {
        try {
          // Use static /r/styles/ files (CDN-served, zero function invocations)
          const url = getRegistryJsonUrl(styleName, name)
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

      const projectRoot = process.cwd()
      let item: RegistryItem | undefined

      try {
        const registryPath = pathNode.join(
          projectRoot,
          "public",
          "r",
          "styles",
          styleName,
          `${name}.json`
        )
        const content = await fs.readFile(registryPath, "utf-8")
        item = JSON.parse(content)
      } catch {
        // Fall back to metadata
      }

      if (!item) {
        const registryKey = getRegistryKey(styleName)
        const { Metadata } = getMetadata(registryKey)
        item = Metadata[registryKey]?.[name] as RegistryItem | undefined

        if (item) {
          try {
            const registryPath = pathNode.join(
              projectRoot,
              "public",
              "r",
              "styles",
              styleName,
              `${item.name}.json`
            )
            const content = await fs.readFile(registryPath, "utf-8")
            const jsonItem = JSON.parse(content)
            if (jsonItem?.files) item = jsonItem
          } catch {
            // Use metadata version
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
          if (!content) content = await getFileContent(file, styleName)
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

async function getFileContent(
  file: RegistryItemFile,
  styleName: string = DEFAULT_STYLE_NAME
) {
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
  code = transformStyleClassNames(code, styleName)
  code = code.replace(
    /^\s*\/\/[*\s]*(?:Description|Order|GridSize|PreviewHeight):.*$\n?/gm,
    ""
  )

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
