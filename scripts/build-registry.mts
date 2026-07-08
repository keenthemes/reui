/**
 * Build Static Registry
 *
 * Pre-compiles registry items into static JSON files in public/r/styles/.
 * This eliminates serverless function invocations for registry serving —
 * files are served directly from the CDN edge.
 *
 * ReUI primitives are style-aware and generated for every base/style pair.
 * Components are style-agnostic and generated only for Nova per base.
 *
 * Output structure:
 *   public/r/styles/index.json             - list of available styles
 *   public/r/styles/{style}/registry.json  - per-style catalog manifest (items, no file content)
 *   public/r/styles/{style}/{name}.json    - style-aware ReUI primitives
 *   public/r/styles/{base}-nova/*.json     - all components for that base
 *   public/r/styles/default/               - alias for base-nova (the default)
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
// We can't use @/ path aliases in scripts, so we import the local modules
// directly and keep the static-registry transform logic in this script.
// ---------------------------------------------------------------------------

const { BASES: rawBases } = await import("../registry/bases.ts")
const BASES = rawBases as ReadonlyArray<{ name: string }>

const stylesSource = await fs.readFile(
  path.join(PROJECT_ROOT, "registry", "styles.tsx"),
  "utf-8"
)
const STYLES = Array.from(stylesSource.matchAll(/\bname:\s*"([^"]+)"/g)).map(
  ([, name]) => ({ name })
) as ReadonlyArray<{ name: string }>

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
  docs?: string
}

interface MetadataData {
  Metadata: Record<string, Record<string, RegistryItem>>
}

// Constants
const DEFAULT_STYLE = "base-nova"
const DEFAULT_VARIANT = "nova"
const REUI_REGISTRY_NAMESPACE = "@reui"
// Per-style registry.json catalog manifest header. Mirrors shadcn's public
// registry.json shape ({ name, homepage, items }); a single name/homepage is
// shared across every style, exactly like shadcn ships "shadcn/ui" for each.
const REGISTRY_MANIFEST_NAME = "reui"
const REGISTRY_MANIFEST_HOMEPAGE = "https://reui.io"
const REQUIRED_REGISTRY_ITEMS = [
  "data-grid",
  "data-grid-scroll-area",
  "data-grid-table-virtual",
]
// Keep these style alternations in sync with the STYLES list in registry/styles.tsx.
const GENERATED_STYLE_PATTERN = "(?:vega|nova|maia|lyra|mira|luma|sera|rhea)"
const STYLE_VARIANT_TOKEN_RE =
  /\bstyle-(vega|nova|maia|lyra|mira|luma|sera|rhea):([^\s"'`{}]+)/g
const QUOTED_STYLE_VARIANT_RE =
  /(["'`])([^"'`\n]*\bstyle-(?:vega|nova|maia|lyra|mira|luma|sera|rhea):[^"'`\n]*)\1/g

function getSvgImportPaths(code: string): string[] {
  const svgImports = new Set<string>()
  const svgImportRegex = /from\s+["']@\/components\/ui\/svgs\/([^"']+)["']/g

  let match: RegExpExecArray | null
  while ((match = svgImportRegex.exec(code)) !== null) {
    const importPath = match[1]?.replace(/\.(?:t|j)sx?$/, "")
    if (importPath) {
      svgImports.add(importPath)
    }
  }

  return Array.from(svgImports)
}

function getResolvedReuiRegistryDeps(code: string): string[] {
  const deps = new Set<string>()
  const registryImportPatterns = [
    /from\s+["']@\/components\/reui\/([^"']+)["']/g,
    /from\s+["']@\/components\/ui\/([^"']+)["']/g,
  ]

  for (const pattern of registryImportPatterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(code)) !== null) {
      const importPath = match[1]?.replace(/\.(?:t|j)sx?$/, "")
      const parts = importPath?.split("/") ?? []
      const depName = parts.at(-1)

      if (depName && !parts.includes("svgs") && depName !== "utils") {
        deps.add(depName)
      }
    }
  }

  return Array.from(deps)
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readRegistryShardItems(
  dirPath: string
): Promise<RegistryItem[]> {
  try {
    const files: string[] = []
    const walk = async (currentDir: string) => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true })

      for (const entry of entries) {
        const entryPath = path.join(currentDir, entry.name)

        if (entry.isDirectory()) {
          await walk(entryPath)
          continue
        }

        if (entry.isFile() && entry.name.endsWith(".json")) {
          files.push(entryPath)
        }
      }
    }

    await walk(dirPath)
    files.sort((a, b) => a.localeCompare(b))

    const items: RegistryItem[] = []

    for (const file of files) {
      const raw = await fs.readFile(file, "utf-8")
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

// ---------------------------------------------------------------------------
// Metadata loading from the generated registry shards
// ---------------------------------------------------------------------------

const metadataCache: Record<string, MetadataData> = {}

async function getMetadata(base: string): Promise<MetadataData> {
  if (metadataCache[base]) return metadataCache[base]

  const metadata: Record<string, RegistryItem> = {}

  // Load reui components
  try {
    const mod = await import(`../registry-reui/bases/${base}/reui/_registry.ts`)
    for (const item of mod.reui || []) metadata[item.name] = item
  } catch {}

  // Load hooks
  try {
    const mod = await import(
      `../registry-reui/bases/${base}/hooks/_registry.ts`
    )
    for (const item of mod.hooks || []) metadata[item.name] = item
  } catch {}

  for (const item of await readRegistryShardItems(
    path.join(
      PROJECT_ROOT,
      "registry-reui",
      "_meta",
      "components",
      "bases",
      base
    )
  )) {
    metadata[item.name] = item
  }

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
// Import path transformation
// ---------------------------------------------------------------------------

function transformImportPaths(code: string, base: string): string {
  const generatedStylePattern = GENERATED_STYLE_PATTERN

  return code
    .replace(
      new RegExp(
        `@/registry-reui/bases/__generated/(?:base|radix)-${generatedStylePattern}/reui/`,
        "g"
      ),
      "@/components/reui/"
    )
    .replace(
      new RegExp(
        `@/registry-reui/bases/__generated/(?:base|radix)-${generatedStylePattern}/ui/`,
        "g"
      ),
      "@/components/ui/"
    )
    .replace(
      new RegExp(
        `@/registry-reui/bases/__generated/(?:base|radix)-${generatedStylePattern}/hooks/`,
        "g"
      ),
      "@/hooks/"
    )
    .replace(
      new RegExp(
        `@/registry-reui/bases/__generated/(?:base|radix)-${generatedStylePattern}/lib/`,
        "g"
      ),
      "@/lib/"
    )
    .replace(
      new RegExp(
        `@/registry-reui/bases/__generated/(?:base|radix)-${generatedStylePattern}/components/`,
        "g"
      ),
      "@/components/examples/"
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
      new RegExp(`@/registry-reui/bases/${base}/components/`, "g"),
      "@/components/examples/"
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
      /@\/registry(?:-reui)?\/bases\/(?:base|radix)\/components\//g,
      "@/components/examples/"
    )
    .replace(/@\/registry\/bases\/(?:base|radix)\/ui\//g, "@/components/ui/")
    .replace(
      /@\/registry\/bases\/(?:base|radix)\/reui\//g,
      "@/components/reui/"
    )
    .replace(/@\/registry\/bases\/(?:base|radix)\/hooks\//g, "@/hooks/")
    .replace(/@\/registry\/bases\/(?:base|radix)\/lib\//g, "@/lib/")
    .trimStart()
}

function transformStyleVariants(code: string, style: string): string {
  return code.replace(
    QUOTED_STYLE_VARIANT_RE,
    (_match, quote: string, inner: string) => {
      const normalized = inner
        .replace(
          STYLE_VARIANT_TOKEN_RE,
          (_tokenMatch, variant: string, token: string) =>
            variant === style ? token : ""
        )
        .replace(/\s+/g, " ")
        .trim()

      return `${quote}${normalized}${quote}`
    }
  )
}

// ---------------------------------------------------------------------------
// Determine registry source type
// ---------------------------------------------------------------------------

function getRegistrySource(
  name: string,
  itemType: string
): { type: "components" | "reui" } {
  if (name.startsWith("c-")) {
    return { type: "components" }
  }

  return { type: "reui" }
}

function isStyleAwareRegistryItem(item: RegistryItem): boolean {
  return (item.files || []).some((file) => {
    const filePath = typeof file === "string" ? file : file.path
    return filePath === "reui" || filePath.startsWith("reui/")
  })
}

function shouldBuildItemForStyle(item: RegistryItem, style: string): boolean {
  return style === DEFAULT_VARIANT || isStyleAwareRegistryItem(item)
}

// ---------------------------------------------------------------------------
// Build a single registry item (mirrors getRegistryItemForApi)
// ---------------------------------------------------------------------------

async function buildRegistryItem(
  name: string,
  styleName: string
): Promise<Record<string, any> | null> {
  const { base, style } = parseStyleName(styleName)
  const { Metadata } = await getMetadata(base)
  const itemMetadata = Metadata[base]?.[name]

  if (!itemMetadata) return null

  const files = new Map<
    string,
    {
      path: string
      type: string
      content: string
      target?: string
    }
  >()
  const registryDependencies = new Set(itemMetadata.registryDependencies || [])

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

    const svgImportPaths = getSvgImportPaths(content)

    // Transform import paths
    content = transformImportPaths(content, base)

    // Transform source-level style variants into the concrete generated style.
    content = transformStyleVariants(content, style)

    for (const dep of getResolvedReuiRegistryDeps(content)) {
      if (dep !== name) {
        registryDependencies.add(dep)
      }
    }

    // 3. Transform export default → export
    if (fileType !== "registry:page") {
      content = content.replace(/export default/g, "export")
    }

    // Determine target path
    let target = fileTarget
    if (!target) {
      const fileName = filePath.split("/").pop()
      const { type: sourceType } = getRegistrySource(name, itemMetadata.type)

      if (sourceType === "components") {
        target = `components/examples/${fileName}`
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

    files.set(target, {
      path: filePath.split("/").pop() || filePath,
      type: fileType,
      content: content.trim(),
      target,
    })

    // Vendored SVG logo components under components/ui/svgs are bundled into
    // the generated registry item so consumers receive the local source files.
    for (const svgImportPath of svgImportPaths) {
      const svgTarget = path.posix.join(
        "components",
        "ui",
        "svgs",
        `${svgImportPath}.tsx`
      )

      if (files.has(svgTarget)) {
        continue
      }

      const svgFullPath = path.join(
        PROJECT_ROOT,
        "components",
        "ui",
        "svgs",
        `${svgImportPath}.tsx`
      )

      try {
        const svgContent = await fs.readFile(svgFullPath, "utf-8")
        files.set(svgTarget, {
          path: `${svgImportPath}.tsx`,
          type: "registry:ui",
          content: svgContent.trim(),
          target: svgTarget,
        })
      } catch {
        console.error(`  Failed to read SVG dependency: ${svgFullPath}`)
      }
    }
  }

  if (files.size === 0) return null

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: itemMetadata.name,
    type: itemMetadata.type,
    title: itemMetadata.title,
    description: itemMetadata.description,
    dependencies: itemMetadata.dependencies,
    devDependencies: itemMetadata.devDependencies,
    registryDependencies: Array.from(registryDependencies).sort(),
    files: Array.from(files.values()),
    cssVars: itemMetadata.cssVars,
    ...(itemMetadata.meta ? { meta: itemMetadata.meta } : {}),
    ...(itemMetadata.docs ? { docs: itemMetadata.docs } : {}),
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
// Resolve internal registryDependencies -> @reui namespace
// ---------------------------------------------------------------------------

function resolveRegistryDeps(
  item: Record<string, any>,
  allNames: Set<string>
): void {
  if (!item.registryDependencies) return

  item.registryDependencies = item.registryDependencies.map((dep: string) => {
    if (allNames.has(dep)) {
      return `${REUI_REGISTRY_NAMESPACE}/${dep}`
    }
    return dep
  })
}

// ---------------------------------------------------------------------------
// Per-style registry.json catalog entry
//
// The catalog lists every item available for a style but, like shadcn's public
// registry.json, omits inlined file content: each file is referenced by
// path/type/target only. Consumers fetch the individual {name}.json to get the
// installable item with content.
// ---------------------------------------------------------------------------

function toManifestItem(item: Record<string, any>): Record<string, any> {
  const manifest: Record<string, any> = {}
  for (const [key, value] of Object.entries(item)) {
    // The per-item $schema belongs on the installable item, not the catalog.
    if (key === "$schema") continue
    if (key === "files" && Array.isArray(value)) {
      manifest.files = value.map((file: Record<string, any>) => {
        const { content, ...rest } = file
        return rest
      })
      continue
    }
    manifest[key] = value
  }
  return manifest
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now()
  console.log("Building static registry...")
  console.log(`  Internal registry namespace: ${REUI_REGISTRY_NAMESPACE}`)

  // Collect all style names. Non-Nova styles only receive style-aware ReUI
  // primitives; components are generated once per base under Nova.
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
  console.log(
    `  Components: generated once per base via ${DEFAULT_VARIANT}`
  )
  console.log(`  Items: ${allItemNames.length}`)
  console.log(
    `  Max possible files before style-aware pruning: ${styleNames.length * allItemNames.length}`
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
    const { base, style } = parseStyleName(styleName)
    const { Metadata } = await getMetadata(base)
    const baseItems = Metadata[base] || {}
    const styleDir = path.join(outputRoot, styleName)
    await fs.mkdir(styleDir, { recursive: true })

    let styleFiles = 0
    const manifestItems: Record<string, any>[] = []

    for (const itemName of allItemNames) {
      const itemMetadata = baseItems[itemName]
      if (!itemMetadata || !shouldBuildItemForStyle(itemMetadata, style)) {
        continue
      }

      try {
        const item = await buildRegistryItem(itemName, styleName)
        if (!item) continue

        // Resolve registryDependencies to package-style aliases.
        resolveRegistryDeps(item, allNamesSet)

        const json = JSON.stringify(item)
        await fs.writeFile(
          path.join(styleDir, `${itemName}.json`),
          json,
          "utf-8"
        )
        styleFiles++
        totalBytes += json.length
        manifestItems.push(toManifestItem(item))
      } catch (error) {
        errors++
        console.error(`  Error building ${styleName}/${itemName}:`, error)
      }
    }

    for (const itemName of REQUIRED_REGISTRY_ITEMS) {
      const outputPath = path.join(styleDir, `${itemName}.json`)
      if (await fileExists(outputPath)) {
        continue
      }

      const item = await buildRegistryItem(itemName, styleName)
      if (!item) {
        continue
      }

      resolveRegistryDeps(item, allNamesSet)

      const json = JSON.stringify(item)
      await fs.writeFile(outputPath, json, "utf-8")
      styleFiles++
      totalBytes += json.length
      manifestItems.push(toManifestItem(item))
      console.log(`  recovered ${styleName}/${itemName}.json`)
    }

    // Write the per-style catalog manifest (registry.json), sorted by name for
    // a stable, diff-friendly catalog, mirroring shadcn's public registry.json.
    // Sort by raw codepoint (not localeCompare) so the output is byte-identical
    // regardless of the build host's locale/ICU.
    const manifest = {
      name: REGISTRY_MANIFEST_NAME,
      homepage: REGISTRY_MANIFEST_HOMEPAGE,
      items: manifestItems.sort((a, b) => {
        const an = String(a.name)
        const bn = String(b.name)
        return an < bn ? -1 : an > bn ? 1 : 0
      }),
    }
    const manifestJson = JSON.stringify(manifest, null, 2)
    await fs.writeFile(
      path.join(styleDir, "registry.json"),
      manifestJson,
      "utf-8"
    )
    totalBytes += manifestJson.length
    totalFiles += 1

    totalFiles += styleFiles

    const missingRequiredItems: string[] = []
    for (const itemName of REQUIRED_REGISTRY_ITEMS) {
      const outputPath = path.join(styleDir, `${itemName}.json`)
      if (!(await fileExists(outputPath))) {
        missingRequiredItems.push(itemName)
      }
    }

    if (missingRequiredItems.length > 0) {
      throw new Error(
        `Missing required registry items for ${styleName}: ${missingRequiredItems.join(", ")}`
      )
    }

    console.log(`  ${styleName}: ${styleFiles} files`)
  }

  // Note: "default" style is handled via edge redirect → base-nova (no file duplication)

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
      // registry.json is the catalog manifest ({ name, homepage, items }), not
      // an installable item - it is verified separately below.
      if (entry === "registry.json") continue
      const filePath = path.join(styleDir, entry)

      try {
        const raw = await fs.readFile(filePath, "utf-8")

        // 1. Verify valid JSON
        const data = JSON.parse(raw)

        // 2. Verify required fields
        if (!data.name || !data.type || !Array.isArray(data.files)) {
          verifyErrors++
          corruptedFiles.push(`${styleName}/${entry}`)
          console.error(
            `  INVALID SCHEMA: ${styleName}/${entry} — missing name, type, or files`
          )
          continue
        }

        // 3. Verify each file entry has content
        for (const file of data.files) {
          if (!file.content || typeof file.content !== "string") {
            verifyErrors++
            corruptedFiles.push(`${styleName}/${entry}`)
            console.error(
              `  EMPTY CONTENT: ${styleName}/${entry} — file "${file.path}" has no content`
            )
            break
          }

          // 4. Check for collapsed code (lines shouldn't be excessively long)
          const lines = file.content.split("\n")
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            // Skip SVG path data lines (legitimately long)
            const trimmedLine = line.trimStart()
            if (
              trimmedLine.startsWith("d=") ||
              trimmedLine.startsWith("d =") ||
              /^<path\b[^>]*\bd=/.test(trimmedLine)
            )
              continue
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
          if (
            /\bstyle-(?:vega|nova|maia|lyra|mira|luma|sera|rhea):/.test(
              file.content
            )
          ) {
            verifyErrors++
            corruptedFiles.push(`${styleName}/${entry}`)
            console.error(
              `  UNTRANSFORMED STYLE: ${styleName}/${entry} — still contains style-*: tokens`
            )
          }

          // 6. Check for unresolved internal import paths
          if (
            /@\/registry-reui\//.test(file.content) ||
            /@\/registry\/bases\//.test(file.content)
          ) {
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

  // Verify each per-style registry.json catalog manifest.
  for (const styleName of styleNames) {
    const manifestPath = path.join(outputRoot, styleName, "registry.json")
    try {
      const data = JSON.parse(await fs.readFile(manifestPath, "utf-8"))
      if (typeof data.name !== "string" || !Array.isArray(data.items)) {
        verifyErrors++
        corruptedFiles.push(`${styleName}/registry.json`)
        console.error(
          `  INVALID MANIFEST: ${styleName}/registry.json - missing name or items[]`
        )
      }
    } catch (error) {
      verifyErrors++
      corruptedFiles.push(`${styleName}/registry.json`)
      console.error(
        `  INVALID MANIFEST JSON: ${styleName}/registry.json -`,
        error
      )
    }
  }

  console.log(`  Verified: ${verified} files`)
  if (verifyErrors > 0) {
    console.error(
      `  Verification FAILED: ${verifyErrors} issues in ${[...new Set(corruptedFiles)].length} files`
    )
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
