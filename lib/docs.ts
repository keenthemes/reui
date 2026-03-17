import { DOCS_MENU_UPDATES } from "@/config/update"

export const PAGES_NEW = Object.keys(DOCS_MENU_UPDATES)

function getDocsComponentKey(value: string) {
  const [path = ""] = value.split(/[?#]/)
  const normalized = path.replace(/^\/+|\/+$/g, "")

  if (!normalized) {
    return ""
  }

  const segments = normalized.split("/")

  if (segments[0] === "docs") {
    segments.shift()
  }

  if (segments[0] === "base" || segments[0] === "radix") {
    segments.shift()
  }

  return segments.at(-1) ?? ""
}

const docsMenuUpdates = new Map(
  Object.entries(DOCS_MENU_UPDATES).map(([componentName, hint]) => [
    getDocsComponentKey(componentName),
    hint,
  ])
)

export function isDocsPageUpdated(path: string) {
  return docsMenuUpdates.has(getDocsComponentKey(path))
}

export function getDocsPageUpdateHint(path: string) {
  return docsMenuUpdates.get(getDocsComponentKey(path))
}
