import type {
  BaseColorName,
  BaseName,
  ChartColorName,
  FontHeadingValue,
  FontValue,
  IconLibraryName,
  MenuAccentValue,
  MenuColorValue,
  RadiusValue,
  StyleName,
  ThemeName,
} from "@/registry/config"

export type ComponentGridMode = 1 | 2
/** @deprecated Use ComponentGridMode. */
export type PatternGridMode = ComponentGridMode
export type BlockGridMode = 1 | 2
export type IconStyleName = "outline" | "solid" | "duotone" | "filled"
export type IconTypeName = "default" | "animated"

export type Config = {
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
  installationType: "cli" | "manual"
  gridColumns: ComponentGridMode
  iconStyle: IconStyleName
  iconType: IconTypeName
  iconColor: string
  base: BaseName
  style: StyleName
  theme: ThemeName
  baseColor: BaseColorName
  chartColor: ChartColorName
  font: FontValue
  fontHeading: FontHeadingValue
  iconLibrary: IconLibraryName
  menuAccent: MenuAccentValue
  menuColor: MenuColorValue
  radius: RadiusValue
  item: string
  template: "next" | "start" | "vite"
  size: number
  custom: boolean
  customizerOpen: boolean
}

export interface ComponentsLayoutState {
  sidebarOpen: boolean
  activeCategory?: string
  sidebarMenuView?: "menu" | "inline"
}

export interface BlocksState {
  sidebarOpen: boolean
  activeGroup?: string
  activeCategory?: string
}

export const CONFIG_STORAGE_KEY = "config"
export const COMPONENTS_STATE_STORAGE_KEY = "components-layout"
/** @deprecated Use COMPONENTS_STATE_STORAGE_KEY; kept for one-time migration from older clients */
export const PATTERNS_STATE_STORAGE_KEY = "patterns-state"
export const BLOCKS_STATE_STORAGE_KEY = "blocks-state"

export const CONFIG_COOKIE_NAME = "reui-config"
export const COMPONENTS_STATE_COOKIE_NAME = "reui-components-state"
/** @deprecated Prefer COMPONENTS_STATE_COOKIE_NAME */
export const PATTERNS_STATE_COOKIE_NAME = "reui-patterns-state"
export const BLOCKS_STATE_COOKIE_NAME = "reui-blocks-state"
export const PREFERENCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const DEFAULT_CONFIG: Config = {
  packageManager: "pnpm",
  installationType: "cli",
  gridColumns: 2,
  iconStyle: "filled",
  iconType: "default",
  iconColor: "",
  // Customizer open state is no longer persisted — see components-provider
  // where local React state defaults to closed. The field stays here for
  // backwards-compat parsing of older configs from localStorage. Default to
  // false to be explicit.
  customizerOpen: false,
  base: "base",
  style: "nova",
  theme: "neutral",
  baseColor: "neutral",
  chartColor: "neutral",
  font: "inter",
  fontHeading: "inherit",
  iconLibrary: "lucide",
  menuAccent: "subtle",
  menuColor: "default",
  radius: "default",
  item: "preview",
  template: "next",
  size: 100,
  custom: false,
}

export const DEFAULT_COMPONENTS_STATE: ComponentsLayoutState = {
  sidebarOpen: true,
  sidebarMenuView: "menu",
}

export const DEFAULT_BLOCKS_STATE: BlocksState = {
  sidebarOpen: true,
}

export function getPreferenceCookieName(storageKey: string) {
  switch (storageKey) {
    case CONFIG_STORAGE_KEY:
      return CONFIG_COOKIE_NAME
    case COMPONENTS_STATE_STORAGE_KEY:
      return COMPONENTS_STATE_COOKIE_NAME
    case PATTERNS_STATE_STORAGE_KEY:
      return PATTERNS_STATE_COOKIE_NAME
    case BLOCKS_STATE_STORAGE_KEY:
      return BLOCKS_STATE_COOKIE_NAME
    default:
      return `reui-${storageKey}`
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function parsePreferenceCookie<T extends Record<string, unknown>>(
  cookieValue: string | undefined,
  fallback: T
): T {
  if (!cookieValue) {
    return fallback
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue)) as unknown

    if (!isRecord(parsed)) {
      return fallback
    }

    return {
      ...fallback,
      ...parsed,
    }
  } catch {
    return fallback
  }
}
