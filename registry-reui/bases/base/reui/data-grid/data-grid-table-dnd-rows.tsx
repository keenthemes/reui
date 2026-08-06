"use client"

import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import type { CSSProperties, ReactNode } from "react"
import {
  useDataGrid,
  useDataGridI18n,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import type {
  DataGridFeatures,
  DataGridTableInstance,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import {
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
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
} from "@/registry-reui/bases/base/reui/data-grid/data-grid-table"
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragCancelEvent,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Modifier,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  type SortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { flexRender } from "@tanstack/react-table"
import type { Cell, HeaderGroup, Row, Table } from "@tanstack/react-table"
import { createPortal } from "react-dom"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Context to share sortable listeners from row to handle
type SortableContextValue = ReturnType<typeof useSortable>
const SortableRowContext = createContext<Pick<
  SortableContextValue,
  "attributes" | "listeners"
> | null>(null)

/**
 * Tree metadata attached to every sortable row, readable from
 * `active.data.current` / `over.data.current` in any drag event. Cross-parent
 * drops can be resolved from it without re-deriving the shape of the table.
 */
type DataGridTableDndRowData = {
  type: "data-grid-row"
  /** Tree depth, 0 for root rows. */
  depth: number
  /** Index within the parent's children, or within the root rows. */
  index: number
  /** Parent row id, or null for root rows. */
  parentId: string | null
}

/**
 * Per-row render slot for drop indicators and depth guides. The returned node
 * is positioned over the row, so it never adds a column, shifts striping, or
 * gets clipped by a truncating resizable cell.
 */
type DataGridTableDndRowDecoration<TData extends object> = (context: {
  row: Row<DataGridFeatures, TData>
  isDragging: boolean
  isOver: boolean
}) => ReactNode

function DataGridTableDndRowHandle({
  className,
  disabled,
  disabledLabel,
}: {
  className?: string
  /**
   * Renders the grip inert instead of withdrawing it. A grid that reorders on
   * one truth (manual order) and sorts on another cannot honour both at once,
   * but dropping the handle entirely collapses the gutter and reads as broken
   * rather than as unavailable. Keep the column's shape, mute the control.
   */
  disabled?: boolean
  /** Announced and shown on hover in place of the drag affordance. */
  disabledLabel?: string
}) {
  const context = useContext(SortableRowContext)
  const i18n = useDataGridI18n()
  const resolvedDisabledLabel = disabledLabel ?? i18n.labels.reorderUnavailable

  if (!context || disabled) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          "size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing",
          // The Button's own disabled treatment supplies the muting; only the
          // cursor needs saying, so the grip reads as unavailable rather than
          // merely unresponsive.
          disabled && "cursor-not-allowed",
          className
        )}
        aria-label={
          disabled ? resolvedDisabledLabel : i18n.labels.dragToReorderRow
        }
        title={disabled ? resolvedDisabledLabel : undefined}
        disabled
      >
        <IconPlaceholder
          lucide="GripHorizontalIcon"
          tabler="IconGripHorizontal"
          hugeicons="DragDropHorizontalIcon"
          phosphor="DotsSixIcon"
          remixicon="RiDraggable"
          aria-hidden="true"
        />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(
        "size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing",
        className
      )}
      aria-label={i18n.labels.dragToReorderRow}
      {...context.attributes}
      {...context.listeners}
    >
      <IconPlaceholder
        lucide="GripHorizontalIcon"
        tabler="IconGripHorizontal"
        hugeicons="DragDropHorizontalIcon"
        phosphor="DotsSixIcon"
        remixicon="RiDraggable"
        aria-hidden="true"
      />
    </Button>
  )
}

/**
 * The rows do not move while one is being carried.
 *
 * Sliding the siblings apart opens a gap the carried row could go into, which
 * reads well in a list of identical rows and badly in a table: the gap is the
 * height of the row you are holding, so with rows of unequal height it never
 * matches the slot it claims to be, and the row you picked up slides away from
 * where it started - which is exactly the position you need to remember if you
 * decide not to drop it.
 *
 * Holding everything still keeps the origin legible, and nothing is lost: the
 * DragOverlay clone follows the pointer and the drop indicator names the seam.
 * Pass `verticalListSortingStrategy` as `sortingStrategy` for the old feel.
 */
const holdRowsInPlaceStrategy: SortingStrategy = () => null

function DataGridTableDndRow<TData extends object>({
  row,
  renderRowDecoration,
  dropIndicator = true,
}: {
  row: Row<DataGridFeatures, TData>
  renderRowDecoration?: DataGridTableDndRowDecoration<TData>
  dropIndicator?: boolean
}) {
  const rowData: DataGridTableDndRowData = {
    type: "data-grid-row",
    depth: row.depth,
    index: row.index,
    parentId: row.getParentRow()?.id ?? null,
  }

  const {
    transform,
    setNodeRef,
    isDragging,
    isOver,
    attributes,
    listeners,
    index,
    activeIndex,
    overIndex,
  } = useSortable({
    id: row.id,
    data: rowData,
  })

  // Which edge of THIS row the carried row would land on, or null when it is
  // not the drop target. Nothing slides apart any more, so the bar is the only
  // thing that says where the drop goes: it marks the row at the destination
  // index, on the side the carried row comes to rest.
  //
  // Dragging down it lands after the target, dragging up before it, so the
  // edge follows the direction of travel.
  const dropEdge =
    dropIndicator && activeIndex !== -1 && index === overIndex && !isDragging
      ? activeIndex < overIndex
        ? "bottom"
        : "top"
      : null

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    // dnd-kit's transition is deliberately dropped. A transition on a transform
    // property of a `tr` does not merely fail to animate in Chrome, it stops the
    // transform applying at all: the element sits at the start value forever.
    // The drag source escapes it because dnd-kit disables its own transition
    // while it is being dragged, which is why the carried row used to be the
    // ONLY one that moved and every other row silently refused to open a gap.
    // Displacement therefore lands in one step, which is what a table wants.
    zIndex: isDragging ? 1 : 0,
    position: "relative",
    cursor: isDragging ? "grabbing" : undefined,
    // The row you are holding is drawn by the DragOverlay, so the one left
    // behind is not a second copy of it - it is the slot you came from, and it
    // stays exactly where it was. Fading alone read as "this row is busy";
    // the outline says "this is the space you are moving out of", which is the
    // thing you need if you change your mind mid-drag.
    ...(isDragging && {
      opacity: 0.4,
      // Inset so the dashes sit inside the row box and cannot be clipped by
      // the neighbouring row's border.
      outline: "1px dashed var(--border)",
      outlineOffset: "-1px",
    }),
  }

  const decoration = renderRowDecoration?.({ row, isDragging, isOver })

  return (
    <SortableRowContext.Provider value={{ attributes, listeners }}>
      <DataGridTableBodyRow row={row} dndRef={setNodeRef} dndStyle={style}>
        {row
          .getVisibleCells()
          .map((cell: Cell<DataGridFeatures, TData, unknown>, index, cells) => {
            return (
              <DataGridTableBodyRowCell cell={cell} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                {decoration && index === cells.length - 1 ? (
                  // Rides inside the last cell rather than in a `td` of its own.
                  // An absolutely positioned `td` is still a cell as far as table
                  // layout is concerned, so it added a NINTH column with no width
                  // of its own, and under `table-layout: fixed` that new column
                  // swallowed the whole surplus the real columns had been sharing
                  // — every column snapped back to its declared size and the row's
                  // content visibly narrowed the moment a drag began. A plain
                  // element adds no column. It still anchors to the ROW, because
                  // the row is the nearest positioned ancestor, so the decoration
                  // spans the full width and is not clipped by the cell.
                  <div
                    aria-hidden="true"
                    data-slot="data-grid-table-row-decoration"
                    className="pointer-events-none absolute inset-0"
                  >
                    {decoration}
                  </div>
                ) : null}
                {dropEdge && index === cells.length - 1 ? (
                  // Same anchoring trick as the decoration above: a plain
                  // element inside the last cell, so it adds no column and
                  // cannot disturb `table-layout: fixed`. It spans the row
                  // because the row is the nearest positioned ancestor.
                  <div
                    aria-hidden="true"
                    data-slot="data-grid-table-row-drop-indicator"
                    data-edge={dropEdge}
                    className="pointer-events-none absolute inset-0 z-20"
                  >
                    {/* Two solid pixels down the leading edge, the same marker
                        the tree drag uses for its drop target. A wash across
                        the row has to stay faint enough not to read as a
                        selected row, and in the achromatic styles primary
                        carries no chroma at all, so faint plus colourless is
                        just grey. The bar reads at any weight and leaves the
                        row's own background to hover and selection.

                        The bar is the whole indicator: the gap the rows have
                        already opened says which side, so a rule across the
                        seam as well only competes with the row borders it sits
                        between. `data-edge` still carries the direction for
                        anyone styling their own. */}
                    <span className="bg-primary absolute inset-y-0 start-0 w-0.5" />
                  </div>
                ) : null}
              </DataGridTableBodyRowCell>
            )
          })}
        <DataGridTableFillBodyCell />
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
    </SortableRowContext.Provider>
  )
}

function DataGridTableDndRowsBody<TData extends object>({
  table,
  dataIds,
  renderRowDecoration,
  dropIndicator,
  sortingStrategy,
}: {
  table: DataGridTableInstance<TData>
  dataIds: UniqueIdentifier[]
  renderRowDecoration?: DataGridTableDndRowDecoration<TData>
  dropIndicator?: boolean
  sortingStrategy: SortingStrategy
}) {
  const { isLoading, props } = useDataGrid()
  const pagination = table.state.pagination

  if (props.loadingMode === "skeleton" && isLoading && pagination?.pageSize) {
    return (
      <>
        {Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
          <DataGridTableBodyRowSkeleton key={rowIndex}>
            {table.getVisibleFlatColumns().map((column, colIndex) => {
              return (
                <DataGridTableBodyRowSkeletonCell
                  column={column}
                  key={colIndex}
                >
                  {column.columnDef.meta?.skeleton}
                </DataGridTableBodyRowSkeletonCell>
              )
            })}
            <DataGridTableFillBodyCell />
          </DataGridTableBodyRowSkeleton>
        ))}
      </>
    )
  }

  if (!table.getRowModel().rows.length) return <DataGridTableEmpty />

  return (
    <SortableContext items={dataIds} strategy={sortingStrategy}>
      {table.getRowModel().rows.map((row: Row<DataGridFeatures, TData>) => {
        return (
          <DataGridTableDndRow
            row={row}
            renderRowDecoration={renderRowDecoration}
            dropIndicator={dropIndicator}
            key={row.id}
          />
        )
      })}
    </SortableContext>
  )
}

/**
 * Memoized body rows: skip re-renders during active column resize.
 * Column widths update via CSS variables on the <table> element,
 * so the browser handles width changes without React re-renders.
 */
const MemoizedDataGridTableDndRowsBody = memo(
  DataGridTableDndRowsBody,
  (_prev, next) => !!next.table.state.columnResizing.isResizingColumn
) as typeof DataGridTableDndRowsBody

function DataGridTableDndRows<TData extends object>({
  handleDragEnd,
  dataIds,
  footerContent,
  collisionDetection = closestCenter,
  modifiers,
  sortingStrategy = holdRowsInPlaceStrategy,
  renderRowDecoration,
  dropIndicator = true,
  onDragStart,
  onDragMove,
  onDragOver,
  onDragCancel,
}: {
  handleDragEnd: (event: DragEndEvent) => void
  dataIds: UniqueIdentifier[]
  footerContent?: ReactNode
  /** Overrides the default `closestCenter` strategy. */
  collisionDetection?: CollisionDetection
  /**
   * Replaces the default axis restriction, e.g. drop `restrictToVerticalAxis`
   * to allow the horizontal gesture that tree re-parenting relies on. The
   * table container clamp is always applied after these, so a dragged row
   * cannot leave the grid.
   */
  modifiers?: Modifier[]
  /**
   * Replaces the default `verticalListSortingStrategy`. Return null from a
   * strategy to leave every row exactly where it is. A tree needs that: its drop
   * is either INTO the hovered row or BETWEEN two rows, and which one it is
   * flips as the pointer crosses a single row, so a gap that opens for one and
   * shuts for the other flickers the whole surface. Such a caller draws its own
   * insertion line instead, and pairs this with a modifier that holds the
   * carried row still, since a gap nothing moves into is just a hole.
   */
  sortingStrategy?: SortingStrategy
  /** Per-row slot for drop indicators and depth guides. */
  renderRowDecoration?: DataGridTableDndRowDecoration<TData>
  /**
   * Draws a line on the seam the carried row would land on. On by default;
   * pass `false` when `renderRowDecoration` paints its own insertion affordance
   * and the two would compete.
   */
  dropIndicator?: boolean
  onDragStart?: (event: DragStartEvent) => void
  onDragMove?: (event: DragMoveEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  onDragCancel?: (event: DragCancelEvent) => void
}) {
  const { table, props } = useDataGrid<TData>()
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [isDraggingRow, setIsDraggingRow] = useState(false)
  // The overlay is portalled to the document body. dnd-kit renders DragOverlay
  // in place, and it positions with `position: fixed` against viewport
  // coordinates - so any ancestor that establishes a containing block for fixed
  // descendants silently re-anchors it. `content-visibility`, `contain`,
  // `transform`, `filter` and `will-change` all do that, and the first two are
  // exactly what a card grid uses to defer off-screen work. The clone then
  // lands offset by that ancestor's own top/left, and the container clamp
  // below mis-clamps too, because its rects are measured in viewport space.
  //
  // Resolved in an effect rather than read at render so the server and the
  // first client render agree. A drag cannot start before hydration, so the
  // overlay being absent for one frame costs nothing.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalTarget(document.body)
  }, [])
  // The row being carried, plus the column widths measured off the header the
  // moment the drag starts. The clone lives outside the table, so it has no
  // columns of its own and has to be told what they are.
  const [carried, setCarried] = useState<{
    id: UniqueIdentifier
    width: number
    height: number
    columns: number[]
  } | null>(null)

  const pickUpRow = useCallback((id: UniqueIdentifier) => {
    const container = tableContainerRef.current
    const head = container?.querySelector("thead tr")
    if (!container || !head) {
      setCarried(null)
      return
    }

    // The clone has to be exactly as tall as the row it was lifted from.
    // A fixed height reads as the grid growing under the pointer the moment
    // you pick a row up, and it is wrong in both directions: rows whose
    // content wraps are taller than any constant, and dense rows are shorter.
    const source = Array.from(
      container.querySelectorAll<HTMLElement>("tbody tr[data-row-id]")
    ).find((candidate) => candidate.dataset.rowId === String(id))
    const height = source?.getBoundingClientRect().height ?? 0

    // The fill cell is a header-only spacer that soaks up the surplus a column
    // resize leaves behind, and the clone renders data cells only. Measuring it
    // in would make the clone's table wider than the cells it actually holds,
    // and `table-fixed` hands that orphaned width back out across every column
    // -- the carried row comes out visibly wider than the row it was lifted
    // from. So the width is the sum of what we render, never the header's own.
    const columns = Array.from(head.children)
      .filter(
        (cell) =>
          cell.getAttribute("data-slot") !== "data-grid-table-fill-head-cell"
      )
      .map((cell) => cell.getBoundingClientRect().width)

    setCarried({
      id,
      width: columns.reduce((total, width) => total + width, 0),
      height,
      columns,
    })
  }, [])

  const carriedRow = carried
    ? table
        .getRowModel()
        .rows.find((row: Row<DataGridFeatures, TData>) => row.id === carried.id)
    : undefined

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    // Keyboard reordering moves one sortable position per keypress instead
    // of the sensor's raw 25px default.
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!isDraggingRow) return

    const { body, documentElement } = document
    const previousBodyCursor = body.style.cursor
    const previousDocumentCursor = documentElement.style.cursor

    body.style.cursor = "grabbing"
    documentElement.style.cursor = "grabbing"

    return () => {
      body.style.cursor = previousBodyCursor
      documentElement.style.cursor = previousDocumentCursor
    }
  }, [isDraggingRow])

  const resolvedModifiers = useMemo(() => {
    const restrictToTableContainer: Modifier = ({
      transform,
      draggingNodeRect,
    }) => {
      if (!tableContainerRef.current || !draggingNodeRect) {
        return transform
      }

      const containerRect = tableContainerRef.current.getBoundingClientRect()
      const { x, y } = transform

      const minX = containerRect.left - draggingNodeRect.left
      const maxX = containerRect.right - draggingNodeRect.right
      const minY = containerRect.top - draggingNodeRect.top
      const maxY = containerRect.bottom - draggingNodeRect.bottom

      return {
        ...transform,
        // The horizontal rail only engages while the default axis restriction
        // is in force. A row is exactly as wide as the viewport, so minX and
        // maxX both collapse to 0 and clamping x erases it entirely: harmless
        // under restrictToVerticalAxis, which zeroes x anyway, but fatal for a
        // caller that replaced the restriction precisely to READ x, as a tree
        // does to resolve drop depth. Vertical is railed either way, which is
        // what actually keeps a dragged row inside the grid.
        x: modifiers ? x : Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y)),
      }
    }

    // The container clamp is a safety rail rather than a policy, so it stays
    // applied even when the caller replaces the axis restriction.
    return [
      ...(modifiers ?? [restrictToVerticalAxis]),
      restrictToTableContainer,
    ]
  }, [modifiers])

  return (
    <DndContext
      id={useId()}
      collisionDetection={collisionDetection}
      modifiers={resolvedModifiers}
      onDragCancel={(event) => {
        setIsDraggingRow(false)
        setCarried(null)
        onDragCancel?.(event)
      }}
      onDragEnd={(event) => {
        setIsDraggingRow(false)
        setCarried(null)
        handleDragEnd(event)
      }}
      onDragMove={onDragMove}
      onDragOver={onDragOver}
      onDragStart={(event) => {
        setIsDraggingRow(true)
        pickUpRow(event.active.id)
        onDragStart?.(event)
      }}
      sensors={sensors}
    >
      <DataGridTableViewport
        viewportRef={tableContainerRef}
        className={
          isDraggingRow
            ? "relative cursor-grabbing [&_*]:cursor-grabbing!"
            : "relative"
        }
      >
        <DataGridTableBase>
          <DataGridTableHead>
            {table
              .getHeaderGroups()
              .map(
                (headerGroup: HeaderGroup<DataGridFeatures, TData>, index) => {
                  return (
                    <DataGridTableHeadRow key={index} rowId={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => {
                        const { column } = header

                        return (
                          <DataGridTableHeadRowCell header={header} key={index}>
                            {header.isPlaceholder ? null : props.tableLayout
                                ?.columnsResizable && column.getCanResize() ? (
                              <>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </>
                            ) : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            )}
                            {props.tableLayout?.columnsResizable &&
                              column.getCanResize() && (
                                <DataGridTableHeadRowCellResize
                                  header={header}
                                />
                              )}
                          </DataGridTableHeadRowCell>
                        )
                      })}
                      <DataGridTableFillHeadCell />
                    </DataGridTableHeadRow>
                  )
                }
              )}
          </DataGridTableHead>

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

          <DataGridTableBody>
            <MemoizedDataGridTableDndRowsBody
              table={table}
              dataIds={dataIds}
              renderRowDecoration={renderRowDecoration}
              dropIndicator={dropIndicator}
              sortingStrategy={sortingStrategy}
            />
          </DataGridTableBody>

          {footerContent && (
            <DataGridTableFoot>{footerContent}</DataGridTableFoot>
          )}
        </DataGridTableBase>
      </DataGridTableViewport>

      {/* The row you are actually holding. It is a real clone rendered outside
          the table, which is the only way a dragged row can follow the pointer
          without disturbing the grid: it adds no cell, so it cannot alter the
          column widths, and it floats above the rows rather than through them.
          Its presence also tells dnd-kit to stop translating the source row, so
          the row left behind simply dims in place.

          Portalled to the body so the fixed positioning resolves against the
          viewport wherever the grid is mounted. React context crosses a portal,
          so DndContext still reaches it. */}
      {portalTarget
        ? createPortal(
            <DragOverlay dropAnimation={null}>
              {carried && carriedRow ? (
                <table
                  aria-hidden="true"
                  style={{ width: carried.width, tableLayout: "fixed" }}
                  className="bg-background border-border pointer-events-none cursor-grabbing rounded-md border shadow-lg"
                >
                  <tbody>
                    {/* Padding rides on the inner element, not the cell. A `td` can
                  never render narrower than its own horizontal padding, so a
                  column resized below that would silently widen here and the
                  clone would stop matching the row it came from. Height comes
                  from the measured source row for the same reason the widths
                  do: the clone has no row of its own to inherit it from. */}
                    <tr
                      style={{ height: carried.height || undefined }}
                      className="[&>td]:p-0 [&>td]:align-middle"
                    >
                      {carriedRow
                        .getVisibleCells()
                        .map(
                          (
                            cell: Cell<DataGridFeatures, TData, unknown>,
                            index: number
                          ) => (
                            <td
                              key={cell.id}
                              // Falls back to the column's own size so an unforeseen
                              // header/cell count mismatch degrades to a real width
                              // rather than to `auto`.
                              style={{
                                width:
                                  carried.columns[index] ??
                                  cell.column.getSize(),
                              }}
                            >
                              <div className="truncate px-3">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            </td>
                          )
                        )}
                    </tr>
                  </tbody>
                </table>
              ) : null}
            </DragOverlay>,
            portalTarget
          )
        : null}
    </DndContext>
  )
}

export { DataGridTableDndRowHandle, DataGridTableDndRows }
export type { DataGridTableDndRowData, DataGridTableDndRowDecoration }
