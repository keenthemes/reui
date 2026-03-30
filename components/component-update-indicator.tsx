"use client"

import { getComponentMenuUpdateHint } from "@/lib/component-updates"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ComponentUpdateIndicator({ category }: { category: string }) {
  const hint = getComponentMenuUpdateHint(category)

  if (!hint) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0 cursor-help">
          <span className="sr-only">{hint}</span>
          <span
            aria-hidden="true"
            className="site-rounded-full size-2 bg-blue-500"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {hint}
      </TooltipContent>
    </Tooltip>
  )
}
