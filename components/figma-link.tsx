import Link from "next/link"

import { FIGMA_URL, FigmaIcon } from "@/lib/nav-config"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Figma icon link for the header toolbar. The destination and the glyph both
 * come from `@/lib/nav-config` so the Figma URL stays single-sourced with the
 * "Free Figma" dropdown item (edit `FIGMA_URL` in one place). Tooltip matches
 * the sibling toolbar icon buttons (theme / X / GitHub) so the group reads as
 * one set.
 */
export function FigmaLink() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild size="icon-sm" variant="ghost" className="shadow-none">
          <Link
            href={FIGMA_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Open ReUI on Figma"
          >
            <FigmaIcon className="size-[18px]" aria-hidden="true" />
            <span className="sr-only">Figma</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Free shadcn/ui Figma</TooltipContent>
    </Tooltip>
  )
}
