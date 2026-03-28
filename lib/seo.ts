import type { Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { getCategoryDocsDescription } from "@/lib/registry"

const CANONICAL_COMPONENT_DOC_SLUGS = [
  "alert",
  "autocomplete",
  "badge",
  "data-grid",
  "date-selector",
  "file-upload",
  "filters",
  "frame",
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

function normalizeSiteUrl(url: string) {
  const trimmed = url.trim()
  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`

  // Accidental env concat (e.g. https://reui.iohttps://v1.reui.io) → first origin only
  const doubleOrigin = /^(https?:\/\/[^/]+)(https?:\/\/)/i
  const m = withProtocol.match(doubleOrigin)
  if (m) {
    return m[1].replace(/\/$/, "")
  }

  return withProtocol.replace(/\/$/, "")
}

export type CanonicalComponentDocSlug =
  (typeof CANONICAL_COMPONENT_DOC_SLUGS)[number]

export function getSiteUrl() {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      siteConfig.url
  )
}

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return new URL(normalizedPath, `${getSiteUrl()}/`).toString()
}

export function getOgImageUrl(title: string, description: string) {
  return absoluteUrl(
    `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
      description
    )}`
  )
}

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  keywords?: Metadata["keywords"]
  robots?: Metadata["robots"]
  type?: "website" | "article"
  titleSuffix?: string
}

function getSocialHandle(url: string) {
  try {
    const socialUrl = new URL(url)
    const handle = socialUrl.pathname.split("/").filter(Boolean)[0]
    return handle ? `@${handle}` : undefined
  } catch {
    return undefined
  }
}

function getAbsoluteMetadataUrl(path: string) {
  return path.startsWith("http://") || path.startsWith("https://")
    ? path
    : absoluteUrl(path)
}

export function getSiteAuthors(): NonNullable<Metadata["authors"]> {
  return [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ]
}

export function buildPageSocialMetadata({
  title,
  description,
  path,
  type = "website",
}: Pick<PageMetadataOptions, "title" | "description" | "path" | "type">): Pick<
  Metadata,
  "openGraph" | "twitter"
> {
  const imageUrl = getOgImageUrl(title, description)
  const twitterCreator = getSocialHandle(siteConfig.links.twitter)

  return {
    openGraph: {
      title,
      description,
      url: getAbsoluteMetadataUrl(path),
      type,
      siteName: siteConfig.name,
      locale: siteConfig.metadata.locale,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl }],
      ...(twitterCreator ? { creator: twitterCreator } : {}),
    },
  }
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  robots,
  type = "website",
  titleSuffix,
}: PageMetadataOptions): Metadata {
  const resolvedTitle = titleSuffix ? `${title} - ${titleSuffix}` : title

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: path,
    },
    ...(keywords ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    ...buildPageSocialMetadata({
      title,
      description,
      path,
      type,
    }),
  }
}

export function isCanonicalComponentDoc(
  slug?: string
): slug is CanonicalComponentDocSlug {
  return !!slug && CANONICAL_COMPONENT_DOC_SLUGS.includes(slug as any)
}

function getGenericComponentDocDescription(label: string) {
  return `Install the open-source shadcn/ui ${label.toLowerCase()} component for React and Tailwind CSS with ReUI examples, CLI setup, and API guidance.`
}

export interface ComponentDocSeo {
  /** Visible H1 and breadcrumb: `Shadcn {Label}` */
  displayTitle: string
  /** Subtitle: `Custom Shadcn {Label} for React and Tailwind CSS.` plus original MDX description */
  leadDescription: string
  title: string
  description: string
  canonicalPath: string
  shouldIndex: boolean
}

/**
 * SEO + on-page copy for canonical component docs (`/docs/components/base/...` and `/docs/components/radix/...`).
 */
export function getComponentDocSeo(
  slug: CanonicalComponentDocSlug,
  label: string,
  base: "base" | "radix",
  docDescription?: string | null
): ComponentDocSeo {
  const canonicalPath = `/docs/components/${base}/${slug}`
  const displayTitle = `Shadcn ${label}`

  const docHook = docDescription?.trim() ?? ""
  const leadPrefix = `Custom Shadcn ${label} for React and Tailwind CSS.`
  const leadDescription = docHook ? `${leadPrefix} ${docHook}` : leadPrefix

  const registryDesc = getCategoryDocsDescription(slug)
  const variantLine =
    base === "radix"
      ? `Radix UI documentation with accessible primitives from the Radix stack.`
      : `Base UI documentation with composable primitives from @base-ui/react.`

  const title =
    base === "base" ? `Shadcn ${label} (Base UI)` : `Shadcn ${label} (Radix UI)`

  const description = registryDesc
    ? `Shadcn ${label} for React and Tailwind CSS. ${variantLine} ${registryDesc}`
    : `Shadcn ${label} for React and Tailwind CSS. ${variantLine} ${docHook || getGenericComponentDocDescription(label)}`

  return {
    displayTitle,
    leadDescription,
    title,
    description: description.replace(/\s+/g, " ").trim(),
    canonicalPath,
    shouldIndex: base === "base",
  }
}

/**
 * Docs catalog CTA intro: Radix vs Base UI copy for the bottom docs section.
 */
export function getDocsComponentCatalogIntro(
  slug: CanonicalComponentDocSlug,
  label: string,
  count: number,
  base: "base" | "radix"
): string {
  const p = count

  if (slug === "alert") {
    if (base === "radix") {
      return `Browse ${p} production-ready Shadcn ${label} components for success, warning, destructive, and inline actions. Alerts follow accessible roles from the Radix stack and stay fully compatible with Shadcn Create so radius, color, and typography match your configured theme.`
    }
    return `Browse ${p} production-ready Shadcn ${label} components for success, warning, destructive, and inline actions. Alerts use Base UI primitives and composable building blocks, and stay fully compatible with Shadcn Create so radius, color, and typography match your configured theme.`
  }

  if (base === "radix") {
    return `Browse ${p} production-ready Shadcn ${label} components for dashboards, forms, and product UI. These examples follow the Radix UI implementation with accessible primitives from the Radix stack and stay fully compatible with Shadcn Create so radius, color, and typography match your configured theme.`
  }

  return `Browse ${p} production-ready Shadcn ${label} components for dashboards, forms, and product UI. These examples use Base UI primitives from @base-ui/react and stay fully compatible with Shadcn Create so radius, color, and typography match your configured theme.`
}

type BreadcrumbItem = {
  name: string
  path: string
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: getSiteUrl(),
    logo: absoluteUrl("/brand/logo-icon-light.svg"),
    sameAs: [siteConfig.links.github, siteConfig.links.twitter],
  }
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: absoluteUrl("/components?search={search_term_string}"),
      "query-input": "required name=search_term_string",
    },
  }
}
