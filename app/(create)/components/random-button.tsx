"use client"

import * as React from "react"
import Script from "next/script"
import { DiceFaces05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
} from "@/registry/config"
import { useLocks } from "@/app/(create)/hooks/use-locks"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  applyBias,
  RANDOMIZE_BIASES,
  type RandomizeContext,
} from "@/app/(create)/lib/randomize-biases"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export const RANDOMIZE_FORWARD_TYPE = "randomize-forward"

function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function RandomButton() {
  const { locks } = useLocks()
  const [params, setParams] = useDesignSystemSearchParams()
  const [config, setConfig] = useConfig()
  const effectiveParams = React.useMemo(
    () => ({
      baseColor: params.baseColor ?? config.baseColor,
      style: params.style ?? config.style,
      theme: params.theme ?? config.theme,
      font: params.font ?? config.font,
      radius: params.radius ?? config.radius,
      iconLibrary: params.iconLibrary ?? config.iconLibrary,
      menuAccent: params.menuAccent ?? config.menuAccent,
      menuColor: params.menuColor ?? config.menuColor,
    }),
    [
      params.baseColor,
      params.style,
      params.theme,
      params.font,
      params.radius,
      params.iconLibrary,
      params.menuAccent,
      params.menuColor,
      config.baseColor,
      config.style,
      config.theme,
      config.font,
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
    const selectedFont = locks.has("font")
      ? effectiveParams.font
      : randomItem(availableFonts).value
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
      iconLibrary: selectedIconLibrary,
      font: selectedFont,
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
  }, [setParams, setConfig, locks, effectiveParams])

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
          variant="ghost"
          size="sm"
          onClick={handleRandomize}
          className="border-foreground/10 bg-muted/50 h-[calc(--spacing(13.5))] w-[140px] touch-manipulation justify-between rounded-xl border select-none focus-visible:border-transparent focus-visible:ring-1 sm:rounded-lg md:w-full md:rounded-lg md:border-transparent md:bg-transparent md:pr-3.5! md:pl-2!"
        >
          <div className="flex flex-col justify-start text-left">
            <div className="text-muted-foreground text-xs">Shuffle</div>
            <div className="text-foreground text-sm font-medium">
              Try Random
            </div>
          </div>
          <HugeiconsIcon icon={DiceFaces05Icon} className="size-5 md:hidden" />
          <Kbd className="bg-foreground/10 text-foreground hidden md:flex">
            R
          </Kbd>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        Use browser back/forward to navigate history
      </TooltipContent>
    </Tooltip>
  )
}

export function RandomizeScript() {
  return (
    <Script
      id="randomize-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward R key
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey) {
                  if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                  ) {
                    return;
                  }
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${RANDOMIZE_FORWARD_TYPE}',
                      key: e.key
                    }, '*');
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}
