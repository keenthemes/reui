import { type CategoryInfo } from "@/lib/registry"
import { type PatternGridMode } from "@/hooks/use-config"

export type { PatternGridMode, CategoryInfo }
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
