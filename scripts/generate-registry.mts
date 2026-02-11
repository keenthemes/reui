import fsSync from "node:fs"
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, "..")
const BASES_DIR = path.join(PROJECT_ROOT, "registry-reui/bases")
const PACKAGE_JSON_FILE = path.join(PROJECT_ROOT, "package.json")
const REGISTRY_JSON_FILE = path.join(BASES_DIR, "registry.json")

const COMMON_PACKAGES = ["react", "react-dom", "next", "next-themes", "@types/react", "@types/react-dom"]

const SHARED_CSS_VARS = {
  light: {
    "destructive-foreground": "var(--color-red-800)",
    "success": "var(--color-emerald-500)",
    "success-foreground": "var(--color-emerald-900)",
    "info": "var(--color-violet-500)",
    "info-foreground": "var(--color-violet-900)",
    "warning": "var(--color-yellow-500)",
    "warning-foreground": "var(--color-yellow-900)",
    "invert": "var(--color-zinc-900)",
    "invert-foreground": "var(--color-zinc-50)",
  },
  dark: {
    "destructive-foreground": "var(--color-red-600)",
    "success": "var(--color-emerald-500)",
    "success-foreground": "var(--color-emerald-600)",
    "info": "var(--color-violet-500)",
    "info-foreground": "var(--color-violet-600)",
    "warning": "var(--color-yellow-500)",
    "warning-foreground": "var(--color-yellow-600)",
    "invert": "var(--color-zinc-700)",
    "invert-foreground": "var(--color-zinc-50)",
  },
}

// Category type from registry.json
interface Category {
  name: string
  label: string
  description: string
  count: number
}

interface RegistryData {
  categories: Category[]
  totalPatterns: number
}

// Load existing categories from registry.json (single source of truth)
async function loadExistingCategories(): Promise<Category[]> {
  try {
    const content = await fs.readFile(REGISTRY_JSON_FILE, "utf-8")
    const data: RegistryData = JSON.parse(content)
    return data.categories || []
  } catch {
    console.warn("⚠️  registry.json not found, will create new one")
    return []
  }
}

async function getPackageDependencies() {
  const content = await fs.readFile(PACKAGE_JSON_FILE, "utf-8")
  const pkg = JSON.parse(content)
  return [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ]
}

function formatTitle(name: string) {
  return name
    .replace(/^p-/, "")
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

async function parseFile(filePath: string, packageDeps: string[]) {
  const content = await fs.readFile(filePath, "utf-8")
  const registryDependencies = new Set<string>()
  const dependencies = new Set<string>()

  // Extract metadata from comments
  let description = ""
  let title = ""
  let order: number | undefined = undefined
  let gridSize: number | undefined = undefined

  const lines = content.split("\n")
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim()
    if (!line.startsWith("//")) continue

    const titleMatch = line.match(/^\/\/\s*Title:\s*(.*)$/i)
    if (titleMatch) title = titleMatch[1].trim()

    const descMatch = line.match(/^\/\/\s*Description:\s*(.*)$/i)
    if (descMatch) description = descMatch[1].trim()

    const orderMatch = line.match(/^\/\/\s*Order:\s*(\d+)$/i)
    if (orderMatch) order = parseInt(orderMatch[1])

    const gridMatch = line.match(/^\/\/\s*GridSize:\s*(\d+)$/i)
    if (gridMatch) gridSize = parseInt(gridMatch[1])
  }

  // Resolve registry dependencies
  const importRegistryRegex = /from\s+["']@\/registry\/([^"']+)["']/g
  let match
  while ((match = importRegistryRegex.exec(content)) !== null) {
    const importPath = match[1]
    const parts = importPath.split("/")
    // If it's a deep import into a component directory, take the component name
    // e.g. bases/base/ui/select/select-content -> select
    const componentName =
      parts.length > 4 && (parts[2] === "ui" || parts[2] === "reui")
        ? parts[3]
        : parts[parts.length - 1].replace(".tsx", "")

    if (componentName !== "utils") {
      registryDependencies.add(componentName)
    }
  }

  // Also check for @/registry-reui dependencies
  const importReuiRegex = /from\s+["']@\/registry-reui\/([^"']+)["']/g
  while ((match = importReuiRegex.exec(content)) !== null) {
    const importPath = match[1]
    const parts = importPath.split("/")
    // If it's a deep import into a component directory, take the component name
    // e.g. bases/base/reui/data-grid/data-grid-pagination -> data-grid
    const componentName =
      parts.length > 4 && (parts[2] === "ui" || parts[2] === "reui")
        ? parts[3]
        : parts[parts.length - 1].replace(".tsx", "")

    registryDependencies.add(componentName)
  }

  // Resolve package dependencies
  const importRegex = /from\s+["']([^"']+)["']/g
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1]
    if (
      importPath.startsWith(".") ||
      importPath.startsWith("@/") ||
      importPath.startsWith("/")
    )
      continue

    let packageName = ""
    if (importPath.startsWith("@")) {
      const parts = importPath.split("/")
      if (parts.length >= 2) {
        packageName = parts.slice(0, 2).join("/")
      }
    } else {
      packageName = importPath.split("/")[0]
    }

    if (
      packageName &&
      packageDeps.includes(packageName) &&
      !COMMON_PACKAGES.includes(packageName)
    ) {
      dependencies.add(packageName)
    }
  }

  return {
    description,
    title,
    order,
    gridSize,
    registryDependencies: Array.from(registryDependencies).sort(),
    dependencies: Array.from(dependencies).sort(),
  }
}

async function generate() {
  const packageDeps = await getPackageDependencies()
  const bases = (await fs.readdir(BASES_DIR)).filter(f => {
    const fullPath = path.join(BASES_DIR, f)
    return fsSync.statSync(fullPath).isDirectory() && !f.startsWith(".") && !f.startsWith("_")
  })

  const globalIndex: Record<string, Record<string, any>> = {}

  for (const base of bases) {
    const baseDir = path.join(BASES_DIR, base)
    const reuiDir = path.join(baseDir, "reui")
    const hooksDir = path.join(baseDir, "hooks")
    const patternsDir = path.join(baseDir, "patterns")

    const reuiItems: any[] = []
    const hooksItems: any[] = []
    const patternItems: any[] = []

    // Process Hooks
    if (fsSync.existsSync(hooksDir)) {
      const entries = await fs.readdir(hooksDir)
      for (const entry of entries) {
        if (entry.startsWith("_") || !entry.endsWith(".ts")) continue
        const entryPath = path.join(hooksDir, entry)
        const name = entry.replace(".ts", "")
        const info = await parseFile(entryPath, packageDeps)

        hooksItems.push({
          name,
          type: "registry:hook",
          title: info.description || info.title || formatTitle(name),
          description: info.description,
          registryDependencies: info.registryDependencies,
          dependencies: info.dependencies,
          files: [
            {
              path: `hooks/${entry}`,
              type: "registry:hook",
              target: `hooks/${entry}`,
            },
          ],
        })
      }
    }

    // Process REUI components
    if (fsSync.existsSync(reuiDir)) {
      const entries = await fs.readdir(reuiDir)
      
      for (const entry of entries) {
        if (entry.startsWith("_")) continue
        
        const entryPath = path.join(reuiDir, entry)
        const stat = await fs.stat(entryPath)
        
        if (stat.isDirectory()) {
          // Handle subdirectory (e.g., data-grid/)
          const subFiles = await fs.readdir(entryPath)
          const tsxFiles = subFiles.filter(f => f.endsWith(".tsx") && !f.startsWith("_"))
          
          // Find the main component file (matches directory name)
          const mainFileName = `${entry}.tsx`
          const hasMainFile = tsxFiles.includes(mainFileName)
          
          // Get all sub-component names (excluding main file) - used to filter internal deps
          const subComponentNames = new Set(
            tsxFiles
              .filter(f => f !== mainFileName)
              .map(f => f.replace(".tsx", ""))
          )
          
          // First pass: collect all dependencies from all files in the directory
          const allExternalRegistryDeps = new Set<string>()
          const allDependencies = new Set<string>()
          const fileInfoMap = new Map<string, Awaited<ReturnType<typeof parseFile>>>()
          
          for (const file of tsxFiles) {
            const filePath = path.join(entryPath, file)
            const info = await parseFile(filePath, packageDeps)
            fileInfoMap.set(file, info)
            
            // Collect external registry dependencies (exclude internal sub-components)
            for (const dep of info.registryDependencies) {
              if (!subComponentNames.has(dep) && dep !== entry) {
                allExternalRegistryDeps.add(dep)
              }
            }
            
            // Collect all package dependencies
            for (const dep of info.dependencies) {
              allDependencies.add(dep)
            }
          }
          
          // Second pass: create registry items
          for (const file of tsxFiles) {
            const name = file.replace(".tsx", "")
            const info = fileInfoMap.get(file)!
            
            const isMainFile = file === mainFileName
            
            // Build meta object
            let meta: { order?: number; gridSize?: number } | undefined
            if (info.order !== undefined || info.gridSize !== undefined) {
              meta = {}
              if (info.order !== undefined) meta.order = info.order
              if (info.gridSize !== undefined) meta.gridSize = info.gridSize
            }
            
            // For main file, include all files and merge external dependencies from all sub-components
            if (isMainFile && hasMainFile) {
              const allFiles = tsxFiles.map(f => ({
                path: `reui/${entry}/${f}`,
                type: "registry:ui",
                target: `components/reui/${entry}/${f}`,
              }))
              
              reuiItems.push({
                name,
                type: "registry:ui",
                title: info.description || info.title || formatTitle(name),
                description: info.description,
                registryDependencies: Array.from(allExternalRegistryDeps).sort(),
                dependencies: Array.from(allDependencies).sort(),
                files: allFiles,
                meta,
                cssVars: (name === "badge" || name === "alert") ? SHARED_CSS_VARS : undefined,
              })
            } else {
              // Sub-component: single file entry, filter out internal deps
              const externalDeps = info.registryDependencies.filter(
                dep => !subComponentNames.has(dep) && dep !== entry
              )
              
              reuiItems.push({
                name,
                type: "registry:ui",
                title: info.description || info.title || formatTitle(name),
                description: info.description,
                registryDependencies: externalDeps,
                dependencies: info.dependencies,
                files: [{ path: `reui/${entry}/${file}`, type: "registry:ui", target: `component/reui/${entry}/${file}` }],
                meta,
                cssVars: (name === "badge" || name === "alert") ? SHARED_CSS_VARS : undefined,
              })
            }
          }
        } else if (entry.endsWith(".tsx")) {
          // Handle single file component
          const name = entry.replace(".tsx", "")
          const info = await parseFile(entryPath, packageDeps)

          // Build meta object
          let meta: { order?: number; gridSize?: number } | undefined
          if (info.order !== undefined || info.gridSize !== undefined) {
            meta = {}
            if (info.order !== undefined) meta.order = info.order
            if (info.gridSize !== undefined) meta.gridSize = info.gridSize
          }

          reuiItems.push({
            name,
            type: "registry:ui",
            title: info.description || info.title || formatTitle(name),
            description: info.description,
            registryDependencies: info.registryDependencies,
            dependencies: info.dependencies,
            files: [{ path: `reui/${entry}`, type: "registry:ui", target: `components/reui/${entry}` }],
            meta,
            cssVars: (name === "badge" || name === "alert") ? SHARED_CSS_VARS : undefined,
          })
        }
      }
    }

    // Build a set of known REUI component names (to filter from pattern dependencies)
    const reuiComponentNames = new Set<string>()
    for (const item of reuiItems) {
      reuiComponentNames.add(item.name)
    }
    for (const item of hooksItems) {
      reuiComponentNames.add(item.name)
    }

    // Process Patterns
    if (fsSync.existsSync(patternsDir)) {
      const categories = await fs.readdir(patternsDir)
      for (const category of categories) {
        const categoryDir = path.join(patternsDir, category)
        if (!(await fs.stat(categoryDir)).isDirectory()) continue

        const files = await fs.readdir(categoryDir)
        for (const file of files) {
          if (!file.endsWith(".tsx")) continue
          const name = file.replace(".tsx", "")
          const filePath = path.join(categoryDir, file)
          const info = await parseFile(filePath, packageDeps)

          // Build meta object with order and gridSize if defined
          let meta: { order?: number; gridSize?: number } | undefined
          if (info.order !== undefined || info.gridSize !== undefined) {
            meta = {}
            if (info.order !== undefined) {
              meta.order = info.order
            }
            if (info.gridSize !== undefined) {
              meta.gridSize = info.gridSize
            }
          }

          // Build files array - only include the pattern file itself
          const patternFiles: Array<{ path: string; type: string; target: string }> = [
            {
              path: `patterns/${category}/${file}`,
              type: "registry:block",
              target: `components/patterns/${file}`,
            },
          ]

          patternItems.push({
            name,
            type: "registry:block",
            title: info.description || info.title || formatTitle(name),
            categories: [category],
            description: info.description,
            registryDependencies: info.registryDependencies,
            dependencies: info.dependencies,
            files: patternFiles,
            meta,
          })
        }
      }
    }

    // Write individual _registry.ts files
    if (reuiItems.length > 0) {
      const reuiRegistryPath = path.join(reuiDir, "_registry.ts")
      await fs.writeFile(
        reuiRegistryPath,
        `import { type Registry } from "shadcn/schema"\n\nexport const reui: Registry["items"] = ${JSON.stringify(reuiItems, null, 2)}\n`
      )
    }

    if (hooksItems.length > 0) {
      const hooksRegistryPath = path.join(hooksDir, "_registry.ts")
      await fs.writeFile(
        hooksRegistryPath,
        `import { type Registry } from "shadcn/schema"\n\nexport const hooks: Registry["items"] = ${JSON.stringify(hooksItems, null, 2)}\n`
      )
    }

    if (patternItems.length > 0) {
      const patternsRegistryPath = path.join(patternsDir, "_registry.ts")
      await fs.writeFile(
        patternsRegistryPath,
        `import { type Registry } from "shadcn/schema"\n\nexport const patterns: Registry["items"] = ${JSON.stringify(patternItems, null, 2)}\n`
      )
    }

    // Write base-specific registry.ts
    const baseRegistryPath = path.join(baseDir, "registry.ts")
    await fs.writeFile(
      baseRegistryPath,
      `import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { hooks } from "./hooks/_registry"
import { patterns } from "./patterns/_registry"
import { reui } from "./reui/_registry"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z.array(registryItemSchema).parse([...reui, ...hooks, ...patterns]),
} satisfies Registry
`
    )

    // Build global index for this base
    globalIndex[base] = {}
    const allItems = [...reuiItems, ...hooksItems, ...patternItems]
    for (const item of allItems) {
      globalIndex[base][item.name] = {
        name: item.name,
        title: item.title,
        description: item.description || "",
        type: item.type,
        registryDependencies: item.registryDependencies.length > 0 ? item.registryDependencies : undefined,
        dependencies: item.dependencies.length > 0 ? item.dependencies : undefined,
        files: item.files.map((f: any) => ({
          path: `registry-reui/bases/${base}/${f.path}`,
          type: f.type,
          target: f.target,
        })),
        categories: item.categories,
        meta: item.meta,
        cssVars: item.cssVars,
      }
    }
  }

  // Load existing categories from registry.json (single source of truth for names, labels, descriptions)
  const existingCategories = await loadExistingCategories()
  const existingCategoriesMap = new Map(existingCategories.map(c => [c.name, c]))

  // Calculate stats
  let totalPatterns = 0
  const patternCounts: Record<string, number> = {}
  
  // Only count from "base" to avoid double counting
  const baseRegistry = globalIndex["base"] || {}
  for (const [name, item] of Object.entries(baseRegistry)) {
    if (item.type !== "registry:block" || !name.startsWith("p-") || name.endsWith("-0")) continue
    totalPatterns++
    const categories = (item.categories as string[]) || []
    categories.forEach((cat: string) => {
      patternCounts[cat] = (patternCounts[cat] || 0) + 1
    })
  }

  // Build unified categories array with updated counts
  // Use existing categories as base, add any new ones discovered
  const allCategoryNames = new Set([
    ...existingCategories.map(c => c.name),
    ...Object.keys(patternCounts)
  ])

  const categoriesArray = Array.from(allCategoryNames).map(catName => {
    const existing = existingCategoriesMap.get(catName)
    return {
      name: catName,
      label: existing?.label || catName.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
      description: existing?.description || "",
      count: patternCounts[catName] || 0,
    }
  }).sort((a, b) => a.name.localeCompare(b.name))

  // Generate patterns.json - Compact manifest for browsing and search
  const patternsManifest: any[] = []
  const seenPatterns = new Set<string>()

  // Use patterns from globalIndex["base"] as the primary source for the manifest
  const basePatterns = globalIndex["base"] || {}
  for (const [name, item] of Object.entries(basePatterns)) {
    if (item.type === "registry:block" && name.startsWith("p-") && !name.endsWith("-0")) {
      patternsManifest.push({
        name: item.name,
        title: item.title,
        categories: item.categories,
        meta: item.meta
      })
      seenPatterns.add(name)
    }
  }

  await fs.writeFile(path.join(BASES_DIR, "patterns.json"), JSON.stringify(patternsManifest, null, 2))
  console.log("   ✅ Generated patterns.json")

  // Generate registry.json - SMALL file with pre-computed categories and stats
  // Using JSON for instant loading without TS compilation overhead
  const statsData = {
    categories: categoriesArray,
    totalPatterns
  }

  await fs.writeFile(path.join(BASES_DIR, "registry.json"), JSON.stringify(statsData, null, 2))
  console.log("   ✅ Generated registry.json")

  console.log(`\n📊 Stats:`)
  console.log(`   - Total Patterns: ${totalPatterns}`)
  console.log(`   - Bases: ${Object.keys(globalIndex).join(", ")}`)
  console.log("\n✅ Registry generation complete!")
}

generate().catch(console.error)
