import "server-only"

import fs from "node:fs/promises"
import path from "node:path"
import { cacheLife } from "next/cache"

import {
  type ComponentSourcePayload,
  type ComponentSourceRequestOptions,
} from "@/lib/component-source-request"
import {
  DEFAULT_DOCS_STYLE_NAME,
  resolveRegistryOptions,
} from "@/lib/docs-registry-options"
import { highlightCode } from "@/lib/highlight-code"
import { getIconLibraryFromStyle, transformIcons } from "@/lib/icons"
import { isStyleAwareRegistryItemName } from "@/lib/public-registry"
import { getRegistryDeploymentId } from "@/lib/registry-deployment"
import type { IconLibraryName } from "@/registry/config"

const DEFAULT_REGISTRY_STYLE_VARIANT = "nova"
const REGISTRY_STYLE_VARIANTS = new Set([
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
])
const SAFE_REGISTRY_SEGMENT_PATTERN = /^[a-z0-9][a-z0-9-]*$/i

function isSafeRegistrySegment(value: string) {
  return SAFE_REGISTRY_SEGMENT_PATTERN.test(value)
}

async function readPublicRegistryFile(styleName: string, name: string) {
  if (!isSafeRegistrySegment(styleName) || !isSafeRegistrySegment(name)) {
    return null
  }

  try {
    return await fs.readFile(
      path.join(
        /* turbopackIgnore: true */ process.cwd(),
        "public",
        "r",
        "styles",
        styleName,
        `${name}.json`
      ),
      "utf-8"
    )
  } catch {
    return null
  }
}

function getStyleAgnosticFallbackStyleName(styleName: string, name: string) {
  if (isStyleAwareRegistryItemName(name)) {
    return null
  }

  const [base, ...variantParts] = styleName.split("-")
  const variant = variantParts.join("-")

  if (!base || !REGISTRY_STYLE_VARIANTS.has(variant)) {
    return null
  }

  if (variant === DEFAULT_REGISTRY_STYLE_VARIANT) {
    return null
  }

  return `${base}-${DEFAULT_REGISTRY_STYLE_VARIANT}`
}

async function readStaticRegistryJson(
  registryOrigin: string,
  styleName: string,
  name: string
) {
  const candidateStyleNames = [
    styleName,
    getStyleAgnosticFallbackStyleName(styleName, name),
  ].filter((value): value is string => Boolean(value))

  for (const candidateStyleName of candidateStyleNames) {
    if (
      !isSafeRegistrySegment(candidateStyleName) ||
      !isSafeRegistrySegment(name)
    ) {
      continue
    }

    const fileContent = await readPublicRegistryFile(candidateStyleName, name)
    if (fileContent) {
      return fileContent
    }

    // HTTP fallback only runs when we have a usable origin. Server
    // components that pre-resolve the source during page render pass an
    // empty origin — they rely entirely on the local-file path above, so
    // there's no second "fetch from CDN" round trip to wait on. If the
    // local read missed (e.g. the function bundle didn't trace this
    // style/component), we just return null and let the caller fall
    // back to the client-side loader.
    if (!registryOrigin) {
      continue
    }

    try {
      const registryUrl = new URL(
        `/r/styles/${encodeURIComponent(candidateStyleName)}/${encodeURIComponent(name)}.json`,
        registryOrigin
      )
      registryUrl.searchParams.set("v", getRegistryDeploymentId())

      const response = await fetch(registryUrl, {
        cache: "force-cache",
        next: { revalidate: 31536000 },
      })

      if (response.ok) {
        return await response.text()
      }
    } catch {}
  }

  return null
}

async function loadComponentSourcePayload({
  name,
  registryOrigin,
  styleName = DEFAULT_DOCS_STYLE_NAME,
  iconLibrary,
  language = "tsx",
  maxLines,
}: ComponentSourceRequestOptions & {
  registryOrigin: string
}): Promise<ComponentSourcePayload | null> {
  "use cache"
  cacheLife("max")

  const jsonContent = await readStaticRegistryJson(
    registryOrigin,
    styleName,
    name
  )
  if (!jsonContent) return null

  const item = JSON.parse(jsonContent) as {
    files?: Array<{ content?: string }>
  }

  let code = item.files?.[0]?.content
  if (!code) {
    return null
  }

  code = code.replaceAll("/* eslint-disable react/no-children-prop */\n", "")
  code = transformIcons(code, iconLibrary ?? getIconLibraryFromStyle(styleName))

  if (typeof maxLines === "number" && maxLines > 0) {
    code = code.split("\n").slice(0, maxLines).join("\n")
  }

  const highlightedCode = await highlightCode(code, language)

  return {
    code,
    highlightedCode,
    language,
  }
}

export async function getComponentSourcePayload({
  name,
  registryOrigin,
  styleName = DEFAULT_DOCS_STYLE_NAME,
  iconLibrary,
  language = "tsx",
  maxLines,
}: {
  name: string
  registryOrigin: string
  styleName?: string
  iconLibrary?: IconLibraryName
  language?: string
  maxLines?: number
}) {
  const resolvedRegistryOptions = resolveRegistryOptions({
    styleName,
    iconLibrary,
  })

  return loadComponentSourcePayload({
    name,
    registryOrigin,
    styleName: resolvedRegistryOptions.styleName,
    iconLibrary: resolvedRegistryOptions.iconLibrary,
    language,
    maxLines,
  })
}
