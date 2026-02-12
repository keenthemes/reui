import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  skipTrailingSlashRedirect: true,
  skipProxyUrlNormalize: true,
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
      // Old component doc URLs → /patterns/:path
      // Only matches known pattern categories, NOT real docs pages like /docs/get-started
      {
        source: "/docs/:path(accordion|alert|alert-dialog|aspect-ratio|autocomplete|avatar|badge|breadcrumb|button|button-group|calendar|card|carousel|chart|checkbox|collapsible|combobox|command|context-menu|data-grid|date-selector|dialog|drawer|dropdown-menu|empty|field|file-upload|filters|frame|hover-card|input|input-group|input-otp|item|kanban|kbd|label|menubar|native-select|navigation-menu|number-field|pagination|phone-input|popover|progress|radio-group|rating|resizable|scroll-area|scrollspy|select|separator|sheet|skeleton|slider|sonner|sortable|spinner|stepper|switch|table|tabs|textarea|timeline|toggle|toggle-group|tooltip|tree)",
        destination: "/patterns/:path",
        permanent: true,
      },
      // Default style fallback: /r/styles/default/* → /r/styles/radix-nova/*
      {
        source: "/r/styles/default/:path*",
        destination: "/r/styles/radix-nova/:path*",
        permanent: true,
      },
      // Backward-compat: old /r/:style/:name.json → new /r/styles/:style/:name.json
      {
        source: "/r/:style/:name.json",
        destination: "/r/styles/:style/:name.json",
        permanent: true,
      },
    ]
  }
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
