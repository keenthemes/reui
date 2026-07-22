"use client"
"use no memo"

import {
  CSSProperties,
  Fragment,
  memo,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react"
import { useDataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import {
  Cell,
  Column,
  flexRender,
  Header,
  Row,
  Table,
} from "@tanstack/react-table"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import { Spinner } from "@/registry/bases/radix/ui/spinner"

// Static spacing lookups; called once per cell, so they stay plain string
// picks instead of runtime variant machinery.
const headerCellSpacingVariants = ({ size }: { size?: "dense" | "default" }) =>
  size === "dense" ? "px-2 h-8" : "px-3"

const bodyCellSpacingVariants = ({ size }: { size?: "dense" | "default" }) =>
  size === "dense" ? "px-2 py-1.5" : "px-3 py-2"

const footerCellSpacingVariants = ({ size }: { size?: "dense" | "default" }) =>
  size === "dense" ? "px-2 py-1.5" : "px-3 py-2"

function getPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned()

  return {
    // Logical offsets: TanStack's "left"/"right" buckets are start/end
    // semantics, so pinned columns stick to the correct edge in RTL too
    // (identical to left/right in LTR).
    insetInlineStart:
      isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    insetInlineEnd:
      isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : undefined,
    transform: isPinned ? "translateZ(0)" : undefined,
    contain: isPinned ? "paint" : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 30 : undefined,
    backgroundClip: isPinned ? "padding-box" : undefined,
  }
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return

  if (typeof ref === "function") {
    ref(value)
    return
  }

  ;(ref as { current: T | null }).current = value
}

/**
 * Nearest scroll-area viewport that belongs to THIS grid. A viewport outside
 * the grid's own container (e.g. a page-level ScrollArea) would make the
 * width measurement - and the virtualizer - bind the wrong box.
 */
function getDataGridScrollAreaViewport(node: HTMLElement): HTMLElement | null {
  const scrollViewport = node.closest(
    '[data-slot="scroll-area-viewport"]'
  ) as HTMLElement | null

  if (!scrollViewport) return null

  const gridContainer = node.closest('[data-slot="data-grid"]')
  if (gridContainer && !gridContainer.contains(scrollViewport)) return null

  return scrollViewport
}

type DataGridResizeStartEvent =
  | ReactMouseEvent<HTMLDivElement>
  | ReactTouchEvent<HTMLDivElement>

type DataGridResizeDocumentEvent = globalThis.MouseEvent | globalThis.TouchEvent

function isDataGridTouchEvent(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent
): event is ReactTouchEvent<HTMLDivElement> | globalThis.TouchEvent {
  return "touches" in event
}

type DataGridTouchListLike = {
  length: number
  item: (index: number) => { identifier: number; clientX: number } | null
}

function findTouchClientX(list: DataGridTouchListLike, identifier: number) {
  for (let i = 0; i < list.length; i++) {
    const touch = list.item(i)
    if (touch && touch.identifier === identifier) return touch.clientX
  }

  return undefined
}

function getDataGridResizeEventClientX(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent,
  touchIdentifier?: number
) {
  if (isDataGridTouchEvent(event)) {
    if (typeof touchIdentifier === "number") {
      return (
        findTouchClientX(event.touches, touchIdentifier) ??
        findTouchClientX(event.changedTouches, touchIdentifier)
      )
    }

    return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX
  }

  return event.clientX
}

function startDataGridColumnResizeOnEnd<TData>(
  event: DataGridResizeStartEvent,
  header: Header<TData, unknown>,
  table: Table<TData>
): (() => void) | undefined {
  const column = table.getColumn(header.column.id)

  if (!column || !column.getCanResize()) return
  const isTouchSession = isDataGridTouchEvent(event)
  if (isTouchSession && event.touches.length > 1) return

  event.persist?.()

  const ownerDocument = event.currentTarget.ownerDocument
  const ownerWindow = ownerDocument.defaultView
  const previousBodyCursor = ownerDocument.body.style.cursor
  const previousDocumentCursor = ownerDocument.documentElement.style.cursor
  const startSize = header.getSize()
  // Track the initiating finger so a second touch cannot move or commit the
  // resize with the wrong clientX.
  const touchIdentifier = isTouchSession
    ? event.touches[0]?.identifier
    : undefined
  const dragStartClientX = getDataGridResizeEventClientX(event, touchIdentifier)
  const headerCell = event.currentTarget.closest("th")
  const headerRect = headerCell?.getBoundingClientRect()
  const startOffset =
    headerRect &&
    Number.isFinite(
      table.options.columnResizeDirection === "rtl"
        ? headerRect.left
        : headerRect.right
    )
      ? table.options.columnResizeDirection === "rtl"
        ? headerRect.left
        : headerRect.right
      : dragStartClientX

  if (typeof dragStartClientX !== "number" || typeof startOffset !== "number") {
    return
  }

  ownerDocument.body.style.cursor = "col-resize"
  ownerDocument.documentElement.style.cursor = "col-resize"

  const columnSizingStart = header
    .getLeafHeaders()
    .map(
      (leafHeader) =>
        [leafHeader.column.id, leafHeader.column.getSize()] as [string, number]
    )
  const directionMultiplier =
    table.options.columnResizeDirection === "rtl" ? -1 : 1

  // Clamp the drag to the leaf columns' min/max sizes so the preview
  // indicator matches what the commit will produce (no overshoot followed by
  // a snap-back on release). columnDef always carries resolved defaults.
  let minDeltaPercentage = -0.999999
  let maxDeltaPercentage = Number.POSITIVE_INFINITY
  columnSizingStart.forEach(([columnId, headerSize]) => {
    if (headerSize <= 0) return

    const leafColumn = table.getColumn(columnId)
    const minSize = leafColumn?.columnDef.minSize
    const maxSize = leafColumn?.columnDef.maxSize

    if (typeof minSize === "number") {
      minDeltaPercentage = Math.max(
        minDeltaPercentage,
        minSize / headerSize - 1
      )
    }
    if (typeof maxSize === "number" && Number.isFinite(maxSize)) {
      maxDeltaPercentage = Math.min(
        maxDeltaPercentage,
        maxSize / headerSize - 1
      )
    }
  })

  let lastClientX = dragStartClientX
  let ended = false
  const stopListeners: Array<() => void> = []

  const updateOffset = (clientXPos?: number, commit = false) => {
    if (typeof clientXPos !== "number") return

    lastClientX = clientXPos

    const nextColumnSizing: Record<string, number> = {}
    const deltaPercentage = Math.min(
      Math.max(
        ((clientXPos - dragStartClientX) * directionMultiplier) / startSize,
        minDeltaPercentage
      ),
      maxDeltaPercentage
    )
    const deltaOffset = deltaPercentage * startSize

    columnSizingStart.forEach(([columnId, headerSize]) => {
      nextColumnSizing[columnId] =
        Math.round(
          Math.max(headerSize + headerSize * deltaPercentage, 0) * 100
        ) / 100
    })

    table.setColumnSizingInfo((old) => ({
      ...old,
      startOffset,
      startSize,
      deltaOffset,
      deltaPercentage,
      columnSizingStart,
      isResizingColumn: column.id,
    }))

    if (commit) {
      table.setColumnSizing((old) => ({
        ...old,
        ...nextColumnSizing,
      }))
    }
  }

  // Single teardown path: commits at the given position, removes every
  // document/window listener, and restores cursors. Safe to call more than
  // once (blur + mouseup + unmount can race).
  const endResize = (clientXPos?: number) => {
    if (ended) return
    ended = true

    stopListeners.forEach((stop) => stop())
    updateOffset(clientXPos, true)
    table.setColumnSizingInfo((old) => ({
      ...old,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      columnSizingStart: [],
    }))
    ownerDocument.body.style.cursor = previousBodyCursor
    ownerDocument.documentElement.style.cursor = previousDocumentCursor
  }

  const mouseMoveHandler = (moveEvent: globalThis.MouseEvent) => {
    updateOffset(moveEvent.clientX)
  }
  const mouseUpHandler = (upEvent: globalThis.MouseEvent) => {
    endResize(upEvent.clientX)
  }
  const touchMoveHandler = (moveEvent: globalThis.TouchEvent) => {
    if (moveEvent.cancelable) {
      moveEvent.preventDefault()
      moveEvent.stopPropagation()
    }

    updateOffset(getDataGridResizeEventClientX(moveEvent, touchIdentifier))
  }
  const touchEndHandler = (endEvent: globalThis.TouchEvent) => {
    // Ignore other fingers lifting; only the initiating touch ends the drag.
    const clientXPos =
      typeof touchIdentifier === "number"
        ? findTouchClientX(endEvent.changedTouches, touchIdentifier)
        : getDataGridResizeEventClientX(endEvent)

    if (typeof clientXPos !== "number") return

    if (endEvent.cancelable) {
      endEvent.preventDefault()
      endEvent.stopPropagation()
    }

    endResize(clientXPos)
  }
  // System-interrupted gestures and window focus loss would otherwise leave
  // the session (and its document listeners) live with no pointer held.
  const touchCancelHandler = () => {
    endResize(lastClientX)
  }
  const windowBlurHandler = () => {
    endResize(lastClientX)
  }

  const passiveIfSupported = { passive: false } as const

  if (isTouchSession) {
    ownerDocument.addEventListener(
      "touchmove",
      touchMoveHandler,
      passiveIfSupported
    )
    ownerDocument.addEventListener(
      "touchend",
      touchEndHandler,
      passiveIfSupported
    )
    ownerDocument.addEventListener("touchcancel", touchCancelHandler)
    stopListeners.push(() => {
      ownerDocument.removeEventListener("touchmove", touchMoveHandler)
      ownerDocument.removeEventListener("touchend", touchEndHandler)
      ownerDocument.removeEventListener("touchcancel", touchCancelHandler)
    })
  } else {
    ownerDocument.addEventListener(
      "mousemove",
      mouseMoveHandler,
      passiveIfSupported
    )
    ownerDocument.addEventListener(
      "mouseup",
      mouseUpHandler,
      passiveIfSupported
    )
    stopListeners.push(() => {
      ownerDocument.removeEventListener("mousemove", mouseMoveHandler)
      ownerDocument.removeEventListener("mouseup", mouseUpHandler)
    })
  }

  if (ownerWindow) {
    ownerWindow.addEventListener("blur", windowBlurHandler)
    stopListeners.push(() =>
      ownerWindow.removeEventListener("blur", windowBlurHandler)
    )
  }

  table.setColumnSizingInfo((old) => ({
    ...old,
    startOffset,
    startSize,
    deltaOffset: 0,
    deltaPercentage: 0,
    columnSizingStart,
    isResizingColumn: column.id,
  }))

  return () => endResize(lastClientX)
}

type DataGridTablePinnedBoundary = "top" | "bottom"

function getDataGridTableRowSections<TData>(
  table: Table<TData>,
  rowsPinnable?: boolean
) {
  if (!rowsPinnable) {
    return {
      topRows: [] as Row<TData>[],
      centerRows: table.getRowModel().rows as Row<TData>[],
      bottomRows: [] as Row<TData>[],
    }
  }

  return {
    topRows: table.getTopRows() as Row<TData>[],
    centerRows: table.getCenterRows() as Row<TData>[],
    bottomRows: table.getBottomRows() as Row<TData>[],
  }
}

function getDataGridTableResolvedRows<TData>(
  table: Table<TData>,
  rowsPinnable?: boolean
) {
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    rowsPinnable
  )
  const resolvedRows: Array<{
    row: Row<TData>
    pinnedBoundary?: DataGridTablePinnedBoundary
  }> = []

  topRows.forEach((row, index) => {
    resolvedRows.push({
      row,
      pinnedBoundary:
        index === topRows.length - 1 &&
        (centerRows.length > 0 || bottomRows.length > 0)
          ? "top"
          : undefined,
    })
  })

  centerRows.forEach((row) => {
    resolvedRows.push({ row })
  })

  bottomRows.forEach((row, index) => {
    resolvedRows.push({
      row,
      pinnedBoundary:
        index === 0 && (centerRows.length > 0 || topRows.length > 0)
          ? "bottom"
          : undefined,
    })
  })

  return resolvedRows
}

function getDataGridTableOrderedVisibleColumns<TData>(table: Table<TData>) {
  return [
    ...table.getLeftVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getRightVisibleLeafColumns(),
  ] as Column<TData>[]
}

function getDataGridTableOrderedVisibleCells<TData>(row: Row<TData>) {
  return [
    ...row.getLeftVisibleCells(),
    ...row.getCenterVisibleCells(),
    ...row.getRightVisibleCells(),
  ] as Cell<TData, unknown>[]
}

function getDataGridTableMergedHeaderGroups<TData>(table: Table<TData>) {
  const leftHeaderGroups = table.getLeftHeaderGroups()
  const centerHeaderGroups = table.getCenterHeaderGroups()
  const rightHeaderGroups = table.getRightHeaderGroups()
  const headerGroupCount = Math.max(
    leftHeaderGroups.length,
    centerHeaderGroups.length,
    rightHeaderGroups.length
  )

  return Array.from({ length: headerGroupCount }, (_, index) => {
    const leftGroup = leftHeaderGroups[index]
    const centerGroup = centerHeaderGroups[index]
    const rightGroup = rightHeaderGroups[index]

    return {
      id:
        [leftGroup?.id, centerGroup?.id, rightGroup?.id]
          .filter(Boolean)
          .join(":") || `header-group-${index}`,
      headers: [
        ...(leftGroup?.headers ?? []),
        ...(centerGroup?.headers ?? []),
        ...(rightGroup?.headers ?? []),
      ] as Header<TData, unknown>[],
    }
  })
}

function hasDataGridTableRightPinnedColumns<TData>(table: Table<TData>) {
  return (table.getState().columnPinning.right?.length ?? 0) > 0
}

function DataGridTableFillCol() {
  const { props } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <col
      data-slot="data-grid-table-fill-col"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  )
}

function DataGridTableFillHeadCell() {
  const { props } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <th
      aria-hidden="true"
      data-slot="data-grid-table-fill-head-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
      className={cn("p-0", props.tableLayout?.headerBackground && "bg-muted")}
    />
  )
}

function DataGridTableFillBodyCell() {
  const { props } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <td
      aria-hidden="true"
      data-slot="data-grid-table-fill-body-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
      className="p-0"
    />
  )
}

function DataGridTableFillFootCell() {
  const { props } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <td
      aria-hidden="true"
      data-slot="data-grid-table-fill-foot-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
      className="p-0"
    />
  )
}

function DataGridTableBase({ children }: { children: ReactNode }) {
  const { props, table } = useDataGrid()
  const leftVisibleColumns = table.getLeftVisibleLeafColumns()
  const centerVisibleColumns = table.getCenterVisibleLeafColumns()
  const rightVisibleColumns = table.getRightVisibleLeafColumns()
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)

  /**
   * Compute column widths as CSS custom properties once upfront (memoized).
   * Cells reference these via calc(var(--col-X-size) * 1px) so the browser
   * handles width propagation without per-cell getSize() calls or React
   * re-renders of the body.
   */
  const columnSizeVars = useMemo(() => {
    if (!props.tableLayout?.columnsResizable) return undefined
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.tableLayout?.columnsResizable,
    // Visibility/order/pinning change the flat header set, so a column shown
    // after mount must get its size variable even though sizing is untouched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.getState().columnSizing,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.getState().columnVisibility,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.getState().columnOrder,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.getState().columnPinning,
  ])

  return (
    <table
      data-slot="data-grid-table"
      className={cn(
        "text-foreground caption-bottom text-left align-middle text-sm font-normal rtl:text-right",
        props.tableLayout?.columnsResizable ? "min-w-0" : "w-full min-w-full",
        props.tableLayout?.width === "auto" ? "table-auto" : "table-fixed",
        !props.tableLayout?.columnsResizable && "",
        !props.tableLayout?.columnsDraggable &&
          "border-separate border-spacing-0",
        props.tableClassNames?.base
      )}
      style={
        props.tableLayout?.columnsResizable
          ? {
              ...columnSizeVars,
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`,
            }
          : undefined
      }
    >
      <colgroup>
        {[...leftVisibleColumns, ...centerVisibleColumns].map((column) => (
          <col
            key={column.id}
            style={
              props.tableLayout?.columnsResizable
                ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
                : props.tableLayout?.width === "fixed"
                  ? { width: column.getSize() }
                  : undefined
            }
          />
        ))}
        {hasRightPinnedColumns ? <DataGridTableFillCol /> : null}
        {rightVisibleColumns.map((column) => (
          <col
            key={column.id}
            style={
              props.tableLayout?.columnsResizable
                ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
                : props.tableLayout?.width === "fixed"
                  ? { width: column.getSize() }
                  : undefined
            }
          />
        ))}
        {!hasRightPinnedColumns ? <DataGridTableFillCol /> : null}
      </colgroup>
      {children}
    </table>
  )
}

function DataGridTableViewport({
  children,
  className,
  viewportRef,
  style,
}: {
  children: ReactNode
  className?: string
  viewportRef?: Ref<HTMLDivElement>
  style?: CSSProperties
}) {
  const { props, table, autoSize } = useDataGrid()
  const isColumnsResizable = !!props.tableLayout?.columnsResizable
  const viewportNodeRef = useRef<HTMLDivElement | null>(null)
  const fillStateRef = useRef({ containerWidth: 0, appliedFill: -1 })
  const stopContainerObserverRef = useRef<(() => void) | null>(null)

  // Free space is written as a CSS variable directly on the viewport node
  // instead of React state, so container resizes and column-size commits
  // reach the fill column without re-rendering the grid.
  const syncFillWidth = useCallback(() => {
    const node = viewportNodeRef.current
    if (!node) return

    const fillWidth = Math.max(
      0,
      fillStateRef.current.containerWidth - table.getTotalSize()
    )

    if (fillStateRef.current.appliedFill !== fillWidth) {
      fillStateRef.current.appliedFill = fillWidth
      node.style.setProperty("--data-grid-fill-size", `${fillWidth}px`)
    }

    autoSize?.apply(fillWidth)
  }, [autoSize, table])

  const handleViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      stopContainerObserverRef.current?.()
      stopContainerObserverRef.current = null
      viewportNodeRef.current = node
      assignRef(viewportRef, node)

      if (!node) return

      if (!isColumnsResizable) {
        fillStateRef.current.appliedFill = -1
        node.style.removeProperty("--data-grid-fill-size")
        return
      }

      const scrollViewport =
        getDataGridScrollAreaViewport(node) ?? node.parentElement
      const measurementTarget = scrollViewport ?? node

      const measure = () => {
        fillStateRef.current.containerWidth = measurementTarget.clientWidth
        syncFillWidth()
      }

      // First measure runs inside the mount commit, before paint, so the fill
      // column and any meta.autoSize growth land in the first painted frame.
      measure()

      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(measure)
        observer.observe(measurementTarget)
        stopContainerObserverRef.current = () => observer.disconnect()
      }
    },
    [isColumnsResizable, syncFillWidth, viewportRef]
  )

  // Column sizing commits and visibility changes alter the table's total size
  // without moving the container, so the fill var must re-sync after renders
  // the ResizeObserver never sees. No-ops when the value is unchanged.
  useLayoutEffect(() => {
    if (!isColumnsResizable) return
    syncFillWidth()
  })

  return (
    <div
      data-slot="data-grid-table-viewport"
      ref={handleViewportRef}
      className={cn("relative min-w-full align-top", className)}
      style={{
        ...(isColumnsResizable
          ? {
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`,
            }
          : undefined),
        ...style,
      }}
    >
      {children}
      <DataGridTableResizeIndicator viewportNodeRef={viewportNodeRef} />
    </div>
  )
}

function DataGridTableHead({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()

  return (
    <thead
      className={cn(
        props.tableClassNames?.header,
        props.tableLayout?.headerSticky && props.tableClassNames?.headerSticky
      )}
    >
      {children}
    </thead>
  )
}

function DataGridTableHeadRow({
  children,
  rowId,
}: {
  children: ReactNode
  rowId: string
}) {
  const { props } = useDataGrid()

  return (
    <tr
      className={cn(
        props.tableLayout?.headerBorder && "[&>th]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped && "bg-transparent",
        props.tableLayout?.headerBackground === false && "bg-transparent",
        props.tableClassNames?.headerRow
      )}
    >
      {children}
    </tr>
  )
}

function DataGridTableHeadRowCell<TData>({
  children,
  header,
  dndRef,
  dndStyle,
}: {
  children: ReactNode
  header: Header<TData, unknown>
  dndRef?: React.Ref<HTMLTableCellElement>
  dndStyle?: CSSProperties
}) {
  const { props } = useDataGrid()

  const { column } = header
  const isPinned = column.getIsPinned()
  const isFirstLeftPinned =
    isPinned === "left" && column.getIsFirstColumn("left")
  const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left")
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right")
  const isLastRightPinned =
    isPinned === "right" && column.getIsLastColumn("right")
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1
  const headerCellSpacing = headerCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })

  const sortDirection = column.getIsSorted()

  return (
    <th
      ref={dndRef}
      scope="col"
      colSpan={header.colSpan > 1 ? header.colSpan : undefined}
      aria-sort={
        sortDirection === "asc"
          ? "ascending"
          : sortDirection === "desc"
            ? "descending"
            : undefined
      }
      style={{
        ...(props.tableLayout?.width === "fixed" &&
          !props.tableLayout?.columnsResizable && {
            width: header.getSize(),
          }),
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--header-${header.id}-size) * 1px)`,
        }),
        ...(dndStyle ? dndStyle : null),
      }}
      data-pinned={isPinned || undefined}
      data-outer-pinned-col={
        isFirstLeftPinned ? "left" : isLastRightPinned ? "right" : undefined
      }
      data-last-col={
        isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
      }
      className={cn(
        "text-foreground relative h-10 text-left align-middle font-medium rtl:text-right [&:has([role=checkbox])]:pe-0",
        headerCellSpacing,
        props.tableLayout?.headerBackground && "bg-muted",
        props.tableLayout?.cellBorder && "border-e",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          (isPinned ? "overflow-hidden" : "overflow-visible"),
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          isLastVisibleColumn &&
          "pe-8",
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          cn(
            "data-pinned:bg-muted data-outer-pinned-col:bg-clip-padding data-pinned:isolate",
            "[&[data-pinned=left][data-last-col=left]]:shadow-[inset_-1px_0_0_0_var(--border)] [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:shadow-[inset_1px_0_0_0_var(--border)]",
            "[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0"
          ),
        header.column.columnDef.meta?.headerClassName,
        // Edge detection spans the full visible leaf order; the header's own
        // group only covers one pinning bucket.
        column.getIndex() === 0 || isLastVisibleColumn
          ? props.tableClassNames?.edgeCell
          : ""
      )}
    >
      {children}
    </th>
  )
}

function DataGridTableHeadRowCellResize<TData>({
  header,
}: {
  header: Header<TData, unknown>
}) {
  const { props, table } = useDataGrid()
  const { column } = header
  const isPinned = column.getIsPinned()
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1
  const isResizeModeOnEnd =
    (props.tableLayout?.columnsResizeMode ?? table.options.columnResizeMode) ===
    "onEnd"
  const stopResizeSessionRef = useRef<(() => void) | undefined>(undefined)

  // End a live drag if the handle unmounts mid-resize so document listeners
  // and the app-wide col-resize cursor don't outlive the grid.
  useEffect(() => {
    return () => {
      stopResizeSessionRef.current?.()
      stopResizeSessionRef.current = undefined
    }
  }, [])

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    // Only the primary button starts a resize; guard before preventDefault so
    // right-click still opens the context menu.
    if (event.button !== 0) return

    event.preventDefault()
    event.stopPropagation()

    if (isResizeModeOnEnd) {
      stopResizeSessionRef.current?.()
      stopResizeSessionRef.current = startDataGridColumnResizeOnEnd(
        event,
        header,
        table
      )
      return
    }

    header.getResizeHandler()(event)
  }

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isResizeModeOnEnd) {
      stopResizeSessionRef.current?.()
      stopResizeSessionRef.current = startDataGridColumnResizeOnEnd(
        event,
        header,
        table
      )
      return
    }

    header.getResizeHandler()(event)
  }

  return (
    <div
      {...{
        onDoubleClick: () => column.resetSize(),
        onMouseDown: handleMouseDown,
        onTouchStart: handleTouchStart,
        className: cn(
          "absolute top-0 h-full cursor-col-resize user-select-none touch-none z-10 flex",
          isLastVisibleColumn
            ? "end-0 w-5 justify-end before:hidden"
            : isPinned
              ? "end-0 w-5 justify-end before:hidden"
              : "-end-2 w-5 justify-center before:absolute before:inset-y-0 before:w-px before:-translate-x-px before:bg-border",
          column.getIsResizing() &&
            (isResizeModeOnEnd
              ? "opacity-100"
              : isLastVisibleColumn
                ? "before:absolute before:end-0 before:block before:inset-y-0 before:w-0.5 before:bg-primary opacity-100"
                : "before:block before:bg-primary before:w-0.5 opacity-100")
        ),
      }}
    />
  )
}

function DataGridTableResizeIndicator({
  viewportNodeRef,
}: {
  viewportNodeRef: RefObject<HTMLDivElement | null>
}) {
  const { props, table } = useDataGrid()
  const indicatorRef = useRef<HTMLDivElement | null>(null)
  const indicatorHeadRef = useRef<HTMLDivElement | null>(null)
  // Header height is stable for the duration of a drag; caching it per
  // session avoids a forced layout (querySelector + getBoundingClientRect)
  // on every mousemove.
  const headerHeightCacheRef = useRef<{
    key: string | false
    value: number
  }>({ key: false, value: 0 })
  const columnSizingInfo = table.getState().columnSizingInfo
  const resizingColumnId = columnSizingInfo.isResizingColumn
  const resizeMode =
    props.tableLayout?.columnsResizeMode ?? table.options.columnResizeMode
  const isActive = !!(
    props.tableLayout?.columnsResizable &&
    resizeMode === "onEnd" &&
    resizingColumnId
  )

  // Positioning happens imperatively after each drag-frame render: layout
  // reads (viewport rect, thead height) and ref access belong outside render,
  // and writing styles directly avoids holding the viewport node in React
  // state, which would cost every grid a second render pass at mount.
  useLayoutEffect(() => {
    const indicator = indicatorRef.current
    const indicatorHead = indicatorHeadRef.current
    const viewportElement = viewportNodeRef.current

    if (!isActive || !indicator || !indicatorHead || !resizingColumnId) return

    const resizingHeader = table
      .getFlatHeaders()
      .find(
        (header) =>
          header.column.id === resizingColumnId ||
          header.id === resizingColumnId
      )

    if (!resizingHeader) return

    // deltaOffset is a logical delta (already direction-adjusted); translate
    // by the physical pointer movement so the indicator follows the cursor
    // in RTL instead of mirroring it.
    const directionMultiplier =
      table.options.columnResizeDirection === "rtl" ? -1 : 1
    const deltaOffset =
      (columnSizingInfo.deltaOffset ?? 0) * directionMultiplier

    if (headerHeightCacheRef.current.key !== resizingColumnId) {
      headerHeightCacheRef.current = {
        key: resizingColumnId,
        value:
          viewportElement
            ?.querySelector('[data-slot="data-grid-table"] thead')
            ?.getBoundingClientRect().height ?? 0,
      }
    }

    const headerHeight = headerHeightCacheRef.current.value
    const indicatorLeft =
      typeof columnSizingInfo.startOffset === "number" && viewportElement
        ? columnSizingInfo.startOffset -
          viewportElement.getBoundingClientRect().left
        : resizingHeader.getStart() + resizingHeader.getSize()

    indicator.style.left = `${indicatorLeft}px`
    indicator.style.transform = `translateX(${deltaOffset}px)`
    indicatorHead.style.height = `${Math.max(headerHeight, 6)}px`
  })

  if (!isActive) return null

  return (
    <div
      ref={indicatorRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-20"
    >
      <div className="bg-primary/85 absolute inset-y-0 left-0 w-px -translate-x-1/2" />
      <div
        ref={indicatorHeadRef}
        className="bg-primary style-vega:rounded-b-sm style-nova:rounded-b-sm style-maia:rounded-b-md style-lyra:rounded-b-none style-mira:rounded-b-sm style-luma:rounded-b-lg style-sera:rounded-b-none style-rhea:rounded-b-lg absolute top-0 left-0 -translate-x-1/2 shadow-xs"
        style={{ width: 5 }}
      />
    </div>
  )
}

function DataGridTableRowSpacer() {
  return (
    <tbody
      aria-hidden="true"
      className="h-2"
      data-slot="data-grid-table-body-spacer"
    ></tbody>
  )
}

function DataGridTableBody({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()

  return (
    <tbody
      data-slot="data-grid-table-body"
      className={cn(
        props.tableLayout?.rowRounded &&
          "style-vega:[&_td:first-child]:rounded-l-lg style-nova:[&_td:first-child]:rounded-l-lg style-maia:[&_td:first-child]:rounded-l-2xl style-lyra:[&_td:first-child]:rounded-l-none style-mira:[&_td:first-child]:rounded-l-lg style-luma:[&_td:first-child]:rounded-l-3xl style-sera:[&_td:first-child]:rounded-l-none style-rhea:[&_td:first-child]:rounded-l-2xl",
        props.tableLayout?.rowRounded &&
          "style-vega:[&_td:last-child]:rounded-r-lg style-nova:[&_td:last-child]:rounded-r-lg style-maia:[&_td:last-child]:rounded-r-2xl style-lyra:[&_td:last-child]:rounded-r-none style-mira:[&_td:last-child]:rounded-r-lg style-luma:[&_td:last-child]:rounded-r-3xl style-sera:[&_td:last-child]:rounded-r-none style-rhea:[&_td:last-child]:rounded-r-2xl",
        props.tableClassNames?.body
      )}
    >
      {children}
    </tbody>
  )
}

function DataGridTableFoot({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()
  return (
    <tfoot
      data-slot="data-grid-table-foot"
      className={cn(props.tableClassNames?.footer)}
    >
      {children}
    </tfoot>
  )
}

function DataGridTableFootRow({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()
  const footRowBottomBorderClasses = "[&:not(:last-child)>td]:border-b"

  return (
    <tr
      data-slot="data-grid-table-foot-row"
      className={cn(
        props.tableLayout?.footerBackground && "bg-muted/40 dark:bg-background",
        props.tableLayout?.rowBorder && footRowBottomBorderClasses,
        props.tableLayout?.cellBorder && "*:last:border-e-0"
      )}
    >
      {children}
      <DataGridTableFillFootCell />
    </tr>
  )
}

function DataGridTableFootRowCell({
  children,
  colSpan,
  className,
}: {
  children?: ReactNode
  colSpan?: number
  className?: string
}) {
  const { props } = useDataGrid()
  const spacing = footerCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "text-secondary-foreground/80 align-middle font-medium",
        spacing,
        props.tableLayout?.footerBackground && "bg-muted/40 dark:bg-background",
        props.tableLayout?.cellBorder && "border-e",
        className
      )}
    >
      {children}
    </td>
  )
}

function DataGridTableBodyRowSkeleton({ children }: { children: ReactNode }) {
  const { table, props } = useDataGrid()

  return (
    <tr
      className={cn(
        "hover:bg-muted/40 data-[state=selected]:bg-muted/50",
        props.onRowClick && "cursor-pointer",
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          "border-border border-b [&:not(:last-child)>td]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped &&
          "odd:bg-muted/90 odd:hover:bg-muted hover:bg-transparent",
        table.options.enableRowSelection && "*:first:relative",
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
    </tr>
  )
}

function DataGridTableBodyRowSkeletonCell<TData>({
  children,
  column,
}: {
  children: ReactNode
  column: Column<TData>
}) {
  const { props, table } = useDataGrid()
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })

  return (
    <td
      style={
        props.tableLayout?.columnsResizable
          ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
          : undefined
      }
      className={cn(
        "align-middle",
        bodyCellSpacing,
        props.tableLayout?.cellBorder && "border-e",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          "truncate",
        column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          "data-pinned:bg-background data-pinned:isolate [&[data-pinned=left][data-last-col=left]]:shadow-[inset_-1px_0_0_0_var(--border)] [&[data-pinned=right][data-last-col=right]]:shadow-[inset_1px_0_0_0_var(--border)]",
        column.getIndex() === 0 ||
          column.getIndex() === table.getVisibleLeafColumns().length - 1
          ? props.tableClassNames?.edgeCell
          : ""
      )}
    >
      {children}
    </td>
  )
}

function DataGridTableBodyRow<TData>({
  children,
  row,
  pinnedBoundary,
  rowRef,
  dndRef,
  dndStyle,
  dataIndex,
}: {
  children: ReactNode
  row: Row<TData>
  pinnedBoundary?: DataGridTablePinnedBoundary
  rowRef?: React.Ref<HTMLTableRowElement>
  dndRef?: React.Ref<HTMLTableRowElement>
  dndStyle?: CSSProperties
  dataIndex?: number
}) {
  const { props, table } = useDataGrid()
  const isRowPinned = row.getIsPinned()

  const bodyRowBottomBorderClasses =
    "[&:not(:last-child)>td]:border-b [tbody:has(+tfoot)_&:last-child>td]:border-b [*:has(>[data-slot=data-grid]+[data-slot=data-grid-pagination])_[data-slot=data-grid]_&:last-child>td]:border-b"

  return (
    <tr
      ref={(node) => {
        assignRef(rowRef, node)
        assignRef(dndRef, node)
      }}
      style={{ ...(dndStyle ? dndStyle : null) }}
      data-state={
        table.options.enableRowSelection && row.getIsSelected()
          ? "selected"
          : undefined
      }
      data-index={dataIndex}
      data-row-pinned={isRowPinned || undefined}
      data-row-pinned-boundary={pinnedBoundary}
      onClick={() => props.onRowClick && props.onRowClick(row.original)}
      className={cn(
        "hover:bg-muted/40 data-[state=selected]:bg-muted/50",
        props.onRowClick && "cursor-pointer",
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          bodyRowBottomBorderClasses,
        props.tableLayout?.cellBorder &&
          `*:last:border-e-0 ${bodyRowBottomBorderClasses}`,
        // Virtualized rows stripe by absolute row index (CSS :nth-child
        // parity flips as spacer rows resize while scrolling).
        props.tableLayout?.stripped &&
          (typeof dataIndex === "number"
            ? cn(
                "hover:bg-transparent",
                dataIndex % 2 === 0 && "bg-muted/90 hover:bg-muted"
              )
            : "odd:bg-muted/90 odd:hover:bg-muted hover:bg-transparent"),
        table.options.enableRowSelection && "*:first:relative",
        props.tableLayout?.rowsPinnable &&
          isRowPinned &&
          "bg-muted/30 hover:bg-muted/50",
        pinnedBoundary === "top" &&
          "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)] dark:[&>td]:shadow-[0_2px_0_rgba(255,255,255,0.06)]",
        pinnedBoundary === "bottom" &&
          "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)] dark:[&>td]:shadow-[0_2px_0_rgba(255,255,255,0.06)]",
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
    </tr>
  )
}

function DataGridTableBodyRowExpandded<TData>({ row }: { row: Row<TData> }) {
  const { props, table } = useDataGrid()
  const bodyRowBottomBorderClasses =
    "[&:not(:last-child)>td]:border-b [tbody:has(+tfoot)_&:last-child>td]:border-b [*:has(>[data-slot=data-grid]+[data-slot=data-grid-pagination])_[data-slot=data-grid]_&:last-child>td]:border-b"

  return (
    <tr
      className={cn(props.tableLayout?.rowBorder && bodyRowBottomBorderClasses)}
    >
      <td
        colSpan={
          getDataGridTableOrderedVisibleCells(row).length +
          (props.tableLayout?.columnsResizable ? 1 : 0)
        }
      >
        {table
          .getAllColumns()
          .find((column) => column.columnDef.meta?.expandedContent)
          ?.columnDef.meta?.expandedContent?.(row.original)}
      </td>
    </tr>
  )
}

function DataGridTableBodyRowCell<TData>({
  children,
  cell,
  dndRef,
  dndStyle,
}: {
  children: ReactNode
  cell: Cell<TData, unknown>
  dndRef?: React.Ref<HTMLTableCellElement>
  dndStyle?: CSSProperties
}) {
  const { props } = useDataGrid()

  const { column, row } = cell
  const isPinned = column.getIsPinned()
  const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left")
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right")
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })

  return (
    <td
      ref={dndRef}
      style={{
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--col-${column.id}-size) * 1px)`,
        }),
        ...(dndStyle ? dndStyle : null),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={
        isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
      }
      className={cn(
        "align-middle",
        bodyCellSpacing,
        props.tableLayout?.cellBorder && "border-e",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          "truncate",
        cell.column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          cn(
            "data-pinned:bg-background data-pinned:isolate",
            "[&[data-pinned=left][data-last-col=left]]:shadow-[inset_-1px_0_0_0_var(--border)]",
            "[&[data-pinned=right][data-last-col=right]]:shadow-[inset_1px_0_0_0_var(--border)]"
          ),
        column.getIndex() === 0 ||
          column.getIndex() === row.getVisibleCells().length - 1
          ? props.tableClassNames?.edgeCell
          : ""
      )}
    >
      {children}
    </td>
  )
}

function DataGridTableRenderedRow<TData>({
  row,
  pinnedBoundary,
  rowRef,
  rowIndex,
}: {
  row: Row<TData>
  pinnedBoundary?: DataGridTablePinnedBoundary
  rowRef?: React.Ref<HTMLTableRowElement>
  /** Virtualized list index, rendered as data-index for measureElement. */
  rowIndex?: number
}) {
  const { props, table } = useDataGrid()
  const leftVisibleCells = row.getLeftVisibleCells()
  const centerVisibleCells = row.getCenterVisibleCells()
  const rightVisibleCells = row.getRightVisibleCells()
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)

  return (
    <Fragment>
      <DataGridTableBodyRow
        row={row}
        pinnedBoundary={pinnedBoundary}
        rowRef={rowRef}
        dataIndex={rowIndex}
      >
        {[...leftVisibleCells, ...centerVisibleCells].map(
          (cell: Cell<TData, unknown>) => (
            <DataGridTableBodyRowCell cell={cell} key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DataGridTableBodyRowCell>
          )
        )}
        {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
          <DataGridTableFillBodyCell />
        ) : null}
        {rightVisibleCells.map((cell: Cell<TData, unknown>) => (
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

function DataGridTableEmpty() {
  const { table, props } = useDataGrid()
  const visibleColumnCount =
    getDataGridTableOrderedVisibleColumns(table).length +
    (props.tableLayout?.columnsResizable ? 1 : 0)

  return (
    <tr>
      <td
        colSpan={Math.max(visibleColumnCount, 1)}
        className="text-muted-foreground py-6 text-center text-sm"
      >
        {props.emptyMessage || "No data available"}
      </td>
    </tr>
  )
}

function DataGridTableLoader() {
  const { props } = useDataGrid()

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="text-muted-foreground bg-card style-vega:rounded-lg style-nova:rounded-lg style-maia:rounded-2xl style-lyra:rounded-none style-mira:rounded-lg style-luma:rounded-3xl style-sera:rounded-none style-rhea:rounded-2xl flex items-center gap-2 border px-4 py-2 text-sm leading-none font-medium">
        <Spinner className="size-5 opacity-60" />
        {props.loadingMessage || "Loading..."}
      </div>
    </div>
  )
}

function DataGridTableRowPin<TData>({ row }: { row: Row<TData> }) {
  const isPinned = row.getIsPinned()

  return (
    <button
      type="button"
      aria-label={isPinned ? "Unpin row" : "Pin row"}
      onClick={(event) => {
        // Pinning must not bubble into the row's onRowClick handler.
        event.stopPropagation()

        if (isPinned) {
          row.pin(false)
        } else {
          row.pin("top")
        }
      }}
      className={cn(
        "text-muted-foreground hover:text-foreground style-vega:rounded-md style-nova:rounded-lg style-maia:rounded-full style-lyra:rounded-none style-mira:rounded-md style-luma:rounded-full style-sera:rounded-none style-rhea:rounded-full inline-flex size-7 items-center justify-center transition-colors",
        isPinned && "text-primary hover:text-primary/80"
      )}
    >
      {isPinned ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <path d="M16 2l4.585 4.586-2.122 2.121L17.05 7.293l-3.535 3.536 1.413 5.658-2.12 2.121-4.244-4.243L4.322 18.6l-1.414-1.41 4.242-4.244-4.243-4.243 2.122-2.121 5.656 1.414 3.536-3.536-1.414-1.414z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="17" x2="12" y2="22" />
          <path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24z" />
        </svg>
      )}
    </button>
  )
}

function DataGridTableRowSelect<TData>({ row }: { row: Row<TData> }) {
  return (
    <>
      <div
        className={cn(
          "bg-primary absolute inset-s-0 top-0 bottom-0 hidden w-[2px]",
          row.getIsSelected() && "block"
        )}
      ></div>
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(event) => {
          // Selection must not bubble into the row's onRowClick handler.
          event.stopPropagation()
        }}
        aria-label="Select row"
        className="align-[inherit]"
      />
    </>
  )
}

function DataGridTableRowSelectAll() {
  const { table, recordCount, isLoading } = useDataGrid()

  const isAllSelected = table.getIsAllPageRowsSelected()
  const isSomeSelected = table.getIsSomePageRowsSelected()

  return (
    <Checkbox
      checked={
        isSomeSelected && !isAllSelected ? "indeterminate" : isAllSelected
      }
      disabled={isLoading || recordCount === 0}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="align-[inherit]"
    />
  )
}

function DataGridTableBodyRows<TData>({ table }: { table: Table<TData> }) {
  const { isLoading, props } = useDataGrid()
  const pagination = table.getState().pagination

  if (isLoading && props.loadingMode === "skeleton" && pagination?.pageSize) {
    const leftVisibleColumns = table.getLeftVisibleLeafColumns()
    const centerVisibleColumns = table.getCenterVisibleLeafColumns()
    const rightVisibleColumns = table.getRightVisibleLeafColumns()
    const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)

    return (
      <>
        {Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
          <DataGridTableBodyRowSkeleton key={rowIndex}>
            {[...leftVisibleColumns, ...centerVisibleColumns].map((column) => (
              <DataGridTableBodyRowSkeletonCell column={column} key={column.id}>
                {column.columnDef.meta?.skeleton}
              </DataGridTableBodyRowSkeletonCell>
            ))}
            {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
              <DataGridTableFillBodyCell />
            ) : null}
            {rightVisibleColumns.map((column) => (
              <DataGridTableBodyRowSkeletonCell column={column} key={column.id}>
                {column.columnDef.meta?.skeleton}
              </DataGridTableBodyRowSkeletonCell>
            ))}
            {props.tableLayout?.columnsResizable && !hasRightPinnedColumns ? (
              <DataGridTableFillBodyCell />
            ) : null}
          </DataGridTableBodyRowSkeleton>
        ))}
      </>
    )
  }

  if (isLoading && props.loadingMode === "spinner") {
    return (
      <tr>
        <td
          colSpan={
            table.getVisibleFlatColumns().length +
            (props.tableLayout?.columnsResizable ? 1 : 0)
          }
          className="p-8"
        >
          <div className="flex items-center justify-center">
            <svg
              className="text-muted-foreground mr-3 -ml-1 h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {props.loadingMessage || "Loading..."}
          </div>
        </td>
      </tr>
    )
  }

  const resolvedRows = getDataGridTableResolvedRows(
    table,
    props.tableLayout?.rowsPinnable
  )

  if (!resolvedRows.length) return <DataGridTableEmpty />

  return (
    <>
      {resolvedRows.map(({ row, pinnedBoundary }) => (
        <DataGridTableRenderedRow
          key={row.id}
          row={row}
          pinnedBoundary={pinnedBoundary}
        />
      ))}
    </>
  )
}

/**
 * Memoized body rows: skip re-renders during active column resize.
 * Column widths update via CSS variables on the <table> element,
 * so the browser handles width changes without React re-renders.
 */
const MemoizedDataGridTableBodyRows = memo(
  DataGridTableBodyRows,
  (_prev, next) => !!next.table.getState().columnSizingInfo.isResizingColumn
) as typeof DataGridTableBodyRows

function DataGridTableHeader<TData>() {
  const { table, props } = useDataGrid()
  const mergedHeaderGroups = getDataGridTableMergedHeaderGroups(table)
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        <DataGridTableHead>
          {mergedHeaderGroups.map((headerGroup) => {
            return (
              <DataGridTableHeadRow key={headerGroup.id} rowId={headerGroup.id}>
                {headerGroup.headers
                  .filter((header) => header.column.getIsPinned() !== "right")
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
                {props.tableLayout?.columnsResizable &&
                hasRightPinnedColumns ? (
                  <DataGridTableFillHeadCell />
                ) : null}
                {headerGroup.headers
                  .filter((header) => header.column.getIsPinned() === "right")
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
                {props.tableLayout?.columnsResizable &&
                !hasRightPinnedColumns ? (
                  <DataGridTableFillHeadCell />
                ) : null}
              </DataGridTableHeadRow>
            )
          })}
        </DataGridTableHead>
      </DataGridTableBase>
    </DataGridTableViewport>
  )
}

function DataGridTable<TData>({
  footerContent,
  renderHeader = true,
}: {
  footerContent?: ReactNode
  renderHeader?: boolean
}) {
  const { table, props } = useDataGrid()
  const mergedHeaderGroups = getDataGridTableMergedHeaderGroups(table)
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {mergedHeaderGroups.map((headerGroup) => {
              return (
                <DataGridTableHeadRow
                  key={headerGroup.id}
                  rowId={headerGroup.id}
                >
                  {headerGroup.headers
                    .filter((header) => header.column.getIsPinned() !== "right")
                    .map((header) => {
                      const { column } = header

                      return (
                        <DataGridTableHeadRowCell
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
                    })}
                  {props.tableLayout?.columnsResizable &&
                  hasRightPinnedColumns ? (
                    <DataGridTableFillHeadCell />
                  ) : null}
                  {headerGroup.headers
                    .filter((header) => header.column.getIsPinned() === "right")
                    .map((header) => {
                      const { column } = header

                      return (
                        <DataGridTableHeadRowCell
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
                    })}
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
          <MemoizedDataGridTableBodyRows table={table} />
        </DataGridTableBody>

        {footerContent && (
          <DataGridTableFoot>{footerContent}</DataGridTableFoot>
        )}
      </DataGridTableBase>
    </DataGridTableViewport>
  )
}

export {
  DataGridTable,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableRenderedRow,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableFillBodyCell,
  DataGridTableFillHeadCell,
  DataGridTableFoot,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
  DataGridTableHeader,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableLoader,
  DataGridTableRowPin,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  getDataGridScrollAreaViewport,
  getDataGridTableMergedHeaderGroups,
  getPinningStyles,
  getDataGridTableResolvedRows,
  getDataGridTableRowSections,
  hasDataGridTableRightPinnedColumns,
}

export type { DataGridTablePinnedBoundary }
