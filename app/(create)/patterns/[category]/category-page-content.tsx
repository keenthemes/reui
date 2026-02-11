"use client"

import { useQueryStates } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"

import { PatternsIframeView } from "../components/patterns-iframe-view"

interface CategoryPageContentProps {
  category: string
  count: number
}

/**
 * Client wrapper that reads the search param from the URL via nuqs
 * and passes it to PatternsIframeView. This lets the /patterns/[category]
 * page be fully static while still supporting ?search= on the client.
 */
export function CategoryPageContent({
  category,
  count,
}: CategoryPageContentProps) {
  const [filters] = useQueryStates({
    search: parseAsSearchStringClient,
  })

  const searchQuery = filters.search || ""

  return (
    <PatternsIframeView
      category={category}
      searchQuery={searchQuery}
      count={count}
    />
  )
}
