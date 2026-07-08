import type { Metadata } from "next"

import {
  getCanonicalComponentDocPath,
  isCanonicalComponentDoc,
  type CanonicalComponentDocSlug,
} from "@/lib/component-doc-paths"
import { siteConfig } from "@/lib/config"
import { getRegistryDeploymentId } from "@/lib/registry-deployment"
import { getComponentCategorySeo } from "@/lib/registry-seo-cache"
import { absoluteUrl, getSiteUrl } from "@/lib/site-url"

export function getOgImageUrl(title: string, description: string) {
  // `&v=<deploymentId>` makes the OG image URL unique per deployment, so the
  // 1-year, immutable CDN/browser/social caches all refresh on every deploy
  // (same invalidation trick the registry uses). Within a deployment the URL
  // is stable, so it stays fully cached.
  return absoluteUrl(
    `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
      description
    )}&v=${encodeURIComponent(getRegistryDeploymentId())}`
  )
}

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  keywords?: Metadata["keywords"]
  robots?: Metadata["robots"]
  type?: "website" | "article"
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
}: PageMetadataOptions): Metadata {
  return {
    // The brand suffix is owned by the root layout's title template
    // (`%s - ReUI`). Pages pass a clean, brand-free title so we never
    // double up — the old `titleSuffix: "ReUI"` produced
    // "… - ReUI - ReUI" (and "… for ReUI - ReUI - ReUI" on home).
    title,
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

function getGenericComponentDocDescription(label: string) {
  return `Install the open-source shadcn/ui ${label.toLowerCase()} component for React and Tailwind CSS with ReUI examples, CLI setup, and API guidance.`
}

function getCategoryDocsDescription(category: string) {
  const seo = getComponentCategorySeo(category)
  return seo?.description
}

export interface ComponentDocSeo {
  displayTitle: string
  leadDescription: string
  title: string
  description: string
  canonicalPath: string
  shouldIndex: boolean
}

export function getComponentDocSeo(
  slug: CanonicalComponentDocSlug,
  label: string,
  base: "base" | "radix",
  docDescription?: string | null
): ComponentDocSeo {
  const canonicalPath = getCanonicalComponentDocPath(slug, base)
  const displayTitle = `Shadcn ${label}`

  const docHook = docDescription?.trim() ?? ""
  const leadPrefix = `Custom Shadcn ${label} for React and Tailwind CSS.`
  const leadDescription = docHook ? `${leadPrefix} ${docHook}` : leadPrefix

  const registryDesc = getCategoryDocsDescription(slug)
  const variantLine =
    base === "radix"
      ? "Radix UI documentation with accessible primitives from the Radix stack."
      : "Open-source component documentation with copy-ready examples and installation guidance."

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
    shouldIndex: true,
  }
}

export function getDocsComponentIntro(
  slug: CanonicalComponentDocSlug,
  label: string,
  count: number,
  base: "base" | "radix"
): string {
  const plural = count === 1 ? "component" : "components"

  if (slug === "alert") {
    if (base === "radix") {
      return `Browse ${count} production-ready Shadcn ${label} components for success, warning, destructive, and inline actions. Alerts follow accessible roles from the Radix stack and stay fully compatible with Shadcn Create so radius, color, and typography match your configured theme.`
    }

    return `Browse ${count} production-ready Shadcn ${label} components for success, warning, destructive, and inline actions. Alerts use Base UI primitives and composable components, and stay fully compatible with Shadcn Create so radius, color, and typography match your configured theme.`
  }

  if (base === "radix") {
    return `Browse ${count} production-ready Shadcn ${label} ${plural} for dashboards, forms, and product UI. These examples follow the Radix UI implementation with accessible primitives from the Radix stack and stay fully compatible with Shadcn Create so radius, color, and typography match your configured theme.`
  }

  return `Browse ${count} production-ready Shadcn ${label} ${plural} for dashboards, forms, and product UI. These examples use Base UI primitives from @base-ui/react and stay fully compatible with Shadcn Create so radius, color, and typography match your configured theme.`
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

type ArticleJsonLdOptions = {
  title: string
  description: string
  path: string
}

/**
 * TechArticle markup for docs pages. No datePublished/dateModified:
 * doc frontmatter carries no dates and fabricating them would be worse
 * than omitting the optional fields.
 */
export function buildArticleJsonLd({
  title,
  description,
  path,
}: ArticleJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(path),
    },
    image: getOgImageUrl(title, description),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/logo-icon-light.svg"),
      },
    },
  }
}

/**
 * SoftwareApplication markup for the home page: ReUI as a free developer
 * tool. No aggregateRating: we have no first-party rating data.
 */
export function buildSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: getSiteUrl(),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }
}

