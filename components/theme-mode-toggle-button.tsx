"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useMetaColor } from "@/hooks/use-meta-color"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ThemeModeToggleButton({
  className,
  // Default `outline` keeps the block-preview toolbar look intact —
  // there the toggle lives inside a `ButtonGroup` of adjoining outline
  // buttons that share borders. The site header overrides to `ghost`
  // for a quieter "utility chrome" feel next to X / GitHub links.
  variant = "outline",
}: {
  className?: string
  variant?: "outline" | "ghost"
}) {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor, metaColor } = useMetaColor()

  React.useEffect(() => {
    setMetaColor(metaColor)
  }, [metaColor, setMetaColor])

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="icon"
          className={cn("size-7", className)}
          onClick={toggleTheme}
          aria-label="Toggle light or dark mode"
        >
          <SunIcon className="hidden size-4 [html.dark_&]:block" />
          <MoonIcon className="size-4 [html.dark_&]:hidden" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle mode</TooltipContent>
    </Tooltip>
  )
}
