/**
 * Every built-in user-facing string in the data grid, overridable in one
 * place: `<DataGrid i18n={{ labels: { ... } }}>`. The shape follows the
 * event-calendar and gantt convention - a nested config merged per section,
 * with functions for anything interpolated so pluralization and word order
 * live in the label, never in string concatenation at a call site.
 *
 * Precedence, most specific wins: a component-level prop that already
 * existed (`rowCreateLabel`, `loadingMessage`, the pagination label props)
 * beats the matching `i18n` label, which beats the built-in default - so
 * adopting `i18n` is never a breaking change.
 */

export interface DataGridI18nLabels {
  /* The column header menu. */
  sortAscending: string
  sortDescending: string
  pinColumnStart: string
  pinColumnEnd: string
  moveColumnStart: string
  moveColumnEnd: string
  columnsMenu: string
  unpinColumn: (title: string) => string
  toggleColumns: string
  /* Row and cell affordances. */
  rowCreate: string
  pinRow: string
  unpinRow: string
  selectRow: string
  selectAll: string
  expandRow: string
  collapseRow: string
  dragToReorder: string
  dragToReorderRow: string
  reorderingUnavailable: string
  /* Grid states. */
  loading: string
  empty: string
  allRowsLoaded: string
  /* Pagination. */
  rowsPerPage: string
  paginationInfo: (info: { from: number; to: number; count: number }) => string
  previousPage: string
  nextPage: string
  goToPage: (page: number) => string
  paginationEllipsis: string
  /* The faceted column filter. */
  filterSelectedCount: (count: number) => string
  filterNoResults: string
  filterClear: string
}

export interface DataGridI18nConfig {
  labels: DataGridI18nLabels
}

export type DataGridI18nOverrides = {
  labels?: Partial<DataGridI18nLabels>
}

const DEFAULT_DATA_GRID_LABELS: DataGridI18nLabels = {
  sortAscending: "Asc",
  sortDescending: "Desc",
  pinColumnStart: "Pin to left",
  pinColumnEnd: "Pin to right",
  moveColumnStart: "Move to left",
  moveColumnEnd: "Move to right",
  columnsMenu: "Columns",
  unpinColumn: (title) => `Unpin ${title} column`,
  toggleColumns: "Toggle Columns",
  rowCreate: "Add row",
  pinRow: "Pin row",
  unpinRow: "Unpin row",
  selectRow: "Select row",
  selectAll: "Select all",
  expandRow: "Expand row",
  collapseRow: "Collapse row",
  dragToReorder: "Drag to reorder",
  dragToReorderRow: "Drag to reorder row",
  reorderingUnavailable: "Reordering unavailable",
  loading: "Loading...",
  empty: "No data available",
  allRowsLoaded: "All records loaded",
  rowsPerPage: "Rows per page",
  paginationInfo: ({ from, to, count }) => `${from} - ${to} of ${count}`,
  previousPage: "Go to previous page",
  nextPage: "Go to next page",
  goToPage: (page) => `Go to page ${page}`,
  paginationEllipsis: "...",
  filterSelectedCount: (count) => `${count} selected`,
  filterNoResults: "No results found.",
  filterClear: "Clear filters",
}

const DEFAULT_DATA_GRID_I18N: DataGridI18nConfig = Object.freeze({
  labels: Object.freeze(DEFAULT_DATA_GRID_LABELS),
})

/**
 * A shallow merge per section, deliberately: a deep merge would leak a
 * default back into a function-valued label the consumer replaced. With no
 * overrides the frozen default is returned as-is, so the merge is free to
 * run on every render without producing a new identity.
 */
export function mergeDataGridI18n(
  overrides?: DataGridI18nOverrides
): DataGridI18nConfig {
  if (!overrides?.labels) return DEFAULT_DATA_GRID_I18N
  return {
    labels: { ...DEFAULT_DATA_GRID_LABELS, ...overrides.labels },
  }
}
