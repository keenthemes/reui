import { cache } from "react"

import {
  getComponentCategorySeo as getComponentCategorySeoUncached,
  getComponentIndexSeo as getComponentIndexSeoUncached,
} from "@/lib/components"

export const getComponentCategorySeo = cache((category: string) =>
  getComponentCategorySeoUncached(category)
)

export const getComponentIndexSeo = cache(() => getComponentIndexSeoUncached())

/** @deprecated Use getComponentCategorySeo. */
export const getPatternCategorySeo = getComponentCategorySeo
/** @deprecated Use getComponentIndexSeo. */
export const getPatternIndexSeo = getComponentIndexSeo
