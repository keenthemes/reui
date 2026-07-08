/**
 * build-component-packages.mts
 *
 * Generates `packages/registry/bases/<base>/components/<category>/`
 * workspace packages, each containing all the component previews for one
 * category pre-bundled via esbuild.
 *
 * Source of truth stays in `registry-reui/bases/<base>/components/`.
 * Packages are derived artifacts.
 *
 * Per-package shape:
 *   packages/registry/bases/<base>/components/<category>/
 *     package.json  (name="@reui/components-<base>-<category>")
 *     tsconfig.json
 *     src/index.ts  (export const componentPreviewLoaders = { name: () => import(...) })
 *     dist/index.js (esbuild output: react family externalized)
 *
 * With `--wire-app` the script also rewires
 * `lib/generated/component-preview-loaders/index.ts` so the runtime
 * resolves component categories to these workspace packages.
 *
 * Skip-broken-components: alias-resolution gating — if a component
 * references an `@/components/ui/<missing>` we exclude it from the
 * package rather than breaking the whole chunk.
 */

import {
  build as esbuildBuild,
  context as esbuildContext,
  type BuildContext,
} from "esbuild"
import { promises as fs } from "fs"
import fsSync from "node:fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, "..") // OSS repo root (app + packages)
// OSS is a single standalone app; the registry packages live under the
// repo root, so the workspace root IS the project root.
const WORKSPACE_ROOT = PROJECT_ROOT
const REGISTRY_PACKAGES_ROOT = path.join(
  WORKSPACE_ROOT,
  "packages",
  "registry",
  "bases"
)
const APP_TSCONFIG = path.join(PROJECT_ROOT, "tsconfig.json")
const REGISTRY_DIR = path.join(PROJECT_ROOT, "registry-reui")
const COMPONENT_SHARDS_DIR = path.join(
  REGISTRY_DIR,
  "_meta",
  "components",
  "bases"
)
const COMPONENTS_SRC_DIR_REL = "components" // under bases/<base>/

const GENERATED_COMPONENT_PREVIEW_LOADERS_DIR = path.join(
  PROJECT_ROOT,
  "lib",
  "generated",
  "component-preview-loaders"
)

const SCOPE = "@reui"
const PACKAGE_NAME_PREFIX = "components-"

// Externalize every library the app depends on. Anything that holds
// React Context (nuqs, next/navigation, jotai, radix-ui, next-themes,
// motion, …) MUST share the single instance the app bundles, otherwise
// the bundled copy's provider context never matches the parent's.
const APP_DEPS_MAP: Record<string, string> = (() => {
  try {
    const pkg = JSON.parse(
      fsSync.readFileSync(path.join(PROJECT_ROOT, "package.json"), "utf-8")
    )
    const deps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.peerDependencies ?? {}),
    }
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(deps)) {
      if (k.startsWith("@reui/")) continue
      out[k] = v as string
    }
    return out
  } catch {
    return {}
  }
})()

const APP_PACKAGE_JSON_DEPS = Object.keys(APP_DEPS_MAP)

const EXTERNALS = Array.from(
  new Set([
    "react",
    "react-dom",
    "react/jsx-runtime",
    ...APP_PACKAGE_JSON_DEPS,
    "next/font/google",
    "next/navigation",
    "next/link",
    "next/image",
    "next/script",
    "next/headers",
    "next/cache",
    "next/dynamic",
    "next/server",
    "nuqs/server",
  ])
)

interface ComponentItem {
  name: string
  categories?: string[]
  files?: Array<{ path?: string; target?: string }>
}

interface ComponentEntry {
  base: string
  category: string
  name: string
  importPath: string // @/registry-reui/bases/<base>/components/<category>/<name>.tsx
  fileAbs: string
}

function pkgDir(base: string, category: string) {
  return path.join(REGISTRY_PACKAGES_ROOT, base, "components", category)
}

function pkgName(base: string, category: string) {
  return `${SCOPE}/${PACKAGE_NAME_PREFIX}${base}-${category}`
}

async function collectComponents(): Promise<ComponentEntry[]> {
  const entries: ComponentEntry[] = []
  if (!fsSync.existsSync(COMPONENT_SHARDS_DIR)) return entries
  const bases = await fs.readdir(COMPONENT_SHARDS_DIR)
  for (const base of bases) {
    const baseShardDir = path.join(COMPONENT_SHARDS_DIR, base)
    const stat = await fs.stat(baseShardDir)
    if (!stat.isDirectory()) continue
    const shardFiles = (await fs.readdir(baseShardDir)).filter(
      (f) => f.endsWith(".json") && f !== "name-index.json"
    )
    for (const shardFile of shardFiles) {
      const category = shardFile.replace(/\.json$/, "")
      let items: ComponentItem[] = []
      try {
        const raw = await fs.readFile(
          path.join(baseShardDir, shardFile),
          "utf-8"
        )
        const mod = JSON.parse(raw) as { items?: ComponentItem[] }
        items = Array.isArray(mod.items) ? mod.items : []
      } catch {
        continue
      }
      for (const item of items) {
        // Component source file lives at a fixed convention:
        //   registry-reui/bases/<base>/components/<category>/<name>.tsx
        const fileAbs = path.join(
          REGISTRY_DIR,
          "bases",
          base,
          COMPONENTS_SRC_DIR_REL,
          category,
          `${item.name}.tsx`
        )
        if (!fsSync.existsSync(fileAbs)) continue
        const importPath = `@/registry-reui/bases/${base}/components/${category}/${item.name}.tsx`
        entries.push({ base, category, name: item.name, importPath, fileAbs })
      }
    }
  }
  return entries
}

// ----- Skip-broken-components --------------------------------------------
const LOCAL_UI_DIR = path.join(PROJECT_ROOT, "components", "ui")
const LOCAL_COMPONENTS_DIR = path.join(PROJECT_ROOT, "components")
const LOCAL_LIB_DIR = path.join(PROJECT_ROOT, "lib")
const LOCAL_HOOKS_DIR = path.join(PROJECT_ROOT, "hooks")

function resolveAliasCandidates(importPath: string): string[] {
  if (importPath.startsWith("@/components/ui/")) {
    const tail = importPath.slice("@/components/ui/".length)
    return [
      path.join(LOCAL_UI_DIR, `${tail}.tsx`),
      path.join(LOCAL_UI_DIR, `${tail}.ts`),
      path.join(LOCAL_UI_DIR, tail, "index.tsx"),
      path.join(LOCAL_UI_DIR, tail, "index.ts"),
    ]
  }
  if (importPath.startsWith("@/lib/")) {
    const tail = importPath.slice("@/lib/".length)
    return [
      path.join(LOCAL_LIB_DIR, `${tail}.ts`),
      path.join(LOCAL_LIB_DIR, `${tail}.tsx`),
    ]
  }
  if (importPath.startsWith("@/hooks/")) {
    const tail = importPath.slice("@/hooks/".length)
    return [
      path.join(LOCAL_HOOKS_DIR, `${tail}.ts`),
      path.join(LOCAL_HOOKS_DIR, `${tail}.tsx`),
    ]
  }
  if (importPath.startsWith("@/components/")) {
    const tail = importPath.slice("@/components/".length)
    return [
      path.join(LOCAL_COMPONENTS_DIR, `${tail}.tsx`),
      path.join(LOCAL_COMPONENTS_DIR, `${tail}.ts`),
    ]
  }
  return []
}

async function pathExistsAny(candidates: string[]) {
  for (const p of candidates) {
    try {
      await fs.access(p)
      return true
    } catch {}
  }
  return false
}

async function componentHasUnresolvedAlias(
  fileAbs: string
): Promise<string | null> {
  let source: string
  try {
    source = await fs.readFile(fileAbs, "utf-8")
  } catch {
    return null
  }
  const importRegex = /from\s+["']([^"']+)["']/g
  let m: RegExpExecArray | null
  while ((m = importRegex.exec(source)) !== null) {
    const candidates = resolveAliasCandidates(m[1])
    if (candidates.length === 0) continue
    if (!(await pathExistsAny(candidates))) return m[1]
  }
  return null
}

// ----- Package emission ---------------------------------------------------
async function writePackageScaffold(
  base: string,
  category: string,
  comps: ComponentEntry[]
): Promise<string> {
  const name = pkgName(base, category)
  const dir = pkgDir(base, category)

  await fs.mkdir(path.join(dir, "src"), { recursive: true })

  // Initial package.json with empty `dependencies` — filled in below by
  // `writePackageJsonFromExternals` once esbuild has reported the actual
  // external imports for this package.
  const pkgJson = {
    name,
    version: "0.0.0",
    private: true,
    type: "module",
    main: "./dist/index.js",
    module: "./dist/index.js",
    types: "./dist/index.d.ts",
    sideEffects: false,
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
      },
    },
    dependencies: {} as Record<string, string>,
    peerDependencies: {
      react: ">=18",
      "react-dom": ">=18",
    },
  }
  await fs.writeFile(
    path.join(dir, "package.json"),
    JSON.stringify(pkgJson, null, 2) + "\n"
  )

  await fs.writeFile(
    path.join(dir, "tsconfig.json"),
    JSON.stringify(
      {
        extends: path.relative(dir, APP_TSCONFIG).replace(/\\/g, "/"),
        compilerOptions: {
          rootDir: "./src",
          outDir: "./dist",
          noEmit: true,
        },
        include: ["src"],
      },
      null,
      2
    ) + "\n"
  )

  const sorted = [...comps].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  )
  // Export key is `componentPreviewLoaders` to match what the runtime
  // (lib/component-preview-loader.ts) already expects when reading the
  // resolved module. No adapter layer needed.
  const indexBody = [
    "// Generated by build-component-packages.mts. Do not edit by hand.",
    "// Lazy-import map of every component preview in this category.",
    "",
    "export const componentPreviewLoaders = {",
    ...sorted.map((c) => `  "${c.name}": () => import("${c.importPath}"),`),
    "} as const",
    "",
    "export type ComponentName = keyof typeof componentPreviewLoaders",
    "",
  ].join("\n")
  await fs.writeFile(path.join(dir, "src", "index.ts"), indexBody)

  await fs.writeFile(
    path.join(dir, ".gitignore"),
    ["dist/", "node_modules/", ""].join("\n")
  )

  return dir
}

// Anything inside the app that isn't registry-reui source is treated as
// host infrastructure: shadcn UI kit, lib helpers, icon placeholder,
// hooks, etc. These get marked external so the bundled dist references
// them by their @/ alias; the app's webpack/turbopack resolves them
// from its own source at consume time. Without this, every package
// would carry a duplicate copy of IconPlaceholder, the ui kit, and so on
// — and dynamic imports like `import(\`./__${lib}__\`)` get turned into
// empty __glob({}) maps that fail at runtime.
const HOST_ALIAS_PREFIXES = [
  "@/registry/",
  "@/app/",
  "@/lib/",
  "@/hooks/",
  "@/components/",
]

const externalizeHostAliasesPlugin = {
  name: "externalize-host-aliases",
  setup(build: any) {
    build.onResolve({ filter: /^@\// }, (args: any) => {
      if (HOST_ALIAS_PREFIXES.some((p) => args.path.startsWith(p))) {
        return { path: args.path, external: true }
      }
      return undefined
    })
  },
}

function makeEsbuildOptions(dir: string) {
  return {
    entryPoints: [path.join(dir, "src", "index.ts")],
    bundle: true,
    format: "esm" as const,
    target: "es2022" as const,
    platform: "browser" as const,
    jsx: "automatic" as const,
    jsxDev: false,
    outfile: path.join(dir, "dist", "index.js"),
    tsconfig: APP_TSCONFIG,
    absWorkingDir: PROJECT_ROOT,
    external: EXTERNALS,
    plugins: [externalizeHostAliasesPlugin],
    loader: { ".css": "empty" } as const,
    logLevel: "silent" as const,
    legalComments: "none" as const,
    metafile: true,
  }
}

// Walk a bare import specifier back to its npm package name.
//   "@radix-ui/react-dialog/foo" → "@radix-ui/react-dialog"
//   "next/font/google"           → "next"
//   "lucide-react"               → "lucide-react"
function specifierToPackageName(spec: string): string | null {
  if (!spec) return null
  if (spec.startsWith("@/")) return null
  if (spec.startsWith(".") || spec.startsWith("/")) return null
  if (spec.startsWith("@")) {
    const parts = spec.split("/")
    if (parts.length < 2) return null
    return `${parts[0]}/${parts[1]}`
  }
  return spec.split("/")[0]
}

// Re-parse the dist file to find every `import ... from "<spec>"` and
// every `import("<spec>")` — that's the ground truth for runtime deps.
async function extractExternalDeps(distPath: string): Promise<Set<string>> {
  const code = await fs.readFile(distPath, "utf-8")
  const deps = new Set<string>()
  const re = /(?:from|import)\s*\(?\s*["']([^"']+)["']\s*\)?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(code))) {
    const pkg = specifierToPackageName(m[1])
    if (pkg) deps.add(pkg)
  }
  return deps
}

async function writePackageJsonFromExternals(
  dir: string,
  specs: Set<string>
): Promise<number> {
  const pkgJsonPath = path.join(dir, "package.json")
  const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))
  const dependencies: Record<string, string> = {}
  for (const spec of specs) {
    if (spec === "react" || spec === "react-dom") continue
    if (spec.startsWith("react/")) continue
    const version = APP_DEPS_MAP[spec]
    if (!version) continue
    dependencies[spec] = version
  }
  pkgJson.dependencies = Object.fromEntries(
    Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b))
  )
  await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n")
  return Object.keys(dependencies).length
}

async function buildPackage(
  dir: string
): Promise<{ outSize: number; depCount: number }> {
  const distDir = path.join(dir, "dist")
  await fs.rm(distDir, { recursive: true, force: true })
  const result = await esbuildBuild(makeEsbuildOptions(dir))
  let outSize = 0
  let outPath = ""
  for (const f of Object.keys(result.metafile?.outputs ?? {})) {
    outSize += result.metafile?.outputs[f]?.bytes ?? 0
    if (f.endsWith("index.js")) outPath = f
  }
  const absOut = path.isAbsolute(outPath)
    ? outPath
    : path.join(PROJECT_ROOT, outPath)
  const specs = await extractExternalDeps(absOut)
  const depCount = await writePackageJsonFromExternals(dir, specs)
  return { outSize, depCount }
}

async function createWatchContext(
  dir: string,
  label: string
): Promise<BuildContext> {
  const distDir = path.join(dir, "dist")
  await fs.rm(distDir, { recursive: true, force: true })
  const opts = makeEsbuildOptions(dir)
  return await esbuildContext({
    ...opts,
    plugins: [
      ...(opts.plugins ?? []),
      {
        name: "watch-logger",
        setup(build) {
          let firstBuild = true
          build.onEnd((result) => {
            if (firstBuild) {
              firstBuild = false
              return
            }
            const errors = result.errors?.length ?? 0
            const t = new Date().toLocaleTimeString()
            if (errors > 0) {
              console.error(`  [${t}] ✗ ${label} — ${errors} error(s)`)
              for (const err of result.errors ?? []) {
                console.error(`    ${err.text}`)
              }
            } else {
              console.log(`  [${t}] ↻ ${label}`)
            }
          })
        },
      },
    ],
  })
}

// ----- App wiring ---------------------------------------------------------
async function regenerateAppLoadersIndex(
  categoryToPackage: Map<string, string> // "base:category" -> pkgName
) {
  // Wipe stale per-source loader files. The categoryLoaders index is
  // regenerated below; per-base directories under it are no longer
  // needed (they've moved into the workspace packages).
  if (fsSync.existsSync(GENERATED_COMPONENT_PREVIEW_LOADERS_DIR)) {
    for (const entry of await fs.readdir(GENERATED_COMPONENT_PREVIEW_LOADERS_DIR)) {
      const p = path.join(GENERATED_COMPONENT_PREVIEW_LOADERS_DIR, entry)
      const s = await fs.stat(p)
      if (s.isDirectory()) await fs.rm(p, { recursive: true, force: true })
    }
  } else {
    await fs.mkdir(GENERATED_COMPONENT_PREVIEW_LOADERS_DIR, { recursive: true })
  }

  const lines: string[] = []
  for (const key of Array.from(categoryToPackage.keys()).sort()) {
    const pkg = categoryToPackage.get(key)!
    lines.push(`  "${key}": () => import("${pkg}"),`)
  }
  const body = [
    "// Generated by build-component-packages.mts. Maps base:category -> workspace package.",
    "//",
    "// Each package ships a pre-built ESM bundle of its components so",
    "// the app's webpack/turbopack graph never compiles component source.",
    "",
    "type ComponentPreviewLoaderModule = {",
    "  componentPreviewLoaders: Record<string, () => Promise<any>>",
    "}",
    "",
    "export const componentPreviewCategoryLoaders: Record<",
    "  string,",
    "  () => Promise<ComponentPreviewLoaderModule>",
    "> = {",
    ...lines,
    "}",
    "",
  ].join("\n")
  await fs.writeFile(
    path.join(GENERATED_COMPONENT_PREVIEW_LOADERS_DIR, "index.ts"),
    body
  )
}

async function syncAppPackageDeps(packageNames: string[]) {
  const pkgJsonPath = path.join(PROJECT_ROOT, "package.json")
  const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))
  pkgJson.dependencies = pkgJson.dependencies || {}
  const wanted = new Set(packageNames)
  for (const k of Object.keys(pkgJson.dependencies)) {
    if (k.startsWith(`${SCOPE}/${PACKAGE_NAME_PREFIX}`) && !wanted.has(k)) {
      delete pkgJson.dependencies[k]
    }
  }
  for (const name of packageNames) {
    pkgJson.dependencies[name] = "workspace:*"
  }
  pkgJson.dependencies = Object.fromEntries(
    Object.entries(pkgJson.dependencies).sort(([a], [b]) => a.localeCompare(b))
  )
  await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n")
}

// ----- Main ----------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2)
  const wireApp = args.includes("--wire-app")
  const watchMode = args.includes("--watch")
  const onlyKey = args.find((a) => !a.startsWith("--")) // optional: "<base>/<category>"
  console.log(
    `📦 Building component packages${onlyKey ? ` (filter: ${onlyKey})` : ""}${
      wireApp ? "" : " (skeleton mode — pass --wire-app to rewire the app)"
    }`
  )

  const all = await collectComponents()

  const grouped = new Map<string, ComponentEntry[]>()
  const skipped: Array<{ component: string; missing: string }> = []

  for (const c of all) {
    const key = `${c.base}/${c.category}`
    if (onlyKey && !key.startsWith(onlyKey)) continue
    const missing = await componentHasUnresolvedAlias(c.fileAbs)
    if (missing) {
      skipped.push({ component: `${c.base}/${c.name}`, missing })
      continue
    }
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(c)
  }

  console.log(
    `   Scanned ${all.length} components, ${grouped.size} (base,category) groups`
  )
  if (skipped.length > 0) {
    console.warn(
      `   ⚠  Skipped ${skipped.length} component(s) with unresolved local imports`
    )
    for (const s of skipped.slice(0, 10)) {
      console.warn(`      • ${s.component} — missing ${s.missing}`)
    }
    if (skipped.length > 10)
      console.warn(`      … and ${skipped.length - 10} more`)
  }

  await fs.mkdir(REGISTRY_PACKAGES_ROOT, { recursive: true })

  const categoryToPackage = new Map<string, string>() // "base:category" -> pkgName
  const packageNames: string[] = []
  const watchContexts: Array<{ name: string; ctx: BuildContext }> = []
  let totalBytes = 0
  const t0 = Date.now()

  for (const [key, comps] of grouped) {
    const [base, category] = key.split("/")
    const name = pkgName(base, category)
    packageNames.push(name)

    const dir = await writePackageScaffold(base, category, comps)

    if (watchMode) {
      const ctx = await createWatchContext(dir, name)
      const initial = await ctx.rebuild()
      let outSize = 0
      let outPath = ""
      for (const f of Object.keys(initial.metafile?.outputs ?? {})) {
        outSize += initial.metafile?.outputs[f]?.bytes ?? 0
        if (f.endsWith("index.js")) outPath = f
      }
      const absOut = path.isAbsolute(outPath)
        ? outPath
        : path.join(PROJECT_ROOT, outPath)
      const specs = await extractExternalDeps(absOut)
      const depCount = await writePackageJsonFromExternals(dir, specs)
      totalBytes += outSize
      watchContexts.push({ name, ctx })
      console.log(
        `   ✅ ${name}  (${comps.length} components, ${(outSize / 1024).toFixed(1)} KB, ${depCount} deps)  [watching]`
      )
    } else {
      const { outSize, depCount } = await buildPackage(dir)
      totalBytes += outSize
      console.log(
        `   ✅ ${name}  (${comps.length} components, ${(outSize / 1024).toFixed(1)} KB, ${depCount} deps)`
      )
    }

    categoryToPackage.set(`${base}:${category}`, name)
  }

  if (wireApp) {
    await regenerateAppLoadersIndex(categoryToPackage)
    if (!onlyKey) await syncAppPackageDeps(packageNames)
    console.log(
      "\n   🔗 Rewired lib/generated/component-preview-loaders/index.ts to packages"
    )
    if (!onlyKey) {
      console.log("   🔗 Updated package.json with workspace deps")
    }
  } else {
    console.log(
      "\n   ℹ  Packages built but the app is NOT rewired. Re-run with --wire-app."
    )
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  console.log(
    `\n📊 Built ${packageNames.length} component packages, ${
      (totalBytes / 1024 / 1024).toFixed(1)
    } MB total, in ${elapsed}s`
  )

  if (watchMode) {
    await Promise.all(watchContexts.map(({ ctx }) => ctx.watch()))
    console.log(
      `\n👀 watching registry-reui/bases/**/components/** (Ctrl-C to stop)`
    )
    const shutdown = async () => {
      console.log("\nstopping watchers…")
      await Promise.all(
        watchContexts.map(({ ctx }) =>
          ctx.dispose().catch(() => undefined)
        )
      )
      process.exit(0)
    }
    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)
    await new Promise<void>(() => undefined)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
