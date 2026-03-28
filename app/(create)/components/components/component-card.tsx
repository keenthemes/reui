"use client"

import * as React from "react"

import { getRegistryItemMetadata } from "@/lib/registry"
import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { CopyRegistry } from "@/components/copy-registry"

import {
  ComponentCardContainer,
  ComponentName,
  ComponentRenderer,
} from "./component-card-container"
import { ComponentSourceSheetContent } from "./component-source-sheet-content"

export function ComponentCard({
  name,
  className,
  base: propBase,
}: {
  name: string
  className?: string
  base?: string
}) {
  // Get the current base preference (base or radix)
  const [config] = useConfig()
  const base = propBase || config?.base || "radix"

  // Get item from the base-specific metadata (lightweight, no React)
  const item = getRegistryItemMetadata(name, base)

  if (!item) {
    return null
  }

  const isFullWidth = item.meta?.gridSize === 1

  return (
    <ComponentCardContainer
      className={className}
      isFullWidth={isFullWidth}
      footer={
        <>
          <p className="text-site-muted-foreground flex flex-1 items-center gap-1.5 truncate text-xs">
            <span className="truncate">{item.description || name}</span>
          </p>
          <div className="flex items-center gap-1.5">
            {process.env.NODE_ENV === "development" && (
              <ComponentName name={name} />
            )}
            <CopyRegistry value={`@reui/${name}`} />
            <Sheet>
              <SheetTrigger asChild>
                <Button className="h-7 text-xs" size="sm" variant="outline">
                  View code
                </Button>
              </SheetTrigger>
              <ComponentSourceSheetContent name={name} base={base} />
            </Sheet>
          </div>
        </>
      }
    >
      <ComponentRenderer name={name} base={base} />
    </ComponentCardContainer>
  )
}
