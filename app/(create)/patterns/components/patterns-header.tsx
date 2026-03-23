"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { PanelLeftOpen } from "lucide-react"

import { hasActivePatternSearch } from "@/lib/pattern-search-filter"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CustomizerSidebarToggle } from "./customizer-sidebar-toggle"
import { PatternsHeaderGridToggle } from "./patterns-header-grid-toggle"
import { PatternsHeaderMobileDrawer } from "./patterns-header-mobile-drawer"
import { PatternsHeaderSearch } from "./patterns-header-search"

export function PatternsHeader() {
  const { open, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasSearch = hasActivePatternSearch(searchParams.get("search") || "")
  const currentCategory =
    pathname.startsWith("/patterns/") && pathname !== "/patterns"
      ? (pathname.split("/").at(-1) ?? "")
      : ""
  const showGridToggle = Boolean(currentCategory) || hasSearch

  return (
    <div className="border-site-border/80 bg-site-background sticky top-(--header-height) z-10 flex h-[51px] items-center gap-2 border-b px-6 sm:px-8 xl:px-10">
      <PatternsHeaderMobileDrawer />

      {!open && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon-sm"
              className="text-site-muted-foreground hover:text-site-foreground -ml-2 hidden hover:bg-transparent md:flex"
            >
              <PanelLeftOpen />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            Show sidebar <Kbd>P</Kbd>
          </TooltipContent>
        </Tooltip>
      )}

      <PatternsHeaderSearch />

      <div className="ml-auto flex items-center gap-2">
        {showGridToggle && <PatternsHeaderGridToggle />}
        <CustomizerSidebarToggle />
      </div>
    </div>
  )
}
