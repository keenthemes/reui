import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import type {
  BaseColorName,
  BaseName,
  FontValue,
  IconLibraryName,
  MenuAccentValue,
  MenuColorValue,
  RadiusValue,
  StyleName,
  ThemeName,
} from "@/registry/config"

export type PatternGridMode = 1 | 2

export type Config = {
  // App preferences (not synced with URL)
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
  installationType: "cli" | "manual"
  gridColumns: PatternGridMode

  // Design system params (synced with URL)
  base: BaseName
  style: StyleName
  theme: ThemeName
  baseColor: BaseColorName
  font: FontValue
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
  style: "vega",
  theme: "neutral",
  baseColor: "neutral",
  font: "inter",
  iconLibrary: "lucide",
  menuAccent: "subtle",
  menuColor: "default",
  radius: "default",
  item: "preview",
  template: "next",
  size: 100,
  custom: false,
}

export const configAtom = atomWithStorage<Config>("config", DEFAULT_CONFIG)

export function useConfig() {
  return useAtom(configAtom)
}

export interface PatternsState {
  sidebarOpen: boolean
  activeCategory?: string
  sidebarMenuView?: "menu" | "inline"
}

const patternsStateAtom = atomWithStorage<PatternsState>("patterns-state", {
  sidebarOpen: true,
  sidebarMenuView: "menu",
})

export function usePatternsState() {
  return useAtom(patternsStateAtom)
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
