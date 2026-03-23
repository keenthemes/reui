import { cache } from "react"

import {
  getPatternCategorySeo as getPatternCategorySeoUncached,
  getPatternIndexSeo as getPatternIndexSeoUncached,
  type PatternCategorySeo,
} from "./registry"

/**
 * Per-request memoization for static pattern category pages that call SEO helpers
 * more than once (e.g. `generateMetadata` + page body).
 */
export const getPatternCategorySeo = cache(
  (category: string): PatternCategorySeo =>
    getPatternCategorySeoUncached(category)
)

export const getPatternIndexSeo = cache(
  (): PatternCategorySeo => getPatternIndexSeoUncached()
)
