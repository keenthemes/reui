import { getRegistryDeploymentId } from "@/lib/registry-deployment"
import { normalizeAbsoluteUrl } from "@/lib/site-url"

function normalizeRegistryOrigin(origin: string) {
  const normalized = normalizeAbsoluteUrl(origin)

  return normalized.endsWith("/") ? normalized : `${normalized}/`
}

export function getComponentRegistryJsonAbsoluteUrl(
  origin: string,
  styleName: string,
  name: string
) {
  const path = `/r/styles/${styleName}/${encodeURIComponent(name)}.json?v=${encodeURIComponent(getRegistryDeploymentId())}`
  return new URL(path, normalizeRegistryOrigin(origin)).toString()
}

/** @deprecated Use getComponentRegistryJsonAbsoluteUrl. */
export const getPatternRegistryJsonAbsoluteUrl =
  getComponentRegistryJsonAbsoluteUrl

export function getBlockRegistryJsonAbsoluteUrl(
  origin: string,
  styleName: string,
  name: string
) {
  const path = `/r/styles/${styleName}/${encodeURIComponent(name)}.json?v=${encodeURIComponent(getRegistryDeploymentId())}`
  return new URL(path, normalizeRegistryOrigin(origin)).toString()
}
