"use client"

import { ComponentPreviewView } from "../components/component-preview-view"
import type { CatalogItem } from "../types"

interface CategoryPageContentProps {
  catalogItems: CatalogItem[]
}

/**
 * Client wrapper for the catalog grid. The page stays fully static while
 * `?search=` filtering runs in `ComponentGrid` on the client.
 */
export function CategoryPageContent({ catalogItems }: CategoryPageContentProps) {
  return <ComponentPreviewView catalogItems={catalogItems} />
}
