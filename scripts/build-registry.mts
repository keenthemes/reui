/**
 * Build Static Registry
 *
 * Pre-compiles all registry items into static JSON files in public/r/styles/.
 * This eliminates serverless function invocations for registry serving —
 * files are served directly from the CDN edge.
 *
 * Output structure:
 *   public/r/styles/index.json          — list of available styles
 *   public/r/styles/{style}/{name}.json — one file per item per style
 *   public/r/styles/default/            — alias for radix-nova (the default)
 *
 * Run: pnpm build:registry
 */

import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, "..")

// ---------------------------------------------------------------------------
// We can't use @/ path aliases in scripts, so we require the modules directly.
// registry-server.ts uses require() internally, so we import it via tsx.
// ---------------------------------------------------------------------------

const { BASES } = await import("../registry/bases.ts")
const { STYLES } = await import("../registry/styles.tsx")

// ---------------------------------------------------------------------------
// Inline the core transformation functions from registry-server.ts
// (We avoid importing registry-server directly because its @/ aliases
//  don't resolve in the script context. Instead we duplicate the minimal
//  set of functions needed.)
// ---------------------------------------------------------------------------

const { transformStyleClassNames } = await import("../lib/code-utils.ts")

// Types
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

// Constants
const DEFAULT_STYLE = "radix-nova"
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://reui.io"

// ---------------------------------------------------------------------------
// Metadata loading (mirrors registry-server.ts but with absolute paths)
// ---------------------------------------------------------------------------

const metadataCache: Record<string, MetadataData> = {}

async function getMetadata(base: string): Promise<MetadataData> {
  if (metadataCache[base]) return metadataCache[base]

  const metadata: Record<string, RegistryItem> = {}

  // Load reui components
  try {
    const mod = await import(
      `../registry-reui/bases/${base}/reui/_registry.ts`
    )
    for (const item of mod.reui || []) metadata[item.name] = item
  } catch {}

  // Load hooks
  try {
    const mod = await import(
      `../registry-reui/bases/${base}/hooks/_registry.ts`
    )
    for (const item of mod.hooks || []) metadata[item.name] = item
  } catch {}

  // Load patterns
  try {
    const mod = await import(
      `../registry-reui/bases/${base}/patterns/_registry.ts`
    )
    for (const item of mod.patterns || []) metadata[item.name] = item
  } catch {}

  metadataCache[base] = { Metadata: { [base]: metadata } }
  return metadataCache[base]
}

// ---------------------------------------------------------------------------
// Parse style name
// ---------------------------------------------------------------------------

function parseStyleName(styleName: string): { base: string; style: string } {
  const parts = styleName.split("-")
  if (parts.length >= 2) {
    const base = parts[0]
    const style = parts.slice(1).join("-")
    if (
      BASES.some((b: any) => b.name === base) &&
      STYLES.some((s: any) => s.name === style)
    ) {
      return { base, style }
    }
  }
  return { base: "radix", style: "nova" }
}

// ---------------------------------------------------------------------------
// Import path transformation (mirrors registry-server.ts)
// ---------------------------------------------------------------------------

function transformImportPaths(code: string, base: string): string {
  return code
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
    .replace(/@\/registry\/bases\/(?:base|radix)\/ui\//g, "@/components/ui/")
    .replace(
      /@\/registry\/bases\/(?:base|radix)\/reui\//g,
      "@/components/reui/"
    )
    .replace(/@\/registry\/bases\/(?:base|radix)\/hooks\//g, "@/hooks/")
    .replace(/@\/registry\/bases\/(?:base|radix)\/lib\//g, "@/lib/")
    .replace(
      /^\s*\/\/\s*(?:Description|Order|GridSize|PreviewHeight):.*$\n?/gm,
      ""
    )
    .trimStart()
}

// ---------------------------------------------------------------------------
// Determine registry source type
// ---------------------------------------------------------------------------

function getRegistrySource(name: string): { type: "patterns" | "reui" } {
  return { type: name.startsWith("p-") ? "patterns" : "reui" }
}

// ---------------------------------------------------------------------------
// Build a single registry item (mirrors getRegistryItemForApi)
// ---------------------------------------------------------------------------

async function buildRegistryItem(
  name: string,
  styleName: string
): Promise<Record<string, any> | null> {
  const { base } = parseStyleName(styleName)
  const { Metadata } = await getMetadata(base)
  const itemMetadata = Metadata[base]?.[name]

  if (!itemMetadata) return null

  const files: Array<{
    path: string
    type: string
    content: string
    target?: string
  }> = []

  for (const file of itemMetadata.files || []) {
    const filePath = typeof file === "string" ? file : file.path
    const fileType = typeof file === "string" ? "registry:file" : file.type
    const fileTarget = typeof file === "string" ? undefined : file.target

    const fullPath = path.join(
      PROJECT_ROOT,
      "registry-reui",
      "bases",
      base,
      filePath
    )

    let content = ""
    try {
      content = await fs.readFile(fullPath, "utf-8")
    } catch (error) {
      console.error(`  Failed to read: ${fullPath}`)
      continue
    }

    // 1. Transform style-specific classNames (style-vega:bg-white → bg-white)
    content = transformStyleClassNames(content, styleName)

    // 2. Transform import paths
    content = transformImportPaths(content, base)

    // 3. Transform export default → export
    if (fileType !== "registry:page") {
      content = content.replace(/export default/g, "export")
    }

    // Determine target path
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

  if (files.length === 0) return null

  return {
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
  }
}

// ---------------------------------------------------------------------------
// Collect all unique item names across all bases
// ---------------------------------------------------------------------------

async function getAllItemNames(): Promise<string[]> {
  const names = new Set<string>()
  for (const base of BASES) {
    const { Metadata } = await getMetadata(base.name)
    const items = Metadata[base.name] || {}
    for (const name of Object.keys(items)) {
      names.add(name)
    }
  }
  return Array.from(names)
}

// ---------------------------------------------------------------------------
// Resolve registryDependencies → absolute URLs
// ---------------------------------------------------------------------------

function resolveRegistryDeps(
  item: Record<string, any>,
  styleName: string,
  allNames: Set<string>
): void {
  if (!item.registryDependencies) return

  item.registryDependencies = item.registryDependencies.map((dep: string) => {
    if (allNames.has(dep)) {
      return `${BASE_URL}/r/styles/${styleName}/${dep}.json`
    }
    return dep
  })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now()
  console.log("Building static registry...")
  console.log(`  Base URL: ${BASE_URL}`)

  // Collect all style names (2 bases × 5 styles = 10)
  const styleNames: string[] = []
  for (const base of BASES) {
    for (const style of STYLES) {
      styleNames.push(`${base.name}-${style.name}`)
    }
  }

  // Collect all item names
  const allItemNames = await getAllItemNames()
  const allNamesSet = new Set(allItemNames)

  console.log(`  Styles: ${styleNames.length}`)
  console.log(`  Items: ${allItemNames.length}`)
  console.log(
    `  Total files to generate: ${styleNames.length * allItemNames.length}`
  )
  console.log(`  Default style: ${DEFAULT_STYLE} (served via redirect)`)
  console.log()

  const outputRoot = path.join(PROJECT_ROOT, "public", "r", "styles")

  // Clean existing output
  try {
    await fs.rm(outputRoot, { recursive: true, force: true })
  } catch {}

  let totalFiles = 0
  let totalBytes = 0
  let errors = 0

  // Generate files for each style
  for (const styleName of styleNames) {
    const styleDir = path.join(outputRoot, styleName)
    await fs.mkdir(styleDir, { recursive: true })

    let styleFiles = 0

    for (const itemName of allItemNames) {
      try {
        const item = await buildRegistryItem(itemName, styleName)
        if (!item) continue

        // Resolve registryDependencies to full URLs
        resolveRegistryDeps(item, styleName, allNamesSet)

        const json = JSON.stringify(item)
        await fs.writeFile(
          path.join(styleDir, `${itemName}.json`),
          json,
          "utf-8"
        )
        styleFiles++
        totalBytes += json.length
      } catch (error) {
        errors++
        console.error(`  Error building ${styleName}/${itemName}:`, error)
      }
    }

    totalFiles += styleFiles
    console.log(`  ${styleName}: ${styleFiles} files`)
  }

  // Note: "default" style is handled via edge redirect → radix-nova (no file duplication)

  // Write styles/index.json
  const stylesIndex = [
    { name: "default", label: "Default" },
    ...styleNames.map((name) => ({
      name,
      label: name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    })),
  ]
  await fs.writeFile(
    path.join(outputRoot, "index.json"),
    JSON.stringify(stylesIndex, null, 2),
    "utf-8"
  )

  // ---------------------------------------------------------------------------
  // Verification pass — read back every generated JSON and check integrity
  // ---------------------------------------------------------------------------
  console.log()
  console.log("Verifying generated files...")

  let verified = 0
  let verifyErrors = 0
  const MAX_LINE_LENGTH = 2000 // SVG paths can be long, but code lines shouldn't exceed this
  const corruptedFiles: string[] = []

  for (const styleName of styleNames) {
    const styleDir = path.join(outputRoot, styleName)
    const entries = await fs.readdir(styleDir)

    for (const entry of entries) {
      if (!entry.endsWith(".json")) continue
      const filePath = path.join(styleDir, entry)

      try {
        const raw = await fs.readFile(filePath, "utf-8")

        // 1. Verify valid JSON
        const data = JSON.parse(raw)

        // 2. Verify required fields
        if (!data.name || !data.type || !Array.isArray(data.files)) {
          verifyErrors++
          corruptedFiles.push(`${styleName}/${entry}`)
          console.error(`  INVALID SCHEMA: ${styleName}/${entry} — missing name, type, or files`)
          continue
        }

        // 3. Verify each file entry has content
        for (const file of data.files) {
          if (!file.content || typeof file.content !== "string") {
            verifyErrors++
            corruptedFiles.push(`${styleName}/${entry}`)
            console.error(`  EMPTY CONTENT: ${styleName}/${entry} — file "${file.path}" has no content`)
            break
          }

          // 4. Check for collapsed code (lines shouldn't be excessively long)
          const lines = file.content.split("\n")
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            // Skip SVG path data lines (legitimately long)
            if (line.trimStart().startsWith("d=") || line.trimStart().startsWith("d =")) continue
            if (line.length > MAX_LINE_LENGTH) {
              verifyErrors++
              corruptedFiles.push(`${styleName}/${entry}`)
              console.error(
                `  COLLAPSED CODE: ${styleName}/${entry} — line ${i + 1} is ${line.length} chars (file "${file.path}")`
              )
              break
            }
          }

          // 5. Check for unresolved style-* tokens (should all be transformed)
          if (/\bstyle-(?:vega|nova|maia|lyra|mira):/.test(file.content)) {
            verifyErrors++
            corruptedFiles.push(`${styleName}/${entry}`)
            console.error(
              `  UNTRANSFORMED STYLE: ${styleName}/${entry} — still contains style-*: tokens`
            )
          }

          // 6. Check for unresolved internal import paths
          if (/@\/registry-reui\//.test(file.content) || /@\/registry\/bases\//.test(file.content)) {
            verifyErrors++
            corruptedFiles.push(`${styleName}/${entry}`)
            console.error(
              `  UNTRANSFORMED IMPORT: ${styleName}/${entry} — still contains registry import paths`
            )
          }
        }

        verified++
      } catch (error) {
        verifyErrors++
        corruptedFiles.push(`${styleName}/${entry}`)
        console.error(`  INVALID JSON: ${styleName}/${entry} —`, error)
      }
    }
  }

  console.log(`  Verified: ${verified} files`)
  if (verifyErrors > 0) {
    console.error(`  Verification FAILED: ${verifyErrors} issues in ${[...new Set(corruptedFiles)].length} files`)
    console.error(`  Affected: ${[...new Set(corruptedFiles)].join(", ")}`)
    process.exit(1)
  } else {
    console.log("  All files passed verification")
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const sizeMB = (totalBytes / 1024 / 1024).toFixed(1)

  console.log()
  console.log(`Done in ${elapsed}s`)
  console.log(`  Total files: ${totalFiles}`)
  console.log(`  Total size: ${sizeMB} MB`)
  if (errors > 0) {
    console.log(`  Build errors: ${errors}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
