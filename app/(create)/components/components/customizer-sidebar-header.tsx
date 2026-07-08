"use client"

import { PanelLeftClose } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useCustomizer } from "./components-provider"

export function CustomizerSidebarHeader() {
  const { toggleCustomizer } = useCustomizer()

  return (
    <div className="border-site-border/80 flex h-[51px] shrink-0 items-center justify-between overflow-hidden border-b px-4">
      <div className="min-w-0 flex-1 whitespace-nowrap">
        <h2 className="text-site-foreground text-sm font-semibold leading-none">
          Customize
        </h2>
      </div>
      {/* `delayDuration={700}` + `sideOffset={8}` match the blocks
          customizer header — see that file for rationale. */}
      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleCustomizer}
            aria-label="Close customizer"
            className="shrink-0 opacity-60 hover:bg-transparent hover:opacity-100"
          >
            <PanelLeftClose />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          Close customizer
          <Kbd className="ml-2">C</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
