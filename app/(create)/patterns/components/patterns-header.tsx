"use client"

import * as React from "react"
import { PanelLeftOpen } from "lucide-react"

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

interface PatternsHeaderProps {
  isGridFixed?: boolean
  iframeRef?: React.RefObject<HTMLIFrameElement | null>
  count?: number
}

export function PatternsHeader({
  isGridFixed,
  iframeRef,
  count,
}: PatternsHeaderProps) {
  const { open, toggleSidebar } = useSidebar()

  return (
    <div className="border-border/80 bg-background sticky top-(--header-height) z-10 flex h-[51px] items-center gap-2 border-b px-6">
      <PatternsHeaderMobileDrawer />

      {!open && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground -ml-2 hidden hover:bg-transparent md:flex"
            >
              <PanelLeftOpen />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            Show sidebar <Kbd>P</Kbd>
          </TooltipContent>
        </Tooltip>
      )}

      <PatternsHeaderSearch count={count} />

      <div className="ml-auto flex items-center gap-2">
        {!isGridFixed && <PatternsHeaderGridToggle iframeRef={iframeRef} />}
        <CustomizerSidebarToggle />
      </div>
    </div>
  )
}
