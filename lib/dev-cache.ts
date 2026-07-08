/**
 * Persist expensive data across Next.js dev-mode module re-evaluations.
 *
 * In development, Next.js re-evaluates server modules on every request,
 * which destroys module-level `let` caches and forces re-parsing of large
 * JSON files (seo.json, component shards, etc.).
 *
 * `globalThis` survives across re-evaluations, so we store caches there.
 * In production builds this is a plain one-shot cache (modules only
 * evaluate once anyway).
 *
 * This file is safe to import from both server and client code.
 * For fs-based JSON reading, use `lib/dev-cache.server.ts` instead.
 */

const g = globalThis as unknown as {
  __reui_dev_cache?: Map<string, unknown>
}

function getStore(): Map<string, unknown> {
  if (!g.__reui_dev_cache) {
    g.__reui_dev_cache = new Map()
  }
  return g.__reui_dev_cache
}

/**
 * Return a cached value, computing it once via `init` if absent.
 */
export function devCached<T>(key: string, init: () => T): T {
  const store = getStore()
  if (!store.has(key)) {
    store.set(key, init())
  }
  return store.get(key) as T
}
