"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { useDataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import type {
  DataGridFeatures,
  DataGridTableInstance,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import {
  DataGridTableAddRow,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableEmpty,
  DataGridTableFillBodyCell,
  DataGridTableFillHeadCell,
  DataGridTableFoot,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableRenderedRow,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  getDataGridScrollAreaViewport,
  getDataGridTableMergedHeaderGroups,
  getDataGridTableRowSections,
  getPinningStyles,
  hasDataGridTableRightPinnedColumns,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-table"
import { flexRender } from "@tanstack/react-table"
import type { Column, Row, Table } from "@tanstack/react-table"
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

type DataGridTableVirtualScrollAlignment = "auto" | "center" | "start" | "end"

interface DataGridTableColumnVirtualizerOptions {
  /** Off unless explicitly true; a column window is opt-in. */
  enabled?: boolean
  overscan?: number
}

type DataGridTableColumnScrollRequest = {
  align: DataGridTableVirtualScrollAlignment
  behavior: ScrollBehavior
  columnId: string | undefined
  columnIndex: number
  scrollElement: HTMLElement
}

function isSameDataGridTableColumnScrollRequest(
  previous: DataGridTableColumnScrollRequest | null,
  next: DataGridTableColumnScrollRequest
) {
  return (
    previous?.align === next.align &&
    previous.behavior === next.behavior &&
    previous.columnId === next.columnId &&
    previous.columnIndex === next.columnIndex &&
    previous.scrollElement === next.scrollElement
  )
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

interface DataGridTableVirtualProps<TData extends object> {
  height?: number | string
  estimateSize?: number
  overscan?: number
  /** Scroll animation used when revealing a controlled target row. */
  scrollBehavior?: ScrollBehavior
  /** Alignment used when revealing a controlled target row. Defaults to auto. */
  scrollToRowAlign?: DataGridTableVirtualScrollAlignment
  /** Index within the center (non-pinned) row section to reveal. */
  scrollToRowIndex?: number
  /**
   * Opt-in horizontal virtualization of the CENTER columns. Activates only
   * under a fixed table layout with a single ungrouped header row; pinned
   * columns stay mounted, and anything else falls back to full-column
   * rendering. `scrollBehavior` is shared with controlled row scrolling.
   */
  columnVirtualizerOptions?: DataGridTableColumnVirtualizerOptions
  /** Alignment used when revealing a controlled target column. */
  scrollToColumnAlign?: DataGridTableVirtualScrollAlignment
  /** Index within the center (non-pinned) visible leaf columns to reveal. */
  scrollToColumnIndex?: number
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
  virtualItems: VirtualItem[]
  totalSize: number
  isVirtualizationEnabled: boolean
  isInfiniteMode: boolean
  isFetchingMore: boolean
  hasMore?: boolean
  loadingMoreMessage: ReactNode
  allRowsLoadedMessage: ReactNode
  measureRowRef?: (element: HTMLTableRowElement | null) => void
  centerColumnWindow?: { start: number; end: number }
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
  const leftVisibleColumns = table.getStartVisibleLeafColumns()
  const centerVisibleColumns = table.getCenterVisibleLeafColumns()
  const rightVisibleColumns = table.getEndVisibleLeafColumns()
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)

  return (
    <tr aria-hidden={ariaHidden || undefined} className={rowClassName}>
      {leftVisibleColumns.map((column) => (
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
      {rightVisibleColumns.map((column) => (
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

/**
 * A scroll frame only shifts the window, so every surviving row's inputs are
 * identical and its last render is reused; the per-frame cost is the rows
 * entering the window, not all mounted rows. Cell-level state (selection,
 * focus, row checks) repaints through each cell's own Subscribe, and any real
 * data change rebuilds the row wrappers, so identity comparison is safe.
 */
const MemoizedRenderedRow = memo(
  DataGridTableRenderedRow,
  (prev, next) =>
    prev.row === next.row &&
    prev.rowIndex === next.rowIndex &&
    prev.rowRef === next.rowRef &&
    prev.pinnedBoundary === next.pinnedBoundary &&
    prev.centerWindow?.start === next.centerWindow?.start &&
    prev.centerWindow?.end === next.centerWindow?.end
) as typeof DataGridTableRenderedRow

function DataGridTableVirtualBody<TData extends object>({
  table,
  topRows,
  centerRows,
  bottomRows,
  virtualItems,
  totalSize,
  isVirtualizationEnabled,
  isInfiniteMode,
  isFetchingMore,
  hasMore,
  loadingMoreMessage,
  allRowsLoadedMessage,
  measureRowRef,
  centerColumnWindow,
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
      <MemoizedRenderedRow
        key={row.id}
        row={row}
        centerWindow={centerColumnWindow}
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
        <MemoizedRenderedRow
          key={row.id}
          row={row}
          rowRef={measureRowRef}
          rowIndex={virtualRow.index}
          centerWindow={centerColumnWindow}
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
        <MemoizedRenderedRow
          key={row.id}
          row={row}
          rowIndex={rowIndex}
          centerWindow={centerColumnWindow}
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
      <MemoizedRenderedRow
        key={row.id}
        row={row}
        centerWindow={centerColumnWindow}
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
 * A cell-selection drag gets the same treatment: painting goes through each
 * cell's own Subscribe, and the virtualizer re-renders itself from inside the
 * memo boundary, so parent-driven reconciliation during the drag is waste.
 */
const MemoizedVirtualBody = memo(
  DataGridTableVirtualBody,
  (_prev, next) =>
    !!next.table.state.columnResizing.isResizingColumn ||
    next.table._isSelectingCells === true
) as typeof DataGridTableVirtualBody

function DataGridTableVirtual<TData extends object>({
  height,
  estimateSize = 48,
  overscan = 10,
  scrollBehavior = "auto",
  scrollToRowAlign = "auto",
  scrollToRowIndex,
  columnVirtualizerOptions,
  scrollToColumnAlign = "auto",
  scrollToColumnIndex,
  footerContent,
  renderHeader = true,
  onFetchMore,
  isFetchingMore = false,
  hasMore,
  fetchMoreOffset = 0,
  virtualizerOptions,
}: DataGridTableVirtualProps<TData>) {
  const { i18n, table, props } = useDataGrid<TData>()
  const mergedHeaderGroups = getDataGridTableMergedHeaderGroups(table)
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)
  const centerVisibleColumns = table.getCenterVisibleLeafColumns()
  // Column windows only where the geometry is provable: a fixed table
  // layout (undefined defaults to fixed; the colgroup then owns every
  // width, so colSpan spacers cannot drift) and a single ungrouped header
  // row (a colSpan group cannot be windowed). Anything else falls back to
  // full-column rendering silently, the same posture as row virtualization
  // toward unsupported shapes.
  const columnVirtualizationActive =
    columnVirtualizerOptions?.enabled === true &&
    props.tableLayout?.width !== "auto" &&
    mergedHeaderGroups.length === 1 &&
    (mergedHeaderGroups[0]?.headers.every((header) => header.colSpan <= 1) ??
      false)
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

  const isVirtualizationEnabled = virtualizerOptions?.enabled !== false
  const loadingMoreMessage =
    props.fetchingMoreMessage || props.loadingMessage || i18n.labels.loading
  const allRowsLoadedMessage =
    props.allRowsLoadedMessage || i18n.labels.allRowsLoaded

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

  // Horizontal offsets invert in RTL; the virtualizer must be told.
  const isRtl = useMemo(
    () =>
      viewportElements.containerElement
        ? getComputedStyle(viewportElements.containerElement).direction ===
          "rtl"
        : false,
    [viewportElements.containerElement]
  )

  const resolveColumnKey = useCallback(
    (index: number) => centerVisibleColumns[index]?.id ?? index,
    [centerVisibleColumns]
  )

  const resolveColumnEstimateSize = useCallback(
    (index: number) => centerVisibleColumns[index]?.getSize() ?? 0,
    [centerVisibleColumns]
  )

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    isRtl,
    count: columnVirtualizationActive ? centerVisibleColumns.length : 0,
    getScrollElement: resolveScrollElement,
    getItemKey: resolveColumnKey,
    estimateSize: resolveColumnEstimateSize,
    overscan: columnVirtualizerOptions?.overscan ?? 3,
  })

  // Column sizes are exact reads of getSize(), never DOM-measured, so a
  // resize commit or a visibility/order/pinning change must resync the
  // virtualizer's cached sizes by hand.
  useEffect(() => {
    if (columnVirtualizationActive) columnVirtualizer.measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnVirtualizationActive,
    columnVirtualizer,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.state.columnSizing,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.state.columnVisibility,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.state.columnOrder,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.state.columnPinning,
  ])

  const virtualColumns = columnVirtualizationActive
    ? columnVirtualizer.getVirtualItems()
    : []
  // The window is a contiguous inclusive [start, end] over the center
  // columns; before the scroll element resolves the item list is empty and
  // the grid renders full-width for that first frame.
  const centerColumnWindow =
    columnVirtualizationActive && virtualColumns.length > 0
      ? {
          start: virtualColumns[0]!.index,
          end: virtualColumns[virtualColumns.length - 1]!.index,
        }
      : undefined

  const virtualItems = isVirtualizationEnabled
    ? virtualizer.getVirtualItems()
    : []
  const totalSize = isVirtualizationEnabled ? virtualizer.getTotalSize() : 0
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
  const pendingScrollToRowIndexRef = useRef<number | null>(null)
  const lastScrollRequestRef = useRef<DataGridTableVirtualScrollRequest | null>(
    null
  )
  // Latch onFetchMore per row count: virtualItems gets a new identity every
  // scroll frame, so without it the effect fires duplicate page requests
  // before the consumer flips isFetchingMore, and loops at end-of-data when
  // hasMore is never set.
  const fetchMoreFiredAtCountRef = useRef<number | null>(null)
  const lastColumnScrollRequestRef =
    useRef<DataGridTableColumnScrollRequest | null>(null)

  // Controlled column reveal: same dedupe posture as the row request - the
  // signature keeps ordinary renders from re-scrolling, and exact column
  // sizes mean no post-measure follow-up pass is needed.
  useEffect(() => {
    if (
      !columnVirtualizationActive ||
      scrollToColumnIndex === undefined ||
      scrollToColumnIndex < 0 ||
      scrollToColumnIndex >= centerVisibleColumns.length ||
      !viewportElements.scrollElement
    ) {
      return
    }
    const request: DataGridTableColumnScrollRequest = {
      align: scrollToColumnAlign,
      behavior: scrollBehavior,
      columnId: centerVisibleColumns[scrollToColumnIndex]?.id,
      columnIndex: scrollToColumnIndex,
      scrollElement: viewportElements.scrollElement,
    }
    if (
      isSameDataGridTableColumnScrollRequest(
        lastColumnScrollRequestRef.current,
        request
      )
    ) {
      return
    }
    lastColumnScrollRequestRef.current = request
    columnVirtualizer.scrollToIndex(scrollToColumnIndex, {
      align: scrollToColumnAlign,
      behavior: scrollBehavior === "smooth" ? "smooth" : "auto",
    })
  }, [
    columnVirtualizationActive,
    columnVirtualizer,
    centerVisibleColumns,
    scrollToColumnAlign,
    scrollToColumnIndex,
    scrollBehavior,
    viewportElements.scrollElement,
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

  // The header re-renders only when its real inputs move: the table
  // wrapper (any table state change recreates it), the layout props, and
  // the column window. A scroll frame changes none of them, so the whole
  // sortable-header subtree is reused instead of rebuilt per frame.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headerNode = useMemo(
    () =>
      renderHeader && (
        <DataGridTableHead>
          {mergedHeaderGroups.map((headerGroup) => (
            <DataGridTableHeadRow key={headerGroup.id} rowId={headerGroup.id}>
              {/* Under an active column window the single ungrouped header
                        row is bucketed start / windowed center / end, with each
                        off-window flank one colSpan spacer sized by the intact
                        colgroup - the same shape the body rows take. */}
              {centerColumnWindow
                ? headerGroup.headers
                    .filter((header) => header.column.getIsPinned() === "start")
                    .map((header) => (
                      <DataGridTableHeadRowCell header={header} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {props.tableLayout?.columnsResizable &&
                          header.column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    ))
                : null}
              {centerColumnWindow && centerColumnWindow.start > 0 ? (
                <th
                  aria-hidden="true"
                  data-slot="data-grid-table-virtual-col-spacer"
                  colSpan={centerColumnWindow.start}
                  className="p-0"
                />
              ) : null}
              {centerColumnWindow
                ? headerGroup.headers
                    .filter((header) => !header.column.getIsPinned())
                    .slice(centerColumnWindow.start, centerColumnWindow.end + 1)
                    .map((header) => (
                      <DataGridTableHeadRowCell header={header} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {props.tableLayout?.columnsResizable &&
                          header.column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    ))
                : null}
              {centerColumnWindow &&
              centerVisibleColumns.length - 1 - centerColumnWindow.end > 0 ? (
                <th
                  aria-hidden="true"
                  data-slot="data-grid-table-virtual-col-spacer"
                  colSpan={
                    centerVisibleColumns.length - 1 - centerColumnWindow.end
                  }
                  className="p-0"
                />
              ) : null}
              {!centerColumnWindow &&
                headerGroup.headers
                  .filter((header) => header.column.getIsPinned() !== "end")
                  .map((header) => {
                    const { column } = header

                    return (
                      <DataGridTableHeadRowCell header={header} key={header.id}>
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
                  })}
              {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
                <DataGridTableFillHeadCell />
              ) : null}
              {headerGroup.headers
                .filter((header) => header.column.getIsPinned() === "end")
                .map((header) => {
                  const { column } = header

                  return (
                    <DataGridTableHeadRowCell header={header} key={header.id}>
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
                })}
              {props.tableLayout?.columnsResizable && !hasRightPinnedColumns ? (
                <DataGridTableFillHeadCell />
              ) : null}
            </DataGridTableHeadRow>
          ))}
        </DataGridTableHead>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      renderHeader,
      table,
      props.tableLayout,
      centerColumnWindow,
      hasRightPinnedColumns,
    ]
  )

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
        {headerNode}

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
            virtualItems={virtualItems}
            totalSize={totalSize}
            isVirtualizationEnabled={isVirtualizationEnabled}
            isInfiniteMode={isInfiniteMode}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            loadingMoreMessage={loadingMoreMessage}
            allRowsLoadedMessage={allRowsLoadedMessage}
            measureRowRef={measureRowRef}
            centerColumnWindow={centerColumnWindow}
          />
          {/* Same appended region as the standard body, so onRowCreate and
              a consumer draft work in the virtual layout too. */}
          {props.appendRow}
          <DataGridTableAddRow />
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
  DataGridTableVirtualScrollAlignment,
  DataGridTableVirtualProps,
  DataGridTableVirtualScrollElements,
  DataGridTableVirtualizerOptions,
}
