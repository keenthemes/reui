"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import {
  buildRegistryTheme,
  DEFAULT_CONFIG,
  type DesignSystemConfig,
  type IconLibraryName,
} from "@/registry/config"
import {
  isInIframe,
  useIframeMessageListener,
} from "@/app/(create)/hooks/use-iframe-sync"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  loadDesignSystemSearchParams,
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

interface DesignSystemContextValue {
  style: string | null
  theme: string | null
  font: string | null
  baseColor: string | null
  menuAccent: string | null
  menuColor: string | null
  radius: string | null
  iconLibrary: IconLibraryName | null
}

export const DesignSystemContext =
  React.createContext<DesignSystemContextValue | null>(null)

export function useDesignSystem() {
  const context = React.useContext(DesignSystemContext)
  if (!context) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider"
    )
  }
  return context
}

// Keys to check for in URL to determine if design system params exist
export const DESIGN_SYSTEM_URL_KEYS = [
  "base",
  "style",
  "theme",
  "baseColor",
  "font",
  "iconLibrary",
  "menuAccent",
  "menuColor",
  "radius",
  "item",
  "template",
  "size",
  "custom",
] as const

/**
 * Sync-only provider for the host page.
 * Handles URL -> localStorage synchronization on mount (for deep links).
 * Use this in the patterns layout (host page).
 *
 * NOTE: This provider renders children immediately to avoid causing
 * child components (like iframes) to mount/unmount during hydration.
 */
export function DesignSystemSyncProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [config, setConfig] = useConfig()
  const hasSyncedRef = React.useRef(false)

  // Initial sync on mount: URL -> localStorage only
  // Using useLayoutEffect to sync before paint, but still render children immediately
  React.useLayoutEffect(() => {
    if (hasSyncedRef.current) return
    hasSyncedRef.current = true

    const urlParams = new URLSearchParams(window.location.search)
    const hasDesignSystemParams = DESIGN_SYSTEM_URL_KEYS.some((key) =>
      urlParams.has(key)
    )

    if (hasDesignSystemParams) {
      // URL HAS params -> Sync them to localStorage (user arrived via deep link)
      const parsed = loadDesignSystemSearchParams(urlParams)

      setConfig((prev) => {
        const next = { ...prev }
        DESIGN_SYSTEM_URL_KEYS.forEach((key) => {
          if (urlParams.has(key)) {
            // @ts-ignore
            next[key] = parsed[key]
          }
        })
        return next
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  // Render children immediately - don't wait for sync to complete
  // This prevents iframe from mounting/unmounting during hydration
  return <>{children}</>
}

/**
 * Full provider for iframe pages.
 * Applies design system styles (CSS classes, CSS variables, fonts) to the page.
 * Use this in iframe preview pages.
 */
export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [params] = useDesignSystemSearchParams({
    shallow: true,
    history: "replace",
  })
  const [config] = useConfig()

  // Use local state for overrides received from parent via postMessage.
  // This prevents URL updates which would trigger server-side re-renders.
  const [overrides, setOverrides] = React.useState<
    Partial<DesignSystemSearchParams>
  >({})

  // Listen for design system params from parent window (iframe mode)
  // Store in local state instead of updating URL to avoid re-renders
  useIframeMessageListener("design-system-params", setOverrides)

  // Merge: overrides (from postMessage) > params (from URL) > config (from localStorage)
  const style = overrides.style ?? params.style ?? config.style
  const theme = overrides.theme ?? params.theme ?? config.theme
  const font = overrides.font ?? params.font ?? config.font
  const baseColor = overrides.baseColor ?? params.baseColor ?? config.baseColor
  const menuAccent =
    overrides.menuAccent ?? params.menuAccent ?? config.menuAccent
  const menuColor = overrides.menuColor ?? params.menuColor ?? config.menuColor
  const radius = overrides.radius ?? params.radius ?? config.radius
  const iconLibrary =
    overrides.iconLibrary ?? params.iconLibrary ?? config.iconLibrary

  const [isReady, setIsReady] = React.useState(false)

  // Use useLayoutEffect for synchronous style updates to prevent flash.
  React.useLayoutEffect(() => {
    if (!style || !theme || !font || !baseColor || !iconLibrary) {
      return
    }

    const body = document.body

    // Update style class in place (remove old, add new).
    body.classList.forEach((className) => {
      if (className.startsWith("style-")) {
        body.classList.remove(className)
      }
    })
    body.classList.add(`style-${style}`)

    // Update base color class in place.
    body.classList.forEach((className) => {
      if (className.startsWith("base-color-")) {
        body.classList.remove(className)
      }
    })
    body.classList.add(`base-color-${baseColor}`)

    // Update font.
    const selectedFont = FONTS.find((f) => f.value === font)
    if (selectedFont) {
      const fontFamily = selectedFont.font.style.fontFamily
      document.documentElement.style.setProperty("--font-sans", fontFamily)
    }

    setIsReady(true)
  }, [style, theme, font, baseColor, iconLibrary])

  const registryTheme = React.useMemo(() => {
    if (!baseColor || !theme || !menuAccent || !radius) {
      return null
    }

    const config: DesignSystemConfig = {
      ...DEFAULT_CONFIG,
      baseColor,
      theme,
      menuAccent,
      radius,
    }

    return buildRegistryTheme(config)
  }, [baseColor, theme, menuAccent, radius])

  // Use useLayoutEffect for synchronous CSS var updates.
  React.useLayoutEffect(() => {
    if (!registryTheme || !registryTheme.cssVars) {
      return
    }

    const styleId = "design-system-theme-vars"
    let styleElement = document.getElementById(
      styleId
    ) as HTMLStyleElement | null

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    const {
      light: lightVars,
      dark: darkVars,
      theme: themeVars,
    } = registryTheme.cssVars

    let cssText = ":root {\n"
    // Add theme vars (shared across light/dark).
    if (themeVars) {
      Object.entries(themeVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }
    // Add light mode vars.
    if (lightVars) {
      Object.entries(lightVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }
    cssText += "}\n\n"

    cssText += ".dark {\n"
    if (darkVars) {
      Object.entries(darkVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }
    cssText += "}\n"

    styleElement.textContent = cssText
  }, [registryTheme])

  // Signal parent that iframe content is ready and interactive.
  // This fires after styles are applied (isReady=true), so the parent can
  // remove the loading overlay as soon as the iframe renders styled content.
  React.useEffect(() => {
    if (isReady && isInIframe()) {
      window.parent.postMessage({ type: "iframe-ready" }, "*")
    }
  }, [isReady])

  // Handle menu color inversion by adding/removing dark class to elements with cn-menu-target.
  React.useEffect(() => {
    if (!menuColor) {
      return
    }

    const updateMenuElements = () => {
      const menuElements = document.querySelectorAll(".cn-menu-target")
      menuElements.forEach((element) => {
        if (menuColor === "inverted") {
          element.classList.add("dark")
        } else {
          element.classList.remove("dark")
        }
      })
    }

    // Update existing menu elements.
    updateMenuElements()

    // Watch for new menu elements being added to the DOM.
    const observer = new MutationObserver(() => {
      updateMenuElements()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [menuColor])

  if (!isReady) {
    return null
  }

  return (
    <DesignSystemContext.Provider
      value={{
        style,
        theme,
        font,
        baseColor,
        menuAccent,
        menuColor,
        radius,
        iconLibrary,
      }}
    >
      {children}
    </DesignSystemContext.Provider>
  )
}
