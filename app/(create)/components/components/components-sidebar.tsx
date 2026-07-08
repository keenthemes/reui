"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { SidebarContent, useSidebar } from "@/components/ui/sidebar"

import { useComponents } from "./components-provider"
import { ComponentsSidebarContent } from "./components-sidebar-content"
import { ComponentsSidebarHeader } from "./components-sidebar-header"

export function ComponentsSidebar() {
  const { open, toggleSidebar, isMobile } = useSidebar()
  const { sidebarCategoryFilter, sidebarMenuView } = useComponents()

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
    <aside
      data-state={open ? "open" : "closed"}
      className={cn(
        "bg-site-background sticky top-[var(--site-top-offset)] bottom-0 hidden h-[calc(100svh-var(--site-top-offset))] shrink-0 flex-col overflow-hidden transition-[top,height,width] duration-140 ease-out motion-reduce:transition-none min-[992px]:flex",
        open ? "w-(--sidebar-width)" : "w-0"
      )}
    >
      {open && (
        <div
          className="bg-site-border/80 absolute top-0 right-0 bottom-0 w-px"
          aria-hidden="true"
        />
      )}
      <div className="flex min-h-0 w-(--sidebar-width) grow flex-col">
        <ComponentsSidebarHeader />
        <SidebarContent className="min-h-0 overflow-hidden p-0">
          <ComponentsSidebarContent
            filter={sidebarCategoryFilter}
            view={internalView}
          />
        </SidebarContent>
      </div>
    </aside>
  )
}
