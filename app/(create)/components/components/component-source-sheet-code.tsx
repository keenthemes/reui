"use client"

import * as React from "react"

import { loadComponentSourcePayloadFromApi } from "@/lib/component-source-client-loader"
import type { ComponentSourcePayload } from "@/lib/component-source-request"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Spinner } from "@/components/ui/spinner"
import { CopyButton } from "@/components/copy-button"

interface ComponentSourceSheetCodeProps {
  name: string
  styleName: string
  iconLibrary?: string
  className?: string
  showFileName?: boolean
  copyButtonClassName?: string
}

export function ComponentSourceSheetCode({
  name,
  styleName,
  iconLibrary,
  className,
  showFileName = false,
  copyButtonClassName,
}: ComponentSourceSheetCodeProps) {
  const [config] = useConfig()
  const [payload, setPayload] = React.useState<ComponentSourcePayload | null>(
    null
  )
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function loadSource() {
      setIsLoading(true)

      try {
        const nextPayload = await loadComponentSourcePayloadFromApi({
          name,
          styleName,
          iconLibrary: iconLibrary as any,
        })

        if (!cancelled) {
          setPayload(nextPayload)
        }
      } catch (error) {
        console.error("Failed to load component source", error)
        if (!cancelled) {
          setPayload(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSource()

    return () => {
      cancelled = true
    }
  }, [iconLibrary, name, styleName])

  if (isLoading) {
    // Position absolutely so the spinner centers within the
    // bordered code panel (which is `relative`) instead of the
    // Radix ScrollArea viewport — that viewport uses
    // `display: table` internally, which collapses `h-full` to
    // content height and pushes the spinner to the top. The
    // panel's `relative` is what catches our `absolute inset-0`.
    return (
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <Spinner className="size-4 opacity-60" />
      </div>
    )
  }

  if (!payload) {
    return null
  }

  return (
    <div className={cn("min-h-full", className)}>
      <CopyButton
        value={payload.code}
        event="copy_component_code"
        variant="ghost"
        size="icon-sm"
        className={cn(
          copyButtonClassName,
          "absolute top-2 right-2 z-10 opacity-60 hover:opacity-100"
        )}
        properties={{
          name,
          base: config?.base,
          style: config?.style,
          iconLibrary: config?.iconLibrary,
        }}
      />
      <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-full">
        {showFileName ? (
          <figcaption
            data-rehype-pretty-code-title=""
            className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
            data-language={payload.language}
          >
            {name}.tsx
          </figcaption>
        ) : null}
        <div dangerouslySetInnerHTML={{ __html: payload.highlightedCode }} />
      </figure>
    </div>
  )
}
