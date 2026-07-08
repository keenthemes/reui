type SearchableComponent = {
  searchText: string
}

export function normalizeComponentSearchQuery(query: string) {
  return query.trim().toLowerCase()
}

export function hasActiveComponentSearch(query: string) {
  return normalizeComponentSearchQuery(query).length > 0
}

export function filterComponentsBySearchQuery<T extends SearchableComponent>(
  components: T[],
  query: string
) {
  const normalizedQuery = normalizeComponentSearchQuery(query)
  if (!normalizedQuery) {
    return components
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean)
  if (terms.length === 0) {
    return components
  }

  return components.filter((component) =>
    terms.every((term) => {
      if (component.searchText.includes(term)) {
        return true
      }

      if (term.length > 3 && term.endsWith("s")) {
        return component.searchText.includes(term.slice(0, -1))
      }

      return false
    })
  )
}

/** @deprecated Use SearchableComponent. */
export type SearchablePattern = SearchableComponent
/** @deprecated Use normalizeComponentSearchQuery. */
export const normalizePatternSearchQuery = normalizeComponentSearchQuery
/** @deprecated Use hasActiveComponentSearch. */
export const hasActivePatternSearch = hasActiveComponentSearch
/** @deprecated Use filterComponentsBySearchQuery. */
export const filterPatternsBySearchQuery = filterComponentsBySearchQuery
