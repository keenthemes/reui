import type { MetadataRoute } from "next"

import { META_THEME_COLORS, siteConfig } from "@/lib/config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: META_THEME_COLORS.light,
    theme_color: META_THEME_COLORS.dark,
    icons: [
      {
        src: "/brand/logo-icon-dark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
