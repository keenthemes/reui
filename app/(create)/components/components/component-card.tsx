"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { CopyRegistry } from "@/components/copy-registry"

import type { Component } from "../types"
import {
  ComponentCardContainer,
  ComponentName,
} from "./component-card-container"
import { ComponentCardPreview } from "./component-card-preview"
import { ComponentSourceSheetContent } from "./component-source-sheet-content"

// Memoized so a grid-wide re-render (e.g. the debounced search URL
// update re-filtering the list) skips cards whose props are unchanged;
// `component` identity is stable across filters and the mounted live
// previews are the expensive subtree we want to keep idle.
export const ComponentCard = React.memo(function ComponentCard({
  component,
  className,
  base: _propBase,
}: {
  component: Component
  className?: string
  base?: string
}) {
  const [config] = useConfig()
  const [isSourceOpen, setIsSourceOpen] = React.useState(false)
  const base = _propBase || config?.base || "base"
  const isFullWidth = component.meta?.gridSize === 1
  const description = component.description || component.title || component.name

  return (
    <ComponentCardContainer
      className={className}
      isFullWidth={isFullWidth}
      footer={
        <>
          <p className="text-site-muted-foreground flex flex-1 items-center gap-1.5 truncate text-xs">
            <span className="truncate" title={description}>
              {description}
            </span>
          </p>
          <div className="flex items-center gap-1.5">
            {process.env.NODE_ENV === "development" && (
              <ComponentName name={component.name} />
            )}
            <CopyRegistry value={`@reui/${component.name}`} />
            <Sheet open={isSourceOpen} onOpenChange={setIsSourceOpen}>
              <SheetTrigger asChild>
                <Button className="h-7 text-xs" size="sm" variant="outline">
                  View code
                </Button>
              </SheetTrigger>
              {isSourceOpen ? (
                <ComponentSourceSheetContent
                  name={component.name}
                  base={base}
                />
              ) : null}
            </Sheet>
          </div>
        </>
      }
    >
      <ComponentCardPreview
        name={component.name}
        title={component.title || component.name}
        base={base}
        category={component.primaryCategory}
      />
    </ComponentCardContainer>
  )
})
