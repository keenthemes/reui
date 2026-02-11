/**
 * Registry Server - Server-only functions for API routes
 *
 * This module uses shadcn/utils which requires Node.js.
 * DO NOT import this file in client components.
 *
 * For client-safe registry functions, use @/lib/registry instead.
 */

import { promises as fs } from "node:fs"
import path from "node:path"
import { type RegistryItem as ShadcnRegistryItem } from "shadcn/schema"
import { createStyleMap, transformStyle } from "shadcn/utils"

import { transformStyleClassNames } from "@/lib/code-utils"
import { BASES } from "@/registry/bases"
import { PRESETS, type IconLibraryName } from "@/registry/config"
import { STYLES } from "@/registry/styles"

// ============================================================================
// Types
// ============================================================================

interface RegistryItemFile {
  path: string
  type: string
  content?: string
  target?: string
}

interface RegistryItem {
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

interface MetadataData {
  Metadata: Record<string, Record<string, RegistryItem>>
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_API_STYLE = "radix-nova"

// Cache for style maps (created from style CSS files)
const styleMapCache = new Map<string, Record<string, string>>()

// Cache for metadata
const metadataCache: Record<string, MetadataData> = {}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse style name into base and style components
 * e.g., "radix-nova" -> { base: "radix", style: "nova" }
 */
export function parseStyleName(styleName: string): {
  base: string
  style: string
} {
  const parts = styleName.split("-")
  if (parts.length >= 2) {
    const base = parts[0]
    const style = parts.slice(1).join("-")
    if (
      BASES.some((b) => b.name === base) &&
      STYLES.some((s) => s.name === style)
    ) {
      return { base, style }
    }
  }
  // Default fallback
  return { base: "radix", style: "nova" }
}

/**
 * Get the icon library for a given style
 */
export function getIconLibraryForStyle(styleName: string): IconLibraryName {
  const preset = PRESETS.find(
    (p) => p.name === styleName || p.style === styleName
  )
  if (preset) return preset.iconLibrary

  if (styleName.includes("vega")) return "lucide"
  if (
    styleName.includes("nova") ||
    styleName.includes("maia") ||
    styleName.includes("mira")
  )
    return "hugeicons"
  if (styleName.includes("lyra")) return "hugeicons"
  return "lucide"
}

/**
 * Determine if a name is a pattern or reui component
 */
function getRegistrySource(name: string): { type: "patterns" | "reui" } {
  return { type: name.startsWith("p-") ? "patterns" : "reui" }
}

/**
 * Load metadata for a specific base
 */
function getMetadata(base: string = "base"): MetadataData {
  if (!metadataCache[base]) {
    try {
      const metadata: Record<string, RegistryItem> = {}

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
        const hooksMod = require(
          `../registry-reui/bases/${base}/hooks/_registry`
        )
        const hooksItems = hooksMod.hooks || []
        for (const item of hooksItems) {
          metadata[item.name] = item
        }
      } catch (e) {
        console.warn(`Could not load hooks registry for ${base}`, e)
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

      metadataCache[base] = { Metadata: { [base]: metadata } }
    } catch (e) {
      console.error(`Failed to load registry for base: ${base}`, e)
      metadataCache[base] = { Metadata: { [base]: {} } }
    }
  }
  return metadataCache[base]
}

/**
 * Get all registry item names across all bases
 */
export function getAllRegistryItemNames(): string[] {
  const names = new Set<string>()

  for (const base of BASES) {
    const { Metadata } = getMetadata(base.name)
    const baseItems = Metadata[base.name] || {}
    for (const name of Object.keys(baseItems)) {
      names.add(name)
    }
  }

  return Array.from(names)
}

/**
 * Get all style names (base-style combinations)
 */
export function getAllStyleNames(): string[] {
  const names: string[] = []

  for (const base of BASES) {
    for (const style of STYLES) {
      names.push(`${base.name}-${style.name}`)
    }
  }

  return names
}

// ============================================================================
// Style Transformation (using shadcn/utils)
// ============================================================================

/**
 * Get the style map for transforming cn-* classes to Tailwind
 */
async function getStyleMap(
  styleName: string
): Promise<Record<string, string> | null> {
  const { style } = parseStyleName(styleName)

  if (styleMapCache.has(style)) {
    return styleMapCache.get(style)!
  }

  try {
    const styleCssPath = path.join(
      process.cwd(),
      "registry",
      "styles",
      `style-${style}.css`
    )
    const styleContent = await fs.readFile(styleCssPath, "utf-8")
    const styleMap = createStyleMap(styleContent) as Record<string, string>
    styleMapCache.set(style, styleMap)
    return styleMap
  } catch (error) {
    console.error(`Failed to load style CSS for ${style}:`, error)
    return null
  }
}

/**
 * Transform cn-* style classes in code to Tailwind classes
 */
export async function transformStyleClasses(
  code: string,
  styleName: string
): Promise<string> {
  const styleMap = await getStyleMap(styleName)

  if (!styleMap) {
    return code
  }

  try {
    return await transformStyle(code, { styleMap: styleMap as any })
  } catch (error) {
    console.error("Failed to transform style classes:", error)
    return code
  }
}

/**
 * Transform import paths from registry paths to user project paths
 */
export function transformImportPaths(code: string, base: string): string {
  return (
    code
      // Handle __generated style-specific paths
      .replace(
        /@\/registry-reui\/bases\/__generated\/(?:base|radix)-(?:vega|nova|maia|lyra|mira)\/reui\//g,
        "@/components/reui/"
      )
      .replace(
        /@\/registry-reui\/bases\/__generated\/(?:base|radix)-(?:vega|nova|maia|lyra|mira)\/ui\//g,
        "@/components/ui/"
      )
      .replace(
        /@\/registry-reui\/bases\/__generated\/(?:base|radix)-(?:vega|nova|maia|lyra|mira)\/hooks\//g,
        "@/hooks/"
      )
      .replace(
        /@\/registry-reui\/bases\/__generated\/(?:base|radix)-(?:vega|nova|maia|lyra|mira)\/lib\//g,
        "@/lib/"
      )
      .replace(
        /@\/registry-reui\/bases\/__generated\/(?:base|radix)-(?:vega|nova|maia|lyra|mira)\/patterns\//g,
        "@/components/patterns/"
      )
      // Handle base paths
      .replace(
        new RegExp(`@/registry-reui/bases/${base}/reui/`, "g"),
        "@/components/reui/"
      )
      .replace(
        new RegExp(`@/registry-reui/bases/${base}/ui/`, "g"),
        "@/components/ui/"
      )
      .replace(
        new RegExp(`@/registry-reui/bases/${base}/hooks/`, "g"),
        "@/hooks/"
      )
      .replace(new RegExp(`@/registry-reui/bases/${base}/lib/`, "g"), "@/lib/")
      .replace(
        new RegExp(`@/registry-reui/bases/${base}/patterns/`, "g"),
        "@/components/patterns/"
      )
      // Generic registry path replacements
      .replace(
        /@\/registry(?:-reui)?\/bases\/(?:base|radix)\/reui\//g,
        "@/components/reui/"
      )
      .replace(
        /@\/registry(?:-reui)?\/bases\/(?:base|radix)\/ui\//g,
        "@/components/ui/"
      )
      .replace(
        /@\/registry(?:-reui)?\/bases\/(?:base|radix)\/hooks\//g,
        "@/hooks/"
      )
      .replace(/@\/registry(?:-reui)?\/bases\/(?:base|radix)\/lib\//g, "@/lib/")
      .replace(
        /@\/registry(?:-reui)?\/bases\/(?:base|radix)\/patterns\//g,
        "@/components/patterns/"
      )
      // Handle @/registry/bases paths
      .replace(/@\/registry\/bases\/(?:base|radix)\/ui\//g, "@/components/ui/")
      .replace(
        /@\/registry\/bases\/(?:base|radix)\/reui\//g,
        "@/components/reui/"
      )
      .replace(/@\/registry\/bases\/(?:base|radix)\/hooks\//g, "@/hooks/")
      .replace(/@\/registry\/bases\/(?:base|radix)\/lib\//g, "@/lib/")
      // Remove metadata comments
      .replace(
        /^\s*\/\/\s*(?:Description|Order|GridSize|PreviewHeight):.*$\n?/gm,
        ""
      )
      .trimStart()
  )
}

// ============================================================================
// Main API Function
// ============================================================================

/**
 * Generate a registry item for the API with fully transformed code
 * This is the main function used by /r/ API routes
 */
export async function getRegistryItemForApi(
  name: string,
  styleName: string = DEFAULT_API_STYLE
): Promise<ShadcnRegistryItem | null> {
  const { base } = parseStyleName(styleName)
  const { Metadata } = getMetadata(base)
  const itemMetadata = Metadata[base]?.[name]

  if (!itemMetadata) {
    return null
  }

  const projectRoot = process.cwd()
  const files: Array<{
    path: string
    type: string
    content: string
    target?: string
  }> = []

  // Process each file in the registry item
  for (const file of itemMetadata.files || []) {
    const filePath = typeof file === "string" ? file : file.path
    const fileType = typeof file === "string" ? "registry:file" : file.type
    const fileTarget = typeof file === "string" ? undefined : file.target

    // Resolve the full path
    const fullPath = path.join(
      projectRoot,
      "registry-reui",
      "bases",
      base,
      filePath
    )

    let content = ""
    try {
      content = await fs.readFile(fullPath, "utf-8")
    } catch (error) {
      console.error(`Failed to read file: ${fullPath}`, error)
      continue
    }

    // Transform the content
    // 1. Transform cn-* classes to Tailwind
    content = await transformStyleClasses(content, styleName)

    // 2. Transform style-specific classNames (e.g., style-vega:bg-background)
    content = transformStyleClassNames(content, styleName)

    // 3. Transform import paths
    content = transformImportPaths(content, base)

    // 3. Transform export default to export
    if (fileType !== "registry:page") {
      content = content.replace(/export default/g, "export")
    }

    // Determine the target path
    let target = fileTarget
    if (!target) {
      const fileName = filePath.split("/").pop()
      const { type: sourceType } = getRegistrySource(name)

      if (sourceType === "patterns") {
        target = `components/patterns/${fileName}`
      } else if (fileType === "registry:ui") {
        target = `components/reui/${fileName}`
      } else if (fileType === "registry:hook") {
        target = `hooks/${fileName}`
      } else if (fileType === "registry:lib") {
        target = `lib/${fileName}`
      } else {
        target = `components/${fileName}`
      }
    }

    files.push({
      path: filePath.split("/").pop() || filePath,
      type: fileType,
      content: content.trim(),
      target,
    })
  }

  if (files.length === 0) {
    return null
  }

  // Build the final registry item
  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: itemMetadata.name,
    type: itemMetadata.type,
    title: itemMetadata.title,
    description: itemMetadata.description,
    dependencies: itemMetadata.dependencies,
    devDependencies: itemMetadata.devDependencies,
    registryDependencies: itemMetadata.registryDependencies,
    files,
    cssVars: itemMetadata.cssVars,
  } as ShadcnRegistryItem

  return registryItem
}
