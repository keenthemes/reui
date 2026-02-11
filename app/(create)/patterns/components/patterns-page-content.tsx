"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"
import type { CategoryInfo } from "@/lib/registry"

import { PatternsIframeView } from "./patterns-iframe-view"

interface PatternsPageContentProps {
  categories: CategoryInfo[]
  categoryGridFallback: React.ReactNode
}

/**
 * Client wrapper that reads the search param from the URL via nuqs
 * and switches between the category grid view (no search) and the
 * iframe search view (with search). This lets the /patterns page be
 * fully static while still supporting ?search= on the client.
 */
export function PatternsPageContent({
  categories,
  categoryGridFallback,
}: PatternsPageContentProps) {
  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })

  const searchQuery = filters.search || ""
  const hasSearch = searchQuery.trim() !== ""

  if (hasSearch) {
    return <PatternsIframeView searchQuery={searchQuery} />
  }

  // No search — render the pre-built category grid from the server
  return <>{categoryGridFallback}</>
}
