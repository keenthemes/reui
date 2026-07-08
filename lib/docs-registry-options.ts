import { getIconLibraryFromStyle } from "@/lib/icons"
import {
  BASES,
  iconLibraries,
  STYLES,
  type BaseName,
  type IconLibraryName,
  type StyleName,
} from "@/registry/config"

export const DEFAULT_DOCS_STYLE_NAME = "base-nova"

const VALID_BASE_NAMES = new Set<string>(BASES.map((base) => base.name))
const VALID_STYLE_NAMES = new Set<string>(STYLES.map((style) => style.name))
const VALID_ICON_LIBRARY_NAMES = new Set<string>(Object.keys(iconLibraries))

function parseRegistryStyleName(styleName?: string | null) {
  const [defaultBase, ...defaultStyleParts] = DEFAULT_DOCS_STYLE_NAME.split("-")
  const [base, ...styleParts] = (
    typeof styleName === "string" && styleName.trim()
      ? styleName.trim()
      : DEFAULT_DOCS_STYLE_NAME
  ).split("-")
  const style = styleParts.join("-")

  const resolvedBase = VALID_BASE_NAMES.has(base) ? base : defaultBase
  const resolvedStyle = VALID_STYLE_NAMES.has(style)
    ? style
    : defaultStyleParts.join("-")

  return {
    base: resolvedBase,
    style: resolvedStyle,
  }
}

export function getRegistryBaseName(styleName?: string): BaseName {
  return parseRegistryStyleName(styleName).base as BaseName
}

export function resolveRegistryStyleName(styleName?: string | null) {
  const { base, style } = parseRegistryStyleName(styleName)

  return `${base}-${style}`
}

export function getSelectedRegistryStyleName(
  base?: BaseName,
  style?: StyleName
) {
  const fallback = parseRegistryStyleName(DEFAULT_DOCS_STYLE_NAME)
  const resolvedBase = base && VALID_BASE_NAMES.has(base) ? base : fallback.base
  const resolvedStyle =
    style && VALID_STYLE_NAMES.has(style) ? style : fallback.style

  return `${resolvedBase}-${resolvedStyle}`
}

export function resolveRegistryIconLibrary(
  iconLibrary: IconLibraryName | string | null | undefined,
  styleName?: string | null
) {
  if (iconLibrary && VALID_ICON_LIBRARY_NAMES.has(iconLibrary)) {
    return iconLibrary as IconLibraryName
  }

  return getIconLibraryFromStyle(resolveRegistryStyleName(styleName))
}

export function resolveRegistryOptions({
  styleName,
  iconLibrary,
}: {
  styleName?: string | null
  iconLibrary?: IconLibraryName | string | null
}) {
  const resolvedStyleName = resolveRegistryStyleName(styleName)

  return {
    styleName: resolvedStyleName,
    iconLibrary: resolveRegistryIconLibrary(iconLibrary, resolvedStyleName),
  }
}
