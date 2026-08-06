"use client"

import { useMemo, useState } from "react"
import {
  DataGrid,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/base/reui/data-grid/data-grid-column-header"
import { DataGridScrollArea } from "@/registry-reui/bases/base/reui/data-grid/data-grid-scroll-area"
import { DataGridTableVirtual } from "@/registry-reui/bases/base/reui/data-grid/data-grid-table-virtual"
import { useTable } from "@tanstack/react-table"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"

interface IData {
  id: string
  name: string
  metrics: number[]
  total: number
}

const METRIC_COLUMN_COUNT = 36
const ROW_COUNT = 1000
const COLUMN_JUMP_SIZE = 8
const columnVirtualizerOptions = { enabled: true, overscan: 3 }
const numberFormatter = new Intl.NumberFormat("en-US")
const names = [
  "Alex Johnson",
  "Sarah Chen",
  "Michael Rodriguez",
  "Emma Wilson",
  "David Kim",
  "Aron Thompson",
  "James Brown",
  "Maria Garcia",
  "Nick Johnson",
  "Liam Thompson",
]

function generateData(count: number): IData[] {
  return Array.from({ length: count }, (_, rowIndex) => {
    const metrics = Array.from(
      { length: METRIC_COLUMN_COUNT },
      (_, metricIndex) => 100 + ((rowIndex * 37 + metricIndex * 19) % 900)
    )

    return {
      id: String(rowIndex + 1),
      name: names[rowIndex % names.length],
      metrics,
      total: metrics.reduce((sum, value) => sum + value, 0),
    }
  })
}

const allData = generateData(ROW_COUNT)

export default function Pattern() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [targetColumnIndex, setTargetColumnIndex] = useState(0)

  const columns = useMemo<ColumnDef<DataGridFeatures, IData>[]>(() => {
    const metricColumns = Array.from(
      { length: METRIC_COLUMN_COUNT },
      (_, metricIndex): ColumnDef<DataGridFeatures, IData> => {
        const metricLabel = `Metric ${String(metricIndex + 1).padStart(2, "0")}`

        return {
          id: `metric-${metricIndex + 1}`,
          accessorFn: (row) => row.metrics[metricIndex],
          header: ({ column }) => (
            <DataGridColumnHeader title={metricLabel} column={column} />
          ),
          cell: ({ row }) => (
            <span className="block text-right font-mono tabular-nums">
              {numberFormatter.format(row.original.metrics[metricIndex])}
            </span>
          ),
          size: 124,
        }
      }
    )

    return [
      {
        accessorKey: "id",
        id: "id",
        header: ({ column }) => (
          <DataGridColumnHeader title="#" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {row.original.id}
          </span>
        ),
        size: 72,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Team member" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-medium">
            {row.original.name}
          </span>
        ),
        size: 180,
        enableHiding: false,
      },
      ...metricColumns,
      {
        accessorKey: "total",
        id: "total",
        header: ({ column }) => (
          <DataGridColumnHeader title="Total" column={column} />
        ),
        cell: ({ row }) => (
          <span className="block text-right font-medium tabular-nums">
            {numberFormatter.format(row.original.total)}
          </span>
        ),
        size: 132,
        enableHiding: false,
      },
    ]
  }, [])

  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: allData,
    enableColumnPinning: true,
    getRowId: (row: IData) => row.id,
    state: {
      columnPinning: { start: ["id", "name"], end: ["total"] },
      sorting,
    },
    onSortingChange: setSorting,
    manualPagination: true,
  })

  return (
    <DataGrid
      table={table}
      recordCount={allData.length}
      tableLayout={{
        width: "fixed",
        dense: true,
        columnsPinnable: true,
        columnsResizable: true,
        headerSticky: true,
      }}
      tableClassNames={{
        headerSticky: "sticky top-0 z-10 bg-muted/90 backdrop-blur-xs",
      }}
    >
      <Card className="w-full gap-0 p-0">
        <CardHeader className="flex items-center justify-between gap-3 px-4 py-2">
          <div className="min-w-0">
            <CardTitle className="truncate text-sm font-medium">
              Performance Matrix
            </CardTitle>
            <p className="text-muted-foreground text-xs">
              {ROW_COUNT.toLocaleString()} team members
            </p>
          </div>
          <CardAction className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-xs tabular-nums sm:inline">
              Metric {String(targetColumnIndex + 1).padStart(2, "0")} of{" "}
              {METRIC_COLUMN_COUNT}
            </span>
            <Button
              aria-label="Show previous metric columns"
              title="Show previous metric columns"
              className="size-8"
              disabled={targetColumnIndex === 0}
              size="icon"
              variant="outline"
              onClick={() =>
                setTargetColumnIndex((current) =>
                  Math.max(0, current - COLUMN_JUMP_SIZE)
                )
              }
            >
              <ChevronLeftIcon aria-hidden="true" />
            </Button>
            <Button
              aria-label="Show next metric columns"
              title="Show next metric columns"
              className="size-8"
              disabled={targetColumnIndex === METRIC_COLUMN_COUNT - 1}
              size="icon"
              variant="outline"
              onClick={() =>
                setTargetColumnIndex((current) =>
                  Math.min(METRIC_COLUMN_COUNT - 1, current + COLUMN_JUMP_SIZE)
                )
              }
            >
              <ChevronRightIcon aria-hidden="true" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="border-t p-0">
          <DataGridScrollArea className="h-[480px]">
            <DataGridTableVirtual
              estimateSize={41}
              overscan={8}
              columnVirtualizerOptions={columnVirtualizerOptions}
              scrollBehavior="smooth"
              scrollToColumnAlign="center"
              scrollToColumnIndex={targetColumnIndex}
            />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  )
}
