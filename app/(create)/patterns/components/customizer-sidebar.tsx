"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

import { CustomizerSidebarContent } from "./customizer-sidebar-content"
import { CustomizerSidebarHeader } from "./customizer-sidebar-header"
import { useCustomizer } from "./patterns-provider"

export function CustomizerSidebar() {
  const { customizerOpen } = useCustomizer()
  const isMobile = useIsMobile()
  const anchorRef = React.useRef<HTMLDivElement | null>(null)

  if (isMobile) {
    return null
  }

  return (
    <aside
      ref={anchorRef}
      className={cn(
        "bg-background border-border/80 sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))] w-60 shrink-0 flex-col overflow-hidden border-l transition-[width,transform] duration-300 ease-in-out lg:flex",
        !customizerOpen && "w-0 border-l-0"
      )}
    >
      <div className="flex h-full w-60 flex-col">
        <CustomizerSidebarHeader />
        <CustomizerSidebarContent isMobile={isMobile} anchorRef={anchorRef} />
      </div>
    </aside>
  )
}
