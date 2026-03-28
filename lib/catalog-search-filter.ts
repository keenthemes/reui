/** Minimal shape for catalog search (matches `CatalogItem` / `ComponentCatalogItem`). */
export interface CatalogSearchable {
  name: string
  categories?: string[]
  searchText?: string
  meta?: {
    className?: string
    colSpan?: number
    gridSize?: 1 | 2
    order?: number
  }
}

export const CATALOG_SEARCH_MIN_CHARS = 3

export function normalizeCatalogSearchQuery(searchQuery: string) {
  return searchQuery.trim()
}

export function hasActiveCatalogSearch(searchQuery: string) {
  return (
    normalizeCatalogSearchQuery(searchQuery).length >= CATALOG_SEARCH_MIN_CHARS
  )
}

/**
 * Client/server-safe filter matching catalog grid search behavior.
 */
export function filterCatalogBySearchQuery(
  items: CatalogSearchable[],
  searchQuery: string
): CatalogSearchable[] {
  const normalizedSearchQuery = normalizeCatalogSearchQuery(searchQuery)

  if (!hasActiveCatalogSearch(normalizedSearchQuery)) {
    return items
  }

  const terms = normalizedSearchQuery.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) {
    return items
  }
  return items.filter((p) => {
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
