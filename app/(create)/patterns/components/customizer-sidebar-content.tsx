"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { FieldGroup } from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getThemesForBaseColor, PRESETS, STYLES } from "@/registry/config"
import { MenuAccentPicker } from "@/app/(create)/components/accent-picker"
import { BaseColorPicker } from "@/app/(create)/components/base-color-picker"
import { BasePicker } from "@/app/(create)/components/base-picker"
import { FontPicker } from "@/app/(create)/components/font-picker"
import { IconLibraryPicker } from "@/app/(create)/components/icon-library-picker"
import { MenuColorPicker } from "@/app/(create)/components/menu-picker"
import { PresetPicker } from "@/app/(create)/components/preset-picker"
import { RadiusPicker } from "@/app/(create)/components/radius-picker"
import { RandomButton } from "@/app/(create)/components/random-button"
import { ResetButton } from "@/app/(create)/components/reset-button"
import { StylePicker } from "@/app/(create)/components/style-picker"
import { ThemePicker } from "@/app/(create)/components/theme-picker"
import { FONTS } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

interface CustomizerSidebarContentProps {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}

export function CustomizerSidebarContent({
  isMobile,
  anchorRef,
}: CustomizerSidebarContentProps) {
  const [params] = useDesignSystemSearchParams()
  const [config] = useConfig()

  const effectiveBaseColor = params.baseColor ?? config.baseColor

  const availableThemes = React.useMemo(
    () => getThemesForBaseColor(effectiveBaseColor),
    [effectiveBaseColor]
  )

  return (
    <>
      <ScrollArea className="max-h-[calc(100svh-240px)] flex-1">
        <div className="p-2">
          <FieldGroup className="flex flex-col gap-0">
            <PresetPicker
              presets={PRESETS}
              isMobile={isMobile}
              anchorRef={anchorRef}
            />
            <BasePicker isMobile={isMobile} anchorRef={anchorRef} />
            <StylePicker
              styles={STYLES}
              isMobile={isMobile}
              anchorRef={anchorRef}
            />
            <BaseColorPicker isMobile={isMobile} anchorRef={anchorRef} />
            <ThemePicker
              themes={availableThemes}
              isMobile={isMobile}
              anchorRef={anchorRef}
            />
            <IconLibraryPicker isMobile={isMobile} anchorRef={anchorRef} />
            <FontPicker
              fonts={FONTS}
              isMobile={isMobile}
              anchorRef={anchorRef}
            />
            <RadiusPicker isMobile={isMobile} anchorRef={anchorRef} />
            <MenuColorPicker isMobile={isMobile} anchorRef={anchorRef} />
            <MenuAccentPicker isMobile={isMobile} anchorRef={anchorRef} />
          </FieldGroup>
        </div>
      </ScrollArea>
      <div className="border-border/80 flex flex-col gap-0 border-t p-3">
        <RandomButton />
        <ResetButton />
      </div>
    </>
  )
}
