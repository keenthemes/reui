import { encodePreset, type PresetConfig } from "shadcn/preset"

import type { Config } from "@/lib/preferences"

/**
 * Subset of the design-system config that contributes to the canonical
 * shadcn preset code. The rest of `Config` (UI state, layout prefs) is
 * intentionally excluded so the preset code only reflects visual style.
 */
type PresetCodeInput = Pick<
  Config,
  | "style"
  | "baseColor"
  | "theme"
  | "chartColor"
  | "iconLibrary"
  | "font"
  | "fontHeading"
  | "radius"
  | "menuAccent"
  | "menuColor"
>

/**
 * Returns the canonical `--preset <code>` value for a given design
 * system config. Same encoding scheme as the official shadcn create
 * site uses, so codes are interchangeable.
 */
export function getPresetCode(config: PresetCodeInput): string {
  const presetConfig: Partial<PresetConfig> = {
    style: config.style as PresetConfig["style"],
    baseColor: config.baseColor as PresetConfig["baseColor"],
    theme: config.theme as PresetConfig["theme"],
    chartColor: config.chartColor as PresetConfig["chartColor"],
    iconLibrary: config.iconLibrary as PresetConfig["iconLibrary"],
    font: config.font as PresetConfig["font"],
    fontHeading: config.fontHeading as PresetConfig["fontHeading"],
    radius: config.radius as PresetConfig["radius"],
    menuAccent: config.menuAccent as PresetConfig["menuAccent"],
    menuColor: config.menuColor as PresetConfig["menuColor"],
  }

  return encodePreset(presetConfig)
}
