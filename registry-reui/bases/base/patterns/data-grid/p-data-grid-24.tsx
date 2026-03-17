// Description: Data grid with column totals footer
// GridSize: 1
// Order: 24

"use client"

import { useMemo, useState } from "react"
import { useCopyToClipboard } from "@/registry-reui/bases/base/hooks/use-copy-to-clipboard"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import { DataGrid } from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/base/reui/data-grid/data-grid-column-header"
import { DataGridPagination } from "@/registry-reui/bases/base/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/registry-reui/bases/base/reui/data-grid/data-grid-scroll-area"
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid-table"
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/bases/base/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { Separator } from "@/registry/bases/base/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface IData {
  id: string
  name: string
  avatar: string
  role: string
  status: "Active" | "Inactive" | "Pending" | "Blocked"
  balance: number
}

const demoData: IData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    role: "CEO",
    status: "Active",
    balance: 5143.03,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    role: "CTO",
    status: "Inactive",
    balance: 4321.87,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    role: "Designer",
    status: "Blocked",
    balance: 7654.98,
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    role: "Developer",
    status: "Inactive",
    balance: 3456.45,
  },
  {
    id: "5",
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    role: "Lawyer",
    status: "Active",
    balance: 9876.54,
  },
  {
    id: "6",
    name: "Aron Thompson",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    role: "Director",
    status: "Pending",
    balance: 6214.22,
  },
  {
    id: "7",
    name: "James Brown",
    avatar:
      "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    role: "Product Manager",
    status: "Inactive",
    balance: 5321.77,
  },
  {
    id: "8",
    name: "Maria Garcia",
    avatar:
      "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    role: "Marketing Lead",
    status: "Blocked",
    balance: 8452.39,
  },
  {
    id: "9",
    name: "Nick Johnson",
    avatar:
      "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
    role: "Data Scientist",
    status: "Pending",
    balance: 7345.1,
  },
  {
    id: "10",
    name: "Liam Thompson",
    avatar:
      "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
    role: "Engineer",
    status: "Inactive",
    balance: 5214.88,
  },
]

function ActionsCell({ row }: { row: Row<IData> }) {
  const { copyToClipboard } = useCopyToClipboard()
  const handleCopyId = () => {
    copyToClipboard(row.original.id)
    toast.success("Employee ID copied", { description: row.original.id })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className="size-7" size="icon" variant="ghost">
            <IconPlaceholder
              lucide="MoreHorizontalIcon"
              tabler="IconDots"
              hugeicons="MoreHorizontalCircle01Icon"
              phosphor="DotsThreeIcon"
              remixicon="RiMoreLine"
            />
          </Button>
        }
      />
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => {}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Pattern() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])

  const totalBalance = useMemo(
    () => demoData.reduce((sum, row) => sum + row.balance, 0),
    []
  )

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: "id",
        id: "id",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 35,
        enableResizing: false,
      },
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
        accessorKey: "role",
        id: "role",
        header: ({ column }) => (
          <DataGridColumnHeader title="Role" visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-foreground font-medium">{row.original.role}</div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
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
            $
            {row.original.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
        ),
        size: 130,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 60,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
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

  const visibleCount = table.getVisibleLeafColumns().length

  const footer = (
    <DataGridTableFootRow>
      {/* Label spans checkbox + user + role + status */}
      <DataGridTableFootRowCell colSpan={visibleCount - 2}>
        <span className="text-muted-foreground text-xs">Total balance</span>
      </DataGridTableFootRowCell>
      {/* Balance total */}
      <DataGridTableFootRowCell className="font-bold tabular-nums">
        ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </DataGridTableFootRowCell>
      {/* Actions column — empty */}
      <DataGridTableFootRowCell />
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
      <Card className="w-full gap-0 py-0">
        <CardHeader className="flex items-center justify-between px-3.5 py-2">
          <div className="flex items-center gap-2">
            <IconPlaceholder
              lucide="TableIcon"
              tabler="IconTable"
              hugeicons="Table01Icon"
              phosphor="TableIcon"
              remixicon="RiTableLine"
              className="text-muted-foreground size-4"
            />
            <span className="text-foreground text-sm font-medium">
              Employee Balances
            </span>
          </div>
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
