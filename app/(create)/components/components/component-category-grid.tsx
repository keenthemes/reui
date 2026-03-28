"use client"

import type { CategoryInfo } from "@/lib/registry"
import { cn } from "@/lib/utils"

import { ComponentCategoryCard } from "./component-category-card"
import { ComponentEmptyState } from "./component-empty-state"

interface ComponentCategoryGridProps {
  categories: CategoryInfo[]
}

function ComponentCategoryMasonryGrid({
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
        <ComponentCategoryCard
          key={item.name}
          name={item.name}
          label={item.label}
          count={item.count}
        />
      ))}
    </div>
  )
}

export function ComponentCategoryGrid({
  categories,
}: ComponentCategoryGridProps) {
  return (
    <div className="@container/category-grid w-full px-6 py-6 sm:px-8 xl:px-10">
      {categories.length === 0 ? (
        <ComponentEmptyState message="No categories found" />
      ) : (
        <ComponentCategoryMasonryGrid categories={categories} />
      )}
    </div>
  )
}
