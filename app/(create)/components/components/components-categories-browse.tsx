"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import {
  filterComponentsBySearchQuery,
  normalizeComponentSearchQuery,
} from "@/lib/component-search-filter"
import type { ComponentCategoryInfo } from "@/lib/component-stats"

import { ComponentsCategoryGrid } from "./components-category-grid"

interface ComponentsCategoriesBrowseProps {
  categories: ComponentCategoryInfo[]
}

export function ComponentsCategoriesBrowse({
  categories,
}: ComponentsCategoriesBrowseProps) {
  const searchParams = useSearchParams()
  const searchQuery = normalizeComponentSearchQuery(
    searchParams.get("search") || ""
  )

  const filteredCategories = React.useMemo(() => {
    const categoriesWithSearchText = categories.map((category) => ({
      ...category,
      searchText: [
        category.slug,
        category.label,
        category.description,
        String(category.count),
      ]
        .join(" ")
        .toLowerCase(),
    }))

    return filterComponentsBySearchQuery(categoriesWithSearchText, searchQuery)
  }, [categories, searchQuery])

  return <ComponentsCategoryGrid categories={filteredCategories} />
}
