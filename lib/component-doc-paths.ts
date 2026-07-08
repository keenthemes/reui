export const CANONICAL_COMPONENT_DOC_SLUGS = [
  "alert",
  "autocomplete",
  "badge",
  "data-grid",
  "date-selector",
  "file-upload",
  "filters",
  "frame",
  "icon-stack",
  "kanban",
  "number-field",
  "phone-input",
  "rating",
  "scrollspy",
  "sortable",
  "stepper",
  "timeline",
  "tree",
] as const

export type CanonicalComponentDocSlug =
  (typeof CANONICAL_COMPONENT_DOC_SLUGS)[number]

export function isCanonicalComponentDoc(
  slug?: string
): slug is CanonicalComponentDocSlug {
  return !!slug && CANONICAL_COMPONENT_DOC_SLUGS.includes(slug as any)
}

export function getCanonicalComponentDocPath(
  slug: CanonicalComponentDocSlug | string,
  base: "base" | "radix" = "base"
) {
  return `/docs/components/${base}/${slug}`
}

export function canonicalizeComponentDocUrl(url: string) {
  const baseMatch = url.match(/^\/docs\/(base|radix)\/([^/]+)$/)
  if (baseMatch) {
    const [, base, slug] = baseMatch
    return getCanonicalComponentDocPath(slug, base as "base" | "radix")
  }

  const legacyCanonicalMatch = url.match(/^\/docs\/components\/([^/]+)$/)
  if (legacyCanonicalMatch) {
    return getCanonicalComponentDocPath(legacyCanonicalMatch[1], "base")
  }

  return url
}
