"use client"
"use no memo"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  DataGrid,
  DataGridContainer,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/base/reui/data-grid/data-grid-column-header"
import { DataGridPagination } from "@/registry-reui/bases/base/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/registry-reui/bases/base/reui/data-grid/data-grid-scroll-area"
import {
  DataGridTable,
  DataGridTableRowExpand,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid-table"
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
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
} from "@/registry/bases/base/ui/avatar"
import { Card } from "@/registry/bases/base/ui/card"

interface IData {
  id: string
  name: string
  type: "department" | "team" | "member"
  status: "active" | "inactive"
  role?: string
  avatar?: string
  flag?: string
  location?: string
  children?: IData[]
}

const demoData: IData[] = [
  {
    id: "eng",
    name: "Engineering",
    type: "department",
    status: "active",
    children: [
      {
        id: "eng-platform",
        name: "Platform",
        type: "team",
        status: "active",
        children: [
          {
            id: "eng-platform-1",
            name: "Alex Johnson",
            type: "member",
            status: "active",
            role: "Staff Engineer",
            avatar:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
            flag: "us",
            location: "United States",
          },
          {
            id: "eng-platform-2",
            name: "Sarah Chen",
            type: "member",
            status: "active",
            role: "Senior Engineer",
            avatar:
              "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
            flag: "gb",
            location: "United Kingdom",
          },
          {
            id: "eng-platform-3",
            name: "Michael Rodriguez",
            type: "member",
            status: "inactive",
            role: "Frontend Engineer",
            avatar:
              "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
            flag: "ca",
            location: "Canada",
          },
        ],
      },
      {
        id: "eng-mobile",
        name: "Mobile",
        type: "team",
        status: "active",
        children: [
          {
            id: "eng-mobile-1",
            name: "Emma Wilson",
            type: "member",
            status: "active",
            role: "iOS Engineer",
            avatar:
              "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
            flag: "au",
            location: "Australia",
          },
          {
            id: "eng-mobile-2",
            name: "David Kim",
            type: "member",
            status: "active",
            role: "Android Engineer",
            avatar:
              "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
            flag: "de",
            location: "Germany",
          },
        ],
      },
    ],
  },
  {
    id: "design",
    name: "Design",
    type: "department",
    status: "active",
    children: [
      {
        id: "design-product",
        name: "Product Design",
        type: "team",
        status: "active",
        children: [
          {
            id: "design-product-1",
            name: "Aron Thompson",
            type: "member",
            status: "active",
            role: "Design Lead",
            avatar:
              "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
            flag: "my",
            location: "Malaysia",
          },
          {
            id: "design-product-2",
            name: "Maria Garcia",
            type: "member",
            status: "active",
            role: "Product Designer",
            avatar:
              "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
            flag: "jp",
            location: "Japan",
          },
          {
            id: "design-product-3",
            name: "James Brown",
            type: "member",
            status: "inactive",
            role: "UX Researcher",
            avatar:
              "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
            flag: "es",
            location: "Spain",
          },
        ],
      },
      {
        id: "design-brand",
        name: "Brand",
        type: "team",
        status: "active",
        children: [
          {
            id: "design-brand-1",
            name: "Nick Johnson",
            type: "member",
            status: "active",
            role: "Brand Designer",
            avatar:
              "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
            flag: "fr",
            location: "France",
          },
          {
            id: "design-brand-2",
            name: "Liam Thompson",
            type: "member",
            status: "inactive",
            role: "Motion Designer",
            avatar:
              "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
            flag: "it",
            location: "Italy",
          },
        ],
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    type: "department",
    status: "active",
    children: [
      {
        id: "marketing-growth",
        name: "Growth",
        type: "team",
        status: "active",
        children: [
          {
            id: "marketing-growth-1",
            name: "Olivia Martin",
            type: "member",
            status: "active",
            role: "Growth Lead",
            avatar:
              "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
            flag: "us",
            location: "United States",
          },
          {
            id: "marketing-growth-2",
            name: "Ethan Clark",
            type: "member",
            status: "active",
            role: "Performance Marketer",
            avatar:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
            flag: "ca",
            location: "Canada",
          },
        ],
      },
      {
        id: "marketing-content",
        name: "Content",
        type: "team",
        status: "active",
        children: [
          {
            id: "marketing-content-1",
            name: "Sofia Rossi",
            type: "member",
            status: "active",
            role: "Content Lead",
            avatar:
              "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
            flag: "it",
            location: "Italy",
          },
          {
            id: "marketing-content-2",
            name: "Lucas Meyer",
            type: "member",
            status: "inactive",
            role: "Copywriter",
            avatar:
              "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
            flag: "de",
            location: "Germany",
          },
        ],
      },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    type: "department",
    status: "active",
    children: [
      {
        id: "operations-finance",
        name: "Finance",
        type: "team",
        status: "active",
        children: [
          {
            id: "operations-finance-1",
            name: "Grace Lee",
            type: "member",
            status: "active",
            role: "Finance Lead",
            avatar:
              "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
            flag: "kr",
            location: "South Korea",
          },
          {
            id: "operations-finance-2",
            name: "Daniel Novak",
            type: "member",
            status: "active",
            role: "Accountant",
            avatar:
              "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
            flag: "cz",
            location: "Czechia",
          },
        ],
      },
      {
        id: "operations-people",
        name: "People",
        type: "team",
        status: "active",
        children: [
          {
            id: "operations-people-1",
            name: "Chloe Dubois",
            type: "member",
            status: "active",
            role: "People Lead",
            avatar:
              "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
            flag: "fr",
            location: "France",
          },
          {
            id: "operations-people-2",
            name: "Ryan Walsh",
            type: "member",
            status: "active",
            role: "Recruiter",
            avatar:
              "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
            flag: "ie",
            location: "Ireland",
          },
        ],
      },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    type: "department",
    status: "active",
    children: [
      {
        id: "sales-accounts",
        name: "Accounts",
        type: "team",
        status: "active",
        children: [
          {
            id: "sales-accounts-1",
            name: "Mia Park",
            type: "member",
            status: "active",
            role: "Account Executive",
            avatar:
              "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
            flag: "kr",
            location: "South Korea",
          },
          {
            id: "sales-accounts-2",
            name: "Noah Fischer",
            type: "member",
            status: "inactive",
            role: "Account Manager",
            avatar:
              "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
            flag: "at",
            location: "Austria",
          },
        ],
      },
    ],
  },
]

// Collapsed rows are unmounted, so their images would load only when a
// branch is first expanded and pop in after the fallback renders. Warming
// them once at mount keeps expansion flicker-free.
function collectImageUrls(rows: IData[]): string[] {
  return rows.flatMap((row) => [
    ...(row.avatar ? [row.avatar] : []),
    ...(row.flag
      ? [`https://flagcdn.com/${row.flag.toLowerCase()}.svg`]
      : []),
    ...(row.children ? collectImageUrls(row.children) : []),
  ])
}

export default function Pattern() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({
    eng: true,
    "eng-platform": true,
  })

  useEffect(() => {
    for (const src of collectImageUrls(demoData)) {
      const image = new Image()
      image.src = src
    }
  }, [])

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Name" column={column} />
        ),
        cell: ({ row }) => {
          const item = row.original

          return (
            <div className="flex items-center gap-1">
              <DataGridTableRowExpand row={row} className="-ms-1.5 -me-1" />
              {item.type === "member" ? (
                <>
                  <Avatar className="size-6 shrink-0">
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <a
                    href="#"
                    className="text-foreground hover:text-primary font-medium"
                  >
                    {item.name}
                  </a>
                </>
              ) : (
                <span className="text-foreground font-medium">
                  {item.name}
                </span>
              )}
            </div>
          )
        },
        minSize: 260,
        enableSorting: true,
        enableHiding: false,
        meta: {
          autoSize: true,
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataGridColumnHeader title="Role" column={column} />
        ),
        cell: ({ row }) => {
          const item = row.original

          return (
            <div className="text-muted-foreground">
              {item.role ??
                (item.type === "department" ? "Department" : "Team")}
            </div>
          )
        },
        size: 180,
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <DataGridColumnHeader title="Location" column={column} />
        ),
        cell: ({ row }) => {
          const item = row.original

          if (!item.location || !item.flag) {
            return <span className="text-muted-foreground">-</span>
          }

          return (
            <div className="flex items-center gap-1.5">
              <img
                src={`https://flagcdn.com/${item.flag.toLowerCase()}.svg`}
                alt={item.flag}
                className="size-4 rounded-full object-cover"
              />
              <div className="text-foreground font-medium">
                {item.location}
              </div>
            </div>
          )
        },
        size: 180,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => {
          if (row.original.status === "active") {
            return <Badge variant="success-outline">Active</Badge>
          }

          return <Badge variant="warning-outline">Inactive</Badge>
        },
        size: 130,
      },
    ],
    []
  )

  const table = useReactTable({
    columns,
    data: demoData,
    pageCount: Math.ceil((demoData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    getSubRows: (row) => row.children,
    state: {
      pagination,
      sorting,
      expanded,
    },
    // Keep expanded children on the same page as their parent.
    paginateExpandedRows: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataGrid
      table={table}
      recordCount={demoData?.length || 0}
      tableLayout={{
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <div className="w-full space-y-2.5">
        <Card className="overflow-hidden p-0">
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
        </Card>
        <DataGridPagination sizes={[4, 8, 16]} />
      </div>
    </DataGrid>
  )
}
