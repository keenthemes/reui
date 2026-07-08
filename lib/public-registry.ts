// Free `c-*` examples pull some shared @reui primitives as registry
// dependencies. These "style-aware" primitives ship a per-style source variant,
// so the registry resolves the correct style when they are served.
const STYLE_AWARE_REGISTRY_ITEM_NAMES = new Set([
  "alert",
  "autocomplete",
  "badge",
  "data-grid-column-filter",
  "data-grid-column-header",
  "data-grid-column-visibility",
  "data-grid-pagination",
  "data-grid-scroll-area",
  "data-grid-table-dnd-rows",
  "data-grid-table-dnd",
  "data-grid-table-virtual",
  "data-grid-table",
  "data-grid",
  "date-selector",
  "filters",
  "frame",
  "icon-stack",
  "kanban",
  "number-field",
  "phone-input",
  "rating",
  "scrollspy",
  "sortable",
  "stepper",
  "timeline",
  "tree",
])

export function isStyleAwareRegistryItemName(name: string) {
  return STYLE_AWARE_REGISTRY_ITEM_NAMES.has(name)
}
