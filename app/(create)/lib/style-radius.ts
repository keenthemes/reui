import type { RadiusValue, StyleName } from "@/registry/config"

export function getRadiusForStyleSelection(style: StyleName): RadiusValue {
  return style === "lyra" ? "none" : "default"
}

export function getRadiusForStyleTransition(
  previousStyle: StyleName | null,
  nextStyle: StyleName,
  currentRadius: RadiusValue
): RadiusValue | null {
  if (nextStyle === "lyra" && currentRadius !== "none") {
    return "none"
  }

  if (
    previousStyle === "lyra" &&
    nextStyle !== "lyra" &&
    currentRadius === "none"
  ) {
    return "default"
  }

  return null
}
