import { getCategoryInfo } from "@/lib/registry"
import {
  getDocsComponentCatalogIntro,
  isCanonicalComponentDoc,
  type CanonicalComponentDocSlug,
} from "@/lib/seo"
import { normalizeSlug } from "@/lib/utils"

import { DocsComponentCatalogCta } from "./docs-component-catalog-cta"

interface DocsComponentCatalogSectionProps {
  componentSlug: string
  docBase: "base" | "radix"
}

/**
 * Resolves catalog count and Radix vs Base UI intro for the docs catalog CTA.
 */
export function DocsComponentCatalogSection({
  componentSlug,
  docBase,
}: DocsComponentCatalogSectionProps) {
  const normalized = normalizeSlug(componentSlug)
  const info = getCategoryInfo(normalized)
  if (!info || info.count < 1) {
    return null
  }

  if (!isCanonicalComponentDoc(normalized)) {
    return null
  }

  const intro = getDocsComponentCatalogIntro(
    normalized as CanonicalComponentDocSlug,
    info.label,
    info.count,
    docBase
  )

  return (
    <DocsComponentCatalogCta
      label={info.label}
      componentCount={info.count}
      catalogHref={`/components/${normalized}`}
      intro={intro}
    />
  )
}
