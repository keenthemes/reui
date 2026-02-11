"use client"

import * as React from "react"
import Link from "next/link"

import { trackEvent } from "@/lib/events"
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

  // Check if we are running inside an iframe
  const isInsideIframe = React.useMemo(() => {
    if (typeof window === "undefined") return false
    return window.self !== window.top
  }, [])

  const handleViewCode = (e: React.MouseEvent) => {
    if (isInsideIframe) {
      e.preventDefault()
      window.parent.postMessage(
        {
          type: "open-pattern-source",
          name,
          base,
        },
        "*"
      )
    }
  }

  // Get item from the base-specific metadata (lightweight, no React)
  const item = getRegistryItemMetadata(name, base)

  if (!item) {
    return null
  }

  const isFullWidth = item.meta?.gridSize === 1

  const handleCardClick = () => {
    if (item?.files?.[0]?.path) {
      // Copy the path to clipboard for easy reference in Cursor
      navigator.clipboard.writeText(item.files[0].path)

      // Track the copy event
      trackEvent({
        name: "copy_pattern_path",
        properties: {
          name,
          path: item.files[0].path,
          base: config.base,
          style: config.style,
          iconLibrary: config.iconLibrary,
        },
      })

      // We could also trigger a custom event or toast here
      const event = new CustomEvent("pattern-referenced", {
        detail: { name, path: item.files[0].path },
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <PatternCardContainer
      className={className}
      isFullWidth={isFullWidth}
      onClick={handleCardClick}
      footer={
        <>
          <p className="text-muted-foreground flex flex-1 items-center gap-1.5 truncate text-xs">
            <span className="truncate">{item.description || name}</span>
          </p>
          <div className="flex items-center gap-1.5">
            {process.env.NODE_ENV === "development" && (
              <PatternName name={name} />
            )}
            <CopyRegistry value={`@reui/${name}`} />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="h-7 text-xs"
                  size="sm"
                  variant="outline"
                  onClick={handleViewCode}
                >
                  View code
                </Button>
              </SheetTrigger>
              {!isInsideIframe && (
                <PatternSourceSheetContent name={name} base={base} />
              )}
            </Sheet>
          </div>
        </>
      }
    >
      <PatternRenderer name={name} base={base} />
    </PatternCardContainer>
  )
}
