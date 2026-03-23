/** Minimal shape for pattern search (matches `Pattern` / `PatternData`). */
export interface PatternSearchable {
  name: string
  categories?: string[]
  searchText?: string
}

export const PATTERN_SEARCH_MIN_CHARS = 3

export function normalizePatternSearchQuery(searchQuery: string) {
  return searchQuery.trim()
}

export function hasActivePatternSearch(searchQuery: string) {
  return (
    normalizePatternSearchQuery(searchQuery).length >= PATTERN_SEARCH_MIN_CHARS
  )
}

/**
 * Client/server-safe filter matching `PatternsGrid` search behavior.
 */
export function filterPatternsBySearchQuery(
  patterns: PatternSearchable[],
  searchQuery: string
): PatternSearchable[] {
  const normalizedSearchQuery = normalizePatternSearchQuery(searchQuery)

  if (!hasActivePatternSearch(normalizedSearchQuery)) {
    return patterns
  }

  const terms = normalizedSearchQuery.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) {
    return patterns
  }
  return patterns.filter((p) => {
    const text =
      p.searchText || [p.name, ...(p.categories || [])].join(" ").toLowerCase()
    return terms.every((term) => {
      if (text.includes(term)) {
        return true
      }
      if (term.length > 3 && term.endsWith("s")) {
        return text.includes(term.slice(0, -1))
      }
      return false
    })
  })
}
