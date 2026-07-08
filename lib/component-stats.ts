import { isComponentSmokeSubsetEnabled } from "@/lib/catalog-subset"
import { getFilteredComponentManifest } from "@/lib/component-manifest.server"
import { projectPath, readJsonCached } from "@/lib/dev-cache.server"
import { normalizeSlug } from "@/lib/utils"

export interface ComponentCategoryInfo {
  name: string
  slug: string
  label: string
  description: string
  count: number
}

interface ComponentStatsData {
  categories: Array<{
    name: string
    label: string
    description: string
    count: number
  }>
  totalPatterns: number
  totalComponents?: number
}

function getComponentStats(): ComponentStatsData {
  const baseStats = readJsonCached<ComponentStatsData>(
    "component-registry-json",
    projectPath("registry-reui", "_meta", "components", "registry.json")
  )

  if (!isComponentSmokeSubsetEnabled()) {
    return baseStats
  }

  const filteredComponents = getFilteredComponentManifest()

  const categoryCounts = new Map<string, number>()

  for (const component of filteredComponents) {
    const categories = new Set(
      (component.categories ?? []).map((category) => normalizeSlug(category))
    )

    for (const category of categories) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1)
    }
  }

  return {
    categories: baseStats.categories
      .map((category) => ({
        ...category,
        count: categoryCounts.get(normalizeSlug(category.name)) ?? 0,
      }))
      .filter((category) => category.count > 0),
    totalComponents: filteredComponents.length,
    totalPatterns: filteredComponents.length,
  }
}

export function getComponentCategories(): ComponentCategoryInfo[] {
  return getComponentStats().categories.map((category) => ({
    ...category,
    slug: category.name,
  }))
}

export function getComponentCategoryInfo(
  category: string
): ComponentCategoryInfo | undefined {
  const normalizedCategory = normalizeSlug(category)
  return getComponentCategories().find(
    (componentCategory) => componentCategory.slug === normalizedCategory
  )
}

export function getComponentCategoryNames(): string[] {
  return getComponentCategories().map((category) => category.slug)
}

export function getComponentsTotalCount(): number {
  return (
    getComponentStats().totalComponents ?? getComponentStats().totalPatterns
  )
}

export function getComponentCountByCategory(category: string): number {
  return getComponentCategoryInfo(category)?.count ?? 0
}

export function getComponentCategoryDescription(category: string) {
  return getComponentCategoryInfo(category)?.description
}

export function isValidComponentCategory(category: string): boolean {
  return !!getComponentCategoryInfo(category)
}

/** @deprecated Use ComponentCategoryInfo. */
export type PatternCategoryInfo = ComponentCategoryInfo
/** @deprecated Use getComponentCategories. */
export const getPatternCategories = getComponentCategories
/** @deprecated Use getComponentCategoryInfo. */
export const getPatternCategoryInfo = getComponentCategoryInfo
/** @deprecated Use getComponentCategoryNames. */
export const getPatternCategoryNames = getComponentCategoryNames
/** @deprecated Use getComponentsTotalCount. */
export const getPatternsTotalCount = getComponentsTotalCount
/** @deprecated Use getComponentCountByCategory. */
export const getPatternCountByCategory = getComponentCountByCategory
/** @deprecated Use getComponentCategoryDescription. */
export const getPatternCategoryDescription = getComponentCategoryDescription
/** @deprecated Use isValidComponentCategory. */
export const isValidPatternCategory = isValidComponentCategory
