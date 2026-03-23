import { getIconLibraryFromStyle } from "@/lib/icons"
import type { BaseName, IconLibraryName, StyleName } from "@/registry/config"

export const DEFAULT_DOCS_STYLE_NAME = "radix-nova"

function parseRegistryStyleName(styleName: string) {
  const [defaultBase, ...defaultStyleParts] = DEFAULT_DOCS_STYLE_NAME.split("-")
  const [base, ...styleParts] = styleName.split("-")

  const resolvedBase = base || defaultBase
  const fallbackStyle = styleParts.join("-") || defaultStyleParts.join("-")

  return {
    base: resolvedBase,
    style: fallbackStyle,
  }
}

export function resolveRegistryStyleName(styleName?: string) {
  const { base, style } = parseRegistryStyleName(
    styleName ?? DEFAULT_DOCS_STYLE_NAME
  )

  return `${base}-${style}`
}

export function getSelectedRegistryStyleName(
  base?: BaseName,
  style?: StyleName
) {
  const fallback = parseRegistryStyleName(DEFAULT_DOCS_STYLE_NAME)

  return `${base ?? fallback.base}-${style ?? fallback.style}`
}

export function resolveRegistryIconLibrary(
  iconLibrary: IconLibraryName | undefined,
  styleName: string
) {
  return iconLibrary ?? getIconLibraryFromStyle(styleName)
}
