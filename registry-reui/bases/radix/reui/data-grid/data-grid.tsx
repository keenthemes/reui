"use client"

import { createContext, useContext, useEffect, useMemo, useRef } from "react"
import type { ReactNode } from "react"
import {
  DEFAULT_DATA_GRID_I18N,
  mergeDataGridI18n,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-i18n"
import type {
  DataGridI18nConfig,
  DataGridI18nOverrides,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-i18n"
import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  metaHelper,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table"
import type {
  Column,
  ColumnFiltersState,
  ReactTable,
  RowData,
  SortingState,
  Table,
  TableFeatures,
} from "@tanstack/react-table"

import { cn } from "@/registry/bases/radix/lib/utils"

/**
 * Per-column extras the grid reads off `columnDef.meta`.
 *
 * TanStack v9 resolves this through the `columnMeta` slot on the feature
 * bundle below instead of a global `declare module` augmentation, so
 * installing the data grid no longer widens `ColumnMeta` for every other
 * table in the consuming app.
 */
export interface DataGridColumnMeta<TData> {
  headerTitle?: string
  headerClassName?: string
  cellClassName?: string
  skeleton?: ReactNode
  expandedContent?: (row: TData) => ReactNode
  autoSize?: boolean
}

/**
 * The batteries-included feature bundle every ReUI data-grid example builds
 * on. v9 requires each table to declare its features up front, and the grid's
 * render path needs the ones registered here: `columnVisibilityFeature` alone
 * gates `row.getVisibleCells()`, so even a grid that never hides a column
 * needs it to render at all.
 *
 * Pass it straight through for the full grid:
 *
 * ```tsx
 * const table = useTable({ features: dataGridFeatures, columns, data })
 * ```
 *
 * Extend it when a grid needs more, keeping each prerequisite feature ahead of
 * the slot that depends on it:
 *
 * ```tsx
 * const features = tableFeatures({
 *   ...dataGridFeatures,
 *   columnGroupingFeature,
 *   groupedRowModel: createGroupedRowModel(),
 * })
 * ```
 *
 * Or drop it entirely and hand `<DataGrid>` a leaner table - the components
 * accept any bundle, so you keep full ownership of the TanStack core.
 */
export const dataGridFeatures = tableFeatures({
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  // columnResizingFeature requires columnSizingFeature, declared above.
  columnResizingFeature,
  columnFilteringFeature,
  // Powers DataGridColumnFilter's column.getFacetedUniqueValues(). On v8 an
  // unregistered facet silently returned an empty map; on v9 the method would
  // not exist at all, so the faceted row models below are required, not
  // optional.
  columnFacetingFeature,
  // globalFilteringFeature requires columnFilteringFeature, declared above.
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  rowPinningFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  // Only the built-ins the registry names by string. v9 resolves string
  // sortFn names against this map alone, and registering them one by one
  // keeps every other built-in out of the bundle.
  sortFns: { basic: sortFn_basic, text: sortFn_text },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnMeta: metaHelper<DataGridColumnMeta<any>>(),
})

/** The feature set `dataGridFeatures` registers. */
export type DataGridFeatures = typeof dataGridFeatures

/**
 * The grid's internal view of the table.
 *
 * `TFeatures` is invariant in v9 and an unresolved generic one collapses to a
 * union that includes the bare core arm, so no generic signature can call
 * `getVisibleCells()`, `getStartVisibleLeafColumns()` and friends. The public
 * components stay generic so consumers can pass any bundle they like; the
 * table is widened to this concrete type exactly once, on the way into
 * context, and every internal component reads it from there.
 */
export type DataGridTableInstance<TData extends object> = ReactTable<
  DataGridFeatures,
  TData
>

/** Label for headers / column visibility: `meta.headerTitle`, string `columnDef.header`, or `column.id`. */
export function getColumnHeaderLabel<TData extends RowData, TValue>(
  column: Column<DataGridFeatures, TData, TValue>
): string {
  const meta = column.columnDef.meta as { headerTitle?: string } | undefined
  if (typeof meta?.headerTitle === "string") return meta.headerTitle
  const defHeader = column.columnDef.header
  if (typeof defHeader === "string") return defHeader
  return String(column.id)
}

export type DataGridApiFetchParams = {
  pageIndex: number
  pageSize: number
  sorting?: SortingState
  filters?: ColumnFiltersState
  searchQuery?: string
}

export type DataGridApiResponse<T> = {
  data: T[]
  empty: boolean
  pagination: {
    total: number
    page: number
  }
}

/**
 * Everything `<DataGrid>` accepts except the two props the provider consumes
 * itself. Kept feature-agnostic: layout and messaging never depend on which
 * TanStack features the consumer registered.
 */
export type DataGridLayoutProps<TData extends object> = Omit<
  DataGridProps<TableFeatures, TData>,
  "table" | "children" | "i18n"
>

export interface DataGridContextProps<TData extends object> {
  props: DataGridLayoutProps<TData>
  table: DataGridTableInstance<TData>
  recordCount: number
  isLoading: boolean
  i18n: DataGridI18nConfig
  /**
   * Internal coordinator for `meta.autoSize` columns. Lives at the core level
   * so every table variant and viewport instance shares one application state.
   */
  autoSize?: DataGridAutoSizeController
}

export type DataGridAutoSizeController = {
  /**
   * Grows the first visible `meta.autoSize` column by the given free space.
   * Applies at most once per column id; safe to call from every viewport
   * measurement. Returns true when a sizing update was dispatched.
   */
  apply: (fillWidth: number) => boolean
}

function createDataGridAutoSizeController<TData extends object>(
  /**
   * A getter, not the table itself.
   *
   * v8 handed back one stable table whose state mutated in place, so a
   * controller could close over it. v9 returns a NEW table wrapper on every
   * state change, and a captured one keeps reporting the state it was built
   * with - here that meant `columnSizing` looked permanently empty, the
   * applied-once guard re-armed on every measurement, and the fill overwrote
   * whatever width the user had just dragged the column to.
   */
  getTable: () => DataGridTableInstance<TData>
): DataGridAutoSizeController {
  let applied: { columnId: string; base: number; grown: number } | null = null

  return {
    apply(fillWidth: number) {
      const table = getTable()
      const columnSizing = table.state.columnSizing

      // Re-arm after reset flows (double-click resetSize, resetColumnSizing,
      // controlled state replacement) so the column re-fills instead of
      // leaving a dead blank strip.
      if (applied && columnSizing[applied.columnId] === undefined) {
        applied = null
      }

      if (fillWidth <= 0) return false

      const autoSizeColumn = table
        .getVisibleLeafColumns()
        .find(
          (column) => column.columnDef.meta?.autoSize && column.getCanResize()
        )

      if (!autoSizeColumn || applied?.columnId === autoSizeColumn.id) {
        return false
      }

      // A width this coordinator did not write belongs to someone else -
      // almost always the user, who just dragged the column's resize handle.
      // Filling over it is what made a `meta.autoSize` column look
      // un-resizable: the drag committed, the next viewport measurement
      // stamped the fill back on top, and the column snapped to its old width.
      //
      // Deliberately keyed on observed state rather than on `applied`, which
      // is per-coordinator memory: anything that rebuilds the coordinator
      // (a remount, a new table store) forgets what it did, and the guard has
      // to survive that. An explicit reset clears the entry and re-arms the
      // fill, which is what makes double-click-to-reset still work.
      const currentSize = columnSizing[autoSizeColumn.id]
      if (currentSize !== undefined && currentSize !== applied?.grown) {
        return false
      }

      // Candidate switched (e.g. the grown column was hidden and another
      // meta.autoSize column took over): revert the previous growth if the
      // user hasn't manually resized that column since, so visibility
      // toggles cannot ratchet the table wider than its container forever.
      const revert =
        applied && columnSizing[applied.columnId] === applied.grown
          ? applied
          : null
      const base = columnSizing[autoSizeColumn.id] ?? autoSizeColumn.getSize()
      const grown = base + fillWidth

      applied = { columnId: autoSizeColumn.id, base, grown }
      table.setColumnSizing((old) => {
        const next = { ...old, [autoSizeColumn.id]: grown }
        if (revert && next[revert.columnId] === revert.grown) {
          next[revert.columnId] = revert.base
        }
        return next
      })

      return true
    },
  }
}

export type DataGridRequestParams = {
  pageIndex: number
  pageSize: number
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
}

export interface DataGridProps<
  TFeatures extends TableFeatures,
  TData extends object,
> {
  className?: string
  table?: Table<TFeatures, TData>
  recordCount: number
  children?: ReactNode
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  loadingMode?: "skeleton" | "spinner"
  loadingMessage?: ReactNode | string
  fetchingMoreMessage?: ReactNode | string
  allRowsLoadedMessage?: ReactNode | string
  emptyMessage?: ReactNode | string
  i18n?: DataGridI18nOverrides
  tableLayout?: {
    dense?: boolean
    cellBorder?: boolean
    rowBorder?: boolean
    rowRounded?: boolean
    stripped?: boolean
    headerBackground?: boolean
    footerBackground?: boolean
    headerBorder?: boolean
    headerSticky?: boolean
    width?: "auto" | "fixed"
    columnsVisibility?: boolean
    columnsResizable?: boolean
    columnsResizeMode?: "onChange" | "onEnd"
    columnsPinnable?: boolean
    columnsMovable?: boolean
    columnsDraggable?: boolean
    rowsDraggable?: boolean
    rowsPinnable?: boolean
  }
  tableClassNames?: {
    base?: string
    header?: string
    headerRow?: string
    headerSticky?: string
    body?: string
    bodyRow?: string
    footer?: string
    edgeCell?: string
  }
}

const DataGridContext = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataGridContextProps<any> | undefined
>(undefined)

/**
 * Reads the grid context. Pass `TData` from the calling component when the
 * table, a row or a cell is handed on to something typed against that row
 * shape: v9 declares `TData` invariant, so the default `any` no longer
 * unifies with a concrete row type the way it did on v8.
 */
function useDataGrid<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData extends object = any,
>(): DataGridContextProps<TData> {
  const context = useContext(DataGridContext) as
    | DataGridContextProps<TData>
    | undefined
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGridProvider")
  }
  return context
}

/** Resolved DataGrid messages, with an English fallback for standalone helpers. */
function useDataGridI18n(): DataGridI18nConfig {
  return useContext(DataGridContext)?.i18n ?? DEFAULT_DATA_GRID_I18N
}

function DataGridProvider<TData extends object>({
  children,
  i18n: i18nOverrides,
  table,
  ...props
}: DataGridLayoutProps<TData> & {
  table: DataGridTableInstance<TData>
  children?: ReactNode
  i18n?: DataGridI18nOverrides
}) {
  const i18n = useMemo(() => mergeDataGridI18n(i18nOverrides), [i18nOverrides])

  // Latest-props ref: context reads always resolve fresh props through the
  // getter below without the memoized context value depending on unstable
  // ReactNode/function prop identities (inline emptyMessage/onRowClick would
  // otherwise publish a new context value on every consumer render - at
  // mousemove rate during a resize drag, piercing the body-rows memo).
  const propsRef = useRef(props)
  propsRef.current = props

  // Same treatment for the table itself, which v9 - unlike v8 - re-creates on
  // every state change. Depending on it directly would republish the context
  // on each resize tick, which is exactly what the memo below exists to
  // prevent; the getter still hands every consumer the current instance.
  const tableRef = useRef(table)
  tableRef.current = table

  // Re-assert an explicit tableLayout resize mode so consumer-level useTable
  // options cannot flip it back between drags. v9 makes `table.options`
  // readonly, so this goes through setOptions in an effect rather than a
  // render-phase mutation. Without an explicit mode, the consumer's own
  // tanstack columnResizeMode (default "onEnd") is honored.
  const resizeMode =
    props.tableLayout?.columnsResizable && props.tableLayout.columnsResizeMode
      ? props.tableLayout.columnsResizeMode
      : undefined

  useEffect(() => {
    if (!resizeMode) return
    if (table.options.columnResizeMode === resizeMode) return
    table.setOptions((old) => ({ ...old, columnResizeMode: resizeMode }))
  }, [table, resizeMode])

  // One autoSize coordinator per table instance so split header/body viewports
  // cannot apply the growth twice. Keyed on `table.store`, which v9 keeps
  // stable for the life of the table, rather than on `table` itself: the
  // wrapper is re-created on every state change, and re-creating the
  // controller with it would reset its applied-once bookkeeping mid-drag.
  const autoSize = useMemo(
    () => createDataGridAutoSizeController(() => tableRef.current),
    [table.store]
  )

  const tableState = table.state

  // Memoize context value so consumers don't re-render during column resize.
  // Column sizing state is intentionally excluded from deps -- CSS variables
  // on the <table> element handle width updates without React re-renders.
  // ReactNode/function props (messages, onRowClick) are also excluded: they
  // are served fresh through the props getter, so unstable inline identities
  // cannot invalidate the context value.
  const value = useMemo(
    () => ({
      get props() {
        return propsRef.current
      },
      get table() {
        return tableRef.current
      },
      recordCount: props.recordCount,
      isLoading: props.isLoading || false,
      i18n,
      autoSize,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      autoSize,
      i18n,
      props.recordCount,
      props.isLoading,
      props.loadingMode,
      props.className,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(props.tableLayout),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(props.tableClassNames),
      tableState.sorting,
      tableState.pagination,
      tableState.columnFilters,
      tableState.rowSelection,
      tableState.rowPinning,
      tableState.expanded,
      tableState.columnVisibility,
      tableState.columnOrder,
      tableState.columnPinning,
      tableState.globalFilter,
    ]
  )

  return (
    // One React context serves every TData, but v9 declares both TFeatures and
    // TData invariant, so a `DataGridContextProps<any>` context cannot accept a
    // `DataGridContextProps<TData>` value structurally. The erasure happens
    // here and is undone by the TData generic on each consumer component.
    <DataGridContext.Provider
      value={value as unknown as DataGridContextProps<TData>}
    >
      {children}
    </DataGridContext.Provider>
  )
}

function DataGrid<TFeatures extends TableFeatures, TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TFeatures, TData>) {
  const defaultProps: Partial<DataGridProps<TFeatures, TData>> = {
    loadingMode: "skeleton",
    tableLayout: {
      dense: false,
      cellBorder: false,
      rowBorder: true,
      rowRounded: false,
      stripped: false,
      headerSticky: false,
      headerBackground: false,
      footerBackground: false,
      headerBorder: true,
      width: "fixed",
      columnsVisibility: false,
      columnsResizable: false,
      // columnsResizeMode has no default on purpose: when unset, the
      // consumer's tanstack columnResizeMode (default "onEnd") is honored.
      columnsPinnable: false,
      columnsMovable: false,
      columnsDraggable: false,
      rowsDraggable: false,
      rowsPinnable: false,
    },
    tableClassNames: {
      base: "",
      header: "",
      headerRow: "",
      // z-40 keeps the sticky header above pinned body cells (zIndex 30 in
      // getPinningStyles), which would otherwise paint over it while
      // scrolling vertically with columnsPinnable enabled.
      headerSticky: "sticky top-0 z-40 bg-background/90 backdrop-blur-xs",
      body: "",
      bodyRow: "",
      footer: "",
      edgeCell: "",
    },
  }

  const mergedProps: DataGridProps<TFeatures, TData> = {
    ...defaultProps,
    ...props,
    tableLayout: {
      ...defaultProps.tableLayout,
      ...(props.tableLayout || {}),
    },
    tableClassNames: {
      ...defaultProps.tableClassNames,
      ...(props.tableClassNames || {}),
    },
  }

  // Ensure table is provided
  if (!table) {
    throw new Error('DataGrid requires a "table" prop')
  }

  // The single widening point. Consumers own the TanStack core and may hand
  // over any feature bundle; internals need a concrete one to resolve the
  // feature-gated APIs they call, and v9's invariant TFeatures rules out
  // expressing that with a generic constraint.
  const internalTable = table as unknown as DataGridTableInstance<TData>
  const internalProps = mergedProps as unknown as DataGridLayoutProps<TData> & {
    i18n?: DataGridI18nOverrides
  }

  return (
    <DataGridProvider table={internalTable} {...internalProps}>
      {children}
    </DataGridProvider>
  )
}

function DataGridContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
  /** Accepted for backwards compatibility; currently has no effect. */
  border?: boolean
}) {
  return (
    <div
      data-slot="data-grid"
      className={cn("w-full overflow-hidden", className)}
    >
      {children}
    </div>
  )
}

export {
  useDataGrid,
  useDataGridI18n,
  DataGridProvider,
  DataGrid,
  DataGridContainer,
}
