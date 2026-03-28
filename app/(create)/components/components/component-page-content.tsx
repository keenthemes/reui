"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"
import { hasActiveCatalogSearch } from "@/lib/catalog-search-filter"

import type { CatalogItem } from "../types"
import { ComponentPreviewView } from "./component-preview-view"

interface ComponentPageContentProps {
  categoryGridFallback: React.ReactNode
  catalogItems: CatalogItem[]
}

/**
 * Client wrapper that reads the search param from the URL via nuqs
 * and switches between the category grid view (no search) and the
 * inline preview grid (with search). This lets the /components page be
 * fully static while still supporting ?search= on the client.
 */
export function ComponentPageContent({
  categoryGridFallback,
  catalogItems,
}: ComponentPageContentProps) {
  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })

  const searchQuery = filters.search || ""
  const hasSearch = hasActiveCatalogSearch(searchQuery)

  if (hasSearch) {
    return <ComponentPreviewView catalogItems={catalogItems} />
  }

  // No search — render the pre-built category grid from the server
  return <>{categoryGridFallback}</>
}
