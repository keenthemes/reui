"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getPresetCode } from "@/app/(create)/lib/preset-code"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

/**
 * Footer button that copies the current customizer state as a
 * `--preset <code>` flag for the shadcn CLI.
 *
 * Reads from BOTH the URL search params (where the customizer mirrors
 * live edits) and the persisted config (the fallback when a field
 * hasn't been overridden via URL). Same precedence the rest of the
 * design system uses.
 */
export function CopyPreset({
  className,
}: {
  className?: string
}) {
  const [params] = useDesignSystemSearchParams()
  const [config] = useConfig()

  // Effective config — URL param wins, then persisted config.
  const presetCode = React.useMemo(
    () =>
      getPresetCode({
        style: params.style ?? config.style,
        baseColor: params.baseColor ?? config.baseColor,
        theme: params.theme ?? config.theme,
        chartColor: params.chartColor ?? config.chartColor,
        iconLibrary: params.iconLibrary ?? config.iconLibrary,
        font: params.font ?? config.font,
        fontHeading: params.fontHeading ?? config.fontHeading,
        radius: params.radius ?? config.radius,
        menuAccent: params.menuAccent ?? config.menuAccent,
        menuColor: params.menuColor ?? config.menuColor,
      }),
    [
      params.style,
      params.baseColor,
      params.theme,
      params.chartColor,
      params.iconLibrary,
      params.font,
      params.fontHeading,
      params.radius,
      params.menuAccent,
      params.menuColor,
      config.style,
      config.baseColor,
      config.theme,
      config.chartColor,
      config.iconLibrary,
      config.font,
      config.fontHeading,
      config.radius,
      config.menuAccent,
      config.menuColor,
    ]
  )

  const [hasCopied, setHasCopied] = React.useState(false)
  const label = hasCopied ? "Copied!" : `--preset ${presetCode}`

  React.useEffect(() => {
    if (!hasCopied) return
    const timer = setTimeout(() => setHasCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [hasCopied])

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`--preset ${presetCode}`)
      setHasCopied(true)
    } catch {
      // Clipboard API can fail in iframes / non-secure contexts; fall
      // back to a transient highlight and let the user select the
      // displayed value manually.
      setHasCopied(true)
    }
  }, [presetCode])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label={`Copy preset flag: --preset ${presetCode}`}
          className={cn(
            // Default UI font + size so the button reads as a normal
            // shadcn outline button. The label is the only thing that
            // really needs to look "command-line-y" — and even then,
            // sentence-case typography is easier to scan in a sidebar
            // than a row of tabular mono digits.
            "border-site-border bg-site-background text-site-foreground hover:bg-site-muted/60 site-rounded-md w-full justify-center gap-2 select-none",
            className
          )}
          title={label}
        >
          <span>{label}</span>
          {hasCopied ? (
            <CheckIcon className="text-site-foreground size-3.5 shrink-0" />
          ) : (
            <CopyIcon className="text-site-muted-foreground size-3.5 shrink-0" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        Copy <span className="font-mono">--preset {presetCode}</span> to
        clipboard
      </TooltipContent>
    </Tooltip>
  )
}
