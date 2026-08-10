"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { filterAvailableBases } from "@/lib/registry-bases"
import { BASES, type Base } from "@/registry/config"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(create)/design-system/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

// The mirror lists every shadcn base, including ones this repo does not ship
// (React Aria). Only offer the ones we actually serve.
const AVAILABLE_BASES = filterAvailableBases(BASES as any[])

export function BasePicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [mounted, setMounted] = React.useState(false)
  const [params, setParams] = useDesignSystemSearchParams()
  const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentBase = React.useMemo(
    () =>
      AVAILABLE_BASES.find(
        (base) => base.name === (params.base ?? config.base)
      ) ?? AVAILABLE_BASES[0],
    [params.base, config.base]
  )

  const handleValueChange = React.useCallback(
    (value: string) => {
      const newBase = AVAILABLE_BASES.find((base) => base.name === value)
      if (!newBase) {
        return
      }

      setParams({ base: newBase.name })
      setConfig((prev) => ({ ...prev, base: newBase.name as any }))
    },
    [setParams, setConfig]
  )

  return (
    <Picker>
      <PickerTrigger>
        <div className="flex flex-col justify-start text-left">
          <div className="text-site-muted-foreground text-xs">
            Component Library
          </div>
          <div className="text-site-foreground text-sm font-medium">
            {mounted ? currentBase?.title : "..."}
          </div>
        </div>
        {mounted && currentBase?.meta?.logo && (
          <div
            className="text-site-foreground *:[svg]:text-site-foreground! pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 select-none *:[svg]:size-4"
            dangerouslySetInnerHTML={{
              __html: currentBase.meta.logo,
            }}
          />
        )}
      </PickerTrigger>
      <PickerContent
        anchor={isMobile ? anchorRef : undefined}
        side={isMobile ? "top" : "right"}
        align={isMobile ? "center" : "start"}
      >
        <PickerRadioGroup
          value={currentBase?.name}
          onValueChange={handleValueChange}
        >
          <PickerGroup>
            {AVAILABLE_BASES.map((base) => (
              <PickerRadioItem key={base.name} value={base.name}>
                {base.meta?.logo && (
                  <div
                    className="text-site-foreground *:[svg]:text-site-foreground! size-4 shrink-0 [&_svg]:size-4"
                    dangerouslySetInnerHTML={{
                      __html: base.meta.logo,
                    }}
                  />
                )}
                {base.title}
              </PickerRadioItem>
            ))}
          </PickerGroup>
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
