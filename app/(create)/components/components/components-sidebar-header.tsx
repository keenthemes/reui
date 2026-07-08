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

import { useComponents } from "./components-provider"

const SIDEBAR_FILTER_DEBOUNCE_MS = 200

export function ComponentsSidebarHeader() {
  const { toggleSidebar } = useSidebar()
  const {
    sidebarCategoryFilter,
    setSidebarCategoryFilter,
    setSidebarMenuView,
    sidebarMenuView,
  } = useComponents()

  // Local input state so typing stays instant; the (heavier) category-list
  // filter only re-runs on the debounced commit, not on every keystroke. This
  // is what was making the sidebar filter feel laggy - it filtered + re-rendered
  // the whole category list synchronously on each character.
  const [localFilter, setLocalFilter] = React.useState(sidebarCategoryFilter)

  React.useEffect(() => {
    setLocalFilter(sidebarCategoryFilter)
  }, [sidebarCategoryFilter])

  React.useEffect(() => {
    if (localFilter === sidebarCategoryFilter) return
    const timer = window.setTimeout(() => {
      setSidebarCategoryFilter(localFilter)
    }, SIDEBAR_FILTER_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [localFilter, sidebarCategoryFilter, setSidebarCategoryFilter])

  const clearFilter = React.useCallback(() => {
    setLocalFilter("")
    setSidebarCategoryFilter("")
  }, [setSidebarCategoryFilter])

  const toggleView = React.useCallback(() => {
    const newView = sidebarMenuView === "menu" ? "inline" : "menu"
    setSidebarMenuView(newView)
  }, [sidebarMenuView, setSidebarMenuView])

  return (
    <SidebarHeader className="border-site-border/80 flex h-[51px] flex-row items-center justify-between border-b px-6 py-0">
      <div className="flex w-full items-center gap-2">
        <FunnelIcon className="size-3.5 shrink-0 opacity-60" />
        <input
          placeholder="Filter categories..."
          value={localFilter}
          onChange={(e) => setLocalFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault()
              clearFilter()
            }
          }}
          className="w-full text-sm font-medium outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {localFilter && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-3.5 shrink-0 opacity-60 hover:bg-transparent hover:opacity-100"
            onClick={clearFilter}
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
