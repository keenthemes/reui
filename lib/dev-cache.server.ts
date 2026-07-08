import "server-only"

/**
 * Server-only helpers that read JSON via `fs` (invisible to Turbopack).
 *
 * Using `fs.readFileSync` instead of `require()` is critical because
 * Turbopack statically traces every `require()` — even inside lazy
 * functions — and compiles each target as a module. With 70+ category
 * JSON shards + large manifests, this caused 4.8 min compilation times.
 * `fs` reads are invisible to the bundler.
 */

import fs from "node:fs"
import path from "node:path"

/** Resolve a path relative to the project root (process.cwd()). */
export function projectPath(...segments: string[]): string {
  return path.join(/* turbopackIgnore: true */ process.cwd(), ...segments)
}

const g = globalThis as unknown as {
  __reui_dev_file_cache?: Map<
    string,
    {
      mtimeMs: number
      size: number
      value: unknown
    }
  >
}

function getFileStore() {
  if (!g.__reui_dev_file_cache) {
    g.__reui_dev_file_cache = new Map()
  }
  return g.__reui_dev_file_cache
}

/**
 * Read and parse a JSON file using `fs` (invisible to Turbopack),
 * cached in `globalThis` so repeated requests avoid reparsing large shards.
 *
 * The cache is invalidated by file mtime/size. This keeps dev browsing fast
 * while still reflecting generated registry updates without restarting Next.
 */
export function readJsonCached<T>(cacheKey: string, filePath: string): T {
  const stat = fs.statSync(filePath)
  const store = getFileStore()
  const cached = store.get(cacheKey)

  if (
    cached &&
    cached.mtimeMs === stat.mtimeMs &&
    cached.size === stat.size
  ) {
    return cached.value as T
  }

  const raw = fs.readFileSync(filePath, "utf-8")
  const value = JSON.parse(raw) as T

  store.set(cacheKey, {
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    value,
  })

  return value
}
