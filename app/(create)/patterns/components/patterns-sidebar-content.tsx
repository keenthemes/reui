"use client"

import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { PatternsSidebarCategoryMenu } from "./patterns-sidebar-category-menu"

interface PatternsSidebarContentProps {
  onSelect?: () => void
  filter?: string
  view?: "list" | "compact"
}

export const PatternsSidebarContent = React.memo(
  function PatternsSidebarContent({
    onSelect,
    filter = "",
    view = "list",
  }: PatternsSidebarContentProps) {
    return (
      <div className="flex flex-col overflow-hidden">
        <ScrollArea className="h-[calc(100vh-135px)] px-2.5">
          <div className="flex-1 overflow-y-auto pt-2">
            <PatternsSidebarCategoryMenu
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
