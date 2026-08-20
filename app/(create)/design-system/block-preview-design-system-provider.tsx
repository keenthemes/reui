"use client"

import * as React from "react"

import {
  BASE_COLORS,
  BASES,
  buildRegistryTheme,
  DEFAULT_CONFIG,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  THEMES,
  type BaseColorName,
  type ChartColorName,
  type DesignSystemConfig,
  type FontHeadingValue,
  type FontValue,
  type IconLibraryName,
  type MenuAccentValue,
  type MenuColorValue,
  type RadiusValue,
  type StyleName,
  type ThemeName,
} from "@/registry/config"
import { filterAvailableBases } from "@/lib/registry-bases"
import {
  isInIframe,
  useIframeMessageListener,
} from "@/app/(create)/hooks/use-iframe-sync"
import { FONTS } from "@/app/(create)/lib/fonts"
import type { DesignSystemSearchParams } from "@/app/(create)/lib/search-params"
import {
  getRadiusForStyleSelection,
  getRadiusForStyleTransition,
} from "@/app/(create)/lib/style-radius"

type PreviewDesignSystemParams = Pick<
  DesignSystemSearchParams,
  | "base"
  | "style"
  | "theme"
  | "font"
  | "fontHeading"
  | "chartColor"
  | "baseColor"
  | "menuAccent"
  | "menuColor"
  | "radius"
  | "iconLibrary"
>

const BASE_NAMES = new Set(filterAvailableBases(BASES).map((base) => base.name))
const STYLE_NAMES = new Set(STYLES.map((style) => style.name))
const THEME_NAMES = new Set(THEMES.map((theme) => theme.name))
const BASE_COLOR_NAMES = new Set(BASE_COLORS.map((color) => color.name))
const MENU_ACCENT_VALUES = new Set(MENU_ACCENTS.map((accent) => accent.value))
const MENU_COLOR_VALUES = new Set(MENU_COLORS.map((color) => color.value))
const RADIUS_VALUES = new Set(RADII.map((radius) => radius.name))
const ICON_LIBRARY_NAMES = new Set(
  Object.values(iconLibraries).map((library) => library.name)
)
const FONT_VALUES = new Set(FONTS.map((font) => font.value))
const FONT_HEADING_VALUES = new Set<FontHeadingValue>([
  "inherit",
  ...FONTS.map((font) => font.value),
])

function resolveParamValue<T extends string>(
  value: string | null | undefined,
  allowedValues: Set<string>,
  fallback: T
): T {
  return value && allowedValues.has(value) ? (value as T) : fallback
}

function sanitizePreviewParams(
  nextParams: Partial<PreviewDesignSystemParams>
): PreviewDesignSystemParams {
  return {
    base: resolveParamValue(nextParams.base, BASE_NAMES, DEFAULT_CONFIG.base),
    style: resolveParamValue(
      nextParams.style,
      STYLE_NAMES,
      DEFAULT_CONFIG.style
    ),
    theme: resolveParamValue(
      nextParams.theme,
      THEME_NAMES,
      DEFAULT_CONFIG.theme
    ),
    font: resolveParamValue(nextParams.font, FONT_VALUES, DEFAULT_CONFIG.font),
    fontHeading: resolveParamValue(
      nextParams.fontHeading,
      FONT_HEADING_VALUES,
      DEFAULT_CONFIG.fontHeading
    ),
    chartColor: resolveParamValue(
      nextParams.chartColor,
      THEME_NAMES,
      DEFAULT_CONFIG.chartColor
    ) as ChartColorName,
    baseColor: resolveParamValue(
      nextParams.baseColor,
      BASE_COLOR_NAMES,
      DEFAULT_CONFIG.baseColor
    ) as BaseColorName,
    menuAccent: resolveParamValue(
      nextParams.menuAccent,
      MENU_ACCENT_VALUES,
      DEFAULT_CONFIG.menuAccent
    ) as MenuAccentValue,
    menuColor: resolveParamValue(
      nextParams.menuColor,
      MENU_COLOR_VALUES,
      DEFAULT_CONFIG.menuColor
    ) as MenuColorValue,
    radius: resolveParamValue(
      nextParams.radius,
      RADIUS_VALUES,
      DEFAULT_CONFIG.radius
    ) as RadiusValue,
    iconLibrary: resolveParamValue(
      nextParams.iconLibrary,
      ICON_LIBRARY_NAMES,
      DEFAULT_CONFIG.iconLibrary
    ) as IconLibraryName,
  }
}

function mergePreviewParams(
  previous: PreviewDesignSystemParams,
  nextParams: DesignSystemSearchParams
): PreviewDesignSystemParams {
  return sanitizePreviewParams({
    base: nextParams.base ?? previous.base,
    style: nextParams.style ?? previous.style,
    theme: nextParams.theme ?? previous.theme,
    font: nextParams.font ?? previous.font,
    fontHeading: nextParams.fontHeading ?? previous.fontHeading,
    chartColor: nextParams.chartColor ?? previous.chartColor,
    baseColor: nextParams.baseColor ?? previous.baseColor,
    menuAccent: nextParams.menuAccent ?? previous.menuAccent,
    menuColor: nextParams.menuColor ?? previous.menuColor,
    radius: nextParams.radius ?? previous.radius,
    iconLibrary: nextParams.iconLibrary ?? previous.iconLibrary,
  })
}

function readPreviewParamsFromLocation(): PreviewDesignSystemParams {
  if (typeof window === "undefined") {
    return sanitizePreviewParams({})
  }

  const searchParams = new URLSearchParams(window.location.search)

  return sanitizePreviewParams({
    base: searchParams.get("base") ?? undefined,
    style: searchParams.get("style") ?? undefined,
    theme: searchParams.get("theme") ?? undefined,
    font: searchParams.get("font") ?? undefined,
    fontHeading: searchParams.get("fontHeading") ?? undefined,
    chartColor: searchParams.get("chartColor") ?? undefined,
    baseColor: searchParams.get("baseColor") ?? undefined,
    menuAccent: searchParams.get("menuAccent") ?? undefined,
    menuColor: searchParams.get("menuColor") ?? undefined,
    radius: searchParams.get("radius") ?? undefined,
    iconLibrary: searchParams.get("iconLibrary") ?? undefined,
  })
}

/**
 * How a menu surface is recognised.
 *
 * Two hooks, because there are two producers. The shadcn parts under
 * `registry/bases/{base,radix}/ui` mark themselves with the `cn-menu-target`
 * class from the theme sheets. The ReUI primitives under `registry-reui` carry
 * no `cn-*` class at all - their look is plain Tailwind, so an installed copy
 * needs no theme CSS - and mark themselves with `data-menu-target` instead. An
 * attribute is the more reliable hook of the two: it survives a `cn()` merge
 * and a consumer's own `className`.
 *
 * `[data-menu-translucent]` is the third entry only so an element stays
 * queryable after the translucent class has been taken off it.
 */
const MENU_TARGET_SELECTOR = ".cn-menu-target, [data-menu-target]"
const MENU_SELECTOR = `${MENU_TARGET_SELECTOR}, [data-menu-translucent]`

export function BlockPreviewDesignSystemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [params, setParams] = React.useState<PreviewDesignSystemParams>(() =>
    readPreviewParamsFromLocation()
  )
  const [isReady, setIsReady] = React.useState(false)
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

  const handleDesignSystemMessage = React.useCallback(
    (nextParams: DesignSystemSearchParams) => {
      setParams((previous) => mergePreviewParams(previous, nextParams))
    },
    []
  )

  useIframeMessageListener("design-system-params", handleDesignSystemMessage)

  const style = params.style
  const theme = params.theme
  const font = params.font
  const fontHeading = params.fontHeading
  const chartColor = params.chartColor
  const baseColor = params.baseColor
  const menuAccent = params.menuAccent
  const menuColor = params.menuColor
  const radius = params.radius
  const iconLibrary = params.iconLibrary
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

  React.useEffect(() => {
    const previousStyle = previousStyleRef.current
    previousStyleRef.current = style

    const nextRadius =
      previousStyle === null && style === "lyra"
        ? getRadiusForStyleSelection(style)
        : getRadiusForStyleTransition(previousStyle, style, radius)

    if (nextRadius && nextRadius !== radius) {
      setParams((previous) => ({
        ...previous,
        radius: nextRadius,
      }))
    }
  }, [style, radius])

  React.useEffect(() => {
    if (!isInIframe()) {
      return
    }

    const root = document.documentElement
    const body = document.body
    const previousRootOverflowY = root.style.overflowY
    const previousBodyOverflowY = body.style.overflowY
    const previousRootHeight = root.style.height
    const previousBodyHeight = body.style.height
    const previousRootOverscroll = root.style.overscrollBehavior
    const previousBodyOverscroll = body.style.overscrollBehavior

    // Let the embedded preview scroll when a block is taller than the iframe
    // (home + blocks-listing previews both embed this page). This was "hidden",
    // which clipped long blocks with no scrollbar.
    //
    // Plain `overflow-y: auto` is NOT enough: the global <body> has
    // `overflow-x: hidden`, and CSS overflow-coercion then lets the body grow
    // to its content height — so there's nothing for it to scroll. Instead we
    // pin the document to the iframe viewport and make the BODY the scroll
    // container: html clips at 100% height, body is exactly one viewport tall
    // (100svh) with `overflow-y: auto`, so a taller block gets a real scrollbar
    // while a block that fits shows none. `overscroll-behavior: none` keeps the
    // scroll contained to the iframe (no chaining to the host page).
    root.style.overflowY = "hidden"
    root.style.height = "100%"
    body.style.height = "100svh"
    body.style.overflowY = "auto"
    root.style.overscrollBehavior = "none"
    body.style.overscrollBehavior = "none"

    return () => {
      root.style.overflowY = previousRootOverflowY
      body.style.overflowY = previousBodyOverflowY
      root.style.height = previousRootHeight
      body.style.height = previousBodyHeight
      root.style.overscrollBehavior = previousRootOverscroll
      body.style.overscrollBehavior = previousBodyOverscroll
    }
  }, [])

  React.useLayoutEffect(() => {
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

    body.classList.forEach((className) => {
      if (className.startsWith("style-")) {
        body.classList.remove(className)
      }
    })
    body.classList.add(`style-${style}`)

    body.classList.forEach((className) => {
      if (className.startsWith("base-color-")) {
        body.classList.remove(className)
      }
    })
    body.classList.add(`base-color-${baseColor}`)

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
  }, [baseColor, selectedFont, selectedHeadingFont, style])

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

  React.useLayoutEffect(() => {
    if (!registryTheme?.cssVars) {
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

    if (themeVars) {
      Object.entries(themeVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }

    if (lightVars) {
      Object.entries(lightVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }

    cssText += "}\n\n.dark {\n"

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

  // NOTE: a previous revision posted `iframe-height` messages to the
  // parent on every ResizeObserver / MutationObserver / window.resize
  // tick (with a `getDocumentHeight()` that ran six layout queries
  // each call). It was intended to let the parent size the iframe to
  // its content, but no consumer ever subscribed — the parent uses a
  // fixed `--block-height` CSS variable instead. With many block
  // preview iframes on a listing page, that effect ran inside every
  // child frame on every parent resize event, forcing N × multiple
  // synchronous reflows per frame and visibly janking window resize.
  //
  // If a future embedder needs height-sync, re-introduce a narrower,
  // opt-in version (e.g. behind a `?sync-height=1` query param) and
  // drop the redundant `window.resize` listener — ResizeObserver on
  // `document.body` already covers viewport resizes.

  React.useEffect(() => {
    const isInvertedMenu =
      menuColor === "inverted" || menuColor === "inverted-translucent"
    const isTranslucentMenu =
      menuColor === "default-translucent" ||
      menuColor === "inverted-translucent"
    let frameId = 0

    const updateMenuElements = () => {
      const allElements = document.querySelectorAll<HTMLElement>(MENU_SELECTOR)

      if (allElements.length === 0) {
        return
      }

      allElements.forEach((element) => {
        element.style.transition = "none"
      })

      allElements.forEach((element) => {
        if (element.matches(MENU_TARGET_SELECTOR)) {
          if (isInvertedMenu) {
            element.classList.add("dark")
          } else {
            element.classList.remove("dark")
          }
        }

        if (isTranslucentMenu) {
          element.classList.add("cn-menu-translucent")
          element.removeAttribute("data-menu-translucent")
        } else if (element.classList.contains("cn-menu-translucent")) {
          element.classList.remove("cn-menu-translucent")
          element.setAttribute("data-menu-translucent", "")
        }
      })

      void document.body.offsetHeight

      allElements.forEach((element) => {
        element.style.transition = ""
      })
    }

    const scheduleMenuUpdate = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        updateMenuElements()
      })
    }

    scheduleMenuUpdate()

    // PERF: filter the observer so the full-document scan + forced
    // sync reflow inside `updateMenuElements` only runs when a real
    // menu surface mounts. See the matching comment in
    // `design-system-provider.tsx` for the full rationale — same
    // problem here, smaller blast radius because this provider
    // runs inside iframes.
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

  if (!isReady || !iconLibrary) {
    return null
  }

  return <>{children}</>
}
