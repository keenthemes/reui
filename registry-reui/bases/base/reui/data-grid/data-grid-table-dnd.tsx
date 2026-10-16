"use client"

// Opted out of React Compiler with the rest of the grid (see data-grid.tsx).
"use no memo"

import {
  Fragment,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import type { CSSProperties, ReactNode } from "react"
import {
  getDataGridHeaderSpans,
  useDataGrid,
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
  getDataGridHeadCellResizeHeader,
  getDataGridHeadCellSizeVar,
  getDataGridTableMergedHeaderGroups,
  renderDataGridTableHeadCellContent,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid-table"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DndContextProps,
  type DragEndEvent,
  type KeyboardSensorProps,
  type Modifier,
} from "@dnd-kit/core"
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { flexRender } from "@tanstack/react-table"
import type { Cell, Header, Row } from "@tanstack/react-table"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function DataGridTableDndHeader<TData extends object>({
  header,
  coveredHeaders = [],
}: {
  header: Header<DataGridFeatures, TData, unknown>
  /** Headers this cell spans through meta.headerColSpan. */
  coveredHeaders?: Header<DataGridFeatures, TData, unknown>[]
}) {
  const { i18n, props } = useDataGrid()
  const { column } = header

  // Pinning decides where a pinned column renders whatever columnOrder says,
  // so dragging one could only rewrite hidden order. It gets no grip and is
  // neither a drag source nor a drop target. Neither is a group cell: its
  // id is not in columnOrder, which holds leaves only.
  const isPinned = !!column.getIsPinned()
  const isGroup = column.columns.length > 0
  // A span is no drag source: a drop moves one leaf, never its covered ones.
  const isSpan = coveredHeaders.length > 0
  const canOrder =
    (column.columnDef as { enableColumnOrdering?: boolean })
      .enableColumnOrdering !== false &&
    !isPinned &&
    !isGroup &&
    !isSpan

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
    disabled: isPinned || isGroup || isSpan,
  })
  const resizeHeader = getDataGridHeadCellResizeHeader(header, coveredHeaders)

  // This style spreads after getPinningStyles, so a sticky pinned cell must
  // not take the drag keys: relative and z-index 0 would unstick it and sink
  // it under the centre cells. Omitted, not undefined, which would still win.
  const isSticky =
    !!props.tableLayout?.columnsPinnable && column.getCanPin() && isPinned

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    ...(!isSticky && {
      position: "relative",
      transform: CSS.Translate.toString(transform),
      zIndex: isDragging ? 1 : 0,
    }),
    transition,
    cursor: isDragging ? "grabbing" : undefined,
    whiteSpace: "nowrap",
    width: props.tableLayout?.columnsResizable
      ? getDataGridHeadCellSizeVar(header, coveredHeaders)
      : coveredHeaders.reduce(
          (sum, covered) => sum + covered.column.getSize(),
          header.column.getSize()
        ),
  }

  return (
    <DataGridTableHeadRowCell
      header={header}
      coveredHeaders={coveredHeaders}
      dndStyle={style}
      dndRef={setNodeRef}
    >
      <div className="flex items-center justify-start gap-0.5">
        {canOrder && (
          <Button
            size="icon-sm"
            variant="ghost"
            className={`-ms-2 size-6 ${isDragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"}`}
            {...attributes}
            {...listeners}
            aria-label={i18n.labels.dragToReorder}
          >
            <IconPlaceholder
              lucide="GripVerticalIcon"
              tabler="IconGripVertical"
              hugeicons="DragDropVerticalIcon"
              phosphor="DotsSixVerticalIcon"
              remixicon="RiDraggable"
              className="opacity-60 hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        )}
        <div className="grow">{renderDataGridTableHeadCellContent(header)}</div>
        {props.tableLayout?.columnsResizable &&
          resizeHeader.column.getCanResize() && (
            <DataGridTableHeadRowCellResize header={resizeHeader} />
          )}
      </div>
    </DataGridTableHeadRowCell>
  )
}

function DataGridTableDndCell<TData extends object>({
  cell,
}: {
  cell: Cell<DataGridFeatures, TData, unknown>
}) {
  const { props } = useDataGrid()
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
    disabled: !!cell.column.getIsPinned(),
  })

  // Same rule as the header: a sticky pinned cell keeps its pinning styles.
  const isSticky =
    !!props.tableLayout?.columnsPinnable &&
    cell.column.getCanPin() &&
    !!cell.column.getIsPinned()

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    ...(!isSticky && {
      position: "relative",
      transform: CSS.Translate.toString(transform),
      zIndex: isDragging ? 1 : 0,
    }),
    transition,
    cursor: isDragging ? "grabbing" : undefined,
    width: props.tableLayout?.columnsResizable
      ? `calc(var(--col-${cell.column.id}-size) * 1px)`
      : cell.column.getSize(),
  }

  return (
    <DataGridTableBodyRowCell cell={cell} dndStyle={style} dndRef={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </DataGridTableBodyRowCell>
  )
}

function DataGridTableDndBodyRows<TData extends object>({
  table,
}: {
  table: DataGridTableInstance<TData>
}) {
  const { isLoading, props } = useDataGrid()
  const pagination = table.state.pagination

  if (props.loadingMode === "skeleton" && isLoading && pagination?.pageSize) {
    return (
      <>
        {Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
          <DataGridTableBodyRowSkeleton key={rowIndex}>
            {[
              ...[
                ...table.getStartVisibleLeafColumns(),
                ...table.getCenterVisibleLeafColumns(),
              ].map((column) => (
                <DataGridTableBodyRowSkeletonCell
                  column={column}
                  key={column.id}
                >
                  {column.columnDef.meta?.skeleton}
                </DataGridTableBodyRowSkeletonCell>
              )),
              <DataGridTableFillBodyCell key="__data-grid-fill" />,
              ...table.getEndVisibleLeafColumns().map((column) => (
                <DataGridTableBodyRowSkeletonCell
                  column={column}
                  key={column.id}
                >
                  {column.columnDef.meta?.skeleton}
                </DataGridTableBodyRowSkeletonCell>
              )),
            ]}
          </DataGridTableBodyRowSkeleton>
        ))}
      </>
    )
  }

  if (!table.getRowModel().rows.length) return <DataGridTableEmpty />

  return (
    <>
      {table.getRowModel().rows.map((row: Row<DataGridFeatures, TData>) => {
        return (
          <Fragment key={row.id}>
            <DataGridTableBodyRow row={row}>
              <SortableContext
                items={table.state.columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {/* One keyed list with the fill in the middle, as in the
                    head row below. */}
                {[
                  ...[
                    ...row.getStartVisibleCells(),
                    ...row.getCenterVisibleCells(),
                  ].map((cell: Cell<DataGridFeatures, TData, unknown>) => (
                    <DataGridTableDndCell cell={cell} key={cell.id} />
                  )),
                  <DataGridTableFillBodyCell key="__data-grid-fill" />,
                  ...row
                    .getEndVisibleCells()
                    .map((cell: Cell<DataGridFeatures, TData, unknown>) => (
                      <DataGridTableDndCell cell={cell} key={cell.id} />
                    )),
                ]}
              </SortableContext>
            </DataGridTableBodyRow>
            {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
          </Fragment>
        )
      })}
    </>
  )
}

/**
 * Memoized body rows: skip re-renders during active column resize.
 * Column widths update via CSS variables on the <table> element,
 * so the browser handles width changes without React re-renders.
 */
const MemoizedDataGridTableDndBodyRows = memo(
  DataGridTableDndBodyRows,
  (_prev, next) => !!next.table.state.columnResizing?.isResizingColumn
) as typeof DataGridTableDndBodyRows

// dnd-kit's KeyboardSensor scrolls instead of moving when the target sits
// past the middle of a scroller, and assumes scrollLeft runs 0 to max. RTL
// runs -max to 0, so from the start edge ArrowRight became a scrollTo that
// clamps to 0 and swallowed the keypress. The sensor gets an LTR-shaped view
// of RTL scrollers, scrolled instantly: a smooth scroll drops a key pressed
// before it settles. The document scroller and the coordinate getter's copy
// stay real elements: both are matched by identity inside dnd-kit.
function toLtrScrollView(element: Element): Element {
  if (
    element === element.ownerDocument.scrollingElement ||
    getComputedStyle(element).direction !== "rtl"
  ) {
    return element
  }
  const offset = () => element.scrollWidth - element.clientWidth
  return new Proxy(element, {
    get(target, key) {
      if (key === "scrollLeft") return target.scrollLeft + offset()
      if (key === "scrollTo") {
        return (options: ScrollToOptions) =>
          target.scrollTo(
            options.left === undefined
              ? options
              : {
                  ...options,
                  left: options.left - offset(),
                  behavior: "instant",
                }
          )
      }
      const value = Reflect.get(target, key)
      return typeof value === "function" ? value.bind(target) : value
    },
  })
}

/** A drop on a span's leaves targets its far edge, after its last leaf moving
 *  forward and before its owner moving back, so no move lands inside it. */
function getDataGridDropBesideSpans<TData extends object>(
  table: DataGridTableInstance<TData>,
  event: DragEndEvent
): DragEndEvent {
  const { active, over } = event
  if (!over || active.id === over.id) return event

  const rendered = [
    ...table.getStartVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getEndVisibleLeafColumns(),
  ].map((column) => column.id)
  const from = rendered.indexOf(String(active.id))
  const to = rendered.indexOf(String(over.id))
  if (from === -1 || to === -1) return event

  for (const [ownerId, covered] of getDataGridHeaderSpans(table)) {
    const leaves = [ownerId, ...covered.map((column) => column.id)]
    if (!leaves.includes(String(over.id))) continue
    if (leaves.includes(String(active.id))) return event
    const edge = from < to ? leaves[leaves.length - 1]! : leaves[0]!
    return edge === String(over.id)
      ? event
      : { ...event, over: { ...over, id: edge } }
  }

  return event
}

class DataGridKeyboardSensor extends KeyboardSensor {
  constructor(props: KeyboardSensorProps) {
    const { context, options } = props
    const getCoordinates = options.coordinateGetter
    super({
      ...props,
      context: {
        get current() {
          const current = context.current
          return {
            ...current,
            scrollableAncestors:
              current.scrollableAncestors.map(toLtrScrollView),
          }
        },
      },
      options: getCoordinates
        ? {
            ...options,
            coordinateGetter: (event, args) =>
              getCoordinates(event, { ...args, context: context.current }),
          }
        : options,
    })
  }
}

function DataGridTableDnd<TData extends object>({
  handleDragEnd,
  footerContent,
  accessibility,
}: {
  handleDragEnd: (event: DragEndEvent) => void
  footerContent?: ReactNode
  /**
   * Forwarded to dnd-kit's `DndContext`: its screen-reader instructions and
   * live-region announcements, which default to dnd-kit's English strings.
   */
  accessibility?: DndContextProps["accessibility"]
}) {
  const { table, props } = useDataGrid()
  const mergedHeaderGroups = getDataGridTableMergedHeaderGroups(table)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDraggingColumn, setIsDraggingColumn] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    // Keyboard reordering moves one sortable position per keypress instead
    // of the sensor's raw 25px default.
    useSensor(DataGridKeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!isDraggingColumn) return

    const { body, documentElement } = document
    const previousBodyCursor = body.style.cursor
    const previousDocumentCursor = documentElement.style.cursor

    body.style.cursor = "grabbing"
    documentElement.style.cursor = "grabbing"

    return () => {
      body.style.cursor = previousBodyCursor
      documentElement.style.cursor = previousDocumentCursor
    }
  }, [isDraggingColumn])

  // Custom modifier to restrict dragging within table bounds with edge offset
  const modifiers = useMemo(() => {
    const restrictToTableBounds: Modifier = ({
      draggingNodeRect,
      transform,
    }) => {
      if (!draggingNodeRect || !containerRef.current) {
        return { ...transform, y: 0 }
      }

      const containerRect = containerRef.current.getBoundingClientRect()
      const edgeOffset = 0

      const minX = containerRect.left - draggingNodeRect.left - edgeOffset
      const maxX =
        containerRect.right -
        draggingNodeRect.left -
        draggingNodeRect.width +
        edgeOffset

      return {
        ...transform,
        x: Math.min(Math.max(transform.x, minX), maxX),
        y: 0, // Lock vertical movement
      }
    }

    return [restrictToTableBounds]
  }, [])

  return (
    <DndContext
      accessibility={accessibility}
      collisionDetection={closestCenter}
      id={useId()}
      modifiers={modifiers}
      onDragCancel={() => setIsDraggingColumn(false)}
      onDragEnd={(event) => {
        setIsDraggingColumn(false)
        handleDragEnd(getDataGridDropBesideSpans(table, event))
      }}
      onDragStart={() => setIsDraggingColumn(true)}
      sensors={sensors}
    >
      <DataGridTableViewport
        viewportRef={containerRef}
        className={
          isDraggingColumn
            ? "relative cursor-grabbing [&_*]:cursor-grabbing!"
            : "relative"
        }
      >
        <DataGridTableBase>
          <DataGridTableHead>
            {mergedHeaderGroups.map((headerGroup, index) => {
              return (
                <DataGridTableHeadRow key={index} rowId={headerGroup.id}>
                  <SortableContext
                    items={table.state.columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {/* Every row follows DataGridTableBase's colgroup,
                        which puts the fill col between the center and
                        end-pinned groups; a fill cell appended last hands
                        its width to the end-pinned column. One keyed
                        list, not three, so a column pinned into or out of
                        the end group moves instead of remounting, which
                        would drop keyboard focus. The fill spans every
                        head row, so only the first renders it. */}
                    {[
                      ...[
                        ...headerGroup.startHeaders,
                        ...headerGroup.centerHeaders,
                      ].map((header) => (
                        <DataGridTableDndHeader
                          header={header}
                          coveredHeaders={headerGroup.coveredHeaders.get(
                            header.id
                          )}
                          key={header.id}
                        />
                      )),
                      ...(index === 0
                        ? [
                            <DataGridTableFillHeadCell
                              key="__data-grid-fill"
                              rowSpan={mergedHeaderGroups.length}
                            />,
                          ]
                        : []),
                      ...headerGroup.endHeaders.map((header) => (
                        <DataGridTableDndHeader
                          header={header}
                          coveredHeaders={headerGroup.coveredHeaders.get(
                            header.id
                          )}
                          key={header.id}
                        />
                      )),
                    ]}
                  </SortableContext>
                </DataGridTableHeadRow>
              )
            })}
          </DataGridTableHead>

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

          <DataGridTableBody>
            <MemoizedDataGridTableDndBodyRows table={table} />
          </DataGridTableBody>

          {footerContent && (
            <DataGridTableFoot>{footerContent}</DataGridTableFoot>
          )}
        </DataGridTableBase>
      </DataGridTableViewport>
    </DndContext>
  )
}

export { DataGridTableDnd }
