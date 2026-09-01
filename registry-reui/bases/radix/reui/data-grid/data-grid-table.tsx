"use client"

import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react"
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
  Ref,
  RefObject,
} from "react"
import {
  dataGridCellSelectionCellClasses,
  getDataGridCellSelectionCellAttrs,
  toDataGridDomId,
  useDataGrid,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import type {
  DataGridFeatures,
  DataGridTableInstance,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import { flexRender, Subscribe } from "@tanstack/react-table"
import type { Cell, Column, Header, Row, Table } from "@tanstack/react-table"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import { Spinner } from "@/registry/bases/radix/ui/spinner"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Static spacing lookups; called once per cell, so they stay plain string
// picks instead of runtime variant machinery.
const headerCellSpacingVariants = ({ size }: { size?: "dense" | "default" }) =>
  size === "dense" ? "px-2 h-8" : "px-3"

const bodyCellSpacingVariants = ({ size }: { size?: "dense" | "default" }) =>
  size === "dense" ? "px-2 py-1.5" : "px-3 py-2"

// The truncation wrapper used when cell selection is on: it consumes the
// td padding with negative margins and restores it as its own, so its
// overflow clips at exactly the boundary the td's `truncate` used to clip
// at - including custom cells that pull into the padding the same way.
const bodyCellTruncateWrapVariants = ({
  size,
}: {
  size?: "dense" | "default"
}) =>
  size === "dense"
    ? "-mx-2 -my-1.5 truncate px-2 py-1.5"
    : "-mx-3 -my-2 truncate px-3 py-2"

const footerCellSpacingVariants = ({ size }: { size?: "dense" | "default" }) =>
  size === "dense" ? "px-2 py-1.5" : "px-3 py-2"

function getPinningStyles<TData extends object>(
  column: Column<DataGridFeatures, TData, unknown>
): CSSProperties {
  const isPinned = column.getIsPinned()

  return {
    // Logical offsets: TanStack's "left"/"right" buckets are start/end
    // semantics, so pinned columns stick to the correct edge in RTL too
    // (identical to left/right in LTR).
    insetInlineStart:
      isPinned === "start" ? `${column.getStart("start")}px` : undefined,
    insetInlineEnd:
      isPinned === "end" ? `${column.getAfter("end")}px` : undefined,
    position: isPinned ? "sticky" : undefined,
    transform: isPinned ? "translateZ(0)" : undefined,
    contain: isPinned ? "paint" : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 30 : undefined,
    backgroundClip: isPinned ? "padding-box" : undefined,
  }
}

// Shared indent contract for tree rows: DataGridTableRowExpand consumes it,
// and fully custom cells can reuse it for depth alignment without the
// built-in toggle.
function getDataGridTreeIndentStyle<TData extends object>(
  row: Row<DataGridFeatures, TData>,
  indent: number = 20
): CSSProperties {
  return {
    "--data-grid-tree-padding": `${row.depth * indent}px`,
  } as CSSProperties
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
  | ReactMouseEvent<HTMLElement>
  | ReactTouchEvent<HTMLElement>

type DataGridResizeDocumentEvent = globalThis.MouseEvent | globalThis.TouchEvent

function isDataGridTouchEvent(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent
): event is ReactTouchEvent<HTMLElement> | globalThis.TouchEvent {
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

function startDataGridColumnResizeOnEnd<TData extends object>(
  event: DataGridResizeStartEvent,
  header: Header<DataGridFeatures, TData, unknown>,
  table: DataGridTableInstance<TData>,
  /**
   * Live mode: per-move width updates go straight to the table element's
   * `--col/--header` variables, so cells track the pointer with ZERO React
   * renders; state is written twice per drag (start marker, release commit)
   * instead of per mousemove - which re-renders the consumer's whole tree.
   */
  live = false
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
  const liveTableElement = live ? headerCell?.closest("table") : null
  // An end-pinned column is anchored at its end edge and grows from its
  // START edge, so its whole resize geometry runs mirrored, exactly like
  // RTL: the anchor is the opposite edge and the drag direction inverts.
  const resizeRtl =
    (table.options.columnResizeDirection === "rtl") !==
    (column.getIsPinned() === "end")
  const startOffset =
    headerRect &&
    Number.isFinite(resizeRtl ? headerRect.left : headerRect.right)
      ? resizeRtl
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
  const directionMultiplier = resizeRtl ? -1 : 1

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

    if (liveTableElement) {
      columnSizingStart.forEach(([columnId]) => {
        const nextSize = nextColumnSizing[columnId]
        if (typeof nextSize !== "number") return
        liveTableElement.style.setProperty(
          `--col-${columnId}-size`,
          String(nextSize)
        )
        liveTableElement.style.setProperty(
          `--header-${columnId}-size`,
          String(nextSize)
        )
      })
    } else {
      table.setColumnResizing((old) => ({
        ...old,
        startOffset,
        startSize,
        deltaOffset,
        deltaPercentage,
        columnSizingStart,
        isResizingColumn: column.id,
      }))
    }

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
    table.setColumnResizing((old) => ({
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

  table.setColumnResizing((old) => ({
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

function getDataGridTableRowSections<TData extends object>(
  table: DataGridTableInstance<TData>,
  rowsPinnable?: boolean
) {
  if (!rowsPinnable) {
    return {
      topRows: [] as Row<DataGridFeatures, TData>[],
      centerRows: table.getRowModel().rows as Row<DataGridFeatures, TData>[],
      bottomRows: [] as Row<DataGridFeatures, TData>[],
    }
  }

  return {
    topRows: table.getTopRows() as Row<DataGridFeatures, TData>[],
    centerRows: table.getCenterRows() as Row<DataGridFeatures, TData>[],
    bottomRows: table.getBottomRows() as Row<DataGridFeatures, TData>[],
  }
}

function getDataGridTableResolvedRows<TData extends object>(
  table: DataGridTableInstance<TData>,
  rowsPinnable?: boolean
) {
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    rowsPinnable
  )
  const resolvedRows: Array<{
    row: Row<DataGridFeatures, TData>
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

function getDataGridTableOrderedVisibleColumns<TData extends object>(
  table: DataGridTableInstance<TData>
) {
  return [
    ...table.getStartVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getEndVisibleLeafColumns(),
  ] as Column<DataGridFeatures, TData, unknown>[]
}

function getDataGridTableOrderedVisibleCells<TData extends object>(
  row: Row<DataGridFeatures, TData>
) {
  return [
    ...row.getStartVisibleCells(),
    ...row.getCenterVisibleCells(),
    ...row.getEndVisibleCells(),
  ] as Cell<DataGridFeatures, TData, unknown>[]
}

function getDataGridTableMergedHeaderGroups<TData extends object>(
  table: DataGridTableInstance<TData>
) {
  const leftHeaderGroups = table.getStartHeaderGroups()
  const centerHeaderGroups = table.getCenterHeaderGroups()
  const rightHeaderGroups = table.getEndHeaderGroups()
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
      ] as Header<DataGridFeatures, TData, unknown>[],
    }
  })
}

function hasDataGridTableRightPinnedColumns<TData extends object>(
  table: DataGridTableInstance<TData>
) {
  return (table.state.columnPinning.end?.length ?? 0) > 0
}

// A meta.fillWidth column absorbs the free space itself, so the fill cells
// must collapse or the strip would be counted twice.
function hasDataGridFillColumn<TData extends object>(
  table: DataGridTableInstance<TData>
) {
  return table
    .getVisibleLeafColumns()
    .some((column) => column.columnDef.meta?.fillWidth)
}

function DataGridTableFillCol() {
  const { props, table } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <col
      data-slot="data-grid-table-fill-col"
      style={{
        width: hasDataGridFillColumn(table)
          ? 0
          : "var(--data-grid-fill-size, 0px)",
      }}
    />
  )
}

function DataGridTableFillHeadCell() {
  const { props, table } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <th
      aria-hidden="true"
      data-slot="data-grid-table-fill-head-cell"
      style={{
        width: hasDataGridFillColumn(table)
          ? 0
          : "var(--data-grid-fill-size, 0px)",
      }}
      className={cn("p-0", props.tableLayout?.headerBackground && "bg-muted")}
    />
  )
}

function DataGridTableFillBodyCell() {
  const { props, table } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <td
      aria-hidden="true"
      data-slot="data-grid-table-fill-body-cell"
      style={{
        width: hasDataGridFillColumn(table)
          ? 0
          : "var(--data-grid-fill-size, 0px)",
      }}
      className="p-0"
    />
  )
}

function DataGridTableFillFootCell() {
  const { props, table } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <td
      aria-hidden="true"
      data-slot="data-grid-table-fill-foot-cell"
      style={{
        width: hasDataGridFillColumn(table)
          ? 0
          : "var(--data-grid-fill-size, 0px)",
      }}
      className="p-0"
    />
  )
}

/**
 * The quick-create affordance, rendered as the body's last row when
 * `onRowCreate` is set: one full-width ghost button, the Notion/Airtable
 * "+ New" idiom. What the click creates stays consumer-owned.
 */
function DataGridTableAddRow() {
  const { i18n, props, table } = useDataGrid()

  if (!props.onRowCreate) return null

  return (
    <tr
      data-slot="data-grid-table-add-row"
      className={cn(
        "hover:bg-muted/40 [thead+tbody_&:first-child]:border-t",
        props.tableClassNames?.rowCreate
      )}
    >
      <td
        // The extra column is the filler strip, rendered only when columns
        // are resizable.
        colSpan={
          table.getVisibleLeafColumns().length +
          (props.tableLayout?.columnsResizable ? 1 : 0)
        }
        className="p-0"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          // Block-level flex: inline-flex would sit on the cell's text
          // baseline and push the icon and label off vertical center.
          className={cn(
            "text-muted-foreground flex w-full items-center justify-start rounded-none px-3",
            props.tableLayout?.dense ? "h-8 px-2" : "h-9"
          )}
          onClick={(event) => {
            // Creating often unmounts this affordance (a draft row takes
            // its place); focus would fall to the body and strand the
            // keyboard. Hand it to the grid's focus target instead - but
            // only when it was actually lost, so a consumer that keeps
            // the button mounted keeps repeated Enter presses working.
            // A timer, not rAF: timers also run in background tabs.
            const button = event.currentTarget
            const grid = button.closest("table")
            props.onRowCreate?.()
            setTimeout(() => {
              if (
                !button.isConnected &&
                grid?.isConnected &&
                grid.tabIndex >= 0 &&
                (document.activeElement === document.body ||
                  !document.activeElement)
              ) {
                grid.focus()
              }
            }, 0)
          }}
        >
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            className="size-4"
            aria-hidden="true"
          />
          {props.rowCreateLabel ?? i18n.labels.rowCreate}
        </Button>
      </td>
    </tr>
  )
}

function DataGridTableBase({ children }: { children: ReactNode }) {
  const { props, table, recordCount } = useDataGrid()
  const leftVisibleColumns = table.getStartVisibleLeafColumns()
  const centerVisibleColumns = table.getCenterVisibleLeafColumns()
  const rightVisibleColumns = table.getEndVisibleLeafColumns()
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
    // A meta.fillWidth column absorbs the filler strip: its size variable
    // carries the unitless fill amount, so every consumer of
    // calc(var(--col-X-size) * 1px) stretches with the container while the
    // fill cells collapse to zero.
    const fillColumnId = table
      .getVisibleLeafColumns()
      .find((column) => column.columnDef.meta?.fillWidth)?.id
    const colSizes: Record<string, number | string> = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] =
        header.column.id === fillColumnId
          ? `calc(${header.column.getSize()} + var(--data-grid-fill, 0))`
          : header.column.getSize()
    }
    return colSizes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.tableLayout?.columnsResizable,
    // Visibility/order/pinning change the flat header set, so a column shown
    // after mount must get its size variable even though sizing is untouched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.state.columnSizing,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.state.columnVisibility,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.state.columnOrder,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.state.columnPinning,
    // A def swap can change a column's `size` without touching sizing
    // STATE; without this dep the CSS variables keep the old widths. For a
    // consumer defining columns inline the memo degrades to per-render
    // recompute, which is the safe direction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.options.columns,
  ])

  // With cell selection on, the table announces as a grid so the tds compute
  // as gridcells and aria-selected applies; existing grids keep their plain
  // semantic table untouched.
  const cellSelectionOn =
    !!props.tableLayout?.cellSelection && table.atoms.cellSelection != null

  return (
    <table
      data-slot="data-grid-table"
      role={cellSelectionOn ? "grid" : undefined}
      aria-multiselectable={
        cellSelectionOn && props.tableLayout?.cellSelectionMode !== "single"
          ? true
          : undefined
      }
      // recordCount can undercount the rows actually present (a pinned
      // draft row a consumer keeps out of its totals), and aria-rowindex
      // is computed from the full display order; the union keeps every
      // announced index inside the announced count.
      aria-rowcount={
        cellSelectionOn
          ? Math.max(recordCount, table.getRowsInDisplayOrder().length) + 1
          : undefined
      }
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

    const freeSpace = fillStateRef.current.containerWidth - table.getTotalSize()
    const fillWidth = Math.max(0, freeSpace)

    if (fillStateRef.current.appliedFill !== fillWidth) {
      fillStateRef.current.appliedFill = fillWidth
      node.style.setProperty("--data-grid-fill-size", `${fillWidth}px`)
      // Unitless twin for the meta.fillWidth column, whose size variable
      // participates in a calc that multiplies by 1px afterwards.
      node.style.setProperty("--data-grid-fill", String(fillWidth))
    }

    // Signed on purpose: a shrinking container drives the free space
    // NEGATIVE, which is exactly what tells a meta.autoSize column to hand
    // its absorbed width back.
    autoSize?.apply(freeSpace)
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
        node.style.removeProperty("--data-grid-fill")
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
      aria-rowindex={props.tableLayout?.cellSelection ? 1 : undefined}
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

function DataGridTableHeadRowCell<TData extends object>({
  children,
  header,
  dndRef,
  dndStyle,
}: {
  children: ReactNode
  header: Header<DataGridFeatures, TData, unknown>
  dndRef?: React.Ref<HTMLTableCellElement>
  dndStyle?: CSSProperties
}) {
  const { props, table } = useDataGrid()

  const { column } = header
  const isPinned = column.getIsPinned()
  const isFirstStartPinned =
    isPinned === "start" && column.getIsFirstColumn("start")
  const isLastStartPinned =
    isPinned === "start" && column.getIsLastColumn("start")
  const isFirstEndPinned = isPinned === "end" && column.getIsFirstColumn("end")
  const isLastEndPinned = isPinned === "end" && column.getIsLastColumn("end")
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
            : column.getCanSort()
              ? "none"
              : undefined
      }
      aria-colindex={
        props.tableLayout?.cellSelection ? column.getIndex() + 1 : undefined
      }
      data-col-id={column.id}
      style={{
        ...(props.tableLayout?.width === "fixed" &&
          !props.tableLayout?.columnsResizable && {
            width: header.getSize(),
          }),
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        // A sticky child does not ride a sticky ancestor: under a sticky
        // header the pinned cell's own position:sticky (horizontal) opts it
        // out of the thead's vertical stickiness, and the corner scrolls
        // away while its non-positioned siblings stick. Pin both axes on
        // the cell itself.
        ...(props.tableLayout?.headerSticky && isPinned && { top: 0 }),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--header-${header.id}-size) * 1px)`,
        }),
        ...(dndStyle ? dndStyle : null),
      }}
      data-pinned={isPinned || undefined}
      data-outer-pinned-col={
        isFirstStartPinned ? "start" : isLastEndPinned ? "end" : undefined
      }
      data-last-col={
        isLastStartPinned ? "start" : isFirstEndPinned ? "end" : undefined
      }
      className={cn(
        "text-foreground relative h-10 text-left align-middle font-medium rtl:text-right [&:has([role=checkbox])]:pe-0",
        headerCellSpacing,
        props.tableLayout?.headerBackground && "bg-muted",
        props.tableLayout?.cellBorder && "border-e",
        // The resize filler column follows the center group, and a border on
        // the last center cell would float against that empty strip.
        props.tableLayout?.cellBorder &&
          props.tableLayout?.columnsResizable &&
          // With end-pinned columns but no pin affordance, the pinned edge
          // draws no separator of its own; keep the border then.
          (props.tableLayout?.columnsPinnable ||
            !hasDataGridTableRightPinnedColumns(table)) &&
          !isPinned &&
          column.getIsLastColumn("center") &&
          "border-e-0",
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
            "[&[data-pinned=end]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=end][data-last-col=end]]:shadow-[inset_1px_0_0_0_var(--border)] [&[data-pinned=start][data-last-col=start]]:shadow-[inset_-1px_0_0_0_var(--border)]",
            "[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=start]_div.cursor-col-resize:last-child]:opacity-0"
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

/**
 * TanStack's own default, restated here on purpose.
 *
 * v8 merged each feature's default table options into `table.options`, so
 * reading `table.options.columnResizeMode` gave you `"onEnd"` even when the
 * consumer never set it. v9 resolves feature defaults internally and leaves
 * the option `undefined` on the instance, so the old `?? table.options...`
 * fallback quietly produced `undefined` - and every grid that had not opted
 * into a mode explicitly lost the onEnd drag session: no cursor lock, no
 * vertical indicator, and an immediate commit instead of a deferred one.
 */
const DATA_GRID_DEFAULT_COLUMN_RESIZE_MODE = "onEnd" as const

function getDataGridColumnResizeMode(
  layoutMode: "onChange" | "onEnd" | undefined,
  tableMode: "onChange" | "onEnd" | undefined
) {
  return layoutMode ?? tableMode ?? DATA_GRID_DEFAULT_COLUMN_RESIZE_MODE
}

function DataGridTableHeadRowCellResize<TData extends object>({
  header,
}: {
  header: Header<DataGridFeatures, TData, unknown>
}) {
  const { props, table } = useDataGrid<TData>()
  const { column } = header
  const isPinned = column.getIsPinned()
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1
  const isResizeModeOnEnd =
    getDataGridColumnResizeMode(
      props.tableLayout?.columnsResizeMode,
      table.options.columnResizeMode
    ) === "onEnd"
  const stopResizeSessionRef = useRef<(() => void) | undefined>(undefined)

  // End a live drag if the handle unmounts mid-resize so document listeners
  // and the app-wide col-resize cursor don't outlive the grid.
  useEffect(() => {
    return () => {
      stopResizeSessionRef.current?.()
      stopResizeSessionRef.current = undefined
    }
  }, [])

  const handleMouseDown = (event: ReactMouseEvent<HTMLElement>) => {
    // Only the primary button starts a resize; guard before preventDefault so
    // right-click still opens the context menu.
    if (event.button !== 0) return

    event.preventDefault()
    event.stopPropagation()

    stopResizeSessionRef.current?.()
    stopResizeSessionRef.current = startDataGridColumnResizeOnEnd(
      event,
      header,
      table,
      !isResizeModeOnEnd
    )
  }

  const handleTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()

    stopResizeSessionRef.current?.()
    stopResizeSessionRef.current = startDataGridColumnResizeOnEnd(
      event,
      header,
      table,
      !isResizeModeOnEnd
    )
  }

  return (
    // A span, deliberately: consumers stretch end-aligned header CONTENT
    // with `[&>div]:w-full` on headerClassName, and that compiled child
    // selector (0,1,1) beats the handle's own w-5 (0,1,0) - a div handle
    // then covers the whole cell and swallows the menu click. Hardening
    // w-5 with ! was rejected: the tag change removes the fight instead
    // of escalating it.
    <span
      data-slot="data-grid-table-resize-handle"
      {...{
        onDoubleClick: () => column.resetSize(),
        onMouseDown: handleMouseDown,
        onTouchStart: handleTouchStart,
        className: cn(
          "absolute top-0 h-full cursor-col-resize user-select-none touch-none z-10 flex",
          isPinned === "end"
            ? cn(
                // An end-pinned column grows from its START edge (its end is
                // anchored), so the handle lives there, inside the sticky
                // cell.
                "start-0 w-5 justify-start",
                props.tableLayout?.columnsPinnable
                  ? "before:hidden"
                  : "before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-border"
              )
            : isLastVisibleColumn
              ? "end-0 w-5 justify-end before:hidden"
              : isPinned
                ? cn(
                    // A pinned column is sticky, so the handle sits inside the
                    // cell instead of straddling the boundary, where the next
                    // sticky cell would paint over it.
                    "end-0 w-5 justify-end",
                    // With the pin affordance on, the pinned edge already draws
                    // its own separator and a resize line would double it. But
                    // pinning is also usable purely as an ordering lock, with no
                    // affordance and no separator -- and there this line is the
                    // only thing marking the edge, so hiding it left a resizable
                    // column showing a resize cursor and no indicator at all.
                    props.tableLayout?.columnsPinnable
                      ? "before:hidden"
                      : "before:absolute before:inset-y-0 before:end-0 before:w-px before:bg-border"
                  )
                : cn(
                    "-end-2 w-5 justify-center",
                    // With cell borders on, the th border-e already marks every
                    // boundary and this always-on line would double it; the wide
                    // hit area and resize cursor stay.
                    props.tableLayout?.cellBorder
                      ? "before:hidden"
                      : "before:absolute before:inset-y-0 before:w-px before:-translate-x-px before:bg-border"
                  ),
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
  const columnResizing = table.state.columnResizing
  const resizingColumnId = columnResizing.isResizingColumn
  const resizeMode = getDataGridColumnResizeMode(
    props.tableLayout?.columnsResizeMode,
    table.options.columnResizeMode
  )
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
    // instead of mirroring it. End-pinned columns resize mirrored (see the
    // session), so the multiplier matches theirs.
    const directionMultiplier =
      (table.options.columnResizeDirection === "rtl") !==
      (resizingHeader.column.getIsPinned() === "end")
        ? -1
        : 1
    const deltaOffset = (columnResizing.deltaOffset ?? 0) * directionMultiplier

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
    // Anchor on the live header cell: content math (getStart) cannot place a
    // STICKY pinned column, while the DOM rect is right for every column at
    // any scroll position. The state offset and content math stay as
    // fallbacks for a header that is not in the DOM.
    const viewportRoot =
      viewportElement ??
      indicator.closest<HTMLElement>('[data-slot="data-grid-table-viewport"]')
    const headerCellElement = viewportRoot?.querySelector<HTMLElement>(
      `thead th[data-col-id="${CSS.escape(resizingHeader.column.id)}"]`
    )
    let indicatorLeft: number
    if (headerCellElement && viewportRoot) {
      const anchorRect = headerCellElement.getBoundingClientRect()
      const edgeClientX =
        (table.options.columnResizeDirection === "rtl") !==
        (resizingHeader.column.getIsPinned() === "end")
          ? anchorRect.left
          : anchorRect.right
      indicatorLeft = edgeClientX - viewportRoot.getBoundingClientRect().left
    } else if (
      typeof columnResizing.startOffset === "number" &&
      viewportElement
    ) {
      indicatorLeft =
        columnResizing.startOffset -
        viewportElement.getBoundingClientRect().left
    } else {
      indicatorLeft = resizingHeader.getStart() + resizingHeader.getSize()
    }

    indicator.style.left = `${indicatorLeft}px`
    indicator.style.transform = `translateX(${deltaOffset}px)`
    indicatorHead.style.height = `${Math.max(headerHeight, 6)}px`
  })

  if (!isActive) return null

  return (
    <div
      ref={indicatorRef}
      aria-hidden="true"
      data-slot="data-grid-table-resize-indicator"
      className="pointer-events-none absolute inset-y-0 z-50"
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
  const { props, table } = useDataGrid()
  const footRowBottomBorderClasses = "[&:not(:last-child)>td]:border-b"

  return (
    <tr
      data-slot="data-grid-table-foot-row"
      className={cn(
        props.tableLayout?.footerBackground && "bg-muted/40 dark:bg-background",
        props.tableLayout?.rowBorder && footRowBottomBorderClasses,
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        // The fill foot cell is the :last child, so the rule above only
        // strips the filler; the real last cell needs the same treatment or
        // its border floats into the strip while thead and tbody suppress
        // theirs. Same pin-affordance gate as the cell-level suppressors.
        props.tableLayout?.cellBorder &&
          props.tableLayout?.columnsResizable &&
          (props.tableLayout?.columnsPinnable ||
            !hasDataGridTableRightPinnedColumns(table)) &&
          "[&>td:has(+td[data-slot=data-grid-table-fill-foot-cell])]:border-e-0"
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
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
    </tr>
  )
}

function DataGridTableBodyRowSkeletonCell<TData extends object>({
  children,
  column,
}: {
  children: ReactNode
  column: Column<DataGridFeatures, TData, unknown>
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
        props.tableLayout?.cellBorder &&
          props.tableLayout?.columnsResizable &&
          // With end-pinned columns but no pin affordance, the pinned edge
          // draws no separator of its own; keep the border then.
          (props.tableLayout?.columnsPinnable ||
            !hasDataGridTableRightPinnedColumns(table)) &&
          !column.getIsPinned() &&
          column.getIsLastColumn("center") &&
          "border-e-0",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          "truncate",
        column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          "data-pinned:bg-background data-pinned:isolate [&[data-pinned=end][data-last-col=end]]:shadow-[inset_1px_0_0_0_var(--border)] [&[data-pinned=start][data-last-col=start]]:shadow-[inset_-1px_0_0_0_var(--border)]",
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

function DataGridTableBodyRow<TData extends object>({
  children,
  row,
  pinnedBoundary,
  rowRef,
  dndRef,
  dndStyle,
  dataIndex,
}: {
  children: ReactNode
  row: Row<DataGridFeatures, TData>
  pinnedBoundary?: DataGridTablePinnedBoundary
  rowRef?: React.Ref<HTMLTableRowElement>
  dndRef?: React.Ref<HTMLTableRowElement>
  dndStyle?: CSSProperties
  dataIndex?: number
}) {
  const { props, table } = useDataGrid()
  const isRowPinned = row.getIsPinned()
  const rowStatus = props.getRowStatus?.(row.original)

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
      data-row-id={row.id}
      data-depth={row.depth || undefined}
      data-row-pinned={isRowPinned || undefined}
      data-row-pinned-boundary={pinnedBoundary}
      data-row-status={rowStatus}
      // 1-based after the header row; row.index is the position in the data,
      // so the announced index stays absolute across pagination.
      aria-rowindex={
        props.tableLayout?.cellSelection ? row.index + 2 : undefined
      }
      onClick={() => props.onRowClick && props.onRowClick(row.original)}
      className={cn(
        "hover:bg-muted/40 data-[state=selected]:bg-muted/50",
        /* Pinned cells hide scrolled content behind an OPAQUE background,
           which also hides the row's translucent hover and selected tints;
           they get the same tints premixed over the background instead,
           the row-status treatment. */
        "hover:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--muted)_40%,var(--background))]",
        "data-[state=selected]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]",
        props.onRowClick && "cursor-pointer",
        // Optional CRUD indications, active only when getRowStatus is
        // wired; the warning-muted defaults yield to tableClassNames
        // overrides per status. Pinned cells must stay OPAQUE (they hide
        // scrolled content), so they get the same tint pre-mixed over the
        // background instead of inheriting the translucent row fill.
        props.getRowStatus &&
          "data-[row-status=deleted]:bg-destructive/5 data-[row-status=deleted]:opacity-60 data-[row-status=dirty]:bg-amber-500/5 data-[row-status=new]:bg-green-500/5 data-[row-status=deleted]:[&_td]:line-through",
        props.getRowStatus &&
          "data-[row-status=deleted]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--destructive)_5%,var(--background))] data-[row-status=dirty]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--color-amber-500)_5%,var(--background))] data-[row-status=new]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--color-green-500)_5%,var(--background))]",
        rowStatus === "new" && props.tableClassNames?.rowNew,
        rowStatus === "dirty" && props.tableClassNames?.rowDirty,
        rowStatus === "deleted" && props.tableClassNames?.rowDeleted,
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
        props.tableLayout?.rowsPinnable &&
          isRowPinned &&
          "bg-muted/30 hover:bg-muted/50",
        pinnedBoundary === "top" &&
          "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)] dark:[&>td]:shadow-[0_2px_0_rgba(255,255,255,0.06)]",
        // A bottom-pinned row borders scrolled content along its TOP edge,
        // so its separator shadow casts upward.
        pinnedBoundary === "bottom" &&
          "[&>td]:shadow-[0_-2px_0_rgba(0,0,0,0.03)] dark:[&>td]:shadow-[0_-2px_0_rgba(255,255,255,0.06)]",
        props.tableLayout?.rowsPinnable &&
          isRowPinned &&
          props.tableClassNames?.rowPinned,
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
    </tr>
  )
}

function DataGridTableBodyRowExpandded<TData extends object>({
  row,
}: {
  row: Row<DataGridFeatures, TData>
}) {
  const { props, table } = useDataGrid()
  const expandedContent = table
    .getAllColumns()
    .find((column) => column.columnDef.meta?.expandedContent)?.columnDef
    .meta?.expandedContent

  // Tree and grouped rows share row.getIsExpanded() with detail expansion.
  // Without a detail column there is nothing to render, and an empty <tr>
  // would break striping parity, rowBorder, and virtual row measurement.
  if (!expandedContent) return null

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
        {expandedContent(row.original)}
      </td>
    </tr>
  )
}

/**
 * Interactive descendants keep their own mousedown semantics: a click on a
 * button, link, editor or checkbox inside a cell must never start or replace
 * a range. One selector also covers the row-dnd grip (a button), the expand
 * toggle, and `data-cell-interactive` - the documented opt-out for custom
 * widgets built from elements the tag list cannot know about.
 */
function isDataGridCellInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(
      'button, a, input, select, textarea, [contenteditable], [role="checkbox"], [data-cell-interactive], [data-slot="data-grid-table-row-expand"], [data-slot="data-grid-cell-fill-handle"]'
    ) != null
  )
}

function DataGridTableBodyRowCell<TData extends object>({
  children,
  cell,
  dndRef,
  dndStyle,
  columnIndex,
}: {
  children: ReactNode
  cell: Cell<DataGridFeatures, TData, unknown>
  dndRef?: React.Ref<HTMLTableCellElement>
  dndStyle?: CSSProperties
  /** Center-column index under column virtualization; data-column-index. */
  columnIndex?: number
}) {
  const { props, table, gridId } = useDataGrid()

  const { column, row } = cell
  const isPinned = column.getIsPinned()
  const isLastStartPinned =
    isPinned === "start" && column.getIsLastColumn("start")
  const isFirstEndPinned = isPinned === "end" && column.getIsFirstColumn("end")
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })

  // The atom check backs up the flag: consumers may hand the grid a leaner
  // bundle without cellSelectionFeature, and the flag alone must not make the
  // renderer call prototype APIs that were never assigned.
  const cellSelectionOn =
    !!props.tableLayout?.cellSelection && table.atoms.cellSelection != null
  const rangeSelectionOn =
    cellSelectionOn && props.tableLayout?.cellSelectionMode !== "single"

  const renderTd = (
    selection: ReturnType<typeof getDataGridCellSelectionCellAttrs> | null
  ) => (
    <td
      ref={dndRef}
      // The id is what the controller's aria-activedescendant points at, so
      // a screen reader tracks the focused cell through the container-focus
      // model.
      id={
        cellSelectionOn
          ? `${gridId}c-${toDataGridDomId(row.id)}-${toDataGridDomId(column.id)}`
          : undefined
      }
      aria-colindex={cellSelectionOn ? column.getIndex() + 1 : undefined}
      style={{
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        // Paint containment clips at the padding edge, which would erase
        // the ::before selection chrome on pinned cells.
        ...(cellSelectionOn ? { contain: undefined } : null),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--col-${column.id}-size) * 1px)`,
        }),
        ...(dndStyle ? dndStyle : null),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={
        isLastStartPinned ? "start" : isFirstEndPinned ? "end" : undefined
      }
      data-cell-status={props.getCellStatus?.(row.original, column.id)}
      data-column-index={columnIndex}
      {...(selection ? selection : null)}
      onMouseDown={
        selection
          ? (event) => {
              if (event.button !== 0) return
              if (isDataGridCellInteractiveTarget(event.target)) {
                // A modifier click is a SELECTION gesture even on a control:
                // Shift extends and Ctrl/Cmd adds, exactly as on a plain
                // cell, so no column is unreachable for ranges.
                if (
                  rangeSelectionOn &&
                  (event.shiftKey || event.metaKey || event.ctrlKey) &&
                  cell.getCanSelect()
                ) {
                  event.preventDefault()
                  cell.getSelectionStartHandler()(event)
                  return
                }
                // The press starts the range session exactly like a plain
                // cell: the cell focuses, a drag extends from it, and a
                // motionless press still ends in the control's own click
                // (this is why drag releases are squelched upstream, in the
                // controller, once a drag actually grew the range).
                if (cell.getCanSelect()) {
                  if (rangeSelectionOn) {
                    cell.getSelectionStartHandler()(event)
                  } else {
                    table.setFocusedCell(row.id, column.id)
                  }
                }
                return
              }
              if (!rangeSelectionOn) {
                // Single mode: every gesture collapses to the one cell.
                if (cell.getCanSelect()) {
                  table.setFocusedCell(row.id, column.id)
                }
                return
              }
              cell.getSelectionStartHandler()(event)
            }
          : undefined
      }
      onMouseEnter={
        rangeSelectionOn
          ? (event) => cell.getSelectionExtendHandler()(event)
          : undefined
      }
      className={cn(
        "align-middle",
        bodyCellSpacing,
        // The classic edited-cell corner mark, active only when
        // getCellStatus is wired: amber for "dirty", destructive for
        // "invalid".
        props.getCellStatus &&
          "data-[cell-status=invalid]:after:border-t-destructive data-[cell-status]:relative data-[cell-status]:after:absolute data-[cell-status]:after:end-0 data-[cell-status]:after:top-0 data-[cell-status]:after:size-0 data-[cell-status]:after:border-s-[5px] data-[cell-status]:after:border-t-[5px] data-[cell-status]:after:border-s-transparent data-[cell-status]:after:content-[''] data-[cell-status=dirty]:after:border-t-amber-500",
        props.tableLayout?.cellBorder && "border-e",
        // Mirror of the head cell rule: no floating border against the
        // resize filler strip.
        props.tableLayout?.cellBorder &&
          props.tableLayout?.columnsResizable &&
          // With end-pinned columns but no pin affordance, the pinned edge
          // draws no separator of its own; keep the border then.
          (props.tableLayout?.columnsPinnable ||
            !hasDataGridTableRightPinnedColumns(table)) &&
          !isPinned &&
          column.getIsLastColumn("center") &&
          "border-e-0",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          !cellSelectionOn &&
          "truncate",
        cell.column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          cn(
            "data-pinned:bg-background data-pinned:isolate",
            "[&[data-pinned=start][data-last-col=start]]:shadow-[inset_-1px_0_0_0_var(--border)]",
            "[&[data-pinned=end][data-last-col=end]]:shadow-[inset_1px_0_0_0_var(--border)]"
          ),
        column.getIndex() === 0 ||
          column.getIndex() === row.getVisibleCells().length - 1
          ? props.tableClassNames?.edgeCell
          : "",
        selection && dataGridCellSelectionCellClasses
      )}
    >
      {/* With cell selection on, the td must not clip (its ::before paints
          the selection chrome 1px outside the cell), so the resize
          truncation moves to an inner wrapper that clips at the same
          boundary the td used to. */}
      {cellSelectionOn &&
      props.tableLayout?.columnsResizable &&
      column.getCanResize() ? (
        <div
          className={bodyCellTruncateWrapVariants({
            size: props.tableLayout?.dense ? "dense" : "default",
          })}
        >
          {children}
        </div>
      ) : (
        children
      )}
      {props.tableLayout?.cellFillHandle &&
        selection?.["data-cell-edge-bottom"] &&
        selection["data-cell-edge-right"] && (
          <span
            data-slot="data-grid-cell-fill-handle"
            /* "dot" stays fully inside the cell corner; "ring" rides the
               corner point the way Sheets draws it. Either way the handle
               clamps where straddling would break: at the grid's own
               boundary (last row, last cell, a last cell followed only by
               the filler strip), where an overhang would extend the scroll
               content and clip the selection chrome, and beside a PINNED
               column, whose sticky layer (z 30) would otherwise paint over
               the straddling half - raising the handle instead would float
               it above the pinned column during horizontal scroll. */
            className={cn(
              "absolute z-10 cursor-crosshair in-data-[cell-editing]:hidden in-data-[cell-selecting]:hidden",
              props.tableLayout?.cellFillHandleVariant === "ring"
                ? "border-primary bg-background -end-[5px] -bottom-[5px] size-[11px] rounded-full border-2 in-[td:has(+[data-slot=data-grid-table-fill-body-cell]+td[data-pinned])]:end-0 in-[td:has(+[data-slot=data-grid-table-fill-body-cell]:last-child)]:end-0 in-[td:has(+td[data-pinned])]:end-0 in-[td:last-child]:end-0 in-[tr:last-child]:bottom-0"
                : props.tableLayout?.cellFillHandleVariant === "square"
                  ? /* Abutting the cell borders from inside: no gap and no
                       overlap, so the square cannot merge with a gridline
                       into a wider-than-tall blob, and it can never leave
                       the grid, which is why it needs no boundary clamps. */
                    "bg-primary end-0 bottom-0 size-[5px]"
                  : "bg-primary border-background end-0 bottom-0 size-[9px] rounded-full border",
              props.tableClassNames?.cellFillHandle
            )}
          />
        )}
    </td>
  )

  if (!cellSelectionOn) return renderTd(null)

  // Per-cell subscription with a projecting selector: the atom writes once
  // per cell crossed during a drag, and shallow-comparing this tuple limits
  // the re-render to cells whose selection state actually changed.
  return (
    <Subscribe
      source={table.atoms.cellSelection}
      selector={() => getDataGridCellSelectionCellAttrs(cell)}
    >
      {(selection) => renderTd(selection)}
    </Subscribe>
  )
}

function DataGridTableRenderedRow<TData extends object>({
  row,
  pinnedBoundary,
  rowRef,
  rowIndex,
  centerWindow,
}: {
  row: Row<DataGridFeatures, TData>
  pinnedBoundary?: DataGridTablePinnedBoundary
  rowRef?: React.Ref<HTMLTableRowElement>
  /** Virtualized list index, rendered as data-index for measureElement. */
  rowIndex?: number
  /**
   * Column-virtualization window over the CENTER cells: only the inclusive
   * [start, end] slice renders, and each flank collapses into one colSpan
   * spacer. The spacers carry no width of their own - the colgroup stays
   * complete, so under table-fixed the browser sizes them from the col
   * elements they span and the layout cannot drift.
   */
  centerWindow?: { start: number; end: number }
}) {
  const { props, table } = useDataGrid()
  const startVisibleCells = row.getStartVisibleCells()
  const centerVisibleCells = row.getCenterVisibleCells()
  const endVisibleCells = row.getEndVisibleCells()
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table)
  const windowedCenterCells = centerWindow
    ? centerVisibleCells.slice(centerWindow.start, centerWindow.end + 1)
    : centerVisibleCells
  const leadingSpacerSpan = centerWindow ? centerWindow.start : 0
  const trailingSpacerSpan = centerWindow
    ? Math.max(0, centerVisibleCells.length - 1 - centerWindow.end)
    : 0

  return (
    <Fragment>
      <DataGridTableBodyRow
        row={row}
        pinnedBoundary={pinnedBoundary}
        rowRef={rowRef}
        dataIndex={rowIndex}
      >
        {startVisibleCells.map(
          (cell: Cell<DataGridFeatures, TData, unknown>) => (
            <DataGridTableBodyRowCell cell={cell} key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DataGridTableBodyRowCell>
          )
        )}
        {leadingSpacerSpan > 0 && (
          <td
            aria-hidden="true"
            data-slot="data-grid-table-virtual-col-spacer"
            colSpan={leadingSpacerSpan}
          />
        )}
        {windowedCenterCells.map(
          (cell: Cell<DataGridFeatures, TData, unknown>, cellIndex) => (
            <DataGridTableBodyRowCell
              cell={cell}
              key={cell.id}
              columnIndex={
                centerWindow ? centerWindow.start + cellIndex : undefined
              }
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DataGridTableBodyRowCell>
          )
        )}
        {trailingSpacerSpan > 0 && (
          <td
            aria-hidden="true"
            data-slot="data-grid-table-virtual-col-spacer"
            colSpan={trailingSpacerSpan}
          />
        )}
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

function DataGridTableEmpty() {
  const { i18n, table, props } = useDataGrid()
  const visibleColumnCount =
    getDataGridTableOrderedVisibleColumns(table).length +
    (props.tableLayout?.columnsResizable ? 1 : 0)

  return (
    <tr>
      <td
        colSpan={Math.max(visibleColumnCount, 1)}
        className="text-muted-foreground py-6 text-center text-sm"
      >
        {props.emptyMessage || i18n.labels.empty}
      </td>
    </tr>
  )
}

function DataGridTableLoader() {
  const { i18n, props } = useDataGrid()

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="text-muted-foreground bg-card style-vega:rounded-lg style-nova:rounded-lg style-maia:rounded-2xl style-lyra:rounded-none style-mira:rounded-lg style-luma:rounded-3xl style-sera:rounded-none style-rhea:rounded-2xl flex items-center gap-2 border px-4 py-2 text-sm leading-none font-medium">
        <Spinner className="size-5 opacity-60" />
        {props.loadingMessage || i18n.labels.loading}
      </div>
    </div>
  )
}

function DataGridTableRowPin<TData extends object>({
  row,
}: {
  row: Row<DataGridFeatures, TData>
}) {
  const { i18n } = useDataGrid()
  const isPinned = row.getIsPinned()

  return (
    <button
      type="button"
      aria-label={isPinned ? i18n.labels.unpinRow : i18n.labels.pinRow}
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

/**
 * Selection cell.
 *
 * The `Subscribe` wrapper is the v9 fix for React Compiler, and it is why this
 * file no longer needs `"use no memo"`. `useTable` hands back a fresh table on
 * every state change, which covers anything read through `table`, but this
 * component reads selection through `row.getIsSelected()` - a builder call
 * that hides its state dependency from the compiler. Rendered inside a column
 * `cell` template it receives a *stable* row, so the compiler is free to
 * memoize this JSX and never re-run those reads, which shows up as checkboxes
 * that do not respond to clicks.
 *
 * Subscribing to the row-selection atom gives the compiler a dependency it can
 * see. Note the standalone `Subscribe` rather than `table.Subscribe`: inside a
 * cell template the `table` handed to the column def is the core `Table`, which
 * has no `Subscribe` attached.
 */
function DataGridTableRowSelect<TData extends object>({
  row,
}: {
  row: Row<DataGridFeatures, TData>
}) {
  const { i18n } = useDataGrid()
  return (
    <Subscribe source={row.table.atoms.rowSelection}>
      {() => (
        <>
          <Checkbox
            checked={
              row.getIsSomeSelected() && !row.getIsSelected()
                ? "indeterminate"
                : row.getIsSelected()
            }
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(event) => {
              // Selection must not bubble into the row's onRowClick handler.
              event.stopPropagation()
            }}
            aria-label={i18n.labels.selectRow}
            className="align-[inherit]"
          />
        </>
      )}
    </Subscribe>
  )
}

function DataGridTableRowSelectAll() {
  const { i18n, table, recordCount, isLoading } = useDataGrid()

  // `getIsSomePageRowsSelected()` means "at least one" in v9, where v8 meant
  // "some but not all", so the all-selected case has to be excluded explicitly
  // or the header checkbox stays indeterminate once every row is checked.
  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => {
        const isAllSelected = table.getIsAllPageRowsSelected()
        const isSomeSelected = table.getIsSomePageRowsSelected()

        return (
          <Checkbox
            checked={
              isSomeSelected && !isAllSelected ? "indeterminate" : isAllSelected
            }
            disabled={isLoading || recordCount === 0}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={i18n.labels.selectAll}
            className="align-[inherit]"
          />
        )
      }}
    </Subscribe>
  )
}

function DataGridTableRowExpand<TData extends object>({
  row,
  indent = 20,
  className,
  children,
}: {
  row: Row<DataGridFeatures, TData>
  /** Horizontal offset in px applied per tree depth level. */
  indent?: number
  className?: string
  /** Custom toggle icon; replaces the default chevron. */
  children?: ReactNode
}) {
  const { i18n, props } = useDataGrid()
  const isExpanded = row.getIsExpanded()
  const controlSize = props.tableLayout?.dense ? "size-6" : "size-7"

  return (
    <span
      data-slot="data-grid-table-row-expand"
      style={getDataGridTreeIndentStyle(row, indent)}
      className={cn(
        "inline-flex shrink-0 items-center ps-(--data-grid-tree-padding) align-middle",
        className
      )}
    >
      {row.getCanExpand() ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={
            isExpanded ? i18n.labels.collapseRow : i18n.labels.expandRow
          }
          onClick={(event) => {
            // Expansion must not bubble into the row's onRowClick handler.
            event.stopPropagation()
            row.toggleExpanded()
          }}
          className={cn(
            "text-muted-foreground hover:text-foreground style-vega:rounded-md style-nova:rounded-lg style-maia:rounded-full style-lyra:rounded-none style-mira:rounded-md style-luma:rounded-full style-sera:rounded-none style-rhea:rounded-full inline-flex items-center justify-center transition-colors",
            controlSize
          )}
        >
          {children ?? (
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
              aria-hidden="true"
              className="transition-transform duration-200 in-aria-[expanded=false]:-rotate-90 rtl:in-aria-[expanded=false]:rotate-90"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </button>
      ) : (
        // Leaf spacer: compact by design so leaf content sits near the
        // parent label instead of a full toggle width deeper.
        <span aria-hidden="true" className="w-2 shrink-0" />
      )}
    </span>
  )
}

function DataGridTableBodyRows<TData extends object>({
  table,
}: {
  table: DataGridTableInstance<TData>
}) {
  const { i18n, isLoading, props } = useDataGrid()
  const pagination = table.state.pagination

  if (isLoading && props.loadingMode === "skeleton" && pagination?.pageSize) {
    const leftVisibleColumns = table.getStartVisibleLeafColumns()
    const centerVisibleColumns = table.getCenterVisibleLeafColumns()
    const rightVisibleColumns = table.getEndVisibleLeafColumns()
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
            {props.loadingMessage || i18n.labels.loading}
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
 * A cell-selection drag gets the same treatment: the root re-renders once per
 * cell crossed, but painting goes through each cell's own Subscribe, so row
 * reconciliation during the drag is pure waste.
 */
const MemoizedDataGridTableBodyRows = memo(
  DataGridTableBodyRows,
  (_prev, next) =>
    !!next.table.state.columnResizing.isResizingColumn ||
    next.table._isSelectingCells === true
) as typeof DataGridTableBodyRows

function DataGridTableHeader<TData extends object>() {
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
                {props.tableLayout?.columnsResizable &&
                hasRightPinnedColumns ? (
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

function DataGridTable<TData extends object>({
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
                    .filter((header) => header.column.getIsPinned() !== "end")
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
                    .filter((header) => header.column.getIsPinned() === "end")
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

export {
  DataGridTable,
  DataGridTableAddRow,
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
  DataGridTableRowExpand,
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
  getDataGridTreeIndentStyle,
  hasDataGridTableRightPinnedColumns,
}

export type { DataGridTablePinnedBoundary }
