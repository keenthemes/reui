import { siteConfig } from "@/lib/config"

export function normalizeAbsoluteUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return siteConfig.url
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  const doubleOrigin = /^(https?:\/\/[^/]+)(https?:\/\/)/i
  const match = withProtocol.match(doubleOrigin)

  if (match) {
    return match[1].replace(/\/+$/, "")
  }

  return withProtocol.replace(/\/+$/, "")
}

export function getSiteUrl() {
  return normalizeAbsoluteUrl(
    // `NEXT_PUBLIC_WEB_URL` is the canonical name. `NEXT_PUBLIC_APP_URL`
    // is the legacy alias kept here for back-compat with deploys that
    // haven't migrated their env yet — drop once all environments
    // have moved.
    process.env.NEXT_PUBLIC_WEB_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      siteConfig.url
  )
}

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return new URL(normalizedPath, `${getSiteUrl()}/`).toString()
}
