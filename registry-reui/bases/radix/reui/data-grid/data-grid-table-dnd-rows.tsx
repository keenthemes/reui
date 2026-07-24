"use client"
"use no memo"

import {
  createContext,
  CSSProperties,
  memo,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { useDataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
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
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-table"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Cell,
  flexRender,
  HeaderGroup,
  Row,
  Table,
} from "@tanstack/react-table"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Context to share sortable listeners from row to handle
type SortableContextValue = ReturnType<typeof useSortable>
const SortableRowContext = createContext<Pick<
  SortableContextValue,
  "attributes" | "listeners"
> | null>(null)

function DataGridTableDndRowHandle({ className }: { className?: string }) {
  const context = useContext(SortableRowContext)

  if (!context) {
    // Fallback if context is not available (shouldn't happen in normal usage)
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          "size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing",
          className
        )}
        aria-label="Drag to reorder row"
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
      aria-label="Drag to reorder row"
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

function DataGridTableDndRow<TData>({ row }: { row: Row<TData> }) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.id,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
    cursor: isDragging ? "grabbing" : undefined,
  }

  return (
    <SortableRowContext.Provider value={{ attributes, listeners }}>
      <DataGridTableBodyRow row={row} dndRef={setNodeRef} dndStyle={style}>
        {row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
          return (
            <DataGridTableBodyRowCell cell={cell} key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DataGridTableBodyRowCell>
          )
        })}
        <DataGridTableFillBodyCell />
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
    </SortableRowContext.Provider>
  )
}

function DataGridTableDndRowsBody<TData>({
  table,
  dataIds,
}: {
  table: Table<TData>
  dataIds: UniqueIdentifier[]
}) {
  const { isLoading, props } = useDataGrid()
  const pagination = table.getState().pagination

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
    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
      {table.getRowModel().rows.map((row: Row<TData>) => {
        return <DataGridTableDndRow row={row} key={row.id} />
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
  (_prev, next) => !!next.table.getState().columnSizingInfo.isResizingColumn
) as typeof DataGridTableDndRowsBody

function DataGridTableDndRows<TData>({
  handleDragEnd,
  dataIds,
  footerContent,
}: {
  handleDragEnd: (event: DragEndEvent) => void
  dataIds: UniqueIdentifier[]
  footerContent?: ReactNode
}) {
  const { table, props } = useDataGrid()
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [isDraggingRow, setIsDraggingRow] = useState(false)

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

  const modifiers = useMemo(() => {
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
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y)),
      }
    }

    return [restrictToVerticalAxis, restrictToTableContainer]
  }, [])

  return (
    <DndContext
      id={useId()}
      collisionDetection={closestCenter}
      modifiers={modifiers}
      onDragCancel={() => setIsDraggingRow(false)}
      onDragEnd={(event) => {
        setIsDraggingRow(false)
        handleDragEnd(event)
      }}
      onDragStart={() => setIsDraggingRow(true)}
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
              .map((headerGroup: HeaderGroup<TData>, index) => {
                return (
                  <DataGridTableHeadRow key={index} rowId={headerGroup.id}>
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
                    <DataGridTableFillHeadCell />
                  </DataGridTableHeadRow>
                )
              })}
          </DataGridTableHead>

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

          <DataGridTableBody>
            <MemoizedDataGridTableDndRowsBody table={table} dataIds={dataIds} />
          </DataGridTableBody>

          {footerContent && (
            <DataGridTableFoot>{footerContent}</DataGridTableFoot>
          )}
        </DataGridTableBase>
      </DataGridTableViewport>
    </DndContext>
  )
}

export { DataGridTableDndRowHandle, DataGridTableDndRows }
