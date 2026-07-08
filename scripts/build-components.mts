/// <reference types="node" />

import fsSync, { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, "..")
const BASES_DIR = path.join(PROJECT_ROOT, "registry-reui", "bases")
const REGISTRY_META_DIR = path.join(PROJECT_ROOT, "registry-reui", "_meta")
const COMPONENTS_METADATA_DIR = path.join(REGISTRY_META_DIR, "components")
const COMPONENT_SHARDS_DIR = path.join(COMPONENTS_METADATA_DIR, "bases")
const GENERATED_COMPONENT_PREVIEW_LOADERS_DIR = path.join(
  PROJECT_ROOT,
  "lib",
  "generated",
  "component-preview-loaders"
)
const PACKAGE_JSON_FILE = path.join(PROJECT_ROOT, "package.json")
const COMPONENTS_STATS_JSON_FILE = path.join(
  COMPONENTS_METADATA_DIR,
  "registry.json"
)

// Packages excluded from a registry item's `dependencies` because every
// Next.js + shadcn consumer already has them (the framework scaffold). Only put
// scaffold/peer packages here. Do NOT add real add-on deps (e.g. next-themes) -
// excluding those drops them from the registry, so `shadcn add` installs an
// item that imports a package the consumer never installs.
const COMMON_PACKAGES = [
  "react",
  "react-dom",
  "next",
  "@types/react",
  "@types/react-dom",
]

interface Category {
  name: string
  label: string
  description: string
  count: number
}

interface RegistryData {
  categories: Category[]
  totalComponents?: number
}

interface GeneratedRegistryFile {
  path: string
  type: string
  target: string
}

type ComponentMeta = {
  title?: string
  description?: string
  order?: number
  gridSize?: 1 | 2
  previewHeight?: string
}

type ComponentRegistryItem = {
  name: string
  type: "registry:block"
  title: string
  categories: string[]
  description?: string
  registryDependencies: string[]
  dependencies: string[]
  files: GeneratedRegistryFile[]
  meta?: {
    order?: number
    gridSize?: 1 | 2
    previewHeight?: string
  }
}

function componentizeCatalogText(text: string) {
  return text
    .replace(/\bPatterns\b/g, "Components")
    .replace(/\bPattern\b/g, "Component")
    .replace(/\bpatterns\b/g, "components")
    .replace(/\bpattern\b/g, "component")
}

async function loadExistingCategories(): Promise<Category[]> {
  try {
    const content = await fs.readFile(COMPONENTS_STATS_JSON_FILE, "utf8")
    const data: RegistryData = JSON.parse(content)
    return (data.categories || []).map((category) => ({
      ...category,
      description: componentizeCatalogText(category.description || ""),
    }))
  } catch {
    console.warn("registry.json not found, creating a new one")
    return []
  }
}

async function getPackageDependencies() {
  const content = await fs.readFile(PACKAGE_JSON_FILE, "utf8")
  const pkg = JSON.parse(content)
  return [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ]
}

function createSvgRegistryFile(importPath: string): GeneratedRegistryFile {
  const normalizedImportPath = importPath.replace(/\.(?:t|j)sx?$/, "")

  return {
    path: path.posix.join(
      "..",
      "..",
      "..",
      "components",
      "ui",
      "svgs",
      `${normalizedImportPath}.tsx`
    ),
    type: "registry:ui",
    target: path.posix.join(
      "components",
      "ui",
      "svgs",
      `${normalizedImportPath}.tsx`
    ),
  }
}

function dedupeFiles<T extends { target?: string; path: string }>(
  files: T[]
): T[] {
  const uniqueFiles = new Map<string, T>()

  for (const file of files) {
    uniqueFiles.set(file.target ?? file.path, file)
  }

  return Array.from(uniqueFiles.values())
}

function formatTitle(name: string) {
  return name
    .replace(/^c-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getRegistryDependencyName(importPath: string) {
  const parts = importPath.split("/")
  const kind = parts[2]
  const lastPart = parts[parts.length - 1].replace(/\.(?:t|j)sx?$/, "")

  if (parts.length > 4 && kind === "ui") {
    return parts[3]
  }

  return lastPart
}

function sanitizeMeta(meta: ComponentMeta | undefined) {
  if (!meta) {
    return undefined
  }

  const next: NonNullable<ComponentRegistryItem["meta"]> = {}
  if (typeof meta.order === "number") next.order = meta.order
  if (meta.gridSize === 1 || meta.gridSize === 2) next.gridSize = meta.gridSize
  if (meta.previewHeight) next.previewHeight = meta.previewHeight

  return Object.keys(next).length > 0 ? next : undefined
}

async function readComponentMeta(categoryDir: string) {
  const metaPath = path.join(categoryDir, "meta.json")
  try {
    const content = await fs.readFile(metaPath, "utf8")
    const entries = JSON.parse(content) as Array<
      ComponentMeta & { name: string }
    >

    return entries.reduce(
      (acc, entry) => {
        acc[entry.name] = {
          title: entry.title,
          description: entry.description,
          order: entry.order,
          gridSize: entry.gridSize,
          previewHeight: entry.previewHeight,
        }
        return acc
      },
      {} as Record<string, ComponentMeta>
    )
  } catch {
    return {}
  }
}

async function parseComponentFile(
  filePath: string,
  packageDeps: string[],
  componentMeta: ComponentMeta | undefined
) {
  const content = await fs.readFile(filePath, "utf8")
  const registryDependencies = new Set<string>()
  const dependencies = new Set<string>()
  const files = new Map<string, GeneratedRegistryFile>()

  const importRegistryRegex = /from\s+["']@\/registry\/([^"']+)["']/g
  let match: RegExpExecArray | null
  while ((match = importRegistryRegex.exec(content)) !== null) {
    const importPath = match[1]
    const componentName = getRegistryDependencyName(importPath)

    if (componentName !== "utils") {
      registryDependencies.add(componentName)
    }
  }

  const importReuiRegex = /from\s+["']@\/registry-reui\/([^"']+)["']/g
  while ((match = importReuiRegex.exec(content)) !== null) {
    const importPath = match[1]
    const componentName = getRegistryDependencyName(importPath)
    registryDependencies.add(componentName)
  }

  const importSvgRegex = /from\s+["']@\/components\/ui\/svgs\/([^"']+)["']/g
  while ((match = importSvgRegex.exec(content)) !== null) {
    const importPath = match[1]
    const file = createSvgRegistryFile(importPath)
    files.set(file.target, file)
  }

  const importRegex = /from\s+["']([^"']+)["']/g
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1]
    if (
      importPath.startsWith(".") ||
      importPath.startsWith("@/") ||
      importPath.startsWith("/")
    ) {
      continue
    }

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
    title: componentMeta?.title?.trim() || "",
    description: componentMeta?.description?.trim() || "",
    meta: sanitizeMeta(componentMeta),
    registryDependencies: Array.from(registryDependencies).sort(),
    dependencies: Array.from(dependencies).sort(),
    files: Array.from(files.values()),
  }
}

function sortComponentItems(
  a: ComponentRegistryItem,
  b: ComponentRegistryItem
) {
  const categoryA = a.categories[0] ?? ""
  const categoryB = b.categories[0] ?? ""
  if (categoryA !== categoryB) {
    return categoryA.localeCompare(categoryB)
  }

  const orderA = a.meta?.order ?? Number.MAX_SAFE_INTEGER
  const orderB = b.meta?.order ?? Number.MAX_SAFE_INTEGER
  if (orderA !== orderB) {
    return orderA - orderB
  }

  return a.name.localeCompare(b.name, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

function sortComponentFiles(
  files: string[],
  categoryMeta: Record<string, ComponentMeta>
) {
  return [...files].sort((fileA, fileB) => {
    const nameA = fileA.replace(/\.tsx$/, "")
    const nameB = fileB.replace(/\.tsx$/, "")
    const orderA = categoryMeta[nameA]?.order ?? Number.MAX_SAFE_INTEGER
    const orderB = categoryMeta[nameB]?.order ?? Number.MAX_SAFE_INTEGER

    if (orderA !== orderB) {
      return orderA - orderB
    }

    return fileA.localeCompare(fileB, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  })
}

async function generate() {
  const packageDeps = await getPackageDependencies()
  await fs.mkdir(COMPONENTS_METADATA_DIR, { recursive: true })
  await fs.mkdir(COMPONENT_SHARDS_DIR, { recursive: true })
  await fs.rm(GENERATED_COMPONENT_PREVIEW_LOADERS_DIR, {
    recursive: true,
    force: true,
  })
  const bases = (await fs.readdir(BASES_DIR)).filter((entry) => {
    const fullPath = path.join(BASES_DIR, entry)
    return (
      fsSync.statSync(fullPath).isDirectory() &&
      !entry.startsWith(".") &&
      !entry.startsWith("_")
    )
  })

  const globalIndex: Record<string, Record<string, ComponentRegistryItem>> = {}
  const previewLoaderImports: string[] = []

  for (const base of bases) {
    const baseDir = path.join(BASES_DIR, base)
    const componentsDir = path.join(baseDir, "components")
    const categoryRegistryDir = path.join(COMPONENT_SHARDS_DIR, base)
    const componentItems: ComponentRegistryItem[] = []
    if (fsSync.existsSync(componentsDir)) {
      await fs.rm(categoryRegistryDir, { recursive: true, force: true })
      await fs.mkdir(categoryRegistryDir, { recursive: true })
      await fs.mkdir(path.join(GENERATED_COMPONENT_PREVIEW_LOADERS_DIR, base), {
        recursive: true,
      })

      const categories = (await fs.readdir(componentsDir)).filter(
        (category) => {
          const categoryDir = path.join(componentsDir, category)
          return (
            fsSync.statSync(categoryDir).isDirectory() &&
            !category.startsWith("_")
          )
        }
      )
      for (const category of categories) {
        const categoryDir = path.join(componentsDir, category)
        const categoryMeta = await readComponentMeta(categoryDir)
        const allFiles = (await fs.readdir(categoryDir)).filter((file) =>
          file.endsWith(".tsx")
        )
        const files = sortComponentFiles(allFiles, categoryMeta)
        const selectedFiles = files
        const categoryItems: ComponentRegistryItem[] = []
        const previewLoaderEntries: string[] = []

        await fs.rm(path.join(categoryDir, "_loaders.ts"), { force: true })

        for (const file of selectedFiles) {
          const name = file.replace(/\.tsx$/, "")
          const filePath = path.join(categoryDir, file)
          const info = await parseComponentFile(
            filePath,
            packageDeps,
            categoryMeta[name]
          )

          const item = {
            name,
            type: "registry:block",
            title: info.title || info.description || formatTitle(name),
            categories: [category],
            description: info.description || undefined,
            registryDependencies: info.registryDependencies,
            dependencies: info.dependencies,
            files: dedupeFiles([
              {
                path: `components/${category}/${file}`,
                type: "registry:block",
                target: `components/examples/${file}`,
              },
              ...info.files,
            ]),
            meta: info.meta,
          } satisfies ComponentRegistryItem

          componentItems.push(item)
          categoryItems.push(item)
          previewLoaderEntries.push(
            `  "${name}": () => import("@/registry-reui/bases/${base}/components/${category}/${file}"),`
          )
        }

        categoryItems.sort(sortComponentItems)
        await fs.writeFile(
          path.join(categoryRegistryDir, `${category}.json`),
          `${JSON.stringify({ items: categoryItems }, null, 2)}\n`
        )
        await fs.writeFile(
          path.join(
            GENERATED_COMPONENT_PREVIEW_LOADERS_DIR,
            base,
            `${category}.ts`
          ),
          [
            "// Generated by build-components.mts. Category-scoped preview imports only.",
            "",
            "export const componentPreviewLoaders = {",
            ...previewLoaderEntries,
            "} as const",
            "",
          ].join("\n")
        )
        previewLoaderImports.push(
          `  "${base}:${category}": () => import("./${base}/${category}"),`
        )
      }
    }

    componentItems.sort(sortComponentItems)

    await fs.rm(path.join(componentsDir, "_registry"), {
      recursive: true,
      force: true,
    })
    await fs.rm(path.join(componentsDir, "_loaders.ts"), { force: true })
    await fs.rm(path.join(componentsDir, "_registry.ts"), { force: true })
    await fs.rm(path.join(componentsDir, "_category-loaders.ts"), {
      force: true,
    })

    globalIndex[base] = {}
    for (const item of componentItems) {
      globalIndex[base][item.name] = item
    }

    const nameIndex = Object.fromEntries(
      componentItems.map((item) => [item.name, item.categories[0] ?? ""])
    )

    await fs.writeFile(
      path.join(COMPONENT_SHARDS_DIR, base, "name-index.json"),
      `${JSON.stringify(nameIndex, null, 2)}\n`
    )
  }

  await fs.writeFile(
    path.join(GENERATED_COMPONENT_PREVIEW_LOADERS_DIR, "index.ts"),
    [
      "// Generated by build-components.mts. Keeps component preview imports category-scoped.",
      "",
      "type ComponentPreviewLoaderModule = {",
      "  componentPreviewLoaders: Record<string, () => Promise<any>>",
      "}",
      "",
      "export const componentPreviewCategoryLoaders: Record<string, () => Promise<ComponentPreviewLoaderModule>> = {",
      ...previewLoaderImports,
      "}",
      "",
    ].join("\n")
  )

  const existingCategories = await loadExistingCategories()
  const existingCategoriesMap = new Map(
    existingCategories.map((category) => [category.name, category])
  )

  const baseRegistry = globalIndex.base || {}
  let totalComponents = 0
  const componentCounts: Record<string, number> = {}

  for (const [name, item] of Object.entries(baseRegistry)) {
    if (
      item.type !== "registry:block" ||
      !name.startsWith("c-") ||
      name.endsWith("-0")
    ) {
      continue
    }

    totalComponents++
    for (const category of item.categories ?? []) {
      componentCounts[category] = (componentCounts[category] || 0) + 1
    }
  }

  const allCategoryNames = new Set([
    ...existingCategories.map((category) => category.name),
    ...Object.keys(componentCounts),
  ])

  const categoriesArray = Array.from(allCategoryNames)
    .map((categoryName) => {
      const existing = existingCategoriesMap.get(categoryName)
      return {
        name: categoryName,
        label:
          existing?.label ||
          categoryName
            .split("-")
            .map(
              (segment) => segment.charAt(0).toUpperCase() + segment.slice(1)
            )
            .join(" "),
        description: componentizeCatalogText(existing?.description || ""),
        count: componentCounts[categoryName] || 0,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  await fs.rm(path.join(COMPONENTS_METADATA_DIR, "components.json"), {
    force: true,
  })

  await fs.writeFile(
    path.join(COMPONENTS_METADATA_DIR, "registry.json"),
    `${JSON.stringify(
      {
        categories: categoriesArray,
        totalComponents,
      },
      null,
      2
    )}\n`
  )

  console.log("Generated component registry metadata.")
  console.log(`  Total components: ${totalComponents}`)
  console.log(`  Categories: ${categoriesArray.length}`)
}

generate().catch((error) => {
  console.error("Failed to build components registry:", error)
  process.exit(1)
})
