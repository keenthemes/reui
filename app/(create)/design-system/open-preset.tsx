"use client"

import * as React from "react"
import { decodePreset } from "shadcn/preset"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useOpenPreset } from "@/app/(create)/hooks/use-open-preset"
import { parsePresetInput } from "@/app/(create)/lib/parse-preset-input"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

const PRESET_EXAMPLE = "b2D0wqNxT"
const PRESET_TITLE = "Open Preset"
const PRESET_DESCRIPTION = "Paste a preset code to load a saved configuration."

/**
 * Open-Preset dialog (port of the upstream shadcn create dialog).
 *
 * Key differences from upstream:
 *   - No hardcoded `dark` class — the dialog uses site-* tokens and
 *     respects the user's current light/dark/system theme via
 *     `font-site-sans bg-site-background ...`. The dialog primitive
 *     already does this; we just don't override.
 *   - On submit we decode the preset code locally via
 *     `decodePreset(...)` and write the resulting fields directly to
 *     `useDesignSystemSearchParams` + `useConfig` so the change is
 *     visible immediately and survives page reload.
 *   - Desktop-only dialog (no separate Drawer for mobile — the
 *     standard Dialog is already responsive enough for paste-a-code).
 */
export function OpenPreset({
  className,
  label = "Open Preset",
}: {
  className?: string
  label?: string
}) {
  const [input, setInput] = React.useState("")
  const [, setParams] = useDesignSystemSearchParams()
  const [, setConfig] = useConfig()
  const { open, setOpen } = useOpenPreset()

  const nextPreset = React.useMemo(() => parsePresetInput(input), [input])
  const isInvalid = input.trim().length > 0 && nextPreset === null

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) setInput("")
    },
    [setOpen]
  )

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!nextPreset) return

      const config = decodePreset(nextPreset)
      if (!config) return

      // Apply each preset field to URL params (the primary source the
      // pickers read from) and mirror to persisted config so the change
      // survives a hard reload.
      const next = {
        style: config.style,
        baseColor: config.baseColor,
        theme: config.theme,
        chartColor: config.chartColor ?? null,
        iconLibrary: config.iconLibrary,
        font: config.font,
        fontHeading: config.fontHeading,
        radius: config.radius,
        menuAccent: config.menuAccent,
        menuColor: config.menuColor,
      }

      setParams(next)
      setConfig((prev) => ({
        ...prev,
        ...next,
        // chartColor in our config is non-nullable; fall back to the
        // base color when the preset doesn't specify one.
        chartColor: next.chartColor ?? next.baseColor,
      }))
      handleOpenChange(false)
    },
    [handleOpenChange, nextPreset, setConfig, setParams]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "border-site-border bg-site-background text-site-foreground hover:bg-site-muted/60 site-rounded-md w-full justify-center gap-2",
                className
              )}
            >
              <span className="text-sm">{label}</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
          Load a saved preset code (press O)
        </TooltipContent>
      </Tooltip>

      <DialogContent className="font-site-sans text-site-foreground sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-site-foreground">
              {PRESET_TITLE}
            </DialogTitle>
            <DialogDescription className="text-site-muted-foreground">
              {PRESET_DESCRIPTION}
            </DialogDescription>
          </DialogHeader>

          <div>
            <label htmlFor="preset-code" className="sr-only">
              Preset code
            </label>
            <Input
              id="preset-code"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={`${PRESET_EXAMPLE} or --preset ${PRESET_EXAMPLE}`}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-invalid={isInvalid}
            />
            {isInvalid ? (
              <p className="text-site-destructive mt-2 text-xs">
                That doesn't look like a valid preset code.
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!nextPreset}>
              Open
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
