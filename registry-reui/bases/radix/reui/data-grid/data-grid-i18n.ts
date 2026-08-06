// Title: Data Grid I18n
// Description: Default UI text and accessibility labels for the data grid, fully overridable per key.

interface DataGridI18nConfig {
  labels: {
    sortAscending: string
    sortDescending: string
    pinColumnStart: string
    pinColumnEnd: string
    moveColumnStart: string
    moveColumnEnd: string
    columns: string
    unpinColumn: (title: string) => string
    selectedCount: (count: number) => string
    noResultsFound: string
    clearFilters: string
    toggleColumns: string
    noData: string
    loading: string
    allRowsLoaded: string
    rowsPerPage: string
    paginationInfo: (args: {
      from: number
      to: number
      count: number
    }) => string
    previousPage: string
    nextPage: string
    paginationEllipsis: string
    pinRow: string
    unpinRow: string
    selectRow: string
    selectAllRows: string
    dragToReorderColumn: string
    dragToReorderRow: string
    reorderUnavailable: string
    expandRow: string
    collapseRow: string
  }
}

const DEFAULT_LABELS: DataGridI18nConfig["labels"] = {
  sortAscending: "Asc",
  sortDescending: "Desc",
  pinColumnStart: "Pin to left",
  pinColumnEnd: "Pin to right",
  moveColumnStart: "Move to Left",
  moveColumnEnd: "Move to Right",
  columns: "Columns",
  unpinColumn: (title) => `Unpin ${title} column`,
  selectedCount: (count) => `${count} selected`,
  noResultsFound: "No results found.",
  clearFilters: "Clear filters",
  toggleColumns: "Toggle Columns",
  noData: "No data available",
  loading: "Loading...",
  allRowsLoaded: "All records loaded",
  rowsPerPage: "Rows per page",
  paginationInfo: ({ from, to, count }) => `${from} - ${to} of ${count}`,
  previousPage: "Go to previous page",
  nextPage: "Go to next page",
  paginationEllipsis: "...",
  pinRow: "Pin row",
  unpinRow: "Unpin row",
  selectRow: "Select row",
  selectAllRows: "Select all",
  dragToReorderColumn: "Drag to reorder",
  dragToReorderRow: "Drag to reorder row",
  reorderUnavailable: "Reordering unavailable",
  expandRow: "Expand row",
  collapseRow: "Collapse row",
}

const DEFAULT_DATA_GRID_I18N: DataGridI18nConfig = {
  labels: DEFAULT_LABELS,
}

/** Partial override shape: replace individual labels, never the section. */
interface DataGridI18nOverrides {
  labels?: Partial<DataGridI18nConfig["labels"]>
}

function mergeDataGridI18n(
  overrides?: DataGridI18nOverrides
): DataGridI18nConfig {
  if (!overrides) return DEFAULT_DATA_GRID_I18N

  return {
    labels: {
      ...DEFAULT_LABELS,
      ...overrides.labels,
    },
  }
}

export { DEFAULT_DATA_GRID_I18N, mergeDataGridI18n }
export type { DataGridI18nConfig, DataGridI18nOverrides }
