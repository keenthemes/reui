"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { STYLES, type Preset } from "@/registry/config"
import { DesignSystemContext } from "@/app/(create)/components/design-system-provider"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function PresetPicker({
  presets,
  isMobile,
  anchorRef,
}: {
  presets: readonly Preset[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [mounted, setMounted] = React.useState(false)
  const context = React.useContext(DesignSystemContext)
  const [params, setParams] = useDesignSystemSearchParams()
  const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const effectiveParams = React.useMemo(
    () => ({
      base: context?.style?.split("-")[0] ?? params.base ?? config.base,
      style: context?.style ?? params.style ?? config.style,
      baseColor: context?.baseColor ?? params.baseColor ?? config.baseColor,
      theme: context?.theme ?? params.theme ?? config.theme,
      iconLibrary:
        context?.iconLibrary ?? params.iconLibrary ?? config.iconLibrary,
      font: context?.font ?? params.font ?? config.font,
      menuAccent: context?.menuAccent ?? params.menuAccent ?? config.menuAccent,
      menuColor: context?.menuColor ?? params.menuColor ?? config.menuColor,
      radius: context?.radius ?? params.radius ?? config.radius,
    }),
    [context, params, config]
  )

  const currentPreset = React.useMemo(() => {
    if (!mounted) return null
    return presets.find(
      (preset) =>
        preset.base === effectiveParams.base &&
        preset.style === effectiveParams.style &&
        preset.baseColor === effectiveParams.baseColor &&
        preset.theme === effectiveParams.theme &&
        preset.iconLibrary === effectiveParams.iconLibrary &&
        preset.font === effectiveParams.font &&
        preset.menuAccent === effectiveParams.menuAccent &&
        preset.menuColor === effectiveParams.menuColor &&
        preset.radius === effectiveParams.radius
    )
  }, [
    mounted,
    presets,
    effectiveParams.base,
    effectiveParams.style,
    effectiveParams.baseColor,
    effectiveParams.theme,
    effectiveParams.iconLibrary,
    effectiveParams.font,
    effectiveParams.menuAccent,
    effectiveParams.menuColor,
    effectiveParams.radius,
  ])

  // Filter presets for current base only
  const currentBasePresets = React.useMemo(() => {
    return presets.filter((preset) => preset.base === effectiveParams.base)
  }, [presets, effectiveParams.base])

  const handlePresetChange = (value: string) => {
    const preset = presets.find((p) => p.title === value)
    if (!preset) {
      return
    }

    const newValues = {
      base: preset.base,
      style: preset.style,
      baseColor: preset.baseColor,
      theme: preset.theme,
      iconLibrary: preset.iconLibrary,
      font: preset.font,
      menuAccent: preset.menuAccent,
      menuColor: preset.menuColor,
      radius: preset.radius,
      custom: false,
    }

    // Update all params including base.
    setParams(newValues)
    setConfig((prev) => ({ ...prev, ...newValues }))
  }

  return (
    <Picker>
      <PickerTrigger>
        <div className="flex flex-col justify-start text-left">
          <div className="text-muted-foreground text-xs">Preset</div>
          <div className="text-foreground line-clamp-1 text-sm font-medium">
            {!mounted ? "..." : (currentPreset?.description ?? "Custom")}
          </div>
        </div>
      </PickerTrigger>
      <PickerContent
        anchor={isMobile ? anchorRef : undefined}
        side={isMobile ? "top" : "right"}
        align={isMobile ? "center" : "start"}
        className="md:w-72"
      >
        <PickerRadioGroup
          value={currentPreset?.title ?? ""}
          onValueChange={handlePresetChange}
        >
          <PickerGroup>
            {currentBasePresets.map((preset) => {
              const style = STYLES.find((s) => s.name === preset.style)
              return (
                <PickerRadioItem key={preset.title} value={preset.title}>
                  <div className="flex items-center gap-2">
                    {style?.icon && (
                      <div className="flex size-4 shrink-0 items-center justify-center">
                        {React.cloneElement(style.icon, {
                          className: "size-4",
                        })}
                      </div>
                    )}
                    {preset.description}
                  </div>
                </PickerRadioItem>
              )
            })}
          </PickerGroup>
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
