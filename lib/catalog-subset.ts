import { normalizeSlug } from "@/lib/utils"

export interface RegistryComponentLike {
  name: string
  categories?: string[]
}

export function isSmokeSubsetEnabled() {
  return false
}

export function isComponentSmokeSubsetEnabled() {
  return false
}

export function filterComponentManifest<T extends RegistryComponentLike>(
  items: T[]
): T[] {
  return items
}

export function getComponentSubsetCategoryOrder(
  items: RegistryComponentLike[]
) {
  const categories = new Set<string>()

  for (const item of items) {
    const itemCategories = item.categories ?? []

    for (const category of itemCategories) {
      categories.add(normalizeSlug(category))
    }
  }

  return categories
}

/** @deprecated Use RegistryComponentLike. */
export type RegistryPatternLike = RegistryComponentLike
/** @deprecated Use isComponentSmokeSubsetEnabled. */
export const isPatternSmokeSubsetEnabled = isComponentSmokeSubsetEnabled
/** @deprecated Use filterComponentManifest. */
export const filterPatternManifest = filterComponentManifest
/** @deprecated Use getComponentSubsetCategoryOrder. */
export const getPatternSubsetCategoryOrder = getComponentSubsetCategoryOrder
