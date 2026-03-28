// Description: Data grid with per-column aggregate footer
// GridSize: 1
// Order: 26

"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import { DataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-column-header"
import { DataGridPagination } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-scroll-area"
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-table"
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/customizer/icon-placeholder"

interface IData {
  id: string
  name: string
  avatar: string
  status: "Active" | "Inactive" | "Pending" | "Blocked"
  balance: number
  transactions: number
}

const demoData: IData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    status: "Active",
    balance: 5143.03,
    transactions: 48,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    status: "Inactive",
    balance: 4321.87,
    transactions: 31,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    status: "Blocked",
    balance: 7654.98,
    transactions: 67,
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    status: "Inactive",
    balance: 3456.45,
    transactions: 22,
  },
  {
    id: "5",
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    status: "Active",
    balance: 9876.54,
    transactions: 93,
  },
  {
    id: "6",
    name: "Aron Thompson",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    status: "Pending",
    balance: 6214.22,
    transactions: 55,
  },
  {
    id: "7",
    name: "James Brown",
    avatar:
      "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    status: "Inactive",
    balance: 5321.77,
    transactions: 40,
  },
  {
    id: "8",
    name: "Maria Garcia",
    avatar:
      "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    status: "Blocked",
    balance: 8452.39,
    transactions: 74,
  },
  {
    id: "9",
    name: "Nick Johnson",
    avatar:
      "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
    status: "Pending",
    balance: 7345.1,
    transactions: 61,
  },
  {
    id: "10",
    name: "Liam Thompson",
    avatar:
      "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
    status: "Inactive",
    balance: 5214.88,
    transactions: 37,
  },
]

export default function Pattern() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])

  const aggregates = useMemo(() => {
    const n = demoData.length
    const balances = demoData.map((r) => r.balance)
    const txns = demoData.map((r) => r.transactions)
    return {
      avgBalance: balances.reduce((a, b) => a + b, 0) / n,
      minBalance: Math.min(...balances),
      maxBalance: Math.max(...balances),
      avgTxns: Math.round(txns.reduce((a, b) => a + b, 0) / n),
      minTxns: Math.min(...txns),
      maxTxns: Math.max(...txns),
    }
  }, [])

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 })

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="User" visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-foreground font-medium">
              {row.original.name}
            </div>
          </div>
        ),
        size: 200,
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" visibility column={column} />
        ),
        cell: ({ row }) => {
          const s = row.original.status
          if (s === "Active")
            return <Badge variant="success-outline">Active</Badge>
          if (s === "Blocked")
            return <Badge variant="destructive-outline">Blocked</Badge>
          if (s === "Inactive")
            return <Badge variant="info-outline">Inactive</Badge>
          return <Badge variant="warning-outline">Pending</Badge>
        },
        size: 110,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "balance",
        id: "balance",
        header: ({ column }) => (
          <DataGridColumnHeader title="Balance" visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-foreground font-medium tabular-nums">
            {fmt(row.original.balance)}
          </div>
        ),
        size: 130,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "transactions",
        id: "transactions",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Transactions"
            visibility
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="text-foreground font-medium tabular-nums">
            {row.original.transactions}
          </div>
        ),
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
    ],
    []
  )

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((c) => c.id as string)
  )

  const table = useReactTable({
    columns,
    data: demoData,
    pageCount: Math.ceil(demoData.length / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: { pagination, sorting, columnOrder },
    columnResizeMode: "onChange",
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const footer = (
    <DataGridTableFootRow>
      <DataGridTableFootRowCell colSpan={2}>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">Summary</span>
          <span className="text-foreground font-medium">
            Across all members
          </span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {demoData.length} members
          </span>
        </div>
      </DataGridTableFootRowCell>
      <DataGridTableFootRowCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">Avg</span>
          <span className="tabular-nums">{fmt(aggregates.avgBalance)}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {fmt(aggregates.minBalance)} – {fmt(aggregates.maxBalance)}
          </span>
        </div>
      </DataGridTableFootRowCell>
      {/* Transactions aggregate */}
      <DataGridTableFootRowCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">Avg</span>
          <span className="tabular-nums">{aggregates.avgTxns}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {aggregates.minTxns} – {aggregates.maxTxns}
          </span>
        </div>
      </DataGridTableFootRowCell>
    </DataGridTableFootRow>
  )

  return (
    <DataGrid
      table={table}
      recordCount={demoData.length}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsVisibility: true,
      }}
    >
      <Card className="w-full gap-0 p-0">
        <CardHeader className="flex items-center justify-between gap-3 px-4 py-2">
          <CardTitle className="text-sm font-medium">
            Column Aggregates
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="sm">
              <IconPlaceholder
                lucide="DownloadIcon"
                tabler="IconDownload"
                hugeicons="Download01Icon"
                phosphor="DownloadSimpleIcon"
                remixicon="RiDownloadLine"
              />
              Export
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="border-y px-0">
          <DataGridScrollArea>
            <DataGridTable footerContent={footer} />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className="border-none bg-transparent! px-3.5 py-2">
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}
