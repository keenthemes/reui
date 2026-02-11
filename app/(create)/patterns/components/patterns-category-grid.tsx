"use client"

import type { CategoryInfo } from "@/lib/registry"
import { cn } from "@/lib/utils"

import { PatternsCategoryCard } from "./patterns-category-card"
import { PatternsEmptyState } from "./patterns-empty-state"
import { PatternsHeader } from "./patterns-header"

interface PatternsCategoryGridProps {
  categories: CategoryInfo[]
}

function PatternsCategoryMasonryGrid({
  categories,
  className,
}: {
  categories: CategoryInfo[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 @lg/category-grid:grid-cols-2 @2xl/category-grid:grid-cols-3 @5xl/category-grid:grid-cols-4",
        className
      )}
    >
      {categories.map((item) => (
        <PatternsCategoryCard
          key={item.name}
          name={item.name}
          label={item.label}
          count={item.count}
        />
      ))}
    </div>
  )
}

export function PatternsCategoryGrid({
  categories,
}: PatternsCategoryGridProps) {
  return (
    <div className="flex flex-col">
      <PatternsHeader isGridFixed />
      <div className="@container/category-grid container py-6">
        {categories.length === 0 ? (
          <PatternsEmptyState message="No categories found" />
        ) : (
          <PatternsCategoryMasonryGrid categories={categories} />
        )}
      </div>
    </div>
  )
}
