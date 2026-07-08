"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { PanelLeftOpen } from "lucide-react"

import { hasActiveComponentSearch } from "@/lib/component-search-filter"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ComponentsHeaderGridToggle } from "./components-header-grid-toggle"
import { ComponentsHeaderMobileDrawer } from "./components-header-mobile-drawer"
import { ComponentsHeaderSearch } from "./components-header-search"
import { CustomizerSidebarToggle } from "./customizer-sidebar-toggle"

export function ComponentsHeader() {
  const { open, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasSearch = hasActiveComponentSearch(searchParams.get("search") || "")
  const currentCategory =
    pathname.startsWith("/components/") && pathname !== "/components"
      ? (pathname.split("/").at(-1) ?? "")
      : ""
  const showGridToggle = Boolean(currentCategory) || hasSearch

  return (
    <div className="border-site-border/80 bg-site-background sticky top-[var(--site-top-offset)] z-10 flex h-[51px] items-center gap-2 border-b px-6 transition-[top] duration-140 ease-out motion-reduce:transition-none sm:px-8 xl:px-10">
      <ComponentsHeaderMobileDrawer />

      {!open && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon-sm"
              className="text-site-muted-foreground hover:text-site-foreground -ml-2 hidden hover:bg-transparent min-[992px]:flex"
            >
              <PanelLeftOpen />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            Show sidebar <Kbd>P</Kbd>
          </TooltipContent>
        </Tooltip>
      )}

      <ComponentsHeaderSearch />

      <div className="ml-auto flex items-center gap-2">
        {showGridToggle && <ComponentsHeaderGridToggle />}
        <CustomizerSidebarToggle />
      </div>
    </div>
  )
}
