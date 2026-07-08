import type { ComponentCategoryInfo as CategoryInfo } from "@/lib/component-stats"

export type ComponentGridMode = 1 | 2
export type { CategoryInfo }
export type GridSize = 1 | 2

export interface Component {
  name: string
  title?: string
  description?: string
  categories: string[]
  primaryCategory?: string
  meta?: {
    className?: string
    colSpan?: number
    gridSize?: GridSize
    order?: number
  }
  // Pre-computed for fast search (optional for backwards compatibility)
  searchText?: string
}

// Legacy type for backwards compatibility
export interface CategoryWithCount {
  category: string
  description?: string
  count: number
}
