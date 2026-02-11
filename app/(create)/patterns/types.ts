import { type CategoryInfo } from "@/lib/registry"

export type PatternGridMode = 1 | 2
export type { CategoryInfo }
export type GridSize = 1 | 2

export interface Pattern {
  name: string
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
