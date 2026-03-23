import type { Metadata } from "next"
import { Provider as JotaiProvider } from "jotai"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { META_THEME_COLORS, siteConfig } from "@/lib/config"
import { fontVariables } from "@/lib/fonts"
import {
  buildOrganizationJsonLd,
  buildPageSocialMetadata,
  buildWebSiteJsonLd,
  getSiteAuthors,
  getSiteUrl,
} from "@/lib/seo"
import { cn } from "@/lib/utils"
import { LayoutProvider } from "@/hooks/use-layout"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@/components/analytics"
import { JsonLd } from "@/components/json-ld"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import "@/styles/globals.css"

const appUrl = getSiteUrl()
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: siteConfig.metadata.titleTemplate,
  },
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: "/",
  },
  description: siteConfig.description,
  keywords: [
    "ReUI",
    "shadcn patterns",
    "shadcn components",
    "shadcn/ui",
    "shadcn ui",
    "shadcn ecosystem",
    "React components",
    "Tailwind CSS components",
    "open source UI",
    "data grid",
    "datagrid",
    "data table",
    "shadcn data grid",
    "shadcn alert",
    "shadcn filters",
    "file upload",
    "combobox",
    "filters",
    "component library",
    "design system",
  ],
  authors: getSiteAuthors(),
  creator: siteConfig.name,
  publisher: siteConfig.name,
  ...buildPageSocialMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/",
  }),
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
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "group/body overscroll-none antialiased [--footer-height:--spacing(14)] [--header-height:--spacing(14)] xl:[--footer-height:--spacing(24)]",
          "[&:not(:has([data-slot=patterns-preview]))]:font-site-sans"
        )}
      >
        <JsonLd data={buildWebSiteJsonLd()} />
        <JsonLd data={buildOrganizationJsonLd()} />
        <ThemeProvider>
          <LayoutProvider>
            <JotaiProvider>
              <NuqsAdapter>
                {children}
                <TailwindIndicator />
                <Toaster position="top-center" />
              </NuqsAdapter>
            </JotaiProvider>
            <Analytics />
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
