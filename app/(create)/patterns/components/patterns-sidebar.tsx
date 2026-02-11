"use client"

import * as React from "react"

import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar"

import { usePatterns } from "./patterns-provider"
import { PatternsSidebarContent } from "./patterns-sidebar-content"
import { PatternsSidebarHeader } from "./patterns-sidebar-header"

export function PatternsSidebar() {
  const { toggleSidebar, isMobile } = useSidebar()
  const { sidebarCategoryFilter, sidebarMenuView } = usePatterns()

  // Map "menu" -> "list", "inline" -> "compact" for internal component use
  const internalView: "list" | "compact" =
    sidebarMenuView === "menu" ? "list" : "compact"

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "p" || e.key === "P") && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        toggleSidebar()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggleSidebar])

  if (isMobile) {
    return null
  }

  return (
    <Sidebar className="bg-background border-border/80 top-(--header-height) h-[calc(100svh-var(--header-height))] border-r">
      <PatternsSidebarHeader />
      <SidebarContent className="p-0">
        <PatternsSidebarContent
          filter={sidebarCategoryFilter}
          view={internalView}
        />
      </SidebarContent>
    </Sidebar>
  )
}
