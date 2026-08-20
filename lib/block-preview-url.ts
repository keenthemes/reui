import { getSiteUrl, normalizeAbsoluteUrl } from "@/lib/site-url"

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "")
}

function sameOriginPreviewOrigin() {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  if (process.env.NODE_ENV === "development") {
    // `NEXT_PUBLIC_WEB_URL` is canonical; legacy `NEXT_PUBLIC_APP_URL`
    // alias kept for back-compat.
    const appUrl = (
      process.env.NEXT_PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_APP_URL
    )?.trim()
    return appUrl ? normalizeAbsoluteUrl(appUrl) : "http://localhost:1000"
  }

  return getSiteUrl()
}

// Design-system param keys the embedded preview's provider reads from the URL
// (mirrors the keys in BlockPreviewDesignSystemProvider). Serialized in this
// FIXED order so a server-rendered prefetch URL and the client iframe `src`
// byte-match (same HTTP cache entry) for the common default-config visit.
export const BLOCK_PREVIEW_DESIGN_PARAM_KEYS = [
  "base",
  "style",
  "theme",
  "font",
  "fontHeading",
  "chartColor",
  "baseColor",
  "menuAccent",
  "menuColor",
  "radius",
  "iconLibrary",
] as const

export interface BlockPreviewPathOptions {
  embed?: boolean
  /**
   * Design params baked into the URL query. The embedded
   * `BlockPreviewDesignSystemProvider` reads these from `window.location.search`
   * on its FIRST client render, so the block paints with the right style
   * immediately - no cross-frame `design-system-params` postMessage round-trip
   * on the critical path. Live customizer changes still flow through
   * postMessage; callers pass a FROZEN snapshot so the `src` stays stable
   * (a changing src would reload the iframe).
   */
  designParams?: Readonly<Record<string, unknown>>
}

function buildBlockPreviewQuery(options: BlockPreviewPathOptions): string {
  const search = new URLSearchParams()

  if (options.embed) {
    search.set("embed", "1")
  }

  if (options.designParams) {
    // Only the known design keys, and only non-empty string values - so a full
    // config object (which may carry non-string fields like `rtl`/`pointer`)
    // can be passed directly without leaking them into the URL.
    for (const key of BLOCK_PREVIEW_DESIGN_PARAM_KEYS) {
      const value = options.designParams[key]
      if (typeof value === "string" && value) {
        search.set(key, value)
      }
    }
  }

  const queryString = search.toString()
  return queryString ? `?${queryString}` : ""
}

export function getBlockPreviewPath(
  base: string,
  name: string,
  options: BlockPreviewPathOptions = {}
) {
  return `/preview/${encodeURIComponent(base)}/${encodeURIComponent(name)}${buildBlockPreviewQuery(options)}`
}

export function getBlocksPreviewPath(base: string, category?: string) {
  const basePath = `/preview/${encodeURIComponent(base)}/blocks`

  return category ? `${basePath}/${encodeURIComponent(category)}` : basePath
}

export function getExternalBlockPreviewOrigin() {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_BLOCK_PREVIEW_ORIGIN?.trim() ||
    process.env.NEXT_PUBLIC_REGISTRY_PREVIEW_ORIGIN?.trim()

  if (configuredOrigin) {
    return trimTrailingSlash(normalizeAbsoluteUrl(configuredOrigin))
  }

  return null
}

function getBlockPreviewOrigin() {
  return (
    getExternalBlockPreviewOrigin() ||
    trimTrailingSlash(sameOriginPreviewOrigin())
  )
}

export function getAllowedBlockPreviewOrigins() {
  if (typeof window === "undefined") {
    return []
  }

  const origins = new Set<string>([window.location.origin])
  const previewOrigin = getBlockPreviewOrigin()

  if (previewOrigin) {
    try {
      origins.add(new URL(previewOrigin).origin)
    } catch {
      // Ignore invalid env values and fall back to same-origin checks.
    }
  }

  return Array.from(origins)
}

export function isAllowedBlockPreviewMessageOrigin(origin: string) {
  return getAllowedBlockPreviewOrigins().includes(origin)
}

export function getExternalBlockPreviewUrl(
  base: string,
  name: string,
  options: { embed?: boolean } = {}
) {
  const origin = getExternalBlockPreviewOrigin()

  if (!origin) {
    return null
  }

  return `${origin}${getBlockPreviewPath(base, name, options)}`
}

export function getBlockPreviewUrl(
  base: string,
  name: string,
  options: { embed?: boolean } = {}
) {
  return `${getBlockPreviewOrigin()}${getBlockPreviewPath(base, name, options)}`
}

export function getBlocksPreviewUrl(base: string, category?: string) {
  const origin = getBlockPreviewOrigin()
  const path = getBlocksPreviewPath(base, category)

  return `${origin}${path}`
}
