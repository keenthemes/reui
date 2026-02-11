"use client"

import * as React from "react"

import { transformStyleClassNames } from "@/lib/code-utils"
import { highlightCode } from "@/lib/highlight-code"
import { getIconLibraryFromStyle, transformIcons } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Spinner } from "@/components/ui/spinner"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/icons"
import { IconLibraryName } from "@/registry/config"

// Default styleName - matches the API default
const DEFAULT_STYLE_NAME = "radix-nova"

export interface ComponentSourceClientProps {
  name?: string
  src?: string
  title?: string
  language?: string
  collapsible?: boolean
  styleName?: string
  iconLibrary?: IconLibraryName
  maxLines?: number
  code?: string
  className?: string
  eventName?: "copy_pattern_code" | "copy_component_code"
}

export function ComponentSourceClient({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
  styleName = DEFAULT_STYLE_NAME,
  iconLibrary: _iconLibrary, // Icon library is now handled by the API
  maxLines,
  code: initialCode,
  eventName,
}: React.ComponentProps<"div"> & ComponentSourceClientProps) {
  const [config] = useConfig()

  const [code, setCode] = React.useState<string | undefined>(initialCode)
  const [highlightedCode, setHighlightedCode] = React.useState<string | null>(
    null
  )
  const [isLoading, setIsLoading] = React.useState(!initialCode)

  const abortControllerRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    let isMounted = true

    async function loadCode() {
      // Abort any previous request
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      let currentCode = initialCode
      let highlighted = null

      // Fetch from the /r/ API endpoint
      if (name) {
        try {
          // Use the style-specific endpoint
          const url = `/r/${styleName}/${name}.json`
          const res = await fetch(url, {
            signal: abortControllerRef.current.signal,
          })

          if (res.ok) {
            const data = await res.json()
            currentCode = data.files?.[0]?.content
          }
        } catch (error) {
          // Check if this is an abort error
          if (error instanceof Error && error.name === "AbortError") {
            return
          }
          console.error("Error fetching registry item:", error)
        }
      }

      if (!isMounted) return

      if (!currentCode && src) {
        // For src-based loading, we can't do this on the client
        // This path should be handled by the server component
        console.warn("src prop is not supported in client component")
      }

      if (!isMounted) return

      if (currentCode) {
        // Clean up any remaining artifacts
        currentCode = currentCode.replaceAll(
          "/* eslint-disable react/no-children-prop */\n",
          ""
        )

        // Transform classNames for display
        currentCode = transformStyleClassNames(currentCode, styleName)

        // Transform icons for display
        const effectiveIconLibrary =
          _iconLibrary || getIconLibraryFromStyle(styleName)
        currentCode = transformIcons(currentCode, effectiveIconLibrary)

        if (maxLines) {
          currentCode = currentCode.split("\n").slice(0, maxLines).join("\n")
        }

        const lang = language ?? title?.split(".").pop() ?? "tsx"
        highlighted = await highlightCode(currentCode, lang)

        if (!isMounted) return

        setCode(currentCode)
        setHighlightedCode(highlighted)
      }
      setIsLoading(false)
    }

    loadCode()

    return () => {
      isMounted = false
      abortControllerRef.current?.abort()
    }
  }, [name, src, initialCode, styleName, language, title, maxLines])

  if (isLoading) {
    return (
      <div
        className={cn("flex min-h-24 items-center justify-center", className)}
      >
        <Spinner className="size-4 opacity-60" />
      </div>
    )
  }

  if (!code || !highlightedCode) {
    return null
  }

  const lang = language ?? title?.split(".").pop() ?? "tsx"

  const effectiveEventName =
    eventName ||
    (name?.startsWith("p-") ? "copy_pattern_code" : "copy_component_code")

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          title={title}
          eventName={effectiveEventName}
          name={name}
          config={config}
        />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
        eventName={effectiveEventName}
        name={name}
        config={config}
      />
    </CodeCollapsibleWrapper>
  )
}

function ComponentCode({
  code,
  highlightedCode,
  language,
  title,
  eventName,
  name,
  config,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
  eventName?: string
  name?: string
  config?: any
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      )}
      <CopyButton
        value={code}
        event={eventName as any}
        properties={{
          name,
          base: config?.base,
          style: config?.style,
          iconLibrary: config?.iconLibrary,
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
