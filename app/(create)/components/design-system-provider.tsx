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
  fontHeading: string | null
  chartColor: string | null
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
  "chartColor",
  "font",
  "fontHeading",
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
  const [params, setParams] = useDesignSystemSearchParams({
    shallow: true,
    history: "replace",
  })
  const [config, setConfig] = useConfig()

  // Match shadcn: sync iframe nuqs state from the host via postMessage so
  // heading font and other params apply without relying on a separate
  // override layer or cross-context localStorage sync.
  const handleDesignSystemMessage = React.useCallback(
    (nextParams: DesignSystemSearchParams) => {
      setParams(nextParams)
    },
    [setParams]
  )

  useIframeMessageListener("design-system-params", handleDesignSystemMessage)

  // Merge: params (URL / postMessage via setParams) > config (localStorage)
  const style = params.style ?? config.style
  const theme = params.theme ?? config.theme
  const font = params.font ?? config.font
  const fontHeading =
    params.fontHeading ?? config.fontHeading ?? DEFAULT_CONFIG.fontHeading
  const chartColor =
    params.chartColor ?? config.chartColor ?? DEFAULT_CONFIG.chartColor
  const baseColor = params.baseColor ?? config.baseColor
  const menuAccent = params.menuAccent ?? config.menuAccent
  const menuColor = params.menuColor ?? config.menuColor
  const radius = params.radius ?? config.radius
  const iconLibrary = params.iconLibrary ?? config.iconLibrary

  const effectiveRadius = style === "lyra" ? "none" : radius

  const selectedFont = React.useMemo(
    () => FONTS.find((fontOption) => fontOption.value === font),
    [font]
  )

  const selectedHeadingFont = React.useMemo(() => {
    if (fontHeading === "inherit" || fontHeading === font) {
      return selectedFont
    }
    return FONTS.find((fontOption) => fontOption.value === fontHeading)
  }, [font, fontHeading, selectedFont])
  const previousDocumentStateRef = React.useRef<{
    styleClasses: string[]
    baseColorClasses: string[]
    fontSans: string
    fontHeading: string
    bodyFontFamily: string
  } | null>(null)
  const previousThemeStyleRef = React.useRef<{
    existed: boolean
    textContent: string
  } | null>(null)

  React.useEffect(() => {
    if (style === "lyra" && radius !== "none") {
      setParams({ radius: "none" })
      setConfig((prev) => ({ ...prev, radius: "none" }))
    }
  }, [style, radius, setParams, setConfig])

  React.useEffect(() => {
    if (!isInIframe()) {
      return
    }

    const root = document.documentElement
    const body = document.body
    const previousRootOverflowY = root.style.overflowY
    const previousBodyOverflowY = body.style.overflowY
    const previousRootOverscroll = root.style.overscrollBehavior
    const previousBodyOverscroll = body.style.overscrollBehavior

    root.style.overflowY = "hidden"
    body.style.overflowY = "hidden"
    root.style.overscrollBehavior = "none"
    body.style.overscrollBehavior = "none"

    return () => {
      root.style.overflowY = previousRootOverflowY
      body.style.overflowY = previousBodyOverflowY
      root.style.overscrollBehavior = previousRootOverscroll
      body.style.overscrollBehavior = previousBodyOverscroll
    }
  }, [])

  const [isReady, setIsReady] = React.useState(false)

  // Use useLayoutEffect for synchronous style updates to prevent flash.
  React.useLayoutEffect(() => {
    if (!style || !theme || !font || !baseColor || !iconLibrary) {
      return
    }

    const body = document.body
    const root = document.documentElement

    if (!previousDocumentStateRef.current) {
      previousDocumentStateRef.current = {
        styleClasses: Array.from(body.classList).filter((className) =>
          className.startsWith("style-")
        ),
        baseColorClasses: Array.from(body.classList).filter((className) =>
          className.startsWith("base-color-")
        ),
        fontSans: root.style.getPropertyValue("--font-sans"),
        fontHeading: root.style.getPropertyValue("--font-heading"),
        bodyFontFamily: body.style.fontFamily,
      }
    }

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

    // Body / UI font (--font-sans) and heading (--font-heading).
    if (selectedFont) {
      root.style.setProperty("--font-sans", selectedFont.font.style.fontFamily)
      body.style.fontFamily = selectedFont.font.style.fontFamily
    }
    if (selectedHeadingFont) {
      root.style.setProperty(
        "--font-heading",
        selectedHeadingFont.font.style.fontFamily
      )
    }

    setIsReady(true)
  }, [
    style,
    theme,
    font,
    fontHeading,
    baseColor,
    iconLibrary,
    selectedFont,
    selectedHeadingFont,
  ])

  React.useEffect(() => {
    return () => {
      const previousDocumentState = previousDocumentStateRef.current
      const body = document.body
      const root = document.documentElement

      if (previousDocumentState) {
        body.classList.forEach((className) => {
          if (
            className.startsWith("style-") ||
            className.startsWith("base-color-")
          ) {
            body.classList.remove(className)
          }
        })

        previousDocumentState.styleClasses.forEach((className) => {
          body.classList.add(className)
        })

        previousDocumentState.baseColorClasses.forEach((className) => {
          body.classList.add(className)
        })

        if (previousDocumentState.fontSans) {
          root.style.setProperty("--font-sans", previousDocumentState.fontSans)
        } else {
          root.style.removeProperty("--font-sans")
        }

        if (previousDocumentState.fontHeading) {
          root.style.setProperty(
            "--font-heading",
            previousDocumentState.fontHeading
          )
        } else {
          root.style.removeProperty("--font-heading")
        }

        if (previousDocumentState.bodyFontFamily) {
          body.style.fontFamily = previousDocumentState.bodyFontFamily
        } else {
          body.style.removeProperty("font-family")
        }
      }

      const styleElement = document.getElementById(
        "design-system-theme-vars"
      ) as HTMLStyleElement | null

      if (!styleElement) {
        return
      }

      if (previousThemeStyleRef.current?.existed) {
        styleElement.textContent = previousThemeStyleRef.current.textContent
        return
      }

      styleElement.remove()
    }
  }, [])

  const registryTheme = React.useMemo(() => {
    if (
      !baseColor ||
      !theme ||
      !menuAccent ||
      !effectiveRadius ||
      !chartColor
    ) {
      return null
    }

    const themeConfig: DesignSystemConfig = {
      ...DEFAULT_CONFIG,
      baseColor,
      theme,
      chartColor,
      menuAccent,
      radius: effectiveRadius,
    }

    return buildRegistryTheme(themeConfig)
  }, [baseColor, theme, chartColor, menuAccent, effectiveRadius])

  // Use useLayoutEffect for synchronous CSS var updates.
  React.useLayoutEffect(() => {
    if (!registryTheme || !registryTheme.cssVars) {
      return
    }

    const styleId = "design-system-theme-vars"
    const existingStyleElement = document.getElementById(
      styleId
    ) as HTMLStyleElement | null
    let styleElement = existingStyleElement

    if (!previousThemeStyleRef.current) {
      previousThemeStyleRef.current = {
        existed: Boolean(existingStyleElement),
        textContent: existingStyleElement?.textContent ?? "",
      }
    }

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
      window.parent.postMessage(
        { type: "iframe-ready" },
        window.location.origin
      )
    }
  }, [isReady])

  // Keep the host iframe height in sync with the rendered preview so the
  // parent page can use normal document scrolling instead of an inner iframe
  // scrollbar. ResizeObserver handles layout changes while MutationObserver
  // catches dynamic content insertions before layout settles.
  React.useEffect(() => {
    if (!isReady || !isInIframe()) {
      return
    }

    let frameId = 0
    let lastHeight = 0

    const getDocumentHeight = () => {
      const root = document.documentElement
      const body = document.body

      return Math.ceil(
        Math.max(
          root.scrollHeight,
          body.scrollHeight,
          root.offsetHeight,
          body.offsetHeight,
          root.getBoundingClientRect().height,
          body.getBoundingClientRect().height
        )
      )
    }

    const postHeight = () => {
      frameId = 0
      const nextHeight = getDocumentHeight()

      if (!nextHeight || Math.abs(nextHeight - lastHeight) < 2) {
        return
      }

      lastHeight = nextHeight
      window.parent.postMessage(
        { type: "iframe-height", height: nextHeight },
        window.location.origin
      )
    }

    const scheduleHeightUpdate = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(postHeight)
    }

    scheduleHeightUpdate()

    const resizeObserver = new ResizeObserver(() => {
      scheduleHeightUpdate()
    })

    resizeObserver.observe(document.documentElement)
    resizeObserver.observe(document.body)

    const mutationObserver = new MutationObserver(() => {
      scheduleHeightUpdate()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    window.addEventListener("resize", scheduleHeightUpdate)

    void document.fonts?.ready?.then(() => {
      scheduleHeightUpdate()
    })

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener("resize", scheduleHeightUpdate)
    }
  }, [isReady])

  // Handle menu color inversion and translucency by updating cn-menu-target elements.
  React.useEffect(() => {
    if (!menuColor) {
      return
    }

    const isInvertedMenu =
      menuColor === "inverted" || menuColor === "inverted-translucent"
    const isTranslucentMenu =
      menuColor === "default-translucent" ||
      menuColor === "inverted-translucent"
    let frameId = 0

    const updateMenuElements = () => {
      const allElements = document.querySelectorAll<HTMLElement>(
        ".cn-menu-target, [data-menu-translucent]"
      )

      if (allElements.length === 0) return

      // Disable transitions while toggling classes.
      allElements.forEach((element) => {
        element.style.transition = "none"
      })

      allElements.forEach((element) => {
        if (element.classList.contains("cn-menu-target")) {
          if (isInvertedMenu) {
            element.classList.add("dark")
          } else {
            element.classList.remove("dark")
          }
        }

        // Toggle translucent class: use class when active, data-attr when inactive
        // so the element stays queryable for future toggles.
        if (isTranslucentMenu) {
          element.classList.add("cn-menu-translucent")
          element.removeAttribute("data-menu-translucent")
        } else if (element.classList.contains("cn-menu-translucent")) {
          element.classList.remove("cn-menu-translucent")
          element.setAttribute("data-menu-translucent", "")
        }
      })

      // Force reflow, then re-enable transitions.
      void document.body.offsetHeight
      allElements.forEach((element) => {
        element.style.transition = ""
      })
    }

    const scheduleMenuUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        updateMenuElements()
      })
    }

    // Update existing menu elements.
    scheduleMenuUpdate()

    // Watch for new menu elements being added to the DOM.
    const observer = new MutationObserver(() => {
      scheduleMenuUpdate()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
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
        fontHeading,
        chartColor,
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
