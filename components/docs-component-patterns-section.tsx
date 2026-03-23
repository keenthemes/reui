import { getCategoryInfo } from "@/lib/registry"
import {
  getDocsComponentPatternsIntro,
  isCanonicalComponentDoc,
  type CanonicalComponentDocSlug,
} from "@/lib/seo"
import { normalizeSlug } from "@/lib/utils"

import { DocsComponentPatternsCta } from "./docs-component-patterns-cta"

interface DocsComponentPatternsSectionProps {
  componentSlug: string
  docBase: "base" | "radix"
}

/**
 * Resolves pattern count and Radix vs Base UI intro for the docs patterns CTA.
 */
export function DocsComponentPatternsSection({
  componentSlug,
  docBase,
}: DocsComponentPatternsSectionProps) {
  const normalized = normalizeSlug(componentSlug)
  const info = getCategoryInfo(normalized)
  if (!info || info.count < 1) {
    return null
  }

  if (!isCanonicalComponentDoc(normalized)) {
    return null
  }

  const intro = getDocsComponentPatternsIntro(
    normalized as CanonicalComponentDocSlug,
    info.label,
    info.count,
    docBase
  )

  return (
    <DocsComponentPatternsCta
      label={info.label}
      patternCount={info.count}
      patternsHref={`/patterns/${normalized}`}
      intro={intro}
    />
  )
}
