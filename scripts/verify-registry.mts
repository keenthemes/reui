/// <reference types="node" />

/**
 * verify-registry.mts
 *
 * Production gate for the generated ReUI registry. Runs LAST in registry:all,
 * after registry:build (-> public/r/styles), and fails the build (exit 1) if
 * the shipped output is not valid for consumers.
 *
 * What it checks per shipped registry item (public/r/styles/{style}/*.json):
 *   1. Valid JSON + required shadcn fields (name, type, files[]).
 *   2. Every file entry has non-empty string content.
 *   3. No untransformed internals leaked into shipped content (registry import
 *      paths or style-*: tokens) - these would not resolve in a consumer app.
 *   4. dependencies / registryDependencies are arrays of non-empty strings.
 *   5. DEPENDENCY COMPLETENESS: every npm package the item's files import is
 *      declared in `dependencies` (or is a framework-scaffold package every
 *      consumer already has). This catches items that `shadcn add` would
 *      install broken because an imported package is never installed - exactly
 *      the class of bug where `next-themes` was silently dropped.
 *
 * Cross-style invariant:
 *   6. base-nova and radix-nova serve the SAME c-* example set (registry:block
 *      items), so the example preview "Copy AI prompt" install guide
 *      (r/<style>/<name>.json, aligned to the shown base) resolves for both the
 *      base and radix versions.
 *
 * Note: the scaffold allowlist below is intentionally INDEPENDENT of the build
 * scripts' COMMON_PACKAGES. If a build script ever wrongly excludes a real
 * add-on dependency from an item's `dependencies`, this gate still flags it,
 * because the package is imported, absent from `dependencies`, and not a
 * genuine framework-scaffold package.
 */

import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, "..")
const STYLES_DIR = path.join(PROJECT_ROOT, "public", "r", "styles")

// Packages a Next.js + shadcn consumer is guaranteed to already have, so a
// registry item may import them without declaring them in `dependencies`.
// Keep MINIMAL - only true framework scaffold / peers. See the file header.
const SCAFFOLD_PACKAGES = new Set([
  "react",
  "react-dom",
  "next",
  "@types/react",
  "@types/react-dom",
])

type RegistryFile = { path?: string; content?: unknown }
type RegistryItem = {
  name?: unknown
  type?: unknown
  files?: RegistryFile[]
  dependencies?: unknown
  registryDependencies?: unknown
}

/** Resolve an import specifier to its npm package name, or null if it is not a
 *  bare npm import (relative, alias, or a Node built-in). */
function packageNameFromImport(specifier: string): string | null {
  if (
    specifier.startsWith(".") ||
    specifier.startsWith("/") ||
    specifier.startsWith("@/") ||
    specifier.startsWith("node:")
  ) {
    return null
  }
  if (specifier.startsWith("@")) {
    const parts = specifier.split("/")
    return parts.length >= 2 ? parts.slice(0, 2).join("/") : null
  }
  return specifier.split("/")[0] || null
}

/** Every npm package specifier imported (statically, dynamically, or via
 *  require / side-effect) from a file's content. */
function collectImportedPackages(content: string): Set<string> {
  const packages = new Set<string>()
  const patterns = [
    /\bfrom\s+["']([^"']+)["']/g, // import/export ... from "x"
    /\bimport\s+["']([^"']+)["']/g, // side-effect import "x"
    /\bimport\(\s*["']([^"']+)["']\s*\)/g, // dynamic import("x")
    /\brequire\(\s*["']([^"']+)["']\s*\)/g, // require("x")
  ]
  for (const pattern of patterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(content)) !== null) {
      const name = packageNameFromImport(match[1] ?? "")
      if (name) packages.add(name)
    }
  }
  return packages
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === "string" && entry.trim().length > 0)
  )
}

async function main() {
  const startTime = Date.now()
  const errors: string[] = []
  let itemCount = 0

  // c-* example-set alignment between the two canonical install styles. The
  // example preview "Copy AI prompt" button points the agent at
  // r/<style>/<name>.json for whichever design base it shows (base ->
  // base-nova, radix -> radix-nova). An example served in one style but not the
  // other would hand the user a 404 install guide for that base, so we assert
  // both styles carry the SAME c-* example set (registry:block items).
  const ALIGN_STYLES = ["base-nova", "radix-nova"] as const
  const examplesByStyle = new Map<string, Set<string>>(
    ALIGN_STYLES.map((style) => [style, new Set<string>()])
  )

  let styleDirs: string[]
  try {
    styleDirs = (await fs.readdir(STYLES_DIR, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  } catch {
    console.error(
      `verify-registry: ${STYLES_DIR} not found. Run registry:build first.`
    )
    process.exit(1)
  }

  for (const styleName of styleDirs) {
    const styleDir = path.join(STYLES_DIR, styleName)
    const files = (await fs.readdir(styleDir)).filter((f) =>
      f.endsWith(".json")
    )

    for (const entry of files) {
      // index.json is a style/aggregate listing and registry.json is the
      // per-style catalog manifest. Neither is an installable registry item,
      // so we only sanity-check that they parse as JSON.
      if (entry === "index.json" || entry === "registry.json") {
        try {
          JSON.parse(await fs.readFile(path.join(styleDir, entry), "utf-8"))
        } catch (error) {
          errors.push(`${styleName}/${entry}: invalid JSON (${String(error)})`)
        }
        continue
      }

      const id = `${styleName}/${entry}`
      let item: RegistryItem
      try {
        item = JSON.parse(
          await fs.readFile(path.join(styleDir, entry), "utf-8")
        )
      } catch (error) {
        errors.push(`${id}: invalid JSON (${String(error)})`)
        continue
      }
      itemCount++

      if (typeof item.name !== "string" || typeof item.type !== "string") {
        errors.push(`${id}: missing or invalid "name"/"type"`)
      }

      // Record c-* examples (typed registry:block) for the cross-style
      // alignment check after the loop.
      if (
        item.type === "registry:block" &&
        typeof item.name === "string" &&
        examplesByStyle.has(styleName)
      ) {
        examplesByStyle.get(styleName)!.add(item.name)
      }
      if (
        item.dependencies !== undefined &&
        !isStringArray(item.dependencies)
      ) {
        errors.push(
          `${id}: "dependencies" is not an array of non-empty strings`
        )
      }
      if (
        item.registryDependencies !== undefined &&
        !isStringArray(item.registryDependencies)
      ) {
        errors.push(
          `${id}: "registryDependencies" is not an array of non-empty strings`
        )
      }

      const declaredDeps = new Set(
        isStringArray(item.dependencies) ? item.dependencies : []
      )

      if (!Array.isArray(item.files)) {
        errors.push(`${id}: missing "files" array`)
        continue
      }

      const missingDeps = new Set<string>()
      for (const file of item.files) {
        const content = file?.content
        if (typeof content !== "string" || content.length === 0) {
          errors.push(`${id}: file "${file?.path}" has no content`)
          continue
        }

        // Internals that should have been rewritten before shipping.
        if (
          /@\/registry-reui\//.test(content) ||
          /@\/registry\/bases\//.test(content)
        ) {
          errors.push(`${id}: file "${file.path}" leaks a registry import path`)
        }
        if (/\bstyle-(?:vega|nova|maia|lyra|mira|luma|sera|rhea):/.test(content)) {
          errors.push(`${id}: file "${file.path}" leaks a style-*: token`)
        }

        // Dependency completeness.
        for (const pkg of collectImportedPackages(content)) {
          if (SCAFFOLD_PACKAGES.has(pkg)) continue
          if (!declaredDeps.has(pkg)) missingDeps.add(pkg)
        }
      }

      if (missingDeps.size > 0) {
        errors.push(
          `${id}: imports not declared in "dependencies": ${[...missingDeps]
            .sort()
            .join(", ")}`
        )
      }
    }
  }

  // base-nova / radix-nova must serve the SAME c-* example set, so the example
  // preview "Copy AI prompt" install guide resolves for whichever base it shows.
  const baseExamples = examplesByStyle.get("base-nova")!
  const radixExamples = examplesByStyle.get("radix-nova")!
  const onlyBase = [...baseExamples].filter((n) => !radixExamples.has(n)).sort()
  const onlyRadix = [...radixExamples].filter((n) => !baseExamples.has(n)).sort()
  const preview = (names: string[]) =>
    `${names.slice(0, 20).join(", ")}${names.length > 20 ? ", ..." : ""}`
  if (onlyBase.length > 0) {
    errors.push(
      `base/radix install misalignment: ${onlyBase.length} example(s) built for base-nova but not radix-nova (the radix AI-prompt install guide would 404): ${preview(onlyBase)}`
    )
  }
  if (onlyRadix.length > 0) {
    errors.push(
      `base/radix install misalignment: ${onlyRadix.length} example(s) built for radix-nova but not base-nova (the base AI-prompt install guide would 404): ${preview(onlyRadix)}`
    )
  }
  console.log(
    `verify-registry: base/radix c-* example-set alignment: base-nova ${baseExamples.size}, radix-nova ${radixExamples.size}, ${onlyBase.length + onlyRadix.length} mismatched`
  )

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(
    `verify-registry: checked ${itemCount} registry items across ${styleDirs.length} styles in ${elapsed}s`
  )

  if (errors.length > 0) {
    console.error(`verify-registry: FAILED with ${errors.length} issue(s):`)
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
  }

  console.log("verify-registry: all registry items are valid for production")
}

main().catch((error) => {
  console.error("verify-registry: fatal error:", error)
  process.exit(1)
})
