"use client"

import type { ComponentCategoryInfo } from "@/lib/component-stats"
import { cn } from "@/lib/utils"

import { ComponentsCategoryCard } from "./components-category-card"
import { ComponentsEmptyState } from "./components-empty-state"

interface ComponentsCategoryGridProps {
  categories: ComponentCategoryInfo[]
}

function ComponentsCategoryMasonryGrid({
  categories,
  className,
}: {
  categories: ComponentCategoryInfo[]
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
        <ComponentsCategoryCard
          key={item.name}
          name={item.name}
          label={item.label}
          count={item.count}
        />
      ))}
    </div>
  )
}

export function ComponentsCategoryGrid({
  categories,
}: ComponentsCategoryGridProps) {
  return (
    <div className="container-wrapper pt-2 pb-6 sm:pt-3">
      <div className="@container/category-grid container">
        {categories.length === 0 ? (
          <ComponentsEmptyState message="No categories found" />
        ) : (
          <ComponentsCategoryMasonryGrid categories={categories} />
        )}
      </div>
    </div>
  )
}
