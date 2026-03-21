import { useQueryStates } from "nuqs"
import {
  createLoader,
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
  type Options,
} from "nuqs/server"

import {
  BASE_COLORS,
  BASES,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  THEMES,
  type BaseColorName,
  type BaseName,
  type ChartColorName,
  type FontHeadingValue,
  type FontValue,
  type IconLibraryName,
  type MenuAccentValue,
  type MenuColorValue,
  type RadiusValue,
  type StyleName,
  type ThemeName,
} from "@/registry/config"
import { FONTS } from "@/app/(create)/lib/fonts"

const fontHeadingLiterals = [
  "inherit",
  ...FONTS.map((f) => f.value),
] as const satisfies readonly FontHeadingValue[]

const designSystemSearchParams = {
  base: parseAsStringLiteral<BaseName>(BASES.map((b) => b.name)),
  item: parseAsString.withOptions({ shallow: true }),
  iconLibrary: parseAsStringLiteral<IconLibraryName>(
    Object.values(iconLibraries).map((i) => i.name)
  ),
  style: parseAsStringLiteral<StyleName>(STYLES.map((s) => s.name)),
  theme: parseAsStringLiteral<ThemeName>(THEMES.map((t) => t.name)),
  chartColor: parseAsStringLiteral<ChartColorName>(THEMES.map((t) => t.name)),
  font: parseAsStringLiteral<FontValue>(FONTS.map((f) => f.value)),
  fontHeading: parseAsStringLiteral<FontHeadingValue>(fontHeadingLiterals),
  baseColor: parseAsStringLiteral<BaseColorName>(
    BASE_COLORS.map((b) => b.name)
  ),
  menuAccent: parseAsStringLiteral<MenuAccentValue>(
    MENU_ACCENTS.map((a) => a.value)
  ),
  menuColor: parseAsStringLiteral<MenuColorValue>(
    MENU_COLORS.map((m) => m.value)
  ),
  radius: parseAsStringLiteral<RadiusValue>(RADII.map((r) => r.name)),
  template: parseAsStringLiteral(["next", "start", "vite"] as const),
  size: parseAsInteger,
  custom: parseAsBoolean,
  search: parseAsString.withOptions({ shallow: true }),
}

export const loadDesignSystemSearchParams = createLoader(
  designSystemSearchParams
)

export const serializeDesignSystemSearchParams = createSerializer(
  designSystemSearchParams
)

export const useDesignSystemSearchParams = (options: Options = {}) =>
  useQueryStates(designSystemSearchParams, {
    shallow: true,
    history: "push",
    ...options,
  })

export type DesignSystemSearchParams = inferParserType<
  typeof designSystemSearchParams
>

export function isTranslucentMenuColor(
  menuColor?: MenuColorValue | null
): menuColor is "default-translucent" | "inverted-translucent" {
  return (
    menuColor === "default-translucent" || menuColor === "inverted-translucent"
  )
}
