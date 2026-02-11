/**
 * Registry - Client-safe registry operations
 *
 * This module provides client-safe access to registry data.
 * For server-only API functions, use @/lib/registry-server instead.
 *
 * Performance optimization:
 * - Categories are loaded from registry.json (~2KB)
 * - Metadata is loaded per-base from base/registry.ts
 * - Components are lazy-loaded on-demand
 */

import * as React from "react"
import { LRUCache } from "lru-cache"
import { registryItemSchema } from "shadcn/schema"

import { transformStyleClassNames } from "@/lib/code-utils"
import { normalizeSlug } from "@/lib/utils"
import { BASES } from "@/registry/bases"
import { PRESETS, type IconLibraryName } from "@/registry/config"
import { STYLES } from "@/registry/styles"

// ============================================================================
// Server-side modules (lazy-loaded to avoid client-side bundling issues)
// ============================================================================

const pathNode =
  typeof window === "undefined" ? eval('require("node:path")') : null
const fs = typeof window === "undefined" ? eval('require("fs").promises') : null

// ============================================================================
// Types
// ============================================================================

export interface CategoryInfo {
  name: string
  label: string
  description: string
  count: number
}

export interface PatternData {
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
  totalPatterns: number
}

interface MetadataData {
  Metadata: Record<string, Record<string, RegistryItem>>
}

let _stats: StatsData | null = null
const _metadataCache: Record<string, MetadataData> = {}
let _patternsArray: PatternData[] | null = null
let _categoryIndex: Map<string, PatternData[]> | null = null

function getStats(): StatsData {
  if (!_stats) {
    try {
      _stats = require("../registry-reui/bases/registry.json") as StatsData
    } catch (e) {
      console.error("Failed to load registry stats", e)
      _stats = { categories: [], totalPatterns: 0 }
    }
  }
  return _stats
}

function getMetadata(base: string = "base"): MetadataData {
  if (!_metadataCache[base]) {
    try {
      const metadata: Record<string, RegistryItem> = {}

      // Directly load patterns and reui registries for reliability and performance
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
        const patternsMod = require(
          `../registry-reui/bases/${base}/patterns/_registry`
        )
        const patternItems = patternsMod.patterns || []
        for (const item of patternItems) {
          metadata[item.name] = item
        }
      } catch (e) {
        console.warn(`Could not load patterns registry for ${base}`, e)
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
// Category Functions - Use __stats__.ts (small file, ~5KB)
// ============================================================================

/**
 * Get all categories with full info (name, label, description, count)
 * This is the primary way to get category data
 */
export function getCategories(): CategoryInfo[] {
  return getStats().categories
}

/**
 * Get category names only
 */
export function getCategoryNames(): string[] {
  return getStats().categories.map((c) => c.name)
}

/**
 * Get total pattern count
 */
export function getPatternsTotalCount(): number {
  return getStats().totalPatterns
}

/**
 * Get pattern count by category
 */
export function getPatternCountByCategory(category: string): number {
  const normalized = normalizeSlug(category)
  const cat = getStats().categories.find((c) => c.name === normalized)
  return cat?.count ?? 0
}

/**
 * Get category description
 */
export function getCategoryDescription(category: string): string | undefined {
  const normalized = normalizeSlug(category)
  const cat = getStats().categories.find((c) => c.name === normalized)
  return cat?.description
}

/**
 * Check if a category is valid
 */
export function isValidCategory(category: string): boolean {
  const normalized = normalizeSlug(category)
  return getStats().categories.some((c) => c.name === normalized)
}

/**
 * Get category sort order
 */
export function getCategorySortOrder(category: string): number {
  const normalized = normalizeSlug(category)
  const index = getStats().categories.findIndex((c) => c.name === normalized)
  return index === -1 ? Number.POSITIVE_INFINITY : index
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
// Pattern Functions - Lazy load __metadata__.ts only when needed
// ============================================================================

function ensurePatternIndexes() {
  if (_patternsArray !== null) return

  const patternsMap = new Map<string, PatternData>()
  const catIndex = new Map<string, PatternData[]>()

  try {
    // Load from patterns.json - Compact manifest for high performance
    const patterns = require("../registry-reui/bases/patterns.json")

    for (const pattern of patterns) {
      const itemCategories = pattern.categories || []
      let primaryCategory = itemCategories[0]

      if (!primaryCategory) {
        const nameParts = pattern.name.split("-")
        primaryCategory = nameParts.slice(1, -1).join("-")
      }

      // Smart search text: include name, title, categories
      const searchText = [
        pattern.name,
        pattern.title || "",
        ...itemCategories,
        primaryCategory,
      ]
        .join(" ")
        .toLowerCase()

      const patternData: PatternData = {
        name: pattern.name,
        title: pattern.title || "",
        description: pattern.description || "",
        categories: itemCategories,
        primaryCategory,
        meta: pattern.meta,
        searchText,
      }

      patternsMap.set(pattern.name, patternData)
    }
  } catch (e) {
    console.error("Failed to load patterns.json manifest", e)
  }

  const sorted = Array.from(patternsMap.values()).sort((a, b) => {
    if (a.primaryCategory !== b.primaryCategory) {
      return a.primaryCategory.localeCompare(b.primaryCategory)
    }
    return (a.meta?.order ?? 9999) - (b.meta?.order ?? 9999)
  })

  for (const pattern of sorted) {
    const normalizedPrimary = normalizeSlug(pattern.primaryCategory)
    if (!catIndex.has(normalizedPrimary)) {
      catIndex.set(normalizedPrimary, [])
    }
    catIndex.get(normalizedPrimary)!.push(pattern)

    for (const cat of pattern.categories) {
      const normalizedCat = normalizeSlug(cat)
      if (normalizedCat !== normalizedPrimary) {
        if (!catIndex.has(normalizedCat)) {
          catIndex.set(normalizedCat, [])
        }
        catIndex.get(normalizedCat)!.push(pattern)
      }
    }
  }

  _patternsArray = sorted
  _categoryIndex = catIndex
}

/**
 * Get all patterns - loads full metadata
 */
export function getAllPatterns(): PatternData[] {
  ensurePatternIndexes()
  return _patternsArray!
}

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): PatternData[] {
  ensurePatternIndexes()
  return _categoryIndex!.get(normalizeSlug(category)) ?? []
}

/**
 * Search patterns
 */
export function searchPatterns(query: string): PatternData[] {
  ensurePatternIndexes()

  if (!query.trim()) return _patternsArray!

  const lowerQuery = query.toLowerCase().trim()

  // Exact category match gets priority
  const exactMatch = _categoryIndex!.get(lowerQuery)
  if (exactMatch) return exactMatch

  // Smart multi-term search
  const terms = lowerQuery.split(/\s+/).filter(Boolean)
  if (terms.length === 0) return _patternsArray!

  return _patternsArray!.filter((p) => {
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

/**
 * Filter patterns by category and search
 */
export function filterPatterns(
  patternsSource: PatternData[],
  filterCategories: string[],
  query: string
): PatternData[] {
  ensurePatternIndexes()

  let result: PatternData[]

  // If we have categories, we filter by them first
  if (filterCategories && filterCategories.length > 0) {
    const normalizedFilters = filterCategories.map((c) => normalizeSlug(c))
    const seen = new Set<string>()
    result = []

    for (const cat of normalizedFilters) {
      const catPatterns = _categoryIndex!.get(cat) ?? []
      for (const p of catPatterns) {
        if (!seen.has(p.name)) {
          seen.add(p.name)
          result.push(p)
        }
      }
    }
  } else {
    // No category filter, use the source provided or all patterns
    result = patternsSource || _patternsArray!
  }

  // Apply search query if present
  if (query && query.trim()) {
    const lowerQuery = query.toLowerCase().trim()
    const terms = lowerQuery.split(/\s+/).filter(Boolean)

    if (terms.length > 0) {
      result = result.filter((p) => {
        return terms.every((term) => {
          if (p.searchText.includes(term)) return true
          if (term.length > 3 && term.endsWith("s")) {
            const singular = term.slice(0, -1)
            if (p.searchText.includes(singular)) return true
          }
          return false
        })
      })
    }
  }

  return result
}

/**
 * Get paginated patterns
 */
export function getPaginatedPatterns(
  category: string | null,
  search: string,
  offset: number,
  limit: number
): { patterns: PatternData[]; total: number; hasMore: boolean } {
  ensurePatternIndexes()

  let filtered: PatternData[]
  if (category) {
    filtered = filterPatterns(_patternsArray!, [category], search)
  } else if (search.trim()) {
    filtered = searchPatterns(search)
  } else {
    filtered = _patternsArray!
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
  const cacheKey = `${styleName}:${iconLibrary || ""}:${name}`

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
