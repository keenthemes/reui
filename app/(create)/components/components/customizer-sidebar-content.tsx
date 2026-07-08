"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { FieldGroup } from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getThemesForBaseColor, STYLES } from "@/registry/config"
import { MenuAccentPicker } from "@/app/(create)/design-system/accent-picker"
import { BaseColorPicker } from "@/app/(create)/design-system/base-color-picker"
import { BasePicker } from "@/app/(create)/design-system/base-picker"
import { ChartColorPicker } from "@/app/(create)/design-system/chart-color-picker"
import { CopyPreset } from "@/app/(create)/design-system/copy-preset"
import { FontPicker } from "@/app/(create)/design-system/font-picker"
import { OpenPreset } from "@/app/(create)/design-system/open-preset"
import { IconLibraryPicker } from "@/app/(create)/design-system/icon-library-picker"
import { ModePicker } from "@/app/(create)/design-system/mode-picker"
import { MenuColorPicker } from "@/app/(create)/design-system/menu-picker"
import { RadiusPicker } from "@/app/(create)/design-system/radius-picker"
import { RandomButton } from "@/app/(create)/design-system/random-button"
import { ResetButton } from "@/app/(create)/design-system/reset-button"
import { StylePicker } from "@/app/(create)/design-system/style-picker"
import { ThemePicker } from "@/app/(create)/design-system/theme-picker"
import { FONT_HEADING_OPTIONS, FONTS } from "@/app/(create)/lib/fonts"
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
      <ScrollArea className="min-h-0 flex-1">
        <div className="px-2 pt-2">
          <FieldGroup className="flex flex-col gap-0">
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
            <ChartColorPicker isMobile={isMobile} anchorRef={anchorRef} />
            <IconLibraryPicker isMobile={isMobile} anchorRef={anchorRef} />
            <FontPicker
              label="Heading"
              param="fontHeading"
              fonts={FONT_HEADING_OPTIONS}
              isMobile={isMobile}
              anchorRef={anchorRef}
            />
            <FontPicker
              label="Font"
              param="font"
              fonts={FONTS}
              isMobile={isMobile}
              anchorRef={anchorRef}
            />
            <RadiusPicker isMobile={isMobile} anchorRef={anchorRef} />
            <MenuColorPicker isMobile={isMobile} anchorRef={anchorRef} />
            <MenuAccentPicker isMobile={isMobile} anchorRef={anchorRef} />
            <ModePicker isMobile={isMobile} anchorRef={anchorRef} />
          </FieldGroup>
        </div>
      </ScrollArea>
      <div className="border-site-border/80 flex shrink-0 flex-col gap-1.5 border-t p-3">
        <CopyPreset />
        <OpenPreset />
        <RandomButton />
        <ResetButton />
      </div>
    </>
  )
}
