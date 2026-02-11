"use server"

import * as React from "react"

import { getPaginatedPatterns, type PatternData } from "@/lib/registry"
import { PatternCard } from "@/app/(create)/patterns/components/pattern-card"

/**
 * Server action to load more patterns with pagination
 * Optimized for large datasets (10,000+ patterns)
 */
export async function getMorePatternsAction(
  categories: string[],
  search: string,
  startIndex: number,
  limit: number
): Promise<React.ReactNode[]> {
  // Use optimized paginated query
  const category = categories.length === 1 ? categories[0] : null
  const { patterns } = getPaginatedPatterns(category, search, startIndex, limit)

  // Render pattern cards
  return patterns.map((pattern) => (
    <PatternCard
      key={pattern.name}
      name={pattern.name}
      className={pattern.meta?.className}
    />
  ))
}

/**
 * Lightweight action that returns just pattern metadata
 * Use this for fast initial data fetching, then hydrate with PatternCard on client
 */
export async function getPatternMetadataAction(
  category: string | null,
  search: string,
  offset: number,
  limit: number
): Promise<{
  patterns: Array<{
    name: string
    description: string | undefined
    className: string | undefined
    gridSize: 1 | 2 | undefined
  }>
  total: number
  hasMore: boolean
}> {
  const result = getPaginatedPatterns(category, search, offset, limit)

  return {
    patterns: result.patterns.map((p) => ({
      name: p.name,
      description: p.description,
      className: p.meta?.className,
      gridSize: p.meta?.gridSize,
    })),
    total: result.total,
    hasMore: result.hasMore,
  }
}
