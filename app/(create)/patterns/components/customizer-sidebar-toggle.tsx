"use client"

import * as React from "react"
import { Settings2Icon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useCustomizer } from "./patterns-provider"

export function CustomizerSidebarToggle() {
  const { customizerOpen, toggleCustomizer } = useCustomizer()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "c" || e.key === "C") && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        toggleCustomizer()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggleCustomizer])

  if (customizerOpen) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm" onClick={toggleCustomizer}>
          <Settings2Icon className="size-3.5" />
          <span className="inline-flex items-center gap-1">
            <Avatar className="size-4">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-xs leading-none">/</span>
            <span className="text-sm leading-none">create</span>
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        Toggle shadcn/create customizer
        <Kbd>C</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
