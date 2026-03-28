"use client"

import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { ComponentSidebarCategoryMenu } from "./component-sidebar-category-menu"

interface ComponentSidebarContentProps {
  onSelect?: () => void
  filter?: string
  view?: "list" | "compact"
}

export const ComponentSidebarContent = React.memo(
  function ComponentSidebarContent({
    onSelect,
    filter = "",
    view = "list",
  }: ComponentSidebarContentProps) {
    return (
      <div className="flex flex-col overflow-hidden">
        <ScrollArea className="h-[calc(100vh-135px)] px-2.5">
          <div className="flex-1 overflow-y-auto pt-2">
            <ComponentSidebarCategoryMenu
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
