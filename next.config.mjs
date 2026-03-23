import { createMDX } from "fumadocs-mdx/next"

const registryDeploymentId =
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  Date.now().toString(36)

function versionedRegistryDestination(destination) {
  const separator = destination.includes("?") ? "&" : "?"
  return `${destination}${separator}v=${registryDeploymentId}`
}

function createVersionedRegistryRedirects(source, destination) {
  return [
    {
      source,
      missing: [
        {
          type: "query",
          key: "v",
        },
      ],
      destination: versionedRegistryDestination(destination),
      permanent: false,
    },
    {
      source,
      has: [
        {
          type: "query",
          key: "v",
          value: "(?<registryVersion>.*)",
        },
      ],
      destination: `${destination}?v=:registryVersion`,
      permanent: true,
    },
  ]
}

const canonicalComponentDocRedirectPattern =
  "alert|autocomplete|badge|data-grid|date-selector|file-upload|filters|frame|kanban|number-field|phone-input|rating|scrollspy|sortable|stepper|timeline|tree"

const legacyPatternCategoryRedirectPattern =
  "accordion|alert-dialog|aspect-ratio|avatar|breadcrumb|button|button-group|calendar|card|carousel|chart|checkbox|collapsible|combobox|command|context-menu|dialog|drawer|dropdown-menu|empty|field|hover-card|input|input-group|input-otp|item|kbd|label|menubar|native-select|navigation-menu|pagination|popover|progress|radio-group|resizable|scroll-area|select|separator|sheet|skeleton|slider|sonner|spinner|switch|table|tabs|textarea|toggle|toggle-group|tooltip"

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  skipTrailingSlashRedirect: true,
  skipProxyUrlNormalize: true,
  env: {
    // Shared with the browser so registry JSON URLs rotate on every deploy.
    // Build timestamp is the last fallback so redeploys still invalidate caches
    // even if Vercel system env exposure is disabled.
    NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID: registryDeploymentId,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  outputFileTracingIncludes: {
    "/*": [
      "./registry/**/*",
      "./registry-reui/**/*",
      "./public/r/styles/**/*",
    ],
  },
  experimental: {
    // Enable file system cache for development
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      "lucide-react",
      "@tabler/icons-react",
      "@base-ui/react",
      "radix-ui",
      "motion",
      "jotai",
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    minimumCacheTTL: 2592000, // 30 days - reduce image re-optimizations
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async headers() {
    const versionedRegistryHeaders = [
      {
        key: "Cache-Control",
        value:
          "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable",
      },
      {
        key: "CDN-Cache-Control",
        value:
          "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400",
      },
      {
        key: "Vercel-CDN-Cache-Control",
        value:
          "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400",
      },
    ]
    const redirectRegistryHeaders = [
      {
        key: "Cache-Control",
        value: "no-store, max-age=0",
      },
      {
        key: "CDN-Cache-Control",
        value: "no-store",
      },
      {
        key: "Vercel-CDN-Cache-Control",
        value: "no-store",
      },
    ]
    const securityHeaders = [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
    ]

    return [
      {
        // Versioned registry assets are immutable for the lifetime of a deploy.
        source: "/r/styles/:path*",
        has: [
          {
            type: "query",
            key: "v",
          },
        ],
        headers: versionedRegistryHeaders,
      },
      {
        // Bare registry URLs must not cache the redirect response, otherwise a
        // client could stay pinned to an older deployment id.
        source: "/r/:path*",
        missing: [
          {
            type: "query",
            key: "v",
          },
        ],
        headers: redirectRegistryHeaders,
      },
      {
        // All pages: allow same-origin + approved external sites to embed in iframes
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://shoogle.dev https://*.shoogle.dev",
          },
        ],
      },
      {
        // API routes: block iframes entirely
        source: "/api/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
        ],
      },
    ]
  },
  redirects() {
    return [
      {
        source: "/components",
        destination: "/docs/components",
        permanent: true,
      },
      {
        source: "/view/styles/:style/:name",
        destination: "/view/:name",
        permanent: true,
      },
      {
        source: "/docs/:path*.mdx",
        destination: "/docs/:path*.md",
        permanent: true,
      },
      // Special case redirects (intentional renames, listed before catch-all)
      {
        source: "/docs/form",
        destination: "/patterns/field",
        permanent: true,
      },
      {
        source: "/docs/toast",
        destination: "/patterns/sonner",
        permanent: true,
      },
      // Old ReUI component doc URLs should resolve to the canonical Base UI docs.
      {
        source: `/docs/:path(${canonicalComponentDocRedirectPattern})`,
        destination: "/docs/base/:path",
        permanent: true,
      },
      // Old pattern doc URLs → /patterns/:path
      // Only matches known pattern categories, NOT real docs pages like /docs/get-started
      {
        source: `/docs/:path(${legacyPatternCategoryRedirectPattern})`,
        destination: "/patterns/:path",
        permanent: true,
      },
      // Canonicalize registry URLs to a deploy-scoped cache key.
      ...createVersionedRegistryRedirects(
        "/r/styles/default/:path*",
        "/r/styles/radix-nova/:path*"
      ),
      ...createVersionedRegistryRedirects(
        "/r/default/:path*",
        "/r/styles/radix-nova/:path*"
      ),
      ...createVersionedRegistryRedirects(
        "/r/new-york/:path*",
        "/r/styles/radix-nova/:path*"
      ),
      ...createVersionedRegistryRedirects(
        "/r/new-york-v4/:path*",
        "/r/styles/radix-nova/:path*"
      ),
      {
        source: "/r/styles/:path*",
        missing: [
          {
            type: "query",
            key: "v",
          },
        ],
        destination: versionedRegistryDestination("/r/styles/:path*"),
        permanent: false,
      },
      ...createVersionedRegistryRedirects(
        "/r/:style/:name.json",
        "/r/styles/:style/:name.json"
      ),
    ]
  }
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
