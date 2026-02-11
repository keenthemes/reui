import type { Metadata } from "next"
import { Provider as JotaiProvider } from "jotai"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { META_THEME_COLORS, siteConfig } from "@/lib/config"
import { fontVariables } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { LayoutProvider } from "@/hooks/use-layout"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@/components/analytics"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import "@/styles/globals.css"

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || siteConfig.url || "https://reui.io"

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
    "Base UI",
    "Radix UI",
    "TypeScript",
    "Blocks",
    "Patterns",
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
        url: `${appUrl}/brand/logo-default.png`,
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
    images: [`${appUrl}/brand/logo-default.png`],
    creator: "@reui_io",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/brand/logo-default.png",
    apple: "/brand/logo-default.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
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
          "group/body overscroll-none antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]",
          "[&:not(:has([data-slot=patterns-preview]))]:font-inter",
          "style-nova" // for docs
        )}
      >
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
