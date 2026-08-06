"use client"

import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type { CSSProperties, ReactNode, Ref } from "react"
import { useDataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import type {
  DataGridFeatures,
  DataGridTableInstance,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import {
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableEmpty,
  DataGridTableFillBodyCell,
  DataGridTableFillHeadCell,
  DataGridTableFoot,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  getDataGridScrollAreaViewport,
  getDataGridTableMergedHeaderGroups,
  getDataGridTableRowSections,
  getPinningStyles,
  hasDataGridTableRightPinnedColumns,
  type DataGridTablePinnedBoundary,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-table"
import { flexRender } from "@tanstack/react-table"
import type { Cell, Column, Row } from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import type {
  VirtualItem,
  Virtualizer,
  VirtualizerOptions,
} from "@tanstack/react-virtual"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Spinner } from "@/registry/bases/radix/ui/spinner"

type DataGridTableVirtualScrollElements = {
  containerElement: HTMLDivElement | null
  scrollElement: HTMLElement | null
}

type DataGridTableVirtualizerInstance = Virtualizer<
  HTMLElement,
  HTMLTableRowElement
>
type DataGridTableColumnVirtualizerInstance = Virtualizer<
  HTMLElement,
  HTMLTableCellElement
>

type DataGridTableVirtualScrollAlignment = "auto" | "center" | "start" | "end"

type DataGridTableVirtualColumnWindow = {
  endPadding: number
  endSpan: number
  items: VirtualItem[]
  startPadding: number
  startSpan: number
}

type DataGridTableVirtualScrollRequest = {
  align: DataGridTableVirtualScrollAlignment
  behavior: ScrollBehavior
  containerElement: HTMLDivElement
  headerSticky: boolean
  isVirtualizationEnabled: boolean
  rowId: string | undefined
  rowIndex: number
  scrollElement: HTMLElement
}

type DataGridTableVirtualColumnScrollRequest = {
  align: DataGridTableVirtualScrollAlignment
  behavior: ScrollBehavior
  columnId: string | undefined
  columnIndex: number
  containerElement: HTMLDivElement
  isVirtualizationEnabled: boolean
  scrollElement: HTMLElement
}

function isSameDataGridTableScrollRequest(
  previous: DataGridTableVirtualScrollRequest | null,
  next: DataGridTableVirtualScrollRequest
) {
  return (
    previous?.align === next.align &&
    previous.behavior === next.behavior &&
    previous.containerElement === next.containerElement &&
    previous.headerSticky === next.headerSticky &&
    previous.isVirtualizationEnabled === next.isVirtualizationEnabled &&
    previous.rowId === next.rowId &&
    previous.rowIndex === next.rowIndex &&
    previous.scrollElement === next.scrollElement
  )
}

function isSameDataGridTableColumnScrollRequest(
  previous: DataGridTableVirtualColumnScrollRequest | null,
  next: DataGridTableVirtualColumnScrollRequest
) {
  return (
    previous?.align === next.align &&
    previous.behavior === next.behavior &&
    previous.columnId === next.columnId &&
    previous.columnIndex === next.columnIndex &&
    previous.containerElement === next.containerElement &&
    previous.isVirtualizationEnabled === next.isVirtualizationEnabled &&
    previous.scrollElement === next.scrollElement
  )
}

function getDataGridTableScrollTarget({
  align,
  clientHeight,
  rowBottom,
  rowHeight,
  rowTop,
  scrollHeight,
  scrollTop,
  viewportTopOffset = 0,
}: {
  align: DataGridTableVirtualScrollAlignment
  clientHeight: number
  rowBottom: number
  rowHeight: number
  rowTop: number
  scrollHeight: number
  scrollTop: number
  viewportTopOffset?: number
}) {
  const visibleHeight = Math.max(0, clientHeight - viewportTopOffset)
  const viewportTop = scrollTop + viewportTopOffset
  const viewportBottom = scrollTop + clientHeight

  const targetTop =
    align === "auto"
      ? rowTop < viewportTop
        ? rowTop - viewportTopOffset
        : rowBottom > viewportBottom
          ? rowBottom - clientHeight
          : null
      : align === "start"
        ? rowTop - viewportTopOffset
        : align === "end"
          ? rowBottom - clientHeight
          : rowTop -
            viewportTopOffset -
            Math.max(0, (visibleHeight - rowHeight) / 2)

  if (targetTop === null) return null

  return Math.min(
    Math.max(0, targetTop),
    Math.max(0, scrollHeight - clientHeight)
  )
}

function getDataGridTableHeaderOffset({
  containerElement,
  headerSticky,
  scrollElement,
}: {
  containerElement: HTMLDivElement
  headerSticky: boolean
  scrollElement: HTMLElement
}) {
  if (!headerSticky) return 0

  const headerElement = containerElement.querySelector<HTMLElement>(
    ':scope > [data-slot="data-grid-table"] > thead'
  )

  if (!headerElement) return 0

  const scrollRect = scrollElement.getBoundingClientRect()
  const headerRect = headerElement.getBoundingClientRect()
  const headerBottomOffset = headerRect.bottom - scrollRect.top
  const overlapsViewportTop =
    headerRect.top <= scrollRect.top + 0.5 && headerBottomOffset > 0

  if (!overlapsViewportTop) return 0

  return Math.min(scrollElement.clientHeight, Math.max(0, headerBottomOffset))
}

function scrollDataGridTableToOffset({
  behavior,
  scrollElement,
  targetTop,
  virtualizer,
}: {
  behavior: ScrollBehavior
  scrollElement: HTMLElement
  targetTop: number
  virtualizer?: DataGridTableVirtualizerInstance
}) {
  if (virtualizer) {
    virtualizer.scrollToOffset(targetTop, { align: "start", behavior })
  } else if (typeof scrollElement.scrollTo === "function") {
    scrollElement.scrollTo({ behavior, top: targetTop })
  } else {
    scrollElement.scrollTop = targetTop
  }
}

function scrollDataGridTableRowIntoView({
  align,
  behavior,
  cancelPendingScroll = false,
  containerElement,
  headerSticky,
  rowIndex,
  scrollElement,
  virtualizer,
}: {
  align: DataGridTableVirtualScrollAlignment
  behavior: ScrollBehavior
  cancelPendingScroll?: boolean
  containerElement: HTMLDivElement | null
  headerSticky: boolean
  rowIndex: number
  scrollElement: HTMLElement | null
  virtualizer?: DataGridTableVirtualizerInstance
}) {
  if (!containerElement || !scrollElement) return false

  const rowElement = containerElement.querySelector<HTMLTableRowElement>(
    `:scope > [data-slot="data-grid-table"] > tbody > tr[data-index="${rowIndex}"]`
  )

  if (!rowElement) return false

  const scrollRect = scrollElement.getBoundingClientRect()
  const rowRect = rowElement.getBoundingClientRect()
  const viewportTopOffset = getDataGridTableHeaderOffset({
    containerElement,
    headerSticky,
    scrollElement,
  })
  const rowTop = scrollElement.scrollTop + rowRect.top - scrollRect.top
  const rowBottom = scrollElement.scrollTop + rowRect.bottom - scrollRect.top
  const targetTop = getDataGridTableScrollTarget({
    align,
    clientHeight: scrollElement.clientHeight,
    rowBottom,
    rowHeight: rowRect.height || rowElement.offsetHeight,
    rowTop,
    scrollHeight: scrollElement.scrollHeight,
    scrollTop: scrollElement.scrollTop,
    viewportTopOffset,
  })

  if (
    targetTop === null ||
    Math.abs(targetTop - scrollElement.scrollTop) < 0.5
  ) {
    if (cancelPendingScroll) {
      scrollDataGridTableToOffset({
        behavior: "auto",
        scrollElement,
        targetTop: scrollElement.scrollTop,
        virtualizer,
      })
    }

    return true
  }

  scrollDataGridTableToOffset({
    behavior,
    scrollElement,
    targetTop,
    virtualizer,
  })

  return true
}

function scrollDataGridTableColumnIntoView({
  align,
  behavior,
  columnIndex,
  containerElement,
  scrollElement,
}: {
  align: DataGridTableVirtualScrollAlignment
  behavior: ScrollBehavior
  columnIndex: number
  containerElement: HTMLDivElement | null
  scrollElement: HTMLElement | null
}) {
  if (!containerElement || !scrollElement) return false

  const columnElement = Array.from(
    containerElement.querySelectorAll<HTMLTableCellElement>(
      ':scope > [data-slot="data-grid-table"] [data-column-index]'
    )
  ).find((element) => Number(element.dataset.columnIndex) === columnIndex)

  if (!columnElement) return false

  const scrollRect = scrollElement.getBoundingClientRect()
  const columnRect = columnElement.getBoundingClientRect()
  const pinnedElements =
    containerElement.querySelectorAll<HTMLTableCellElement>(
      ':scope > [data-slot="data-grid-table"] [data-pinned]'
    )
  const isRtl = getComputedStyle(scrollElement).direction === "rtl"
  let viewportLeft = scrollRect.left
  let viewportRight = scrollRect.right

  pinnedElements.forEach((element) => {
    const rect = element.getBoundingClientRect()
    const isPinnedOnLeft =
      (element.dataset.pinned === "start" && !isRtl) ||
      (element.dataset.pinned === "end" && isRtl)
    const isPinnedOnRight =
      (element.dataset.pinned === "end" && !isRtl) ||
      (element.dataset.pinned === "start" && isRtl)

    if (isPinnedOnLeft) {
      viewportLeft = Math.max(viewportLeft, rect.right)
    } else if (isPinnedOnRight) {
      viewportRight = Math.min(viewportRight, rect.left)
    }
  })

  viewportLeft = Math.min(viewportLeft, scrollRect.right)
  viewportRight = Math.max(viewportRight, viewportLeft)

  const visibleWidth = Math.max(0, viewportRight - viewportLeft)
  const alignToStart = () =>
    isRtl ? columnRect.right - viewportRight : columnRect.left - viewportLeft
  const alignToEnd = () =>
    isRtl ? columnRect.left - viewportLeft : columnRect.right - viewportRight
  const delta =
    align === "start"
      ? alignToStart()
      : align === "end"
        ? alignToEnd()
        : align === "center"
          ? (columnRect.left +
              columnRect.right -
              viewportLeft -
              viewportRight) /
            2
          : columnRect.width > visibleWidth
            ? alignToStart()
            : columnRect.left < viewportLeft
              ? columnRect.left - viewportLeft
              : columnRect.right > viewportRight
                ? columnRect.right - viewportRight
                : 0

  if (Math.abs(delta) < 0.5) return true

  if (typeof scrollElement.scrollBy === "function") {
    scrollElement.scrollBy({ behavior, left: delta })
  } else if (typeof scrollElement.scrollTo === "function") {
    scrollElement.scrollTo({
      behavior,
      left: scrollElement.scrollLeft + delta,
    })
  } else {
    scrollElement.scrollLeft += delta
  }

  return true
}

type DataGridTableVirtualizerOptions<TData extends object> = Omit<
  VirtualizerOptions<HTMLElement, HTMLTableRowElement>,
  "count" | "estimateSize" | "getItemKey" | "getScrollElement"
> & {
  estimateSize?: (index: number, row: Row<DataGridFeatures, TData>) => number
  getItemKey?: (
    index: number,
    row: Row<DataGridFeatures, TData>
  ) => string | number
  getScrollElement?: (
    elements: DataGridTableVirtualScrollElements
  ) => HTMLElement | null
}

type DataGridTableColumnVirtualizerOptions = Partial<
  Omit<
    VirtualizerOptions<HTMLElement, HTMLTableCellElement>,
    | "count"
    | "estimateSize"
    | "gap"
    | "getItemKey"
    | "getScrollElement"
    | "horizontal"
    | "lanes"
    | "measureElement"
    | "rangeExtractor"
  >
>

interface DataGridTableVirtualProps<TData extends object> {
  height?: number | string
  estimateSize?: number
  overscan?: number
  /** Optional horizontal virtualizer settings. Omit to render every column. */
  columnVirtualizerOptions?: DataGridTableColumnVirtualizerOptions
  /** Scroll animation used when revealing a controlled target row or column. */
  scrollBehavior?: ScrollBehavior
  /** Alignment used when revealing a controlled center column. Defaults to auto. */
  scrollToColumnAlign?: DataGridTableVirtualScrollAlignment
  /** Index within the center (non-pinned) visible leaf columns to reveal. */
  scrollToColumnIndex?: number
  /** Alignment used when revealing a controlled target row. Defaults to auto. */
  scrollToRowAlign?: DataGridTableVirtualScrollAlignment
  /** Index within the center (non-pinned) row section to reveal. */
  scrollToRowIndex?: number
  footerContent?: ReactNode
  renderHeader?: boolean
  onFetchMore?: () => void
  isFetchingMore?: boolean
  hasMore?: boolean
  fetchMoreOffset?: number
  virtualizerOptions?: DataGridTableVirtualizerOptions<TData>
}

interface VirtualBodyProps<TData extends object> {
  table: DataGridTableInstance<TData>
  topRows: Row<DataGridFeatures, TData>[]
  centerRows: Row<DataGridFeatures, TData>[]
  bottomRows: Row<DataGridFeatures, TData>[]
  columnWindow: DataGridTableVirtualColumnWindow | null
  virtualItems: VirtualItem[]
  totalSize: number
  isVirtualizationEnabled: boolean
  isInfiniteMode: boolean
  isFetchingMore: boolean
  hasMore?: boolean
  loadingMoreMessage: ReactNode
  allRowsLoadedMessage: ReactNode
  measureRowRef?: (element: HTMLTableRowElement | null) => void
}

function DataGridTableVirtualPinnedPlaceholderCell<TData extends object>({
  column,
}: {
  column: Column<DataGridFeatures, TData, unknown>
}) {
  const { props } = useDataGrid()
  const isPinned = column.getIsPinned()
  const isLastStartPinned =
    isPinned === "start" && column.getIsLastColumn("start")
  const isFirstEndPinned = isPinned === "end" && column.getIsFirstColumn("end")

  return (
    <td
      aria-hidden="true"
      style={{
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--col-${column.id}-size) * 1px)`,
        }),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={
        isLastStartPinned ? "start" : isFirstEndPinned ? "end" : undefined
      }
      className={cn(
        "p-0",
        props.tableLayout?.cellBorder && "border-e",
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          "data-pinned:bg-background data-pinned:isolate [&[data-pinned=end][data-last-col=end]]:shadow-[inset_1px_0_0_0_var(--border)] [&[data-pinned=start][data-last-col=start]]:shadow-[inset_-1px_0_0_0_var(--border)]"
      )}
    />
  )
}

function DataGridTableVirtualColumnSpacerCell({
  colSpan,
  side,
  width,
}: {
  colSpan: number
  side: "end" | "start"
  width: number
}) {
  if (colSpan <= 0) return null

  return (
    <td
      aria-hidden="true"
      colSpan={colSpan}
      data-side={side}
      data-slot="data-grid-table-virtual-column-spacer"
      className="p-0"
      style={{ width: Math.max(0, width) }}
    />
  )
}

function DataGridTableVirtualColumnSpacerHeadCell({
  colSpan,
  side,
  width,
}: {
  colSpan: number
  side: "end" | "start"
  width: number
}) {
  if (colSpan <= 0) return null

  return (
    <th
      aria-hidden="true"
      colSpan={colSpan}
      data-side={side}
      data-slot="data-grid-table-virtual-column-spacer"
      className="p-0"
      style={{ width: Math.max(0, width) }}
    />
  )
}

function DataGridTableVirtualRenderedRow<TData extends object>({
  columnWindow,
  pinnedBoundary,
  row,
  rowIndex,
  rowRef,
}: {
  columnWindow: DataGridTableVirtualColumnWindow | null
  pinnedBoundary?: DataGridTablePinnedBoundary
  row: Row<DataGridFeatures, TData>
  rowIndex?: number
  rowRef?: Ref<HTMLTableRowElement>
}) {
  const { props, table } = useDataGrid<TData>()
  const startVisibleCells = row.getStartVisibleCells()
  const centerVisibleCells = row.getCenterVisibleCells()
  const endVisibleCells = row.getEndVisibleCells()
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)
  const renderedCenterCells = columnWindow
    ? columnWindow.items.flatMap((item) => {
        const cell = centerVisibleCells[item.index]

        return cell ? [{ cell, columnIndex: item.index }] : []
      })
    : centerVisibleCells.map((cell, columnIndex) => ({ cell, columnIndex }))

  return (
    <Fragment>
      <DataGridTableBodyRow
        dataIndex={rowIndex}
        pinnedBoundary={pinnedBoundary}
        row={row}
        rowRef={rowRef}
      >
        {startVisibleCells.map(
          (cell: Cell<DataGridFeatures, TData, unknown>) => (
            <DataGridTableBodyRowCell cell={cell} key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DataGridTableBodyRowCell>
          )
        )}
        {columnWindow ? (
          <DataGridTableVirtualColumnSpacerCell
            colSpan={columnWindow.startSpan}
            side="start"
            width={columnWindow.startPadding}
          />
        ) : null}
        {renderedCenterCells.map(({ cell, columnIndex }) => (
          <DataGridTableBodyRowCell
            cell={cell}
            columnIndex={columnIndex}
            key={cell.id}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        ))}
        {columnWindow ? (
          <DataGridTableVirtualColumnSpacerCell
            colSpan={columnWindow.endSpan}
            side="end"
            width={columnWindow.endPadding}
          />
        ) : null}
        {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
          <DataGridTableFillBodyCell />
        ) : null}
        {endVisibleCells.map((cell: Cell<DataGridFeatures, TData, unknown>) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        ))}
        {props.tableLayout?.columnsResizable && !hasRightPinnedColumns ? (
          <DataGridTableFillBodyCell />
        ) : null}
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
    </Fragment>
  )
}

function DataGridTableVirtualUtilityRow<TData extends object>({
  table,
  children,
  centerCellClassName,
  centerCellStyle,
  rowClassName,
  ariaHidden,
}: {
  table: DataGridTableInstance<TData>
  children: ReactNode
  centerCellClassName?: string
  centerCellStyle?: CSSProperties
  rowClassName?: string
  ariaHidden?: boolean
}) {
  const { props } = useDataGrid()
  const startVisibleColumns = table.getStartVisibleLeafColumns()
  const centerVisibleColumns = table.getCenterVisibleLeafColumns()
  const endVisibleColumns = table.getEndVisibleLeafColumns()
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)

  return (
    <tr aria-hidden={ariaHidden || undefined} className={rowClassName}>
      {startVisibleColumns.map((column) => (
        <DataGridTableVirtualPinnedPlaceholderCell
          column={column}
          key={column.id}
        />
      ))}
      <td
        colSpan={Math.max(centerVisibleColumns.length, 1)}
        className={centerCellClassName}
        style={centerCellStyle}
      >
        {children}
      </td>
      {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
        <DataGridTableFillBodyCell />
      ) : null}
      {endVisibleColumns.map((column) => (
        <DataGridTableVirtualPinnedPlaceholderCell
          column={column}
          key={column.id}
        />
      ))}
      {props.tableLayout?.columnsResizable && !hasRightPinnedColumns ? (
        <DataGridTableFillBodyCell />
      ) : null}
    </tr>
  )
}

function DataGridTableVirtualSpacer<TData extends object>({
  table,
  height,
}: {
  table: DataGridTableInstance<TData>
  height: number
}) {
  if (height <= 0) return null

  return (
    <DataGridTableVirtualUtilityRow
      table={table}
      ariaHidden
      centerCellClassName="p-0"
      centerCellStyle={{ height, padding: 0 }}
    >
      {null}
    </DataGridTableVirtualUtilityRow>
  )
}

function DataGridTableVirtualStatusRow<TData extends object>({
  table,
  children,
  className,
}: {
  table: DataGridTableInstance<TData>
  children: ReactNode
  className?: string
}) {
  return (
    <DataGridTableVirtualUtilityRow
      table={table}
      centerCellClassName={cn(
        "text-muted-foreground py-4 text-center text-sm",
        className
      )}
    >
      {children}
    </DataGridTableVirtualUtilityRow>
  )
}

function DataGridTableVirtualBody<TData extends object>({
  table,
  topRows,
  centerRows,
  bottomRows,
  columnWindow,
  virtualItems,
  totalSize,
  isVirtualizationEnabled,
  isInfiniteMode,
  isFetchingMore,
  hasMore,
  loadingMoreMessage,
  allRowsLoadedMessage,
  measureRowRef,
}: VirtualBodyProps<TData>) {
  const { isLoading } = useDataGrid()
  const totalRows = topRows.length + centerRows.length + bottomRows.length

  if (!totalRows) {
    // Initial load must not flash the empty state as if the query returned
    // nothing.
    if (isLoading) {
      return (
        <DataGridTableVirtualStatusRow table={table}>
          <div className="flex items-center justify-center gap-2">
            <Spinner className="size-4 opacity-60" />
            {loadingMoreMessage}
          </div>
        </DataGridTableVirtualStatusRow>
      )
    }

    return <DataGridTableEmpty />
  }

  const hasCenterRows = centerRows.length > 0
  const showFetchingRow = isInfiniteMode && isFetchingMore
  const showCompleteRow = isInfiniteMode && hasMore === false && totalRows > 0
  const hasMiddleSection = hasCenterRows || showFetchingRow || showCompleteRow
  const leadingSpacerHeight =
    isVirtualizationEnabled && hasCenterRows && virtualItems.length > 0
      ? (virtualItems[0]?.start ?? 0)
      : 0
  const trailingSpacerHeight =
    isVirtualizationEnabled && hasCenterRows && virtualItems.length > 0
      ? Math.max(
          0,
          totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0)
        )
      : 0

  const renderedRows: ReactNode[] = []

  topRows.forEach((row, index) => {
    renderedRows.push(
      <DataGridTableVirtualRenderedRow
        columnWindow={columnWindow}
        key={row.id}
        row={row}
        pinnedBoundary={
          index === topRows.length - 1 && hasMiddleSection ? "top" : undefined
        }
      />
    )
  })

  if (isVirtualizationEnabled) {
    if (leadingSpacerHeight > 0) {
      renderedRows.push(
        <DataGridTableVirtualSpacer
          key="virtual-spacer-start"
          table={table}
          height={leadingSpacerHeight}
        />
      )
    }

    virtualItems.forEach((virtualRow) => {
      const row = centerRows[virtualRow.index]

      if (!row) return

      renderedRows.push(
        <DataGridTableVirtualRenderedRow
          columnWindow={columnWindow}
          key={row.id}
          row={row}
          rowRef={measureRowRef}
          rowIndex={virtualRow.index}
        />
      )
    })

    if (trailingSpacerHeight > 0) {
      renderedRows.push(
        <DataGridTableVirtualSpacer
          key="virtual-spacer-end"
          table={table}
          height={trailingSpacerHeight}
        />
      )
    }
  } else {
    centerRows.forEach((row, rowIndex) => {
      renderedRows.push(
        <DataGridTableVirtualRenderedRow
          columnWindow={columnWindow}
          key={row.id}
          row={row}
          rowIndex={rowIndex}
        />
      )
    })
  }

  if (showFetchingRow) {
    renderedRows.push(
      <DataGridTableVirtualStatusRow key="virtual-status-loading" table={table}>
        <div className="flex items-center justify-center gap-2">
          <Spinner className="size-4 opacity-60" />
          {loadingMoreMessage}
        </div>
      </DataGridTableVirtualStatusRow>
    )
  }

  if (showCompleteRow) {
    renderedRows.push(
      <DataGridTableVirtualStatusRow
        key="virtual-status-complete"
        table={table}
        className="py-3 text-xs"
      >
        {allRowsLoadedMessage}
      </DataGridTableVirtualStatusRow>
    )
  }

  bottomRows.forEach((row, index) => {
    renderedRows.push(
      <DataGridTableVirtualRenderedRow
        columnWindow={columnWindow}
        key={row.id}
        row={row}
        pinnedBoundary={
          index === 0 && (topRows.length > 0 || hasMiddleSection)
            ? "bottom"
            : undefined
        }
      />
    )
  })

  return <>{renderedRows}</>
}

/**
 * Memoized virtual body: skip re-renders during active column resize.
 * Column widths update via CSS variables on the <table> element,
 * so the browser handles width changes without React re-renders.
 */
const MemoizedVirtualBody = memo(
  DataGridTableVirtualBody,
  (_prev, next) => !!next.table.state.columnResizing.isResizingColumn
) as typeof DataGridTableVirtualBody

function DataGridTableVirtual<TData extends object>({
  height,
  estimateSize = 48,
  overscan = 10,
  columnVirtualizerOptions,
  scrollBehavior = "auto",
  scrollToColumnAlign = "auto",
  scrollToColumnIndex,
  scrollToRowAlign = "auto",
  scrollToRowIndex,
  footerContent,
  renderHeader = true,
  onFetchMore,
  isFetchingMore = false,
  hasMore,
  fetchMoreOffset = 0,
  virtualizerOptions,
}: DataGridTableVirtualProps<TData>) {
  const { table, props } = useDataGrid<TData>()
  const mergedHeaderGroups = getDataGridTableMergedHeaderGroups(table)
  const centerVisibleColumns = table.getCenterVisibleLeafColumns()
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    props.tableLayout?.rowsPinnable
  )
  const isInfiniteMode = typeof onFetchMore === "function"
  const [viewportElements, setViewportElements] =
    useState<DataGridTableVirtualScrollElements>({
      containerElement: null,
      scrollElement: null,
    })

  const {
    estimateSize: customEstimateSize,
    getItemKey: customGetItemKey,
    getScrollElement: customGetScrollElement,
    measureElement: customMeasureElement,
    overscan: customOverscan,
    ...virtualizerOptionsRest
  } = virtualizerOptions ?? {}
  const {
    enabled: columnVirtualizerEnabled = true,
    overscan: columnOverscan = 3,
    ...columnVirtualizerOptionsRest
  } = columnVirtualizerOptions ?? {}

  const isVirtualizationEnabled = virtualizerOptions?.enabled !== false
  const isColumnVirtualizationEnabled =
    columnVirtualizerOptions !== undefined &&
    columnVirtualizerEnabled !== false &&
    props.tableLayout?.width === "fixed" &&
    mergedHeaderGroups.length <= 1 &&
    centerVisibleColumns.length > 0
  const centerColumnSignature = centerVisibleColumns
    .map((column) => `${column.id}:${column.getSize()}`)
    .join("|")
  const loadingMoreMessage =
    props.fetchingMoreMessage ?? props.loadingMessage ?? "Loading..."
  const allRowsLoadedMessage =
    props.allRowsLoadedMessage ?? "All records loaded"

  const handleViewportRef = useCallback((node: HTMLDivElement | null) => {
    setViewportElements({
      containerElement: node,
      scrollElement: node
        ? (getDataGridScrollAreaViewport(node) ?? node)
        : null,
    })
  }, [])

  const usesExternalScrollArea =
    viewportElements.scrollElement !== null &&
    viewportElements.scrollElement !== viewportElements.containerElement

  const resolveScrollElement = useCallback(() => {
    if (customGetScrollElement) {
      return customGetScrollElement(viewportElements)
    }

    return viewportElements.scrollElement
  }, [customGetScrollElement, viewportElements])

  const resolveItemKey = useCallback(
    (index: number) => {
      const row = centerRows[index]

      if (!row) return index

      return customGetItemKey?.(index, row) ?? row.id ?? index
    },
    [centerRows, customGetItemKey]
  )

  const resolveEstimateSize = useCallback(
    (index: number) => {
      const row = centerRows[index]

      return row
        ? (customEstimateSize?.(index, row) ?? estimateSize)
        : estimateSize
    },
    [centerRows, customEstimateSize, estimateSize]
  )

  const virtualizer = useVirtualizer({
    count: centerRows.length,
    getScrollElement: resolveScrollElement,
    getItemKey: resolveItemKey,
    estimateSize: resolveEstimateSize,
    overscan: customOverscan ?? overscan,
    measureElement: customMeasureElement,
    ...virtualizerOptionsRest,
  }) as DataGridTableVirtualizerInstance

  const columnVirtualizer = useVirtualizer({
    ...columnVirtualizerOptionsRest,
    count: centerVisibleColumns.length,
    enabled: isColumnVirtualizationEnabled,
    estimateSize: (index) => centerVisibleColumns[index]?.getSize() ?? 0,
    getItemKey: (index) => centerVisibleColumns[index]?.id ?? index,
    getScrollElement: resolveScrollElement,
    horizontal: true,
    overscan: columnOverscan,
  }) as DataGridTableColumnVirtualizerInstance

  const virtualItems = isVirtualizationEnabled
    ? virtualizer.getVirtualItems()
    : []
  const totalSize = isVirtualizationEnabled ? virtualizer.getTotalSize() : 0
  const columnVirtualItems = isColumnVirtualizationEnabled
    ? columnVirtualizer
        .getVirtualItems()
        .filter(
          (item) => item.index >= 0 && item.index < centerVisibleColumns.length
        )
    : []
  const firstVirtualColumn = columnVirtualItems[0]
  const lastVirtualColumn = columnVirtualItems[columnVirtualItems.length - 1]
  const columnTotalSize = isColumnVirtualizationEnabled
    ? columnVirtualizer.getTotalSize()
    : 0
  const columnWindow =
    firstVirtualColumn && lastVirtualColumn
      ? {
          endPadding: Math.max(0, columnTotalSize - lastVirtualColumn.end),
          endSpan: Math.max(
            0,
            centerVisibleColumns.length - lastVirtualColumn.index - 1
          ),
          items: columnVirtualItems,
          startPadding: Math.max(0, firstVirtualColumn.start),
          startSpan: Math.max(0, firstVirtualColumn.index),
        }
      : null
  const measureRowRef =
    isVirtualizationEnabled && customMeasureElement
      ? virtualizer.measureElement
      : undefined
  const resolvedFetchMoreOffset = Math.max(0, fetchMoreOffset)
  const scrollToRowId =
    scrollToRowIndex !== undefined
      ? centerRows[scrollToRowIndex]?.id
      : undefined
  const scrollToRowVirtualItem =
    isVirtualizationEnabled && scrollToRowIndex !== undefined
      ? virtualItems.find((item) => item.index === scrollToRowIndex)
      : undefined
  const scrollToColumnId =
    scrollToColumnIndex !== undefined
      ? centerVisibleColumns[scrollToColumnIndex]?.id
      : undefined
  const scrollToColumnVirtualItem =
    isColumnVirtualizationEnabled && scrollToColumnIndex !== undefined
      ? columnVirtualItems.find((item) => item.index === scrollToColumnIndex)
      : undefined
  const scrollToColumnVirtualItemSignature = scrollToColumnVirtualItem
    ? `${scrollToColumnVirtualItem.start}:${scrollToColumnVirtualItem.size}:${scrollToColumnVirtualItem.end}`
    : undefined
  const pendingScrollToColumnIndexRef = useRef<number | null>(null)
  const lastColumnScrollRequestRef =
    useRef<DataGridTableVirtualColumnScrollRequest | null>(null)
  const pendingScrollToRowIndexRef = useRef<number | null>(null)
  const lastScrollRequestRef = useRef<DataGridTableVirtualScrollRequest | null>(
    null
  )
  // Latch onFetchMore per row count: virtualItems gets a new identity every
  // scroll frame, so without it the effect fires duplicate page requests
  // before the consumer flips isFetchingMore, and loops at end-of-data when
  // hasMore is never set.
  const fetchMoreFiredAtCountRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (!isColumnVirtualizationEnabled) return

    columnVirtualizer.measure()
  }, [centerColumnSignature, columnVirtualizer, isColumnVirtualizationEnabled])

  useEffect(() => {
    const previousRequest = lastColumnScrollRequestRef.current

    if (
      scrollToColumnIndex === undefined ||
      scrollToColumnIndex < 0 ||
      scrollToColumnIndex >= centerVisibleColumns.length
    ) {
      pendingScrollToColumnIndexRef.current = null
      lastColumnScrollRequestRef.current = null
      return
    }

    const scrollElement = resolveScrollElement()
    const containerElement = viewportElements.containerElement
    if (!containerElement || !scrollElement) return

    const nextRequest: DataGridTableVirtualColumnScrollRequest = {
      align: scrollToColumnAlign,
      behavior: scrollBehavior,
      columnId: scrollToColumnId,
      columnIndex: scrollToColumnIndex,
      containerElement,
      isVirtualizationEnabled: isColumnVirtualizationEnabled,
      scrollElement,
    }

    if (isSameDataGridTableColumnScrollRequest(previousRequest, nextRequest)) {
      return
    }

    pendingScrollToColumnIndexRef.current = null

    const columnWasHandled = scrollDataGridTableColumnIntoView({
      align: scrollToColumnAlign,
      behavior: scrollBehavior,
      columnIndex: scrollToColumnIndex,
      containerElement,
      scrollElement,
    })

    if (columnWasHandled) {
      lastColumnScrollRequestRef.current = nextRequest
      return
    }

    if (!isColumnVirtualizationEnabled) return

    pendingScrollToColumnIndexRef.current = scrollToColumnIndex
    lastColumnScrollRequestRef.current = nextRequest
    columnVirtualizer.scrollToIndex(scrollToColumnIndex, {
      align: scrollToColumnAlign,
      behavior: scrollBehavior,
    })
  })

  useEffect(() => {
    if (
      !isColumnVirtualizationEnabled ||
      scrollToColumnIndex === undefined ||
      pendingScrollToColumnIndexRef.current !== scrollToColumnIndex ||
      !scrollToColumnVirtualItemSignature
    ) {
      return
    }

    const columnWasHandled = scrollDataGridTableColumnIntoView({
      align: scrollToColumnAlign,
      behavior: "auto",
      columnIndex: scrollToColumnIndex,
      containerElement: viewportElements.containerElement,
      scrollElement: resolveScrollElement(),
    })

    if (columnWasHandled) {
      pendingScrollToColumnIndexRef.current = null
    }
  }, [
    isColumnVirtualizationEnabled,
    resolveScrollElement,
    scrollToColumnAlign,
    scrollToColumnIndex,
    scrollToColumnVirtualItemSignature,
    viewportElements.containerElement,
  ])

  // Resolve after every commit so a stable getter can expose a replaced ref;
  // the request signature prevents duplicate scrolling on ordinary renders.
  useEffect(() => {
    const previousRequest = lastScrollRequestRef.current

    if (
      scrollToRowIndex === undefined ||
      scrollToRowIndex < 0 ||
      scrollToRowIndex >= centerRows.length
    ) {
      pendingScrollToRowIndexRef.current = null
      lastScrollRequestRef.current = null

      if (previousRequest) {
        const scrollElement = resolveScrollElement()

        if (scrollElement) {
          scrollDataGridTableToOffset({
            behavior: "auto",
            scrollElement,
            targetTop: scrollElement.scrollTop,
            virtualizer: isVirtualizationEnabled ? virtualizer : undefined,
          })
        }
      }

      return
    }

    const scrollElement = resolveScrollElement()
    const containerElement = viewportElements.containerElement
    if (!containerElement || !scrollElement) return

    const headerSticky = renderHeader && !!props.tableLayout?.headerSticky
    const nextRequest: DataGridTableVirtualScrollRequest = {
      align: scrollToRowAlign,
      behavior: scrollBehavior,
      containerElement,
      headerSticky,
      isVirtualizationEnabled,
      rowId: scrollToRowId,
      rowIndex: scrollToRowIndex,
      scrollElement,
    }

    if (isSameDataGridTableScrollRequest(previousRequest, nextRequest)) return

    pendingScrollToRowIndexRef.current = null

    const rowWasHandled = scrollDataGridTableRowIntoView({
      align: scrollToRowAlign,
      behavior: scrollBehavior,
      cancelPendingScroll: previousRequest !== null,
      containerElement,
      headerSticky,
      rowIndex: scrollToRowIndex,
      scrollElement,
      virtualizer: isVirtualizationEnabled ? virtualizer : undefined,
    })

    if (rowWasHandled) {
      lastScrollRequestRef.current = nextRequest
      return
    }

    if (!isVirtualizationEnabled) return

    pendingScrollToRowIndexRef.current = scrollToRowIndex
    lastScrollRequestRef.current = nextRequest
    virtualizer.scrollToIndex(scrollToRowIndex, {
      align: scrollToRowAlign,
      behavior: scrollBehavior,
    })
  })

  useEffect(() => {
    if (
      !isVirtualizationEnabled ||
      scrollToRowIndex === undefined ||
      pendingScrollToRowIndexRef.current !== scrollToRowIndex ||
      !scrollToRowVirtualItem
    ) {
      return
    }

    const rowWasHandled = scrollDataGridTableRowIntoView({
      align: scrollToRowAlign,
      behavior: "auto",
      cancelPendingScroll: true,
      containerElement: viewportElements.containerElement,
      headerSticky: renderHeader && !!props.tableLayout?.headerSticky,
      rowIndex: scrollToRowIndex,
      scrollElement: resolveScrollElement(),
      virtualizer,
    })

    if (rowWasHandled) {
      pendingScrollToRowIndexRef.current = null
    }
  }, [
    isVirtualizationEnabled,
    props.tableLayout?.headerSticky,
    renderHeader,
    resolveScrollElement,
    scrollToRowAlign,
    scrollToRowIndex,
    scrollToRowVirtualItem,
    virtualizer,
    viewportElements.containerElement,
  ])

  useEffect(() => {
    if (
      !isVirtualizationEnabled ||
      !isInfiniteMode ||
      hasMore === false ||
      isFetchingMore
    ) {
      return
    }

    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return

    if (fetchMoreFiredAtCountRef.current === centerRows.length) return

    if (lastItem.index >= centerRows.length - 1 - resolvedFetchMoreOffset) {
      fetchMoreFiredAtCountRef.current = centerRows.length
      onFetchMore?.()
    }
  }, [
    centerRows.length,
    hasMore,
    isFetchingMore,
    isInfiniteMode,
    isVirtualizationEnabled,
    onFetchMore,
    resolvedFetchMoreOffset,
    virtualItems,
  ])

  return (
    <DataGridTableViewport
      viewportRef={handleViewportRef}
      className={!usesExternalScrollArea ? "block" : undefined}
      style={
        usesExternalScrollArea
          ? undefined
          : {
              height,
              overflow: "auto",
              position: "relative",
              // Standalone mode: this node IS the scroll container, so it
              // must stay at its parent's width (not the resizable table
              // width) or horizontal scrolling becomes impossible.
              width: "auto",
            }
      }
    >
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {mergedHeaderGroups.map((headerGroup) => {
              const startHeaders = headerGroup.headers.filter(
                (header) => header.column.getIsPinned() === "start"
              )
              const centerHeaders = headerGroup.headers.filter(
                (header) => !header.column.getIsPinned()
              )
              const endHeaders = headerGroup.headers.filter(
                (header) => header.column.getIsPinned() === "end"
              )
              const renderedCenterHeaders = columnWindow
                ? columnWindow.items.flatMap((item) => {
                    const header = centerHeaders[item.index]

                    return header ? [{ columnIndex: item.index, header }] : []
                  })
                : centerHeaders.map((header, columnIndex) => ({
                    columnIndex,
                    header,
                  }))
              const renderHeaderCell = (
                header: (typeof headerGroup.headers)[number],
                columnIndex?: number
              ) => {
                const { column } = header

                return (
                  <DataGridTableHeadRowCell
                    columnIndex={columnIndex}
                    header={header}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {props.tableLayout?.columnsResizable &&
                      column.getCanResize() && (
                        <DataGridTableHeadRowCellResize header={header} />
                      )}
                  </DataGridTableHeadRowCell>
                )
              }

              return (
                <DataGridTableHeadRow
                  key={headerGroup.id}
                  rowId={headerGroup.id}
                >
                  {startHeaders.map((header) => renderHeaderCell(header))}
                  {columnWindow ? (
                    <DataGridTableVirtualColumnSpacerHeadCell
                      colSpan={columnWindow.startSpan}
                      side="start"
                      width={columnWindow.startPadding}
                    />
                  ) : null}
                  {renderedCenterHeaders.map(({ columnIndex, header }) =>
                    renderHeaderCell(header, columnIndex)
                  )}
                  {columnWindow ? (
                    <DataGridTableVirtualColumnSpacerHeadCell
                      colSpan={columnWindow.endSpan}
                      side="end"
                      width={columnWindow.endPadding}
                    />
                  ) : null}
                  {props.tableLayout?.columnsResizable &&
                  hasRightPinnedColumns ? (
                    <DataGridTableFillHeadCell />
                  ) : null}
                  {endHeaders.map((header) => renderHeaderCell(header))}
                  {props.tableLayout?.columnsResizable &&
                  !hasRightPinnedColumns ? (
                    <DataGridTableFillHeadCell />
                  ) : null}
                </DataGridTableHeadRow>
              )
            })}
          </DataGridTableHead>
        )}

        {renderHeader &&
          (props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

        <DataGridTableBody>
          <MemoizedVirtualBody
            table={table}
            topRows={topRows}
            centerRows={centerRows}
            bottomRows={bottomRows}
            columnWindow={columnWindow}
            virtualItems={virtualItems}
            totalSize={totalSize}
            isVirtualizationEnabled={isVirtualizationEnabled}
            isInfiniteMode={isInfiniteMode}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            loadingMoreMessage={loadingMoreMessage}
            allRowsLoadedMessage={allRowsLoadedMessage}
            measureRowRef={measureRowRef}
          />
        </DataGridTableBody>

        {footerContent && (
          <DataGridTableFoot>{footerContent}</DataGridTableFoot>
        )}
      </DataGridTableBase>
    </DataGridTableViewport>
  )
}

export { DataGridTableVirtual }
export type {
  DataGridTableColumnVirtualizerOptions,
  DataGridTableVirtualScrollAlignment,
  DataGridTableVirtualProps,
  DataGridTableVirtualScrollElements,
  DataGridTableVirtualizerOptions,
}
