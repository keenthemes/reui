"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { useMounted } from "@/hooks/use-mounted"
import {
  BASE_COLORS,
  getThemesForBaseColor,
  type ChartColorName,
} from "@/registry/config"
import { LockButton } from "@/app/(create)/customizer/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/customizer/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ChartColorPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const mounted = useMounted()
  const [params, setParams] = useDesignSystemSearchParams()
  const [config, setConfig] = useConfig()

  const effectiveBaseColor = params.baseColor ?? config.baseColor

  const availableChartColors = React.useMemo(
    () => getThemesForBaseColor(effectiveBaseColor),
    [effectiveBaseColor]
  )

  const effectiveChartColor = params.chartColor ?? config.chartColor

  const currentChartColor = React.useMemo(
    () =>
      availableChartColors.find((theme) => theme.name === effectiveChartColor),
    [availableChartColors, effectiveChartColor]
  )

  const currentChartColorIsBaseColor = React.useMemo(
    () =>
      BASE_COLORS.find((baseColor) => baseColor.name === effectiveChartColor),
    [effectiveChartColor]
  )

  React.useEffect(() => {
    if (!currentChartColor && availableChartColors.length > 0) {
      const next = availableChartColors[0].name
      setParams({ chartColor: next })
      setConfig((prev) => ({ ...prev, chartColor: next }))
    }
  }, [currentChartColor, availableChartColors, setParams, setConfig])

  const handleChartColorChange = React.useCallback(
    (value: string) => {
      const next = value as ChartColorName
      setParams({ chartColor: next })
      setConfig((prev) => ({ ...prev, chartColor: next }))
    },
    [setParams, setConfig]
  )

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="min-w-0 flex-1 pr-10 text-left">
            <div className="text-site-muted-foreground text-xs">
              Chart Color
            </div>
            <div className="text-site-foreground truncate text-sm font-medium">
              {mounted ? (currentChartColor?.title ?? "...") : "..."}
            </div>
          </div>
          {mounted && (
            <div
              style={
                {
                  "--color":
                    currentChartColor?.cssVars?.dark?.[
                      currentChartColorIsBaseColor
                        ? "muted-foreground"
                        : "primary"
                    ],
                } as React.CSSProperties
              }
              className="site-rounded-full pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 bg-(--color) select-none"
            />
          )}
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
          className="max-h-92"
        >
          <PickerRadioGroup
            value={currentChartColor?.name}
            onValueChange={handleChartColorChange}
          >
            <PickerGroup>
              {availableChartColors
                .filter((theme) =>
                  BASE_COLORS.find((baseColor) => baseColor.name === theme.name)
                )
                .map((theme) => (
                  <PickerRadioItem
                    key={theme.name}
                    value={theme.name}
                    closeOnClick={isMobile}
                  >
                    {theme.title}
                  </PickerRadioItem>
                ))}
            </PickerGroup>
            <PickerSeparator />
            <PickerGroup>
              {availableChartColors
                .filter(
                  (theme) =>
                    !BASE_COLORS.find(
                      (baseColor) => baseColor.name === theme.name
                    )
                )
                .map((theme) => (
                  <PickerRadioItem
                    key={theme.name}
                    value={theme.name}
                    closeOnClick={isMobile}
                  >
                    {theme.title}
                  </PickerRadioItem>
                ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="chartColor"
        className="absolute top-1/2 right-10 -translate-y-1/2"
      />
    </div>
  )
}
