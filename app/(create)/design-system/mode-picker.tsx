"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/registry/bases/base/lib/utils"

type Mode = "light" | "dark"

/**
 * Mode (light/dark) toggle for the customizer sidebar.
 *
 * Reads from and writes to `next-themes`. Previously this rendered a
 * `Picker` dropdown with `System` / `Light` / `Dark` options, but the
 * customizer is fundamentally a "tweak and see" surface — having to
 * click the row, wait for a popover, then click an item just to flip a
 * dark-mode preview tripled the input cost on the most-toggled control.
 *
 * One click flips the resolved theme (`light` ↔ `dark`). `System` is
 * dropped from the toggle path because (a) almost no one uses it inside
 * a design tool, and (b) the `ThemeProvider` still defaults new visitors
 * to `system` — it just won't be reachable via this control after they
 * touch it. The `aria-label` and `title` advertise the next action so
 * the affordance is obvious without a tooltip.
 *
 * Trigger styling mirrors `PickerTrigger` exactly so the row sits flush
 * with the other customizer pickers visually. The right-side glyph
 * reflects the *current* mode (Sun for light, Moon for dark); clicking
 * swaps it to the opposite.
 *
 * `isMobile` / `anchorRef` are accepted to keep the prop signature
 * stable for the customizer-sidebar-content call site — they're unused
 * now that the popover is gone, but matching the picker API means we
 * don't have to fork the picker config.
 */
export function ModePicker(_: {
  isMobile?: boolean
  anchorRef?: React.RefObject<HTMLDivElement | null>
}) {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // While unmounted (SSR + first paint) we don't know the resolved
  // theme yet. Render a placeholder shape that matches the eventual
  // dimensions so the customizer column doesn't reflow on hydration.
  const currentMode: Mode = resolvedTheme === "dark" ? "dark" : "light"
  const nextMode: Mode = currentMode === "dark" ? "light" : "dark"

  const handleClick = React.useCallback(() => {
    setTheme(nextMode)
  }, [nextMode, setTheme])

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        mounted ? `Switch to ${nextMode} mode` : "Toggle theme mode"
      }
      title={mounted ? `Switch to ${nextMode} mode` : undefined}
      className={cn(
        "font-site-sans hover:bg-site-muted border-site-foreground/10 bg-site-muted/50 site-rounded-xl md:site-rounded-lg relative w-[160px] shrink-0 touch-manipulation border p-2 text-left select-none disabled:opacity-50 md:w-full md:border-transparent md:bg-transparent",
        // No `data-popup-open` state since there's no popup — but keep
        // the same focus-visible affordance as the other picker rows.
        "focus-visible:ring-site-ring focus-visible:ring-2 focus-visible:outline-none"
      )}
    >
      <div className="flex flex-col justify-start text-left">
        <div className="text-site-muted-foreground text-xs">Mode</div>
        <div className="text-site-foreground text-sm font-medium">
          {mounted ? (currentMode === "dark" ? "Dark" : "Light") : "..."}
        </div>
      </div>
      {mounted && (
        <div className="text-site-foreground pointer-events-none absolute top-1/2 right-2 flex size-4 -translate-y-1/2 items-center justify-center select-none">
          {currentMode === "dark" ? (
            <MoonIcon className="size-4" />
          ) : (
            <SunIcon className="size-4" />
          )}
        </div>
      )}
    </button>
  )
}
