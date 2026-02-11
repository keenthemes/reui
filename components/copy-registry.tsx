"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { trackEvent } from "@/lib/events"
import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CopyRegistryProps extends React.ComponentProps<typeof Button> {
  value: string
}

export function CopyRegistry({ value, ...props }: CopyRegistryProps) {
  const [config] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const copyToClipboard = React.useCallback(async () => {
    try {
      const pm = config?.packageManager || "pnpm"
      let command = ""

      switch (pm) {
        case "bun":
          command = `bunx --bun shadcn@latest add ${value}`
          break
        case "yarn":
          command = `yarn dlx shadcn@latest add ${value}`
          break
        case "npm":
          command = `npx shadcn@latest add ${value}`
          break
        case "pnpm":
        default:
          command = `pnpm dlx shadcn@latest add ${value}`
          break
      }

      await navigator.clipboard.writeText(command)
      setHasCopied(true)

      trackEvent({
        name: "copy_command",
        properties: {
          command,
          pm,
          base: config?.base,
          style: config?.style,
          iconLibrary: config?.iconLibrary,
        },
      })
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [value, config?.packageManager])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-sm"
          variant="outline"
          className="size-7"
          onClick={copyToClipboard}
          {...props}
        >
          {hasCopied ? (
            <CheckIcon className="size-3" />
          ) : (
            <CopyIcon className="size-3" />
          )}
          <span className="sr-only">Copy registry URL</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {hasCopied ? "Copied" : "Copy Registry URL"}
      </TooltipContent>
    </Tooltip>
  )
}
