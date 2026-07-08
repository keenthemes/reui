import { createMDX } from "fumadocs-mdx/next"

const registryDeploymentId =
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  "local"

function versionedRegistryDestination(destination) {
  const separator = destination.includes("?") ? "&" : "?"
  return `${destination}${separator}v=${registryDeploymentId}`
}

function createVersionedRegistryRedirects(source, destination) {
  return [
    {
      source,
      missing: [{ type: "query", key: "v" }],
      destination: versionedRegistryDestination(destination),
      permanent: false,
    },
    {
      source,
      has: [{ type: "query", key: "v", value: "(?<registryVersion>.*)" }],
      destination: `${destination}?v=:registryVersion`,
      permanent: true,
    },
  ]
}

const canonicalComponentDocRedirectPattern =
  "alert|autocomplete|badge|data-grid|date-selector|file-upload|filters|frame|kanban|number-field|phone-input|rating|scrollspy|sortable|stepper|timeline|tree"

const legacyComponentCategoryRedirectPattern =
  "accordion|alert-dialog|aspect-ratio|avatar|breadcrumb|button|button-group|calendar|card|carousel|chart|checkbox|collapsible|combobox|command|context-menu|dialog|drawer|dropdown-menu|empty|field|hover-card|input|input-group|input-otp|item|kbd|label|menubar|native-select|navigation-menu|pagination|popover|progress|radio-group|resizable|scroll-area|select|separator|sheet|skeleton|slider|sonner|spinner|switch|table|tabs|textarea|toggle|toggle-group|tooltip"

// Barrel packages worth optimizing (none are in Next's default list).
const optimizePackageImports = [
  "lucide-react",
  "@tabler/icons-react",
  "@phosphor-icons/react",
  "@remixicon/react",
  "@hugeicons/react",
  "@base-ui/react",
  "radix-ui",
  "motion",
  "jotai",
]

// Trace only the component registry metadata + generated component source that
// runtime code actually reads (listing, search, docs source rendering).
const componentMetadataTracingGlobs = [
  "./registry-reui/_meta/components/**/*.json",
]
const docsTracingGlobs = [
  "./content/docs/**/*",
  ...componentMetadataTracingGlobs,
  "./public/r/styles/base-nova/**/*.json",
  "./public/r/styles/radix-nova/**/*.json",
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  deploymentId:
    registryDeploymentId === "local" ? undefined : registryDeploymentId,
  // recharts 3.x renders empty under Next's production optimizer unless it is
  // transpiled through Next's own pipeline. Do not remove.
  transpilePackages: ["recharts"],
  devIndicators: false,
  skipTrailingSlashRedirect: true,
  productionBrowserSourceMaps: false,
  env: {
    NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID: registryDeploymentId,
  },
  typescript: {
    // The upstream source project also ships with this enabled; the app builds
    // and runs, and the vendored component packages carry their own type setup.
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    "/": componentMetadataTracingGlobs,
    "/docs": docsTracingGlobs,
    "/docs/**/*": docsTracingGlobs,
    "/components": componentMetadataTracingGlobs,
    "/components/**/*": componentMetadataTracingGlobs,
  },
  experimental: {
    preloadEntriesOnStart: false,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    serverSourceMaps: false,
    optimizePackageImports,
  },
  images: {
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatar.vercel.sh" },
      { protocol: "https", hostname: "picsum.photos" },
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
    ]
    const isDev = process.env.NODE_ENV === "development"
    const localConnect = isDev
      ? " http://127.0.0.1:* http://localhost:* ws://127.0.0.1:* ws://localhost:*"
      : ""
    const localImg = isDev ? " http://127.0.0.1:* http://localhost:*" : ""

    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      ...(isDev
        ? []
        : [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]),
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
      },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ]

    return [
      {
        source: "/r/styles/:path*",
        has: [{ type: "query", key: "v" }],
        headers: versionedRegistryHeaders,
      },
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Production only needs WASM compilation for the client-side
              // shiki highlighter (code views); dev also needs 'unsafe-eval'.
              `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : "'wasm-unsafe-eval'"} https://*.vercel-scripts.com https://vercel.live https://va.vercel-scripts.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              `img-src 'self' data: blob: https:${localImg}`,
              "font-src 'self' data: https://fonts.gstatic.com",
              `connect-src 'self' https://vercel.live https://*.vercel-insights.com${localConnect}`,
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ]
  },
  redirects() {
    return [
      // shadcn-muscle-memory + legacy docs URLs.
      {
        source: "/docs/installation",
        destination: "/docs/get-started",
        permanent: true,
      },
      { source: "/docs/cli", destination: "/docs/get-started", permanent: true },
      {
        source: "/docs/:path*.mdx",
        destination: "/docs/:path*.md",
        permanent: true,
      },
      {
        source: "/docs/form",
        destination: "/components/field",
        permanent: true,
      },
      {
        source: "/docs/toast",
        destination: "/components/sonner",
        permanent: true,
      },
      {
        source: `/docs/:path(${canonicalComponentDocRedirectPattern})`,
        destination: "/docs/components/base/:path",
        permanent: true,
      },
      {
        source: "/docs/components/:path",
        destination: "/docs/components/base/:path",
        permanent: true,
      },
      {
        source: "/docs/base/:path*",
        destination: "/docs/components/base/:path*",
        permanent: true,
      },
      {
        source: "/docs/radix/:path*",
        destination: "/docs/components/radix/:path*",
        permanent: true,
      },
      {
        source: `/docs/:path(${legacyComponentCategoryRedirectPattern})`,
        destination: "/components/:path",
        permanent: true,
      },
      // Map the shadcn CLI style aliases onto the canonical base-nova style.
      ...createVersionedRegistryRedirects(
        "/r/styles/default/:path*",
        "/r/styles/base-nova/:path*"
      ),
      ...createVersionedRegistryRedirects(
        "/r/default/:path*",
        "/r/styles/base-nova/:path*"
      ),
      ...createVersionedRegistryRedirects(
        "/r/new-york/:path*",
        "/r/styles/base-nova/:path*"
      ),
      ...createVersionedRegistryRedirects(
        "/r/:name.json",
        "/r/styles/base-nova/:name.json"
      ),
      // Map the shadcn CLI namespace form `/r/<style>/<name>.json` onto the
      // canonical `/r/styles/<style>/<name>.json`. The `(?!styles/)` lookahead
      // keeps already-canonical paths from doubling their segment.
      ...createVersionedRegistryRedirects(
        "/r/:style((?!styles/)[^/]+)/:name.json",
        "/r/styles/:style/:name.json"
      ),
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
