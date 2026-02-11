"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { type FontValue } from "@/registry/config"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { type Font } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function FontPicker({
  fonts,
  isMobile,
  anchorRef,
}: {
  fonts: readonly Font[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [mounted, setMounted] = React.useState(false)
  const [params, setParams] = useDesignSystemSearchParams()
  const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentFont = React.useMemo(
    () => fonts.find((font) => font.value === (params.font ?? config.font)),
    [fonts, params.font, config.font]
  )

  const handleValueChange = React.useCallback(
    (value: string) => {
      const newFont = value as FontValue
      setParams({ font: newFont })
      setConfig((prev) => ({ ...prev, font: newFont }))
    },
    [setParams, setConfig]
  )

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-muted-foreground text-xs">Font</div>
            <div className="text-foreground text-sm font-medium">
              {mounted ? currentFont?.name : "..."}
            </div>
          </div>
          <div
            className="text-foreground pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base select-none"
            style={{
              fontFamily: mounted
                ? currentFont?.font.style.fontFamily
                : undefined,
            }}
          >
            Aa
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
          className="max-h-80 md:w-72"
        >
          <PickerRadioGroup
            value={currentFont?.value}
            onValueChange={handleValueChange}
          >
            <PickerGroup>
              {fonts.map((font, index) => (
                <React.Fragment key={font.value}>
                  <PickerRadioItem value={font.value}>
                    <Item size="xs">
                      <ItemContent className="gap-1">
                        <ItemTitle className="text-muted-foreground text-xs font-medium">
                          {font.name}
                        </ItemTitle>
                        <ItemDescription
                          style={{ fontFamily: font.font.style.fontFamily }}
                        >
                          Designers love packing quirky glyphs into test
                          phrases.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </PickerRadioItem>
                  {index < fonts.length - 1 && (
                    <PickerSeparator className="opacity-50" />
                  )}
                </React.Fragment>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="font"
        className="absolute top-1/2 right-10 -translate-y-1/2"
      />
    </div>
  )
}
