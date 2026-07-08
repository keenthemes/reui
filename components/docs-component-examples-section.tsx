import {
  isCanonicalComponentDoc,
  type CanonicalComponentDocSlug,
} from "@/lib/component-doc-paths"
import { getComponentCategoryInfo } from "@/lib/component-stats"
import { getDocsComponentIntro } from "@/lib/seo"
import { normalizeSlug } from "@/lib/utils"

import { DocsComponentExamplesCta } from "./docs-component-examples-cta"

interface DocsComponentExamplesSectionProps {
  componentSlug: string
  docBase: "base" | "radix"
}

/**
 * Resolves component count and Radix vs Base UI intro for the docs examples CTA.
 */
export function DocsComponentExamplesSection({
  componentSlug,
  docBase,
}: DocsComponentExamplesSectionProps) {
  const normalized = normalizeSlug(componentSlug)
  const info = getComponentCategoryInfo(normalized)
  if (!info || info.count < 1) {
    return null
  }

  if (!isCanonicalComponentDoc(normalized)) {
    return null
  }

  const intro = getDocsComponentIntro(
    normalized as CanonicalComponentDocSlug,
    info.label,
    info.count,
    docBase
  )

  return (
    <DocsComponentExamplesCta
      label={info.label}
      componentCount={info.count}
      componentsHref={`/components/${normalized}`}
      intro={intro}
    />
  )
}

/** @deprecated Use DocsComponentExamplesSection. */
export const DocsComponentPatternsSection = DocsComponentExamplesSection
