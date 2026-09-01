"use client"

import { useMemo, useState } from "react"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/base/reui/data-grid/data-grid-column-header"
import { DataGridScrollArea } from "@/registry-reui/bases/base/reui/data-grid/data-grid-scroll-area"
import { DataGridTableVirtual } from "@/registry-reui/bases/base/reui/data-grid/data-grid-table-virtual"
import { useTable } from "@tanstack/react-table"
import type { ColumnDef, SortingState } from "@tanstack/react-table"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface IPerson {
  name: string
  avatar: string
  initials: string
}

interface IData {
  id: string
  person: IPerson
  metrics: number[]
  total: number
}

const METRIC_COLUMN_COUNT = 36
const ROW_COUNT = 1000
const COLUMN_JUMP_SIZE = 8
const columnVirtualizerOptions = { enabled: true, overscan: 3 }
const numberFormatter = new Intl.NumberFormat("en-US")
const PEOPLE: IPerson[] = [
  {
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
  },
  {
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
  },
  {
    name: "Michael Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    initials: "MR",
  },
  {
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    initials: "EW",
  },
  {
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    initials: "DK",
  },
  {
    name: "Aron Thompson",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    initials: "AT",
  },
  {
    name: "James Brown",
    avatar:
      "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    initials: "JB",
  },
  {
    name: "Maria Garcia",
    avatar:
      "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    initials: "MG",
  },
  {
    name: "Nick Johnson",
    avatar:
      "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
    initials: "NJ",
  },
  {
    name: "Liam Thompson",
    avatar:
      "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
    initials: "LT",
  },
]

// Deterministic pseudo-data: the same grid on every load, no Math.random.
function generateData(count: number): IData[] {
  return Array.from({ length: count }, (_, rowIndex) => {
    const metrics = Array.from(
      { length: METRIC_COLUMN_COUNT },
      (_, metricIndex) => 100 + ((rowIndex * 37 + metricIndex * 19) % 900)
    )

    return {
      id: String(rowIndex + 1),
      person: PEOPLE[rowIndex % PEOPLE.length]!,
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
              {numberFormatter.format(row.original.metrics[metricIndex]!)}
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
        id: "name",
        accessorFn: (row) => row.person.name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Team member" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={row.original.person.avatar}
                alt={row.original.person.name}
              />
              <AvatarFallback className="text-[10px]">
                {row.original.person.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground truncate font-medium">
              {row.original.person.name}
            </span>
          </div>
        ),
        size: 190,
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
    // The whole set is already client-side: without this, v9's registered
    // paginated row model would clip the virtual grid to one page.
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
        /* z-40, not z-10: pinned BODY cells are sticky at z-30, and a lower
           thead would let them paint over the header band while rows scroll
           under it. 40 is the primitive's sticky-header plane. */
        headerSticky: "sticky top-0 z-40 bg-muted/90 backdrop-blur-xs",
      }}
    >
      {/* No footer here, so the grid itself closes the card: pb-0 removes
          the empty strip below the container, and overflow-hidden lets the
          card's own radius clip the grid's square bottom corners. */}
      <Card className="w-full gap-3 overflow-hidden py-3.5 pb-0">
        <CardHeader className="items-center px-3.5">
          <CardTitle>Performance Matrix</CardTitle>
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
              <IconPlaceholder
                lucide="ChevronLeftIcon"
                tabler="IconChevronLeft"
                hugeicons="ArrowLeft01Icon"
                phosphor="CaretLeftIcon"
                remixicon="RiArrowLeftSLine"
                aria-hidden="true"
              />
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
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                aria-hidden="true"
              />
            </Button>
          </CardAction>
        </CardHeader>
        <DataGridContainer className="border-t">
          <DataGridScrollArea className="h-[480px]">
            {/* Column index 2 + the jump target: the controlled reveal
                addresses CENTER columns only, so index 0 is Metric 01. */}
            <DataGridTableVirtual
              estimateSize={41}
              overscan={8}
              columnVirtualizerOptions={columnVirtualizerOptions}
              scrollBehavior="smooth"
              scrollToColumnAlign="center"
              scrollToColumnIndex={targetColumnIndex}
            />
          </DataGridScrollArea>
        </DataGridContainer>
      </Card>
    </DataGrid>
  )
}
