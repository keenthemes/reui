import { getFilteredComponentManifest } from "@/lib/component-manifest.server"
import {
  filterComponentsBySearchQuery,
  hasActiveComponentSearch,
  normalizeComponentSearchQuery,
} from "@/lib/component-search-filter"
import {
  getComponentCategories,
  getComponentCategoryDescription,
  getComponentCategoryInfo,
  getComponentCategoryNames,
  getComponentCountByCategory,
  getComponentsTotalCount,
  isValidComponentCategory,
  type ComponentCategoryInfo,
} from "@/lib/component-stats"
import { devCached } from "@/lib/dev-cache"
import { projectPath, readJsonCached } from "@/lib/dev-cache.server"
import { normalizeSlug } from "@/lib/utils"

export interface ComponentItem {
  name: string
  title: string
  description?: string
  categories: string[]
  primaryCategory: string
  meta?: {
    className?: string
    colSpan?: number
    gridSize?: 1 | 2
    order?: number
    previewHeight?: string
  }
  searchText: string
}

export interface CategorySeoFeatureItem {
  title: string
  description: string
}

export interface CategorySeoComponentListItem {
  slug: string
  title: string
  badge?: string
  description: string
  href: string
}

export interface CategorySeoSection {
  title: string
  intro?: string
  paragraphs?: string[]
  bullets?: string[]
  featureItems?: CategorySeoFeatureItem[]
  componentList?: CategorySeoComponentListItem[]
}

export interface CategorySeoFaq {
  question: string
  answer: string
}

export interface CategorySeoContent {
  title: string
  summary: string[]
  sections: CategorySeoSection[]
  faqs?: CategorySeoFaq[]
}

export interface RelatedComponentRef {
  slug: string
  label: string
}

export interface RelatedComponentsBlock {
  title: string
  items?: RelatedComponentRef[]
  links?: RelatedComponentRef[]
  integrationBody?: string[]
}

export interface CategorySeoInfo {
  title?: string
  description?: string
  intro?: string
  keywords?: string[]
  content?: CategorySeoContent
  docsDescription?: string
  relatedComponents?: RelatedComponentsBlock
}

export interface ComponentCategorySeo {
  title: string
  description: string
  intro: string
  keywords: string[]
  content?: CategorySeoContent
  relatedComponents?: RelatedComponentsBlock
}

function componentizeSeoText(text: string) {
  return text
    .replace(/\/patterns\//g, "/components/")
    .replace(/\bPatterns\b/g, "Components")
    .replace(/\bPattern\b/g, "Component")
    .replace(/\bpatterns\b/g, "components")
    .replace(/\bpattern\b/g, "component")
}

function componentizeSeoContent(
  content?: CategorySeoContent
): CategorySeoContent | undefined {
  if (!content) {
    return undefined
  }

  return {
    ...content,
    title: componentizeSeoText(content.title),
    summary: content.summary.map(componentizeSeoText),
    sections: content.sections.map((section) => ({
      ...section,
      title: componentizeSeoText(section.title),
      intro: section.intro ? componentizeSeoText(section.intro) : undefined,
      paragraphs: section.paragraphs?.map(componentizeSeoText),
      bullets: section.bullets?.map(componentizeSeoText),
      featureItems: section.featureItems?.map((item) => ({
        ...item,
        title: componentizeSeoText(item.title),
        description: componentizeSeoText(item.description),
      })),
      componentList: section.componentList?.map((item) => ({
        ...item,
        title: componentizeSeoText(item.title),
        description: componentizeSeoText(item.description),
      })),
    })),
    faqs: content.faqs?.map((faq) => ({
      ...faq,
      question: componentizeSeoText(faq.question),
      answer: componentizeSeoText(faq.answer),
    })),
  }
}

function componentizeRelatedComponents(
  block?: RelatedComponentsBlock
): RelatedComponentsBlock | undefined {
  if (!block) {
    return undefined
  }

  return {
    ...block,
    title: componentizeSeoText(block.title),
    integrationBody: block.integrationBody?.map(componentizeSeoText),
    links: block.links?.map((link) => ({
      ...link,
      label: componentizeSeoText(link.label),
    })),
  }
}

function getComponentSeoMap(): Record<string, CategorySeoInfo> {
  return readJsonCached<Record<string, CategorySeoInfo>>(
    "components-seo-map",
    projectPath("registry-reui", "_meta", "components", "seo.json")
  )
}

function getComponentsManifest(): Array<any> {
  return devCached("components-manifest", () => getFilteredComponentManifest())
}

function fallbackCategoryLabel(category: string) {
  return category
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

interface ComponentIndexes {
  items: ComponentItem[]
  categoryIndex: Map<string, ComponentItem[]>
}

function getComponentIndexes(): ComponentIndexes {
  return devCached("component-indexes", () => {
    const categoryIndex = new Map<string, ComponentItem[]>()
    const items = getComponentsManifest()
      .map((component) => {
        const categories = Array.isArray(component.categories)
          ? component.categories.map((category: string) =>
              normalizeSlug(category)
            )
          : []
        const primaryCategory =
          categories[0] || component.name.split("-").slice(1, -1).join("-")

        const searchText = [
          component.name,
          component.title || "",
          component.description || "",
          ...categories,
          primaryCategory,
        ]
          .join(" ")
          .toLowerCase()

        return {
          name: component.name,
          title: component.title || component.name,
          description: component.description || "",
          categories,
          primaryCategory,
          meta: component.meta,
          searchText,
        } satisfies ComponentItem
      })
      .sort((a, b) => {
        if (a.primaryCategory !== b.primaryCategory) {
          return a.primaryCategory.localeCompare(b.primaryCategory)
        }
        return (a.meta?.order ?? 9_999) - (b.meta?.order ?? 9_999)
      })

    for (const item of items) {
      const allCategories = new Set([item.primaryCategory, ...item.categories])

      for (const category of allCategories) {
        const normalizedCategory = normalizeSlug(category)
        if (!categoryIndex.has(normalizedCategory)) {
          categoryIndex.set(normalizedCategory, [])
        }
        categoryIndex.get(normalizedCategory)!.push(item)
      }
    }

    return { items, categoryIndex }
  })
}

export {
  getComponentCategories,
  getComponentCategoryDescription,
  getComponentCategoryInfo,
  getComponentCategoryNames,
  getComponentCountByCategory,
  getComponentsTotalCount,
  isValidComponentCategory,
}

export function getAllComponentItems(): ComponentItem[] {
  return getComponentIndexes().items
}

export function getComponentsByCategory(category: string): ComponentItem[] {
  return getComponentIndexes().categoryIndex.get(normalizeSlug(category)) ?? []
}

export function searchComponents(query: string): ComponentItem[] {
  const { items, categoryIndex } = getComponentIndexes()

  const normalizedQuery = normalizeComponentSearchQuery(query)
  if (!normalizedQuery) {
    return items
  }

  const exactCategoryMatch = categoryIndex.get(normalizedQuery)
  if (exactCategoryMatch) {
    return exactCategoryMatch
  }

  return filterComponentsBySearchQuery(items, normalizedQuery)
}

export {
  filterComponentsBySearchQuery,
  hasActiveComponentSearch,
  normalizeComponentSearchQuery,
}

export function applySeoCountPlaceholder(text: string, count: number) {
  if (!text.includes("[[count]]") && !text.includes("{{count}}")) {
    return text
  }

  if (count > 0) {
    return text
      .replace(/\{\{count\}\}/g, String(count))
      .replace(/\[\[count\]\]/g, String(count))
  }

  return text
    .replace(/\s*\{\{count\}\}\s*/g, " ")
    .replace(/\s*\[\[count\]\]\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function applyCountToSeoContent(
  content: CategorySeoContent,
  count: number
): CategorySeoContent {
  return {
    ...content,
    title: applySeoCountPlaceholder(content.title, count),
    summary: content.summary.map((summary) =>
      applySeoCountPlaceholder(summary, count)
    ),
    sections: content.sections.map((section) => ({
      ...section,
      title: applySeoCountPlaceholder(section.title, count),
      intro: section.intro
        ? applySeoCountPlaceholder(section.intro, count)
        : undefined,
      paragraphs: section.paragraphs?.map((paragraph) =>
        applySeoCountPlaceholder(paragraph, count)
      ),
      bullets: section.bullets?.map((bullet) =>
        applySeoCountPlaceholder(bullet, count)
      ),
      featureItems: section.featureItems?.map((item) => ({
        ...item,
        title: applySeoCountPlaceholder(item.title, count),
        description: applySeoCountPlaceholder(item.description, count),
      })),
      componentList: section.componentList?.map((item) => ({
        ...item,
        title: applySeoCountPlaceholder(item.title, count),
        description: applySeoCountPlaceholder(item.description, count),
      })),
    })),
    faqs: content.faqs?.map((faq) => ({
      ...faq,
      question: applySeoCountPlaceholder(faq.question, count),
      answer: applySeoCountPlaceholder(faq.answer, count),
    })),
  }
}

export function getComponentCategorySeo(
  category: string
): ComponentCategorySeo {
  const normalizedCategory = normalizeSlug(category)
  const categoryInfo = getComponentCategoryInfo(normalizedCategory)
  const label = categoryInfo?.label ?? fallbackCategoryLabel(normalizedCategory)
  const count = categoryInfo?.count ?? 0
  const seo = getComponentSeoMap()[normalizedCategory]
  const title = seo?.title ?? `Shadcn ${label}`

  const fallbackDescription =
    categoryInfo?.description ||
    `Explore free open-source shadcn/ui ${label.toLowerCase()} components for React and Tailwind CSS in ReUI.`
  const fallbackIntro =
    count > 0
      ? `Browse {{count}} production-ready shadcn ${label.toLowerCase()} components built to help you move from primitives to polished product UI faster.`
      : `Browse production-ready shadcn ${label.toLowerCase()} components built to help you move from primitives to polished product UI faster.`

  return {
    title: componentizeSeoText(title),
    description: componentizeSeoText(
      applySeoCountPlaceholder(seo?.description || fallbackDescription, count)
    ),
    intro: componentizeSeoText(
      applySeoCountPlaceholder(seo?.intro || fallbackIntro, count)
    ),
    keywords: (seo?.keywords ?? []).map(componentizeSeoText),
    content: componentizeSeoContent(
      seo?.content ? applyCountToSeoContent(seo.content, count) : undefined
    ),
    relatedComponents: componentizeRelatedComponents(seo?.relatedComponents),
  }
}

export function getComponentIndexSeo(): ComponentCategorySeo {
  const count = getComponentsTotalCount()
  const root = getComponentSeoMap().root
  const fallbackDescription = `Browse ${count}+ free open-source shadcn/ui components for React and Tailwind CSS.`

  return {
    title: componentizeSeoText(
      root?.title ?? root?.content?.title ?? "Shadcn UI Components"
    ),
    description: componentizeSeoText(
      applySeoCountPlaceholder(root?.description ?? fallbackDescription, count)
    ),
    intro: componentizeSeoText(
      applySeoCountPlaceholder(
        root?.intro ?? root?.description ?? fallbackDescription,
        count
      )
    ),
    keywords: (root?.keywords ?? []).map(componentizeSeoText),
    content: componentizeSeoContent(
      root?.content ? applyCountToSeoContent(root.content, count) : undefined
    ),
    relatedComponents: componentizeRelatedComponents(root?.relatedComponents),
  }
}

/** @deprecated Use ComponentItem. */
export type PatternItem = ComponentItem
/** @deprecated Use ComponentCategorySeo. */
export type PatternCategorySeo = ComponentCategorySeo
/** @deprecated Use getComponentCategories. */
export const getPatternCategories = getComponentCategories
/** @deprecated Use getComponentCategoryDescription. */
export const getPatternCategoryDescription = getComponentCategoryDescription
/** @deprecated Use getComponentCategoryInfo. */
export const getPatternCategoryInfo = getComponentCategoryInfo
/** @deprecated Use getComponentCategoryNames. */
export const getPatternCategoryNames = getComponentCategoryNames
/** @deprecated Use getComponentCountByCategory. */
export const getPatternCountByCategory = getComponentCountByCategory
/** @deprecated Use getComponentsTotalCount. */
export const getPatternsTotalCount = getComponentsTotalCount
/** @deprecated Use isValidComponentCategory. */
export const isValidPatternCategory = isValidComponentCategory
/** @deprecated Use getAllComponentItems. */
export const getAllPatternItems = getAllComponentItems
/** @deprecated Use getComponentsByCategory. */
export const getPatternsByCategory = getComponentsByCategory
/** @deprecated Use searchComponents. */
export const searchPatterns = searchComponents
/** @deprecated Use filterComponentsBySearchQuery. */
export const filterPatternsBySearchQuery = filterComponentsBySearchQuery
/** @deprecated Use normalizeComponentSearchQuery. */
export const normalizePatternSearchQuery = normalizeComponentSearchQuery
/** @deprecated Use hasActiveComponentSearch. */
export const hasActivePatternSearch = hasActiveComponentSearch
/** @deprecated Use getComponentCategorySeo. */
export const getPatternCategorySeo = getComponentCategorySeo
/** @deprecated Use getComponentIndexSeo. */
export const getPatternIndexSeo = getComponentIndexSeo
