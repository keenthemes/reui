import { Suspense } from "react"
import type { Metadata } from "next"
import { Provider as JotaiProvider } from "jotai"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { META_THEME_COLORS, siteConfig } from "@/lib/config"
import { fontVariables } from "@/lib/fonts"
import { getOgImageUrl } from "@/lib/seo"
import { getSiteUrl } from "@/lib/site-url"
import { cn } from "@/lib/utils"
import { LayoutProvider } from "@/hooks/use-layout"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@/components/analytics"
import { ScrollToTop } from "@/components/scroll-to-top"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { TopProgressBar } from "@/components/top-progress-bar"

import "@/styles/globals.css"

const appUrl = getSiteUrl()
// Branded, CDN-cached dynamic OG as the site-wide default/fallback. Most
// pages override this with their own `/og?title=…` via buildPageMetadata.
const defaultOgImage = getOgImageUrl(siteConfig.name, siteConfig.description)

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(appUrl),
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Components",
    "Component Examples",
    "Primitives",
    "Base UI",
    "Radix UI",
    "TypeScript",
    "ReUI",
    "registry",
    "shadcn",
  ],
  authors: [
    {
      name: "ReUI",
      url: "https://reui.io",
    },
  ],
  creator: "reui_io",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [defaultOgImage],
    creator: "@reui_io",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/brand/logo-default.png",
        sizes: "500x500",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(fontVariables, "overscroll-none")}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        className={cn(
          "group/body overflow-x-hidden overscroll-none antialiased [--announcement-height:0px] [--blocks-sidebar-width:256px] [--customizer-sidebar-width:240px] [--footer-height:--spacing(14)] [--header-height:--spacing(14)] [--site-top-offset:calc(var(--header-height)+var(--announcement-height))] xl:[--footer-height:--spacing(24)]",
          "[&:not(:has([data-slot=component-preview]))]:font-site-sans",
          "style-nova"
        )}
      >
        <ThemeProvider>
          <LayoutProvider>
            <JotaiProvider>
              <Suspense>
                <NuqsAdapter>
                  <TopProgressBar />
                  <ScrollToTop />
                  {children}
                  <TailwindIndicator />
                  <Toaster position="top-center" />
                </NuqsAdapter>
              </Suspense>
            </JotaiProvider>
            <Analytics />
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
