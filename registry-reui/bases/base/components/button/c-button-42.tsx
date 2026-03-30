// Description: Icon-only copy button with feedback
// Order: 42

"use client"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1500 })

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            aria-label={isCopied ? "Copied" : "Copy"}
            onClick={() => copyToClipboard("https://reui.io")}
          >
            {isCopied ? (
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                aria-hidden="true"
              />
            ) : (
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
                aria-hidden="true"
              />
            )}
          </Button>
        }
      />
      <TooltipContent>{isCopied ? "Copied" : "Copy link"}</TooltipContent>
    </Tooltip>
  )
}
