"use client"

import * as React from "react"
import { Columns2Icon, Rows2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useConfig, type PatternGridMode } from "@/hooks/use-config"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { sendToIframe } from "@/app/(create)/hooks/use-iframe-sync"

interface PatternsHeaderGridToggleProps {
  className?: string
  iframeRef?: React.RefObject<HTMLIFrameElement | null>
}

export function PatternsHeaderGridToggle({
  className,
  iframeRef,
}: PatternsHeaderGridToggleProps) {
  const [config, setConfig] = useConfig()

  const value = config?.gridColumns ?? 2

  const handleValueChange = (val: string) => {
    if (!val) return

    const numVal = Number(val) as PatternGridMode
    setConfig({
      ...config,
      gridColumns: numVal,
    })

    // Send grid columns to iframe if ref is provided
    if (iframeRef?.current) {
      sendToIframe(iframeRef.current, "grid-columns", { columns: numVal })
    }
  }

  return (
    <Tabs
      value={String(value)}
      onValueChange={handleValueChange}
      className={cn("flex h-8 shrink-0 flex-row gap-0", className)}
    >
      <TabsList className="h-8 p-0.5">
        {/* Pattern listing: 1 (row) or 2 columns */}
        <TabsTrigger
          value="1"
          aria-label="1 column (row mode)"
          title="1 column (row mode)"
          className="h-7 w-8 px-0"
        >
          <Rows2Icon className="size-3.5" />
        </TabsTrigger>
        <TabsTrigger
          value="2"
          aria-label="2 columns"
          title="2 columns"
          className="h-7 w-8 px-0"
        >
          <Columns2Icon className="size-3.5" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
