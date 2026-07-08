"use client"

import * as React from "react"

import { notifyIconLibraryChanged } from "@/lib/icon-library-store"
import { DEFAULT_CONFIG, useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  BASE_COLORS,
  getThemesForBaseColor,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  type FontHeadingValue,
} from "@/registry/config"
import { useLocks } from "@/app/(create)/hooks/use-locks"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  applyBias,
  RANDOMIZE_BIASES,
  type RandomizeContext,
} from "@/app/(create)/lib/randomize-biases"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export { RANDOMIZE_FORWARD_TYPE } from "./randomize-forward"

function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function RandomButton() {
  const { locks } = useLocks()
  const [params, setParams] = useDesignSystemSearchParams()
  const [config, setConfig] = useConfig()
  const fontHeadingChoices = React.useMemo(
    () =>
      [
        "inherit",
        ...FONTS.map((font) => font.value),
      ] as readonly FontHeadingValue[],
    []
  )
  const effectiveParams = React.useMemo(
    () => ({
      baseColor: params.baseColor ?? config.baseColor,
      style: params.style ?? config.style,
      theme: params.theme ?? config.theme,
      chartColor: params.chartColor ?? config.chartColor,
      font: params.font ?? config.font,
      fontHeading: params.fontHeading ?? config.fontHeading,
      radius: params.radius ?? config.radius,
      iconLibrary: params.iconLibrary ?? config.iconLibrary,
      menuAccent: params.menuAccent ?? config.menuAccent,
      menuColor: params.menuColor ?? config.menuColor,
    }),
    [
      params.baseColor,
      params.style,
      params.theme,
      params.chartColor,
      params.font,
      params.fontHeading,
      params.radius,
      params.iconLibrary,
      params.menuAccent,
      params.menuColor,
      config.baseColor,
      config.style,
      config.theme,
      config.chartColor,
      config.font,
      config.fontHeading,
      config.radius,
      config.iconLibrary,
      config.menuAccent,
      config.menuColor,
    ]
  )

  const handleRandomize = React.useCallback(() => {
    // Use current value if locked, otherwise randomize.
    const baseColor = locks.has("baseColor")
      ? effectiveParams.baseColor
      : randomItem(BASE_COLORS).name
    const selectedStyle = locks.has("style")
      ? effectiveParams.style
      : randomItem(STYLES).name

    // Build context for bias application.
    const context: RandomizeContext = {
      style: selectedStyle,
      baseColor,
    }

    const availableThemes = getThemesForBaseColor(baseColor)
    const availableFonts = applyBias(FONTS, context, RANDOMIZE_BIASES.fonts)
    const availableRadii = applyBias(RADII, context, RANDOMIZE_BIASES.radius)

    const selectedTheme = locks.has("theme")
      ? effectiveParams.theme
      : randomItem(availableThemes).name
    const selectedChartColor = locks.has("chartColor")
      ? effectiveParams.chartColor
      : randomItem(availableThemes).name
    const selectedFont = locks.has("font")
      ? effectiveParams.font
      : randomItem(availableFonts).value
    const selectedFontHeading = locks.has("fontHeading")
      ? effectiveParams.fontHeading
      : randomItem(fontHeadingChoices)
    const selectedRadius = locks.has("radius")
      ? effectiveParams.radius
      : randomItem(availableRadii).name
    const selectedIconLibrary = locks.has("iconLibrary")
      ? effectiveParams.iconLibrary
      : randomItem(Object.values(iconLibraries)).name
    const selectedMenuAccent = locks.has("menuAccent")
      ? effectiveParams.menuAccent
      : randomItem(MENU_ACCENTS).value
    const selectedMenuColor = locks.has("menuColor")
      ? effectiveParams.menuColor
      : randomItem(MENU_COLORS).value

    // Update context with selected values for potential future biases.
    context.theme = selectedTheme
    context.font = selectedFont
    context.radius = selectedRadius

    const newValues = {
      style: selectedStyle,
      baseColor,
      theme: selectedTheme,
      chartColor: selectedChartColor,
      iconLibrary: selectedIconLibrary,
      font: selectedFont,
      fontHeading: selectedFontHeading,
      menuAccent: selectedMenuAccent,
      menuColor: selectedMenuColor,
      radius: selectedRadius,
    }

    // Update URL params and config storage
    // Only include values in the URL if they differ from the defaults
    const paramsToUpdate = Object.fromEntries(
      Object.entries(newValues).map(([key, value]) => [
        key,
        value === (DEFAULT_CONFIG as any)[key] ? null : value,
      ])
    )
    setParams(paramsToUpdate)
    setConfig((prev) => ({ ...prev, ...newValues }))
    notifyIconLibraryChanged()
  }, [setParams, setConfig, locks, effectiveParams, fontHeadingChoices])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "r" || e.key === "R") && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        handleRandomize()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [handleRandomize])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRandomize}
          className="border-site-border bg-site-background text-site-foreground hover:bg-site-muted/60 site-rounded-md w-full justify-center gap-2"
        >
          <span className="text-sm">Shuffle</span>
          <Kbd className="bg-site-muted text-site-muted-foreground">R</Kbd>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        Shuffle to a random style — back/forward to navigate history
      </TooltipContent>
    </Tooltip>
  )
}
