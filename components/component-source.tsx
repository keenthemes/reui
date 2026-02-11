import fs from "node:fs/promises"
import path from "node:path"
import * as React from "react"

import { transformStyleClassNames } from "@/lib/code-utils"
import { highlightCode } from "@/lib/highlight-code"
import { getIconLibraryFromStyle, transformIcons } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/icons"
import { IconLibraryName } from "@/registry/config"

import { ComponentSourceClient } from "./component-source-client"

// Default styleName - matches the API default
const DEFAULT_STYLE_NAME = "radix-nova"

export async function ComponentSource({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
  styleName = DEFAULT_STYLE_NAME,
  iconLibrary = "lucide",
  maxLines,
  code: initialCode,
  async = false,
  eventName,
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
  eventName?: "copy_pattern_code" | "copy_component_code"
}) {
  if (async) {
    return (
      <ComponentSourceClient
        name={name}
        src={src}
        title={title}
        language={language}
        collapsible={collapsible}
        className={className}
        styleName={styleName}
        iconLibrary={iconLibrary}
        maxLines={maxLines}
        code={initialCode}
        eventName={eventName}
      />
    )
  }

  let code = initialCode

  if (code) {
    // Transform classNames for display (code prop comes raw, not from static JSON)
    code = transformStyleClassNames(code, styleName)

    // Transform icons for display if code is provided via prop (e.g. from rehype)
    const effectiveIconLibrary =
      iconLibrary || getIconLibraryFromStyle(styleName)
    code = transformIcons(code, effectiveIconLibrary)
  }

  if (!code && name) {
    // Read from pre-built static JSON (style classes already transformed at build time)
    try {
      const jsonPath = path.join(
        process.cwd(),
        "public",
        "r",
        "styles",
        styleName,
        `${name}.json`
      )
      const jsonContent = await fs.readFile(jsonPath, "utf-8")
      const item = JSON.parse(jsonContent)
      code = item?.files?.[0]?.content
    } catch (error) {
      console.error(`Error reading static registry: ${name}`, error)
    }

    if (code) {
      // Transform icons for display (not baked into static JSON)
      const effectiveIconLibrary =
        iconLibrary || getIconLibraryFromStyle(styleName)
      code = transformIcons(code, effectiveIconLibrary)
    }
  }

  if (!code && src) {
    const projectRoot = process.cwd()
    let absolutePath: string
    if (src.startsWith("registry/")) {
      absolutePath = path.join(projectRoot, "registry", src.slice(9))
    } else if (src.startsWith("registry-reui/")) {
      absolutePath = path.join(projectRoot, "registry-reui", src.slice(14))
    } else {
      absolutePath = path.join(projectRoot, src)
    }

    try {
      code = await fs.readFile(absolutePath, "utf-8")

      // Transform classNames for display
      code = transformStyleClassNames(code, styleName)

      // Transform icons for file-based source
      const effectiveIconLibrary =
        iconLibrary || getIconLibraryFromStyle(styleName)
      code = transformIcons(code, effectiveIconLibrary)
    } catch (error) {
      console.error(`Error reading file: ${absolutePath}`, error)
    }
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
  const highlightedCode = await highlightCode(code, lang)

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
          styleName={styleName}
          iconLibrary={iconLibrary}
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
        styleName={styleName}
        iconLibrary={iconLibrary}
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
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
  eventName?: string
  name?: string
  styleName?: string
  iconLibrary?: string
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
          style: styleName,
          iconLibrary: iconLibrary,
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
