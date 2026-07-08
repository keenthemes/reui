import * as React from "react"

import { componentPreviewCategoryLoaders } from "@/lib/generated/component-preview-loaders"

function normalizeComponentSegment(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-")
}

/**
 * Bounded LRU caches.
 *
 * At 10k components across hundreds of categories, unbounded caches
 * would pin every visited preview's bundle in memory. The user only
 * sees a handful at a time, so we evict by recency.
 */
const MAX_PREVIEW_LAZIES = 256
const MAX_CATEGORY_LOADERS = 64

const componentPreviewCache = new Map<string, React.LazyExoticComponent<any>>()
const componentPreviewLoaderCache = new Map<
  string,
  Promise<{
    componentPreviewLoaders: Record<string, () => Promise<any>>
  }>
>()

function touchLRU<K, V>(map: Map<K, V>, key: K, max: number) {
  const value = map.get(key)
  if (value !== undefined) {
    map.delete(key)
    map.set(key, value)
  }
  while (map.size > max) {
    const oldest = map.keys().next().value
    if (oldest === undefined) break
    map.delete(oldest)
  }
}

const MAX_CONCURRENT_IMPORTS = 6
let activeImports = 0
const importQueue: Array<{
  resolve: (mod: any) => void
  reject: (err: any) => void
  loader: () => Promise<any>
}> = []

function flushImportQueue() {
  while (activeImports < MAX_CONCURRENT_IMPORTS && importQueue.length > 0) {
    const next = importQueue.shift()!
    activeImports++
    next
      .loader()
      .then(next.resolve, next.reject)
      .finally(() => {
        activeImports--
        flushImportQueue()
      })
  }
}

function throttledImport(loader: () => Promise<any>): Promise<any> {
  if (activeImports < MAX_CONCURRENT_IMPORTS) {
    activeImports++
    return loader().finally(() => {
      activeImports--
      flushImportQueue()
    })
  }

  return new Promise((resolve, reject) => {
    importQueue.push({ resolve, reject, loader })
  })
}

function loadComponentPreviewLoader(
  base: string,
  category: string
): Promise<{
  componentPreviewLoaders: Record<string, () => Promise<any>>
}> {
  const loaderKey = `${base}:${category}`
  const existingPromise = componentPreviewLoaderCache.get(loaderKey)

  if (existingPromise) {
    touchLRU(componentPreviewLoaderCache, loaderKey, MAX_CATEGORY_LOADERS)
    return existingPromise
  }

  const loader = componentPreviewCategoryLoaders[loaderKey]

  if (!loader) {
    return Promise.reject(
      new Error(`Component preview category loader not found for ${loaderKey}`)
    )
  }

  const nextPromise = throttledImport(loader).catch((error) => {
    componentPreviewLoaderCache.delete(loaderKey)
    throw error
  })

  componentPreviewLoaderCache.set(loaderKey, nextPromise)
  touchLRU(componentPreviewLoaderCache, loaderKey, MAX_CATEGORY_LOADERS)
  return nextPromise
}

export function getComponentPreviewComponent(
  base: string,
  name: string,
  category?: string
): React.LazyExoticComponent<any> | null {
  const normalizedCategory = category
    ? normalizeComponentSegment(category)
    : undefined

  if (!normalizedCategory) {
    return null
  }

  const cacheKey = `${base}:${normalizedCategory}:${name}`
  if (componentPreviewCache.has(cacheKey)) {
    const existing = componentPreviewCache.get(cacheKey)!
    touchLRU(componentPreviewCache, cacheKey, MAX_PREVIEW_LAZIES)
    return existing
  }

  const lazyComponent = React.lazy(() =>
    loadComponentPreviewLoader(base, normalizedCategory).then((mod) => {
      const loader = mod.componentPreviewLoaders[name]

      if (!loader) {
        throw new Error(
          `Component preview loader not found for ${base}/${normalizedCategory}/${name}`
        )
      }

      return throttledImport(() => loader())
    })
  )

  componentPreviewCache.set(cacheKey, lazyComponent)
  touchLRU(componentPreviewCache, cacheKey, MAX_PREVIEW_LAZIES)
  return lazyComponent
}
