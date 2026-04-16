"use client"

import {
  CSSProperties,
  Fragment,
  memo,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useDataGrid } from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import {
  Cell,
  Column,
  flexRender,
  Header,
  HeaderGroup,
  Row,
  Table,
} from "@tanstack/react-table"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"
import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Spinner } from "@/registry/bases/base/ui/spinner"

const headerCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense:
        "style-vega:px-2.5 style-vega:h-9 style-maia:px-2.5 style-maia:h-9 style-nova:px-2 style-nova:h-8 style-lyra:px-2 style-lyra:h-8 style-mira:px-2 style-mira:h-7",
      default:
        "style-vega:px-4 style-maia:px-4 style-nova:px-3 style-lyra:px-3 style-mira:px-2.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const bodyCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense:
        "style-vega:px-2.5 style-vega:py-2 style-maia:px-2.5 style-maia:py-2 style-nova:px-2 style-nova:py-1.5 style-lyra:px-2 style-lyra:py-1.5 style-mira:px-2 style-mira:py-1",
      default:
        "style-vega:px-4 style-vega:py-2.5 style-maia:px-4 style-maia:py-2.5 style-nova:px-3 style-nova:py-2 style-lyra:px-3 style-lyra:py-2 style-mira:px-2.5 style-mira:py-1.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const footerCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense:
        "style-vega:px-2.5 style-vega:py-2 style-maia:px-2.5 style-maia:py-2 style-nova:px-2 style-nova:py-1.5 style-lyra:px-2 style-lyra:py-1.5 style-mira:px-2 style-mira:py-1",
      default:
        "style-vega:px-4 style-vega:py-2.5 style-maia:px-4 style-maia:py-2.5 style-nova:px-3 style-nova:py-2 style-lyra:px-3 style-lyra:py-2 style-mira:px-2.5 style-mira:py-1.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function getPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned()

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
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

type DataGridResizeStartEvent =
  | ReactMouseEvent<HTMLDivElement>
  | ReactTouchEvent<HTMLDivElement>

type DataGridResizeDocumentEvent = globalThis.MouseEvent | globalThis.TouchEvent

function isDataGridTouchEvent(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent
): event is ReactTouchEvent<HTMLDivElement> | globalThis.TouchEvent {
  return "touches" in event
}

function getDataGridResizeEventClientX(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent
) {
  if (isDataGridTouchEvent(event)) {
    return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX
  }

  return event.clientX
}

function startDataGridColumnResizeOnEnd<TData>(
  event: DataGridResizeStartEvent,
  header: Header<TData, unknown>,
  table: Table<TData>
) {
  const column = table.getColumn(header.column.id)

  if (!column || !column.getCanResize()) return
  if (isDataGridTouchEvent(event) && event.touches.length > 1) return

  event.persist?.()

  const ownerDocument = event.currentTarget.ownerDocument
  const previousBodyCursor = ownerDocument.body.style.cursor
  const previousDocumentCursor = ownerDocument.documentElement.style.cursor
  const startSize = header.getSize()
  const dragStartClientX = getDataGridResizeEventClientX(event)
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

  const updateOffset = (clientXPos?: number, commit = false) => {
    if (typeof clientXPos !== "number") return

    let nextColumnSizing: Record<string, number> = {}
    const deltaOffset = (clientXPos - dragStartClientX) * directionMultiplier
    const deltaPercentage = Math.max(deltaOffset / startSize, -0.999999)

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

  const endResize = (clientXPos?: number) => {
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
    ownerDocument.removeEventListener("mousemove", mouseMoveHandler)
    ownerDocument.removeEventListener("mouseup", mouseUpHandler)
    endResize(upEvent.clientX)
  }
  const touchMoveHandler = (moveEvent: globalThis.TouchEvent) => {
    if (moveEvent.cancelable) {
      moveEvent.preventDefault()
      moveEvent.stopPropagation()
    }

    updateOffset(getDataGridResizeEventClientX(moveEvent))
  }
  const touchEndHandler = (endEvent: globalThis.TouchEvent) => {
    ownerDocument.removeEventListener("touchmove", touchMoveHandler)
    ownerDocument.removeEventListener("touchend", touchEndHandler)

    if (endEvent.cancelable) {
      endEvent.preventDefault()
      endEvent.stopPropagation()
    }

    endResize(getDataGridResizeEventClientX(endEvent))
  }

  const passiveIfSupported = { passive: false } as const

  if (isDataGridTouchEvent(event)) {
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
      className="p-0"
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
      className="border-t p-0"
    />
  )
}

function DataGridTableBase({ children }: { children: ReactNode }) {
  const { props, table } = useDataGrid()
  const visibleColumns = table.getVisibleLeafColumns()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.getState().columnSizing,
  ])

  return (
    <table
      data-slot="data-grid-table"
      className={cn(
        "text-foreground style-vega:text-sm style-maia:text-sm style-nova:text-sm style-lyra:text-xs style-mira:text-xs/relaxed caption-bottom text-left align-middle font-normal rtl:text-right",
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
        {visibleColumns.map((column) => (
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
        <DataGridTableFillCol />
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
  const { props, table } = useDataGrid()
  const [viewportElement, setViewportElement] = useState<HTMLDivElement | null>(
    null
  )
  const [containerWidth, setContainerWidth] = useState(0)
  const handleViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      setViewportElement(node)
      assignRef(viewportRef, node)
    },
    [viewportRef]
  )
  const fillWidth =
    props.tableLayout?.columnsResizable && containerWidth > 0
      ? Math.max(0, containerWidth - table.getTotalSize())
      : 0

  useEffect(() => {
    if (!viewportElement || !props.tableLayout?.columnsResizable) {
      setContainerWidth(0)
      return
    }

    const scrollViewport =
      (viewportElement.closest(
        '[data-slot="scroll-area-viewport"]'
      ) as HTMLElement | null) ?? viewportElement.parentElement
    const measurementTarget = scrollViewport ?? viewportElement

    const syncContainerWidth = () => {
      setContainerWidth(measurementTarget.clientWidth)
    }

    syncContainerWidth()

    if (typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(syncContainerWidth)
    observer.observe(measurementTarget)

    return () => {
      observer.disconnect()
    }
  }, [props.tableLayout?.columnsResizable, viewportElement])

  return (
    <div
      data-slot="data-grid-table-viewport"
      ref={handleViewportRef}
      className={cn("relative min-w-full align-top", className)}
      style={{
        ...(props.tableLayout?.columnsResizable
          ? {
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`,
              ["--data-grid-fill-size" as string]: `${fillWidth}px`,
            }
          : undefined),
        ...style,
      }}
    >
      {children}
      <DataGridTableResizeIndicator viewportElement={viewportElement} />
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

function DataGridTableHeadRow<TData>({
  children,
  headerGroup,
}: {
  children: ReactNode
  headerGroup: HeaderGroup<TData>
}) {
  const { props } = useDataGrid()

  return (
    <tr
      key={headerGroup.id}
      className={cn(
        "bg-muted/40",
        props.tableLayout?.headerBorder && "[&>th]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped && "bg-transparent",
        props.tableLayout?.headerBackground === false && "bg-transparent",
        props.tableClassNames?.headerRow
      )}
    >
      {children}
      <DataGridTableFillHeadCell />
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
  const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left")
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right")
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1
  const headerCellSpacing = headerCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })

  return (
    <th
      key={header.id}
      ref={dndRef}
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
      data-last-col={
        isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
      }
      className={cn(
        "text-secondary-foreground/80 style-vega:h-10 style-maia:h-10 style-nova:h-9 style-lyra:h-9 style-mira:h-8 relative text-left align-middle font-normal rtl:text-right [&:has([role=checkbox])]:pe-0",
        headerCellSpacing,
        props.tableLayout?.cellBorder && "border-e",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          "overflow-visible",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          isLastVisibleColumn &&
          "pe-8",
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          "[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-s!",
        header.column.columnDef.meta?.headerClassName,
        column.getIndex() === 0 ||
          column.getIndex() === header.headerGroup.headers.length - 1
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
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1
  const isResizeModeOnEnd =
    (props.tableLayout?.columnsResizeMode ?? table.options.columnResizeMode) ===
    "onEnd"

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isResizeModeOnEnd) {
      startDataGridColumnResizeOnEnd(event, header, table)
      return
    }

    header.getResizeHandler()(event)
  }

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isResizeModeOnEnd) {
      startDataGridColumnResizeOnEnd(event, header, table)
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
  viewportElement,
}: {
  viewportElement: HTMLDivElement | null
}) {
  const { props, table } = useDataGrid()
  const columnSizingInfo = table.getState().columnSizingInfo
  const resizingColumnId = columnSizingInfo.isResizingColumn
  const resizeMode =
    props.tableLayout?.columnsResizeMode ?? table.options.columnResizeMode

  if (
    !props.tableLayout?.columnsResizable ||
    resizeMode !== "onEnd" ||
    !resizingColumnId
  ) {
    return null
  }

  const resizingHeader = table
    .getFlatHeaders()
    .find(
      (header) =>
        header.column.id === resizingColumnId || header.id === resizingColumnId
    )

  if (!resizingHeader) return null

  const deltaOffset = columnSizingInfo.deltaOffset ?? 0
  const headerHeight =
    viewportElement
      ?.querySelector('[data-slot="data-grid-table"] thead')
      ?.getBoundingClientRect().height ?? 0
  const indicatorLeft =
    typeof columnSizingInfo.startOffset === "number" && viewportElement
      ? columnSizingInfo.startOffset -
        viewportElement.getBoundingClientRect().left
      : resizingHeader.getStart() + resizingHeader.getSize()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-20"
      style={{
        left: indicatorLeft,
        transform: `translateX(${deltaOffset}px)`,
      }}
    >
      <div className="bg-primary/85 absolute inset-y-0 left-0 w-px -translate-x-1/2" />
      <div
        className="bg-primary absolute top-0 left-0 -translate-x-1/2 rounded-b-sm shadow-xs"
        style={{
          width: 5,
          height: Math.max(headerHeight, 6),
        }}
      />
    </div>
  )
}

function DataGridTableRowSpacer() {
  return <tbody aria-hidden="true" className="h-2"></tbody>
}

function DataGridTableBody({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()

  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        props.tableLayout?.rowRounded &&
          "style-vega:[&_td:first-child]:rounded-l-lg style-nova:[&_td:first-child]:rounded-l-lg style-maia:[&_td:first-child]:rounded-l-none style-lyra:[&_td:first-child]:rounded-e-none style-mira:[&_td:first-child]:rounded-l-4xl",
        props.tableLayout?.rowRounded &&
          "style-vega:[&_td:last-child]:rounded-r-lg style-nova:[&_td:last-child]:rounded-r-lg style-maia:[&_td:last-child]:rounded-r-none style-lyra:[&_td:last-child]:rounded-e-none style-mira:[&_td:last-child]:rounded-r-4xl",
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
    <tfoot className={cn("border-t", props.tableClassNames?.footer)}>
      {children}
    </tfoot>
  )
}

function DataGridTableFootRow({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()
  return (
    <tr
      className={cn(
        "bg-muted/40 dark:bg-background",
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
        "text-secondary-foreground/80 border-t align-middle font-medium",
        spacing,
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
      <DataGridTableFillBodyCell />
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
          '[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 data-pinned:backdrop-blur-xs" [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s!',
        column.getIndex() === 0 ||
          column.getIndex() === table.getVisibleFlatColumns().length - 1
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
}: {
  children: ReactNode
  row: Row<TData>
  pinnedBoundary?: DataGridTablePinnedBoundary
  rowRef?: React.Ref<HTMLTableRowElement>
  dndRef?: React.Ref<HTMLTableRowElement>
  dndStyle?: CSSProperties
}) {
  const { props, table } = useDataGrid()
  const isRowPinned = row.getIsPinned()

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
      data-row-pinned={isRowPinned || undefined}
      data-row-pinned-boundary={pinnedBoundary}
      onClick={() => props.onRowClick && props.onRowClick(row.original)}
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
        props.tableLayout?.rowsPinnable &&
          isRowPinned &&
          "bg-muted/30 hover:bg-muted/50",
        pinnedBoundary === "top" && "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)]",
        pinnedBoundary === "bottom" &&
          "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)]",
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
      <DataGridTableFillBodyCell />
    </tr>
  )
}

function DataGridTableBodyRowExpandded<TData>({ row }: { row: Row<TData> }) {
  const { props, table } = useDataGrid()

  return (
    <tr
      className={cn(
        props.tableLayout?.rowBorder && "[&:not(:last-child)>td]:border-b"
      )}
    >
      <td
        colSpan={
          row.getVisibleCells().length +
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
      key={cell.id}
      ref={dndRef}
      {...(props.tableLayout?.columnsDraggable && !isPinned ? { cell } : {})}
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
          '[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 data-pinned:backdrop-blur-xs" [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s!',
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

function getDataGridTableCellSkeleton<TData>(cell: Cell<TData, unknown>) {
  return (
    cell.column.columnDef.meta?.skeleton ?? (
      <div className="bg-muted/70 h-7 w-full animate-pulse rounded-md" />
    )
  )
}

function DataGridTableRenderedRow<TData>({
  row,
  pinnedBoundary,
  rowRef,
}: {
  row: Row<TData>
  pinnedBoundary?: DataGridTablePinnedBoundary
  rowRef?: React.Ref<HTMLTableRowElement>
}) {
  const { props, table } = useDataGrid()
  const isPendingRow =
    props.loadingMode === "skeleton" &&
    Boolean(table.options.meta?.editing?.isRowPending(row.id))

  if (isPendingRow) {
    return (
      <DataGridTableBodyRowSkeleton>
        {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
          <DataGridTableBodyRowSkeletonCell column={cell.column} key={cell.id}>
            {getDataGridTableCellSkeleton(cell)}
          </DataGridTableBodyRowSkeletonCell>
        ))}
      </DataGridTableBodyRowSkeleton>
    )
  }

  return (
    <Fragment>
      <DataGridTableBodyRow
        row={row}
        pinnedBoundary={pinnedBoundary}
        rowRef={rowRef}
      >
        {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        ))}
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
    </Fragment>
  )
}

function DataGridTableEmpty() {
  const { table, props } = useDataGrid()
  const visibleColumnCount =
    table.getVisibleLeafColumns().length +
    (props.tableLayout?.columnsResizable ? 1 : 0)

  return (
    <tr>
      <td
        colSpan={Math.max(visibleColumnCount, 1)}
        className="text-muted-foreground style-vega:text-sm style-maia:text-sm style-nova:text-sm style-lyra:text-xs style-mira:text-xs/relaxed py-6 text-center"
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
      <div className="text-muted-foreground bg-card style-vega:rounded-md style-vega:text-sm style-vega:shadow-xs style-maia:rounded-2xl style-maia:text-sm style-nova:rounded-lg style-nova:text-sm style-lyra:rounded-none style-lyra:text-xs style-mira:rounded-md style-mira:text-xs/relaxed flex items-center gap-2 border px-4 py-2 leading-none font-medium">
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
      onClick={() => {
        if (isPinned) {
          row.pin(false)
        } else {
          row.pin("top")
        }
      }}
      className={cn(
        "text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors",
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
      checked={isAllSelected}
      indeterminate={isSomeSelected && !isAllSelected}
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
    return (
      <>
        {Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
          <DataGridTableBodyRowSkeleton key={rowIndex}>
            {table.getVisibleFlatColumns().map((column, colIndex) => (
              <DataGridTableBodyRowSkeletonCell column={column} key={colIndex}>
                {column.columnDef.meta?.skeleton}
              </DataGridTableBodyRowSkeletonCell>
            ))}
          </DataGridTableBodyRowSkeleton>
        ))}
      </>
    )
  }

  if (isLoading && props.loadingMode === "spinner") {
    return (
      <tr>
        <td colSpan={table.getVisibleFlatColumns().length} className="p-8">
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

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        <DataGridTableHead>
          {table
            .getHeaderGroups()
            .map((headerGroup: HeaderGroup<TData>, index) => {
              return (
                <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                  {headerGroup.headers.map((header, index) => {
                    const { column } = header

                    return (
                      <DataGridTableHeadRowCell header={header} key={index}>
                        {header.isPlaceholder ? null : props.tableLayout
                            ?.columnsResizable && column.getCanResize() ? (
                          <div className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                        {props.tableLayout?.columnsResizable &&
                          column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    )
                  })}
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

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<TData>, index) => {
                return (
                  <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                    {headerGroup.headers.map((header, index) => {
                      const { column } = header

                      return (
                        <DataGridTableHeadRowCell header={header} key={index}>
                          {header.isPlaceholder ? null : props.tableLayout
                              ?.columnsResizable && column.getCanResize() ? (
                            <div className="truncate">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                          {props.tableLayout?.columnsResizable &&
                            column.getCanResize() && (
                              <DataGridTableHeadRowCellResize header={header} />
                            )}
                        </DataGridTableHeadRowCell>
                      )
                    })}
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
  getDataGridTableResolvedRows,
  getDataGridTableRowSections,
}

export type { DataGridTablePinnedBoundary }
