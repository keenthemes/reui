"use client"

import type { CatalogItem } from "../types"
import { ComponentGrid } from "./component-grid"

interface ComponentPreviewViewProps {
  catalogItems: CatalogItem[]
}

export function ComponentPreviewView({
  catalogItems,
}: ComponentPreviewViewProps) {
  return (
    <div className="theme-container w-full" data-slot="component-preview">
      <ComponentGrid catalogItems={catalogItems} />
    </div>
  )
}
