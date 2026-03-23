"use client"

import * as React from "react"

import { getRegistryItemMetadata } from "@/lib/registry"
import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { CopyRegistry } from "@/components/copy-registry"

import {
  PatternCardContainer,
  PatternName,
  PatternRenderer,
} from "./pattern-card-container"
import { PatternSourceSheetContent } from "./pattern-source-sheet-content"

export function PatternCard({
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
    <PatternCardContainer
      className={className}
      isFullWidth={isFullWidth}
      footer={
        <>
          <p className="text-site-muted-foreground flex flex-1 items-center gap-1.5 truncate text-xs">
            <span className="truncate">{item.description || name}</span>
          </p>
          <div className="flex items-center gap-1.5">
            {process.env.NODE_ENV === "development" && (
              <PatternName name={name} />
            )}
            <CopyRegistry value={`@reui/${name}`} />
            <Sheet>
              <SheetTrigger asChild>
                <Button className="h-7 text-xs" size="sm" variant="outline">
                  View code
                </Button>
              </SheetTrigger>
              <PatternSourceSheetContent name={name} base={base} />
            </Sheet>
          </div>
        </>
      }
    >
      <PatternRenderer name={name} base={base} />
    </PatternCardContainer>
  )
}
