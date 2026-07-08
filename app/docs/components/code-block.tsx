"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function CopyButton({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* noop */
    }
  }, [value])

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "text-site-muted-foreground hover:text-site-foreground focus-visible:ring-site-ring absolute top-3 right-3 rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <CheckIcon className="size-4" aria-hidden="true" />
      ) : (
        <ClipboardIcon className="size-4" aria-hidden="true" />
      )}
    </button>
  )
}

export function CodeBlock({
  code,
  filename,
  badge,
}: {
  code: string
  filename?: string
  badge?: string
}) {
  return (
    <div className="bg-code text-code-foreground relative overflow-hidden rounded-xl border">
      {(filename || badge) && (
        <div className="flex items-center gap-2 border-b px-4 py-2.5">
          {filename && (
            <span className="text-code-foreground/70 text-sm">{filename}</span>
          )}
          {badge && (
            <span className="text-site-muted-foreground ml-auto rounded-md border px-2 py-0.5 text-[11px] font-medium">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <CopyButton value={code} />
        <pre className="no-scrollbar overflow-x-auto px-4 py-3.5 text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
