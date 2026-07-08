"use client"

import * as React from "react"
import { Settings2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useCustomizer } from "./components-provider"

/**
 * Customizer toggle for the components page header.
 *
 * A compact "Customize" toggle: primary fill, settings glyph, "Customize"
 * label, `h-7 px-2 text-xs` sizing. Retains the components-page niceties:
 * the `C` keyboard shortcut (with the tooltip surfacing it) and an
 * `aria-pressed` toggled state.
 */
export function CustomizerSidebarToggle() {
  const { customizerOpen, toggleCustomizer } = useCustomizer()
  const [tooltipOpen, setTooltipOpen] = React.useState(false)

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
        setTooltipOpen(false)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggleCustomizer])

  const handleClick = () => {
    setTooltipOpen(false)
    toggleCustomizer()
  }

  return (
    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
      <TooltipTrigger asChild>
        {/*
          Default `size` so the type ramp matches the rest of the header,
          but we pin the height to `h-8` (32px) so the button sits at the
          same baseline as the adjacent `ComponentsHeaderGridToggle` (whose
          outer `Tabs` / `TabsList` are also `h-8`). Without the override
          the default `h-9` button would tower over the toggle by a
          pixel — visually obvious in the sticky header band.
        */}
        <Button
          type="button"
          variant="default"
          size="default"
          className="h-8 gap-1.5 px-2.5 text-xs"
          onClick={handleClick}
          aria-pressed={customizerOpen}
          aria-label={customizerOpen ? "Close customizer" : "Customize preview"}
        >
          <Settings2Icon className="size-3.5" aria-hidden="true" />
          Customize
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex items-center gap-2">
        {customizerOpen ? "Close customizer" : "Open customizer"}
        <Kbd>C</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
