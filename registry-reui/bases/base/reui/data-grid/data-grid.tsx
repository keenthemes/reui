"use client"

import { createContext, ReactNode, useContext, useMemo } from "react"
import {
  Column,
  ColumnFiltersState,
  RowData,
  SortingState,
  Table,
} from "@tanstack/react-table"

import { cn } from "@/registry/bases/base/lib/utils"

export type DataGridEditorKind =
  | "text"
  | "email"
  | "textarea"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "switch"
  | "rating"

export interface DataGridEditorOption<TValue = unknown> {
  label: string
  value: TValue
  description?: string
  disabled?: boolean
}

export interface DataGridColumnEditorRenderProps<
  TData extends RowData = RowData,
  TValue = unknown,
> {
  table: Table<TData>
  row: TData
  rowId: string
  columnId: string
  value: TValue
  setValue: (value: TValue) => void
  commit: (value?: TValue) => Promise<boolean>
  cancel: () => void
  isEditing: boolean
  isPending: boolean
  error?: string | null
  editor: DataGridColumnEditor<TData, TValue>
}

export interface DataGridColumnEditor<
  TData extends RowData = RowData,
  TValue = unknown,
> {
  kind: DataGridEditorKind
  label?: string
  placeholder?: string
  description?: string
  options?: DataGridEditorOption<TValue>[]
  required?: boolean
  min?: number
  max?: number
  step?: number
  dialogOnly?: boolean
  inlineOnly?: boolean
  parse?: (value: unknown, row: TData) => TValue
  validate?: (value: TValue, row: TData) => string | null | undefined
  renderInline?: (
    props: DataGridColumnEditorRenderProps<TData, TValue>
  ) => ReactNode
  renderDialog?: (
    props: DataGridColumnEditorRenderProps<TData, TValue>
  ) => ReactNode
}

export interface DataGridEditingTableMeta<TData extends RowData = RowData> {
  activeCell: { rowId: string; columnId: string } | null
  dialogOpen: boolean
  dialogRow: TData | null
  dialogRowId: string | null
  dialogDraft: Partial<TData> | null
  dialogErrors: Record<string, string | undefined>
  dialogMessage: string | null
  startCellEdit: (row: TData, columnId: string) => void
  cancelCellEdit: (rowId?: string, columnId?: string) => void
  updateCellDraft: (rowId: string, columnId: string, value: unknown) => void
  commitCellEdit: (
    row: TData,
    columnId: string,
    value?: unknown
  ) => Promise<boolean>
  isCellEditing: (rowId: string, columnId: string) => boolean
  isCellPending: (rowId: string, columnId: string) => boolean
  getCellDraftValue: (row: TData, columnId: string) => unknown
  getCellError: (rowId: string, columnId: string) => string | undefined
  openDialog: (row: TData) => void
  closeDialog: () => void
  updateDialogDraft: (columnId: string, value: unknown) => void
  saveDialog: () => Promise<boolean>
  getDialogValue: (columnId: string) => unknown
  getDialogError: (columnId: string) => string | undefined
  clearDialogMessage: () => void
  isRowPending: (rowId: string) => boolean
  isGridPending: () => boolean
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerTitle?: string
    headerClassName?: string
    cellClassName?: string
    skeleton?: ReactNode
    expandedContent?: (row: TData) => ReactNode
    editor?: DataGridColumnEditor<TData, TValue>
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    editing?: DataGridEditingTableMeta<TData>
  }
}

/** Label for headers / column visibility: `meta.headerTitle`, string `columnDef.header`, or `column.id`. */
export function getColumnHeaderLabel<TData, TValue>(
  column: Column<TData, TValue>
): string {
  const meta = column.columnDef.meta as { headerTitle?: string } | undefined
  if (typeof meta?.headerTitle === "string") return meta.headerTitle
  const defHeader = column.columnDef.header
  if (typeof defHeader === "string") return defHeader
  return String(column.id)
}

export function getDataGridColumnEditor<TData, TValue>(
  column: Column<TData, TValue>
): DataGridColumnEditor<TData, TValue> | undefined {
  return column.columnDef.meta?.editor as
    | DataGridColumnEditor<TData, TValue>
    | undefined
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

export interface DataGridContextProps<TData extends object> {
  props: DataGridProps<TData>
  table: Table<TData>
  recordCount: number
  isLoading: boolean
}

export type DataGridRequestParams = {
  pageIndex: number
  pageSize: number
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
}

export interface DataGridProps<TData extends object> {
  className?: string
  table?: Table<TData>
  recordCount: number
  children?: ReactNode
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  loadingMode?: "skeleton" | "spinner"
  loadingMessage?: ReactNode | string
  fetchingMoreMessage?: ReactNode | string
  allRowsLoadedMessage?: ReactNode | string
  emptyMessage?: ReactNode | string
  tableLayout?: {
    dense?: boolean
    cellBorder?: boolean
    rowBorder?: boolean
    rowRounded?: boolean
    stripped?: boolean
    headerBackground?: boolean
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

function useDataGrid() {
  const context = useContext(DataGridContext)
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGridProvider")
  }
  return context
}

function DataGridProvider<TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TData> & { table: Table<TData> }) {
  const tableState = table.getState()
  const resolvedColumnsResizeMode =
    props.tableLayout?.columnsResizeMode ?? "onEnd"

  // Keep resize mode aligned with the DataGrid contract every render so
  // consumer-level useReactTable options cannot flip it back between drags.
  if (props.tableLayout?.columnsResizable) {
    table.options.columnResizeMode = resolvedColumnsResizeMode
  }

  // Memoize context value so consumers don't re-render during column resize.
  // Column sizing state is intentionally excluded from deps -- CSS variables
  // on the <table> element handle width updates without React re-renders.
  const value = useMemo(
    () => ({
      props,
      table,
      recordCount: props.recordCount,
      isLoading: props.isLoading || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      table,
      props.recordCount,
      props.isLoading,
      props.loadingMode,
      props.loadingMessage,
      props.fetchingMoreMessage,
      props.allRowsLoadedMessage,
      props.emptyMessage,
      props.onRowClick,
      props.className,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(props.tableLayout),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(props.tableClassNames),
      tableState.sorting,
      tableState.pagination,
      tableState.columnFilters,
      tableState.rowSelection,
      tableState.expanded,
      tableState.columnVisibility,
      tableState.columnOrder,
      tableState.columnPinning,
      tableState.globalFilter,
    ]
  )

  return (
    <DataGridContext.Provider value={value}>
      {children}
    </DataGridContext.Provider>
  )
}

function DataGrid<TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TData>) {
  const defaultProps: Partial<DataGridProps<TData>> = {
    loadingMode: "skeleton",
    tableLayout: {
      dense: false,
      cellBorder: false,
      rowBorder: true,
      rowRounded: false,
      stripped: false,
      headerSticky: false,
      headerBackground: true,
      headerBorder: true,
      width: "fixed",
      columnsVisibility: false,
      columnsResizable: false,
      columnsResizeMode: "onEnd",
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
      headerSticky: "sticky top-0 z-15 bg-background/90 backdrop-blur-xs",
      body: "",
      bodyRow: "",
      footer: "",
      edgeCell: "",
    },
  }

  const mergedProps: DataGridProps<TData> = {
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

  return (
    <DataGridProvider table={table} {...mergedProps}>
      {children}
    </DataGridProvider>
  )
}

function DataGridContainer({
  children,
  className,
  border = true,
}: {
  children: ReactNode
  className?: string
  border?: boolean
}) {
  return (
    <div
      data-slot="data-grid"
      className={cn(
        "w-full overflow-hidden",
        border &&
          "border-border style-vega:rounded-lg style-maia:rounded-2xl style-nova:rounded-lg style-lyra:rounded-none style-mira:rounded-lg border",
        className
      )}
    >
      {children}
    </div>
  )
}

export { useDataGrid, DataGridProvider, DataGrid, DataGridContainer }
