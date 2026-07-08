"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { useScrollActiveIntoView } from "@/hooks/use-scroll-active-into-view"
import { ScrollArea } from "@/components/ui/scroll-area"

import { ComponentsSidebarCategoryMenu } from "./components-sidebar-category-menu"

interface ComponentsSidebarContentProps {
  onSelect?: () => void
  filter?: string
  view?: "list" | "compact"
}

export const ComponentsSidebarContent = React.memo(
  function ComponentsSidebarContent({
    onSelect,
    filter = "",
    view = "list",
  }: ComponentsSidebarContentProps) {
    const pathname = usePathname()
    const scrollRef = useScrollActiveIntoView<HTMLDivElement>(pathname)
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ScrollArea className="min-h-0 flex-1">
          <div ref={scrollRef} className="px-2.5 pt-2 pb-4">
            <ComponentsSidebarCategoryMenu
              onSelect={onSelect}
              filter={filter}
              view={view}
            />
          </div>
        </ScrollArea>
      </div>
    )
  }
)
