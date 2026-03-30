"use client"

import {
  createContext,
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { useDataGrid } from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import {
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Cell, flexRender, HeaderGroup, Row } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
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
        disabled
      >
        <IconPlaceholder
          lucide="GripHorizontalIcon"
          tabler="IconGripHorizontal"
          hugeicons="DragDropHorizontalIcon"
          phosphor="DotsSixIcon"
          remixicon="RiDraggable"
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
      {...context.attributes}
      {...context.listeners}
    >
      <IconPlaceholder
        lucide="GripHorizontalIcon"
        tabler="IconGripHorizontal"
        hugeicons="DragDropHorizontalIcon"
        phosphor="DotsSixIcon"
        remixicon="RiDraggable"
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
      <DataGridTableBodyRow
        row={row}
        dndRef={setNodeRef}
        dndStyle={style}
        key={row.id}
      >
        {row.getVisibleCells().map((cell: Cell<TData, unknown>, colIndex) => {
          return (
            <DataGridTableBodyRowCell cell={cell} key={colIndex}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DataGridTableBodyRowCell>
          )
        })}
      </DataGridTableBodyRow>
    </SortableRowContext.Provider>
  )
}

function DataGridTableDndRows<TData>({
  handleDragEnd,
  dataIds,
  footerContent,
}: {
  handleDragEnd: (event: DragEndEvent) => void
  dataIds: UniqueIdentifier[]
  footerContent?: ReactNode
}) {
  const { table, isLoading, props } = useDataGrid()
  const pagination = table.getState().pagination
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [isDraggingRow, setIsDraggingRow] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
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

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

          <DataGridTableBody>
            {props.loadingMode === "skeleton" &&
            isLoading &&
            pagination?.pageSize ? (
              Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
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
                </DataGridTableBodyRowSkeleton>
              ))
            ) : table.getRowModel().rows.length ? (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row: Row<TData>) => {
                  return <DataGridTableDndRow row={row} key={row.id} />
                })}
              </SortableContext>
            ) : (
              <DataGridTableEmpty />
            )}
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
