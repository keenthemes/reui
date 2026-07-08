import * as React from "react"

import { getComponentSourcePayload } from "@/lib/component-source-payload"
import {
  DEFAULT_DOCS_STYLE_NAME,
  resolveRegistryOptions,
} from "@/lib/docs-registry-options"
import { highlightCode } from "@/lib/highlight-code"
import { transformIcons } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { ComponentSourceClient } from "@/components/component-source-client"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/custom/icons"
import { IconLibraryName } from "@/registry/config"

const COLLAPSIBLE_COPY_BUTTON_CLASS_NAME =
  "pointer-events-none invisible opacity-0 transition-opacity group-data-[state=open]/collapsible:pointer-events-auto group-data-[state=open]/collapsible:visible group-data-[state=open]/collapsible:opacity-100"

export async function ComponentSource({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
  styleName = DEFAULT_DOCS_STYLE_NAME,
  iconLibrary,
  maxLines,
  code: initialCode,
  async = false,
  eventName,
  showCopyButton = true,
}: React.ComponentProps<"div"> & {
  name?: string
  src?: string
  title?: string
  language?: string
  collapsible?: boolean
  styleName?: string
  iconLibrary?: IconLibraryName
  maxLines?: number
  code?: string
  async?: boolean
  eventName?: "copy_component_code"
  showCopyButton?: boolean
}) {
  const resolvedRegistryOptions = resolveRegistryOptions({
    styleName,
    iconLibrary,
  })

  if (async) {
    return (
      <ComponentSourceClient
        name={name}
        src={src}
        title={title}
        language={language}
        collapsible={collapsible}
        className={className}
        styleName={resolvedRegistryOptions.styleName}
        iconLibrary={resolvedRegistryOptions.iconLibrary}
        maxLines={maxLines}
        code={initialCode}
        eventName={eventName}
        showCopyButton={showCopyButton}
      />
    )
  }

  let code = initialCode
  let highlightedCode: string | null = null

  if (code) {
    // Transform icons for display if code is provided via prop (e.g. from rehype)
    code = transformIcons(code, resolvedRegistryOptions.iconLibrary)
  }

  if (!code && name) {
    // Server-render the source code instead of falling through to the
    // browser-side `ComponentSourceClient` (which fetches
    // `/api/components/source` and then re-runs Shiki on every preview).
    //
    // On docs pages with 20–30+ examples (e.g. data-grid) the API path
    // turned into 30 cold-start serverless invocations per first visit
    // — each ~1.4s — that hung the page on scroll. The server payload
    // resolver below is `'use cache' + cacheLife("max")` so the result
    // is shared across visitors and bakes into the docs page's own
    // `'use cache'` HTML, so subsequent loads serve from CDN with zero
    // function executions.
    //
    // Empty `registryOrigin` ("") is intentional: the resolver tries a
    // local `public/r/styles/…json` read first and only falls back to
    // HTTP if the file is missing. Local read works as long as the
    // function bundle traces those JSONs (see `outputFileTracingIncludes`
    // in `next.config.mjs`). If the local read fails AND there's no
    // origin, we drop back to the legacy client-fetch path below so the
    // page never breaks — same fail-open behaviour as before.
    const serverPayload = await getComponentSourcePayload({
      name,
      registryOrigin: "",
      styleName: resolvedRegistryOptions.styleName,
      iconLibrary: resolvedRegistryOptions.iconLibrary,
      maxLines,
    }).catch(() => null)

    if (serverPayload) {
      const effectiveEventName = eventName || "copy_component_code"

      if (!collapsible) {
        return (
          <div className={cn("relative", className)}>
            <ComponentCode
              code={serverPayload.code}
              highlightedCode={serverPayload.highlightedCode}
              language={serverPayload.language}
              title={title}
              eventName={effectiveEventName}
              name={name}
              styleName={resolvedRegistryOptions.styleName}
              iconLibrary={resolvedRegistryOptions.iconLibrary}
              showCopyButton={showCopyButton}
            />
          </div>
        )
      }

      return (
        <CodeCollapsibleWrapper className={className}>
          <ComponentCode
            code={serverPayload.code}
            highlightedCode={serverPayload.highlightedCode}
            language={serverPayload.language}
            title={title}
            eventName={effectiveEventName}
            name={name}
            styleName={resolvedRegistryOptions.styleName}
            iconLibrary={resolvedRegistryOptions.iconLibrary}
            showCopyButton={showCopyButton}
            copyButtonClassName={COLLAPSIBLE_COPY_BUTTON_CLASS_NAME}
          />
        </CodeCollapsibleWrapper>
      )
    }

    // Fall back to the client loader only when the server resolver
    // couldn't produce a payload (unknown component, missing registry
    // bundle entry, etc.). Keeps existing behaviour for edge cases.
    return (
      <ComponentSourceClient
        name={name}
        src={src}
        title={title}
        language={language}
        collapsible={collapsible}
        className={className}
        styleName={resolvedRegistryOptions.styleName}
        iconLibrary={resolvedRegistryOptions.iconLibrary}
        maxLines={maxLines}
        eventName={eventName}
        showCopyButton={showCopyButton}
      />
    )
  }

  if (!code && src) {
    console.error(`Unsupported component source path: ${src}`)
  }

  if (!code) {
    return null
  }

  // Clean up any remaining artifacts
  code = code.replaceAll("/* eslint-disable react/no-children-prop */\n", "")

  if (maxLines) {
    code = code.split("\n").slice(0, maxLines).join("\n")
  }

  const lang = language ?? title?.split(".").pop() ?? "tsx"
  if (!highlightedCode) {
    highlightedCode = await highlightCode(code, lang)
  }

  const effectiveEventName = eventName || "copy_component_code"

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
          styleName={resolvedRegistryOptions.styleName}
          iconLibrary={resolvedRegistryOptions.iconLibrary}
          showCopyButton={showCopyButton}
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
        styleName={resolvedRegistryOptions.styleName}
        iconLibrary={resolvedRegistryOptions.iconLibrary}
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
  styleName,
  iconLibrary,
  showCopyButton,
  copyButtonClassName,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
  eventName?: string
  name?: string
  styleName?: string
  iconLibrary?: string
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
            style: styleName,
            iconLibrary: iconLibrary,
          }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
