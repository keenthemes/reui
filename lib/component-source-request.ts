import {
  DEFAULT_DOCS_STYLE_NAME,
  resolveRegistryOptions,
} from "@/lib/docs-registry-options"
import { getRegistryDeploymentId } from "@/lib/registry-deployment"
import type { IconLibraryName } from "@/registry/config"

const COMPONENT_SOURCE_TRANSFORM_VERSION = "3"

export interface ComponentSourceRequestOptions {
  name: string
  styleName?: string
  iconLibrary?: IconLibraryName
  language?: string
  maxLines?: number
}

export interface ComponentSourcePayload {
  code: string
  highlightedCode: string
  language: string
}

function normalizeOptions({
  name,
  styleName = DEFAULT_DOCS_STYLE_NAME,
  iconLibrary,
  maxLines,
}: ComponentSourceRequestOptions) {
  const resolvedOptions = resolveRegistryOptions({ styleName, iconLibrary })

  return {
    name,
    styleName: resolvedOptions.styleName,
    iconLibrary: resolvedOptions.iconLibrary,
    maxLines: typeof maxLines === "number" ? maxLines : undefined,
  }
}

export function buildComponentSourceRequestUrl(
  options: ComponentSourceRequestOptions
) {
  const normalized = normalizeOptions(options)
  const params = new URLSearchParams({
    name: normalized.name,
    styleName: normalized.styleName,
    v: getRegistryDeploymentId(),
    cv: COMPONENT_SOURCE_TRANSFORM_VERSION,
  })

  if (normalized.iconLibrary) {
    params.set("iconLibrary", normalized.iconLibrary)
  }

  if (normalized.maxLines !== undefined) {
    params.set("maxLines", String(normalized.maxLines))
  }

  return `/api/components/source?${params.toString()}`
}

export function getComponentSourcePayloadCacheKey(
  options: ComponentSourceRequestOptions
) {
  const normalized = normalizeOptions(options)

  return [
    getRegistryDeploymentId(),
    COMPONENT_SOURCE_TRANSFORM_VERSION,
    normalized.styleName,
    normalized.iconLibrary ?? "",
    normalized.maxLines ?? "",
    normalized.name,
  ].join(":")
}
