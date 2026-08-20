import type {
  CascaderLabels,
  CascaderMode,
} from "@/registry-reui/bases/base/reui/cascader/cascader-types"

/** Name of the root level. Hoisted so the root announcement can reuse it. */
const ROOT_LEVEL = "Top level"

/** Hoisted for the same reason: several defaults end in an item count. */
const itemCount = (count: number) =>
  `${count} ${count === 1 ? "item" : "items"}`

/**
 * English defaults. Every string the primitive can render lives here, so a
 * consumer can translate the whole surface by passing `labels`.
 */
export const CASCADER_LABELS: CascaderLabels = {
  // Deliberately NOT lowercased. `toLowerCase()` is locale-hostile - it maps
  // Turkish "İ" to a two-code-point sequence and German "İstanbul" style
  // proper nouns lose their casing - and a label is already written the way
  // its author wants it read.
  search: (parentLabel) =>
    parentLabel ? `Search ${parentLabel}...` : "Search...",
  back: "Back",
  loading: "Loading...",
  loadingMore: "Loading more...",
  loadMore: "Load more",
  error: "Could not load items.",
  retry: "Retry",
  empty: "No results found.",
  selectedCount: (count) => `${count} selected`,
  breadcrumbLabel: "Breadcrumb",
  chipsLabel: "Selected items",
  removeChip: (label) => `Remove ${label}`,
  pathSeparator: "/",
  rootLevel: ROOT_LEVEL,
  itemCount,
  branchAffordance: "submenu",
  selectedState: "selected",
  partiallySelectedState: "partially selected",
  columnsLabel: "Levels",
  actionsLabel: "Actions",
  submenuAffordance: "opens a menu",
  panelLabel: "Options",
  keyboardHint: (mode: CascaderMode, dir: "ltr" | "rtl") => {
    // "Deeper" is the direction the text runs, so the level keys mirror in
    // RTL and the hint has to name the mirrored pair there - an LTR-worded
    // hint would teach exactly the wrong keys.
    const open = dir === "rtl" ? "Left" : "Right"
    const back = dir === "rtl" ? "Right" : "Left"
    if (mode === "tree") {
      return `Use the ${open} Arrow key to expand and the ${back} Arrow key to collapse.`
    }
    if (mode === "columns") {
      return `Use the ${open} Arrow key to open the next column and the ${back} Arrow key to go back.`
    }
    return `Use the ${open} Arrow key to open a branch and the ${back} Arrow key to go back.`
  },
  rootAnnouncement: (count) => `${ROOT_LEVEL}, ${itemCount(count)}`,
  expandedAnnouncement: (label, count) =>
    `${label} expanded, ${itemCount(count)}`,
  collapsedAnnouncement: (label) => `${label} collapsed`,
  levelAnnouncement: (parentLabel, depth, count) =>
    `${parentLabel}, level ${depth}, ${itemCount(count)}`,
  resultsAnnouncement: (count) =>
    count === 1 ? "1 result" : `${count} results`,
  maxReachedAnnouncement: (max) => `Selection limit of ${max} reached`,
  cascadeAnnouncement: (label, count, selecting) =>
    `${label} ${selecting ? "selected" : "deselected"}, ${itemCount(count)} followed`,
  searchingAnnouncement: "Searching...",
}

/**
 * Shallow-merges consumer overrides over the defaults, so `labels` can carry a
 * single key without restating the rest.
 */
export function resolveCascaderLabels(
  labels?: Partial<CascaderLabels>
): CascaderLabels {
  if (!labels) return CASCADER_LABELS
  return { ...CASCADER_LABELS, ...labels }
}

/** Resolves the search placeholder, which may be a string or a function. */
export function resolveCascaderSearchLabel(
  labels: CascaderLabels,
  parentLabel?: string
): string {
  return typeof labels.search === "function"
    ? labels.search(parentLabel)
    : labels.search
}
