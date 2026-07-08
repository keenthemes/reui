"use client"

import * as React from "react"

import { loadComponentSourcePayloadFromApi } from "@/lib/component-source-client-loader"
import { type ComponentSourcePayload } from "@/lib/component-source-request"
import {
  DEFAULT_DOCS_STYLE_NAME,
  resolveRegistryOptions,
} from "@/lib/docs-registry-options"
import { transformIcons } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Spinner } from "@/components/ui/spinner"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/custom/icons"
import { IconLibraryName } from "@/registry/config"

const COLLAPSIBLE_COPY_BUTTON_CLASS_NAME =
  "pointer-events-none invisible opacity-0 transition-opacity group-data-[state=open]/collapsible:pointer-events-auto group-data-[state=open]/collapsible:visible group-data-[state=open]/collapsible:opacity-100"

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
  eventName?: "copy_component_code"
  showCopyButton?: boolean
}

export function ComponentSourceClient({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
  styleName = DEFAULT_DOCS_STYLE_NAME,
  iconLibrary: _iconLibrary,
  maxLines,
  code: initialCode,
  eventName,
  showCopyButton = true,
}: React.ComponentProps<"div"> & ComponentSourceClientProps) {
  const [config] = useConfig()

  const [payload, setPayload] = React.useState<ComponentSourcePayload | null>(
    null
  )
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function loadCode() {
      setIsLoading(true)
      const lang = language ?? title?.split(".").pop() ?? "tsx"
      const resolvedRegistryOptions = resolveRegistryOptions({
        styleName,
        iconLibrary: _iconLibrary,
      })
      let nextPayload: ComponentSourcePayload | null = null

      if (initialCode) {
        let currentCode = initialCode

        currentCode = currentCode.replaceAll(
          "/* eslint-disable react/no-children-prop */\n",
          ""
        )
        currentCode = transformIcons(
          currentCode,
          resolvedRegistryOptions.iconLibrary
        )

        if (maxLines) {
          currentCode = currentCode.split("\n").slice(0, maxLines).join("\n")
        }

        const { highlightCode } = await import("@/lib/highlight-code")
        nextPayload = {
          code: currentCode,
          highlightedCode: await highlightCode(currentCode, lang),
          language: lang,
        }
      } else if (name) {
        try {
          nextPayload = await loadComponentSourcePayloadFromApi({
            name,
            styleName: resolvedRegistryOptions.styleName,
            iconLibrary: resolvedRegistryOptions.iconLibrary,
            maxLines,
          })
        } catch (error) {
          console.error("Error fetching component source payload:", error)
        }
      } else if (src) {
        // For src-based loading, we can't do this on the client
        // This path should be handled by the server component
        console.warn("src prop is not supported in client component")
      }

      if (cancelled) {
        return
      }

      setPayload(nextPayload)
      setIsLoading(false)
    }

    loadCode()

    return () => {
      cancelled = true
    }
  }, [
    name,
    src,
    initialCode,
    styleName,
    _iconLibrary,
    language,
    title,
    maxLines,
  ])

  if (isLoading) {
    return (
      <div
        className={cn("flex min-h-24 items-center justify-center", className)}
      >
        <Spinner className="size-4 opacity-60" />
      </div>
    )
  }

  if (!payload) {
    return null
  }

  const effectiveEventName = eventName || "copy_component_code"

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <ComponentCode
          code={payload.code}
          highlightedCode={payload.highlightedCode}
          language={payload.language}
          title={title}
          eventName={effectiveEventName}
          name={name}
          config={config}
          showCopyButton={showCopyButton}
        />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <ComponentCode
        code={payload.code}
        highlightedCode={payload.highlightedCode}
        language={payload.language}
        title={title}
        eventName={effectiveEventName}
        name={name}
        config={config}
        showCopyButton={showCopyButton}
        copyButtonClassName={COLLAPSIBLE_COPY_BUTTON_CLASS_NAME}
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
  showCopyButton,
  copyButtonClassName,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
  eventName?: string
  name?: string
  config?: any
  showCopyButton?: boolean
  copyButtonClassName?: string
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-site-code-foreground [&_svg]:text-site-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      )}
      {showCopyButton && (
        <CopyButton
          value={code}
          event={eventName as any}
          className={copyButtonClassName}
          properties={{
            name,
            base: config?.base,
            style: config?.style,
            iconLibrary: config?.iconLibrary,
          }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
