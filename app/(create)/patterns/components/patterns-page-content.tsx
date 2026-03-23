"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"
import { hasActivePatternSearch } from "@/lib/pattern-search-filter"

import type { Pattern } from "../types"
import { PatternsPreviewView } from "./patterns-preview-view"

interface PatternsPageContentProps {
  categoryGridFallback: React.ReactNode
  patterns: Pattern[]
}

/**
 * Client wrapper that reads the search param from the URL via nuqs
 * and switches between the category grid view (no search) and the
 * inline preview grid (with search). This lets the /patterns page be
 * fully static while still supporting ?search= on the client.
 */
export function PatternsPageContent({
  categoryGridFallback,
  patterns,
}: PatternsPageContentProps) {
  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })

  const searchQuery = filters.search || ""
  const hasSearch = hasActivePatternSearch(searchQuery)

  if (hasSearch) {
    return <PatternsPreviewView patterns={patterns} />
  }

  // No search — render the pre-built category grid from the server
  return <>{categoryGridFallback}</>
}
