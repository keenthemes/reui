"use client"

import type { ComponentCategoryInfo } from "@/lib/component-stats"

import { ComponentsCategoriesBrowse } from "./components-categories-browse"

/**
 * Legacy wrapper path kept for compatibility.
 * The /components page is now metadata-only and filters category cards only.
 */
export function ComponentsPageContent({
  categories,
}: {
  categories: ComponentCategoryInfo[]
}) {
  return <ComponentsCategoriesBrowse categories={categories} />
}
