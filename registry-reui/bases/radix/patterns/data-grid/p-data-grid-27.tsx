// Description: Data grid with local infinite scroll
// GridSize: 1
// Order: 27

"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import { DataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-column-header"
import { DataGridScrollArea } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-scroll-area"
import { DataGridTableVirtual } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-table-virtual"
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface IData {
  id: string
  name: string
  avatar: string
  department: string
  status: "Active" | "Inactive" | "Pending"
  balance: number
}

const avatars = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
  "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
  "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
  "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
]

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

const departments = [
  "Engineering",
  "Marketing",
  "Design",
  "Sales",
  "Finance",
  "Operations",
  "Legal",
  "Support",
]

const statuses: IData["status"][] = ["Active", "Inactive", "Pending"]

function generateData(count: number): IData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: names[i % names.length],
    avatar: avatars[i % avatars.length],
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    balance: Math.round((Math.random() * 9000 + 1000) * 100) / 100,
  }))
}

const allData = generateData(200)

export default function Pattern() {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
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
        size: 40,
        enableSorting: true,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="User" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-7">
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground font-medium">
              {row.original.name}
            </span>
          </div>
        ),
        size: 240,
        enableSorting: true,
      },
      {
        accessorKey: "department",
        id: "department",
        header: ({ column }) => (
          <DataGridColumnHeader title="Department" column={column} />
        ),
        cell: ({ row }) => row.original.department,
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => {
          const s = row.original.status
          if (s === "Active")
            return <Badge variant="success-outline">Active</Badge>
          if (s === "Inactive")
            return <Badge variant="info-outline">Inactive</Badge>
          return <Badge variant="warning-outline">Pending</Badge>
        },
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "balance",
        id: "balance",
        header: ({ column }) => (
          <DataGridColumnHeader title="Balance" column={column} />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums">
            $
            {row.original.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
        size: 140,
        enableSorting: true,
        enableResizing: true,
      },
    ],
    []
  )

  const table = useReactTable({
    columns,
    data: allData,
    getRowId: (row: IData) => row.id,
    state: { sorting },
    columnResizeMode: "onChange",
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataGrid
      table={table}
      recordCount={allData.length}
      tableLayout={{
        columnsResizable: true,
        headerSticky: true,
      }}
      tableClassNames={{
        headerSticky: "sticky top-0 z-10 bg-muted/90 backdrop-blur-xs",
      }}
    >
      <Card className="w-full gap-0 p-0">
        <CardHeader className="flex items-center justify-between gap-3 px-4 py-2">
          <CardTitle className="text-sm font-medium">
            Virtualized Directory
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="sm">
              <IconPlaceholder
                lucide="RefreshCwIcon"
                tabler="IconRefresh"
                hugeicons="RefreshIcon"
                phosphor="ArrowClockwiseIcon"
                remixicon="RiRefreshLine"
              />
              Refresh
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="border-t p-0">
          <DataGridScrollArea className="h-[480px]">
            <DataGridTableVirtual estimateSize={49} />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  )
}
