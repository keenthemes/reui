import { cache } from "react"

import {
  getComponentCategorySeo as getComponentCategorySeoUncached,
  getComponentIndexSeo as getComponentIndexSeoUncached,
  type ComponentCategorySeo,
} from "./registry"

/**
 * Per-request memoization for static component category pages that call SEO helpers
 * more than once (e.g. `generateMetadata` + page body).
 */
export const getComponentCategorySeo = cache(
  (category: string): ComponentCategorySeo =>
    getComponentCategorySeoUncached(category)
)

export const getComponentIndexSeo = cache(
  (): ComponentCategorySeo => getComponentIndexSeoUncached()
)
