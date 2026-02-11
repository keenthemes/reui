"use client"

import * as React from "react"
import {
  FunnelIcon,
  LayoutGridIcon,
  MenuIcon,
  PanelLeftClose,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { usePatterns } from "./patterns-provider"

export function PatternsSidebarHeader() {
  const { toggleSidebar } = useSidebar()
  const {
    sidebarCategoryFilter,
    setSidebarCategoryFilter,
    setSidebarMenuView,
    sidebarMenuView,
  } = usePatterns()

  const toggleView = React.useCallback(() => {
    const newView = sidebarMenuView === "menu" ? "inline" : "menu"
    setSidebarMenuView(newView)
  }, [sidebarMenuView, setSidebarMenuView])

  return (
    <SidebarHeader className="border-border/80 flex h-[51px] flex-row items-center justify-between border-b px-6 py-0">
      <div className="flex w-full items-center gap-2">
        <FunnelIcon className="size-3.5 shrink-0 opacity-60" />
        <input
          placeholder="Filter categories..."
          value={sidebarCategoryFilter}
          onChange={(e) => setSidebarCategoryFilter(e.target.value)}
          className="w-full text-sm font-medium outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {sidebarCategoryFilter && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-3.5 shrink-0 opacity-60 hover:bg-transparent hover:opacity-100"
            onClick={() => setSidebarCategoryFilter("")}
          >
            <XIcon className="size-3.25" />
          </Button>
        )}
        <div className="flex shrink-0 items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleView}
            className="size-3.5 shrink-0 opacity-60 hover:bg-transparent hover:opacity-100"
            title={sidebarMenuView === "menu" ? "Compact view" : "List view"}
          >
            {sidebarMenuView === "menu" ? <LayoutGridIcon /> : <MenuIcon />}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon-sm"
                className="size-3.5 shrink-0 opacity-60 hover:bg-transparent hover:opacity-100"
              >
                <PanelLeftClose />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              Hide sidebar <Kbd>P</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </SidebarHeader>
  )
}
