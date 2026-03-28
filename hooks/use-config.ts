import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

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

export type CatalogGridMode = 1 | 2

export type Config = {
  // App preferences (not synced with URL)
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
  installationType: "cli" | "manual"
  gridColumns: CatalogGridMode

  // Design system params (synced with URL)
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

export const DEFAULT_CONFIG: Config = {
  // App preferences
  packageManager: "pnpm",
  installationType: "cli",
  gridColumns: 2,
  customizerOpen: true,

  // Design system defaults (matching DEFAULT_CONFIG from registry/config.ts)
  base: "base",
  style: "nova",
  theme: "neutral",
  baseColor: "neutral",
  chartColor: "sky",
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

export const configAtom = atomWithStorage<Config>(
  "config",
  DEFAULT_CONFIG,
  undefined,
  { getOnInit: true }
)

export function useConfig() {
  return useAtom(configAtom)
}

export interface ComponentsLayoutState {
  sidebarOpen: boolean
  activeCategory?: string
  sidebarMenuView?: "menu" | "inline"
}

const componentsLayoutStateAtom = atomWithStorage<ComponentsLayoutState>(
  "components-layout",
  {
    sidebarOpen: true,
    sidebarMenuView: "menu",
  }
)

export function useComponentsLayoutState() {
  return useAtom(componentsLayoutStateAtom)
}

// Blocks states configuration
export interface BlocksState {
  sidebarOpen: boolean
  activeCategory?: string
}

const blocksStateAtom = atomWithStorage<BlocksState>("blocks-state", {
  sidebarOpen: true,
})

export function useBlocksState() {
  return useAtom(blocksStateAtom)
}
