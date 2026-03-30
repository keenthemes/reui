// Description: Copy button with feedback
// Order: 41

"use client"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1500 })

  return (
    <Button
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
      <span>{isCopied ? "Copied" : "Copy"}</span>
    </Button>
  )
}
