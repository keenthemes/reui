import { PATTERNS_MENU_UPDATES } from "@/config/update"
import { normalizeSlug } from "@/lib/utils"

function getComponentCategoryKey(value: string) {
  const [path = ""] = value.split(/[?#]/)
  const normalized = path.replace(/^\/+|\/+$/g, "")

  if (!normalized) {
    return ""
  }

  const segments = normalized.split("/")
  const lastSegment = segments.at(-1) ?? normalized
  return normalizeSlug(lastSegment)
}

const componentMenuUpdates = new Map(
  Object.entries(PATTERNS_MENU_UPDATES).map(([componentName, hint]) => [
    getComponentCategoryKey(componentName),
    hint,
  ])
)

export function getComponentMenuUpdateHint(categoryOrPath: string) {
  return componentMenuUpdates.get(getComponentCategoryKey(categoryOrPath))
}
