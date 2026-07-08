"use client"

import * as React from "react"

import { notifyIconLibraryChanged } from "@/lib/icon-library-store"
import { useConfig } from "@/hooks/use-config"
import {
  buildRegistryTheme,
  DEFAULT_CONFIG,
  type DesignSystemConfig,
  type StyleName,
} from "@/registry/config"
import {
  DESIGN_SYSTEM_URL_KEYS,
  DesignSystemContext,
} from "@/app/(create)/design-system/design-system-context"
import {
  isInIframe,
  isSameOriginEmbed,
  useIframeMessageListener,
} from "@/app/(create)/hooks/use-iframe-sync"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  loadDesignSystemSearchParams,
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"
import {
  getRadiusForStyleSelection,
  getRadiusForStyleTransition,
} from "@/app/(create)/lib/style-radius"

// Re-export from the pure context module so existing call sites that
// import these from "design-system-provider" keep working unchanged.
// Block source (via IconPlaceholder) should import directly from
// "design-system-context" to avoid pulling FONTS / next/font.
export {
  DesignSystemContext,
  useDesignSystem,
  DESIGN_SYSTEM_URL_KEYS,
} from "@/app/(create)/design-system/design-system-context"
export type { DesignSystemContextValue } from "@/app/(create)/design-system/design-system-context"

/**
 * Sync-only provider for the host page.
 * Handles URL -> localStorage synchronization on mount (for deep links).
 * Use this in the components layout (host page).
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
        if (
          urlParams.has("style") &&
          !urlParams.has("radius") &&
          parsed.style
        ) {
          next.radius = getRadiusForStyleSelection(parsed.style)
        }
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
 *
 * `effectsOnly`: when true, returns `null` instead of wrapping children with
 * the context provider. All side-effects (DOM class / CSS-var / font / iframe-
 * message-listener) still run. Used on host pages (e.g. `/components/[category]`)
 * so the page content can render alongside this
 * component as a sibling — keeping it outside the Suspense boundary that the
 * nuqs read on this component requires under `cacheComponents: true`. Without
 * this mode, the entire layout tree gets stuck behind the boundary's fallback
 * during prerender, producing a visible blank-flash before the cached content
 * streams in.
 */
export function DesignSystemProvider({
  children,
  effectsOnly = false,
}: {
  children?: React.ReactNode
  effectsOnly?: boolean
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
      // If the host changed `iconLibrary`, mirror it into localStorage
      // and notify same-tab subscribers. IconPlaceholder reads from
      // localStorage via `useIconLibrary` (no nuqs / no Context), so a
      // postMessage from the host won't flip it without this bridge.
      if (
        nextParams.iconLibrary !== undefined &&
        nextParams.iconLibrary !== null
      ) {
        setConfig((prev) => ({ ...prev, iconLibrary: nextParams.iconLibrary! }))
        notifyIconLibraryChanged()
      }
    },
    [setParams, setConfig]
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
  const previousStyleRef = React.useRef<StyleName | null>(null)
  const previousThemeStyleRef = React.useRef<{
    existed: boolean
    textContent: string
  } | null>(null)

  React.useEffect(() => {
    const previousStyle = previousStyleRef.current
    previousStyleRef.current = style

    const nextRadius =
      previousStyle === null && style === "lyra"
        ? getRadiusForStyleSelection(style)
        : getRadiusForStyleTransition(previousStyle, style, radius)

    if (nextRadius && nextRadius !== radius) {
      setParams({ radius: nextRadius })
      setConfig((prev) => ({ ...prev, radius: nextRadius }))
    }
  }, [style, radius, setParams, setConfig])

  React.useEffect(() => {
    // Lock document scroll ONLY for reui's OWN same-origin preview embeds, where
    // the parent frame owns the scroll. A cross-origin embedder (e.g.
    // shoogle.dev) must keep normal document scroll - gating this on
    // `isInIframe()` (any embed) left the whole listing page unscrollable inside
    // external iframes. See isSameOriginEmbed.
    if (!isSameOriginEmbed()) {
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
  // Embedded single-block previews defer this signal until the lazy block
  // itself has rendered, otherwise the viewer briefly shows two spinners.
  React.useEffect(() => {
    const isEmbeddedBlockPreview =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("embed") === "1"

    if (isReady && isInIframe() && !isEmbeddedBlockPreview) {
      window.parent.postMessage(
        { type: "iframe-ready" },
        window.location.origin
      )
    }
  }, [isReady])

  // NOTE: a previous revision posted `iframe-height` messages to the
  // parent on every ResizeObserver / MutationObserver / window.resize
  // tick (with a `getDocumentHeight()` that ran six layout queries each
  // call). It was intended to let an embedder sync the host iframe's
  // height to its content, but no consumer ever subscribed in this
  // repo. With N <iframe> previews on a listing page, that effect ran
  // inside every child frame on every parent resize event, forcing
  // N × multiple synchronous reflows per frame and visibly janking
  // window resize. The block-listing iframes use a fixed
  // `--block-height` CSS variable, so height-sync isn't needed.
  //
  // If a future embedder needs height-sync, re-introduce a narrower,
  // opt-in version (e.g. behind a `?sync-height=1` query param) and
  // drop the redundant `window.resize` listener — ResizeObserver on
  // `document.body` already covers viewport resizes.

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
    //
    // PERF: the previous version called `scheduleMenuUpdate()` on
    // EVERY mutation, then ran a full-document query + forced sync
    // reflow (`void document.body.offsetHeight`) inside that
    // callback. At the layout level (this provider runs in
    // `effectsOnly` mode for every blocks page) that made window
    // resize visibly janky — sidebar/breadcrumb/preview-panel
    // re-renders during the drag mutate the DOM, every mutation
    // fires the observer, every observer tick forces a reflow.
    //
    // Filter to "did an added node contain a menu surface?" so the
    // expensive work only runs when a popover / select / dropdown
    // actually mounts.
    const MENU_SELECTOR = ".cn-menu-target, [data-menu-translucent]"
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") continue
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue
          if (
            node.matches?.(MENU_SELECTOR) ||
            node.querySelector?.(MENU_SELECTOR)
          ) {
            scheduleMenuUpdate()
            return
          }
        }
      }
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

  // `effectsOnly` mode: rendering nothing is the whole point — host-page
  // callers pass no children and rely solely on the side-effects above to
  // apply DOM classes / CSS vars / fonts. Always return null, regardless of
  // isReady, since there's no children to gate against FOUC.
  if (effectsOnly) {
    return null
  }

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
