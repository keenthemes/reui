"use client"

import { IconCheck, IconCopy } from "@tabler/icons-react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/components/ui/button"

export function DocsCopyPage({ page }: { page: string; url: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8 rounded-md shadow-none md:h-7 md:text-[0.8rem]"
      onClick={() => copyToClipboard(page)}
    >
      {isCopied ? <IconCheck /> : <IconCopy />}
      Copy Markdown
    </Button>
  )
}
