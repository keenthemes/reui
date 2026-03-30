// Description: Filters with data grid
// Order: 7
// GridSize: 1

"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, AlertTitle } from "@/registry-reui/bases/base/reui/alert"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  DataGrid,
  DataGridContainer,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/base/reui/data-grid/data-grid-column-header"
import { DataGridPagination } from "@/registry-reui/bases/base/reui/data-grid/data-grid-pagination"
import { DataGridTable } from "@/registry-reui/bases/base/reui/data-grid/data-grid-table"
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@/registry-reui/bases/base/reui/filters"
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
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import { ScrollArea, ScrollBar } from "@/registry/bases/base/ui/scroll-area"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface IData {
  id: string
  name: string
  availability: "online" | "away" | "busy" | "offline"
  avatar: string
  status: "active" | "inactive"
  flag: string // Emoji flags
  email: string
  company: string
  role: string
  joined: string
  location: string
  balance: number
}

const demoData: IData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    availability: "online",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    status: "active",
    flag: "us",
    email: "alex@apple.com",
    company: "Apple",
    role: "CEO",
    joined: "Jan, 2024",
    location: "San Francisco, USA",
    balance: 5143.03,
  },
  {
    id: "2",
    name: "Sarah Chen",
    availability: "away",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    status: "inactive",
    flag: "gb",
    email: "sarah@openai.com",
    company: "OpenAI",
    role: "CTO",
    joined: "Mar, 2023",
    location: "London, UK",
    balance: 4321.87,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    availability: "busy",
    avatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    status: "active",
    flag: "ca",
    email: "michael@meta.com",
    company: "Meta",
    role: "Designer",
    joined: "Jun, 2022",
    location: "Toronto, Canada",
    balance: 7654.98,
  },
  {
    id: "4",
    name: "Emma Wilson",
    availability: "offline",
    avatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    status: "inactive",
    flag: "au",
    email: "emma@tesla.com",
    company: "Tesla",
    role: "Developer",
    joined: "Sep, 2024",
    location: "Sydney, Australia",
    balance: 3456.45,
  },
  {
    id: "5",
    name: "David Kim",
    availability: "online",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    status: "active",
    flag: "de",
    email: "david@sap.com",
    company: "SAP",
    role: "Lawyer",
    joined: "Nov, 2023",
    location: "Berlin, Germany",
    balance: 9876.54,
  },
  {
    id: "6",
    name: "Aron Thompson",
    availability: "away",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    status: "active",
    flag: "my",
    email: "aron@keenthemes.com",
    company: "Keenthemes",
    role: "Director",
    joined: "Feb, 2022",
    location: "Kuala Lumpur, MY",
    balance: 6214.22,
  },
  {
    id: "7",
    name: "James Brown",
    availability: "busy",
    avatar:
      "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    status: "inactive",
    flag: "es",
    email: "james@bbva.es",
    company: "BBVA",
    role: "Product Manager",
    joined: "Aug, 2024",
    location: "Barcelona, Spain",
    balance: 5321.77,
  },
  {
    id: "8",
    name: "Maria Garcia",
    availability: "offline",
    avatar:
      "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    status: "active",
    flag: "jp",
    email: "maria@sony.jp",
    company: "Sony",
    role: "Marketing Lead",
    joined: "Dec, 2023",
    location: "Tokyo, Japan",
    balance: 8452.39,
  },
  {
    id: "9",
    name: "Nick Johnson",
    availability: "online",
    avatar:
      "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
    status: "active",
    flag: "fr",
    email: "nick@lvmh.fr",
    company: "LVMH",
    role: "Data Scientist",
    joined: "Apr, 2022",
    location: "Paris, France",
    balance: 7345.1,
  },
  {
    id: "10",
    name: "Liam Thompson",
    availability: "away",
    avatar:
      "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
    status: "inactive",
    flag: "it",
    email: "liam@eni.it",
    company: "ENI",
    role: "Engineer",
    joined: "Jul, 2024",
    location: "Milan, Italy",
    balance: 5214.88,
  },
  {
    id: "11",
    name: "Alex Johnson",
    availability: "busy",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    status: "active",
    flag: "br",
    email: "alex@vale.br",
    company: "Vale",
    role: "Software Engineer",
    joined: "May, 2023",
    location: "Rio de Janeiro, Brazil",
    balance: 9421.5,
  },
  {
    id: "12",
    name: "Sarah Chen",
    availability: "offline",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    status: "active",
    flag: "in",
    email: "sarah@tata.in",
    company: "Tata",
    role: "Sales Manager",
    joined: "Oct, 2024",
    location: "Mumbai, India",
    balance: 4521.67,
  },
]

// Availability status component
const AvailabilityStatus = ({ availability }: { availability: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Away"
      case "busy":
        return "Busy"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className={`size-2 rounded-full ${getStatusColor(availability)}`} />
      <span className="text-muted-foreground text-sm">
        {getStatusLabel(availability)}
      </span>
    </div>
  )
}

// Helper to check if a filter has meaningful values
const getActiveFilters = (filters: Filter[]) => {
  return filters.filter((filter) => {
    const { values } = filter

    // Check if filter has meaningful values
    if (!values || values.length === 0) return false

    // For text/string values, check if they're not empty strings
    if (
      values.every((value) => typeof value === "string" && value.trim() === "")
    )
      return false

    // For number values, check if they're not null/undefined
    if (values.every((value) => value === null || value === undefined))
      return false

    // For arrays, check if they're not empty
    if (values.every((value) => Array.isArray(value) && value.length === 0))
      return false

    return true
  })
}

export default function Pattern() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])
  const [filters, setFilters] = useState<Filter[]>([
    createFilter("status", "is", ["active"]),
  ])

  // Async state management
  const [isLoading, setIsLoading] = useState(false)
  const [filteredData, setFilteredData] = useState<IData[]>(demoData)
  const isInitialLoad = useRef(true)

  // Filter field configurations
  const fields: FilterFieldConfig[] = [
    {
      key: "name",
      label: "Name",
      icon: (
        <IconPlaceholder
          lucide="UserIcon"
          tabler="IconUser"
          hugeicons="UserIcon"
          phosphor="UserIcon"
          remixicon="RiUserLine"
          className="size-3.5"
        />
      ),
      type: "text",
      className: "w-40",
      placeholder: "Search names...",
    },
    {
      key: "email",
      label: "Email",
      icon: (
        <IconPlaceholder
          lucide="MailIcon"
          tabler="IconMail"
          hugeicons="MailIcon"
          phosphor="EnvelopeIcon"
          remixicon="RiMailLine"
          className="size-3.5"
        />
      ),
      type: "text",
      className: "w-48",
      placeholder: "user@example.com",
    },
    {
      key: "company",
      label: "Company",
      icon: (
        <IconPlaceholder
          lucide="BuildingIcon"
          tabler="IconBuilding"
          hugeicons="Building02Icon"
          phosphor="BuildingIcon"
          remixicon="RiBuilding4Line"
          className="size-3.5"
        />
      ),
      type: "select",
      searchable: true,
      className: "w-[180px]",
      options: [
        { value: "Apple", label: "Apple" },
        { value: "OpenAI", label: "OpenAI" },
        { value: "Meta", label: "Meta" },
        { value: "Tesla", label: "Tesla" },
        { value: "SAP", label: "SAP" },
        { value: "Keenthemes", label: "Keenthemes" },
        { value: "BBVA", label: "BBVA" },
        { value: "Sony", label: "Sony" },
        { value: "LVMH", label: "LVMH" },
        { value: "ENI", label: "ENI" },
        { value: "Vale", label: "Vale" },
        { value: "Tata", label: "Tata" },
      ],
    },
    {
      key: "role",
      label: "Role",
      icon: (
        <IconPlaceholder
          lucide="UserIcon"
          tabler="IconUser"
          hugeicons="UserIcon"
          phosphor="UserIcon"
          remixicon="RiUserLine"
          className="size-3.5"
        />
      ),
      type: "select",
      searchable: true,
      className: "w-[160px]",
      options: [
        { value: "CEO", label: "CEO" },
        { value: "CTO", label: "CTO" },
        { value: "Designer", label: "Designer" },
        { value: "Developer", label: "Developer" },
        { value: "Lawyer", label: "Lawyer" },
        { value: "Director", label: "Director" },
        { value: "Product Manager", label: "Product Manager" },
        { value: "Marketing Lead", label: "Marketing Lead" },
        { value: "Data Scientist", label: "Data Scientist" },
        { value: "Engineer", label: "Engineer" },
        { value: "Software Engineer", label: "Software Engineer" },
        { value: "Sales Manager", label: "Sales Manager" },
      ],
    },
    {
      key: "status",
      label: "Status",
      icon: (
        <IconPlaceholder
          lucide="UserIcon"
          tabler="IconUser"
          hugeicons="UserIcon"
          phosphor="UserIcon"
          remixicon="RiUserLine"
          className="size-3.5"
        />
      ),
      type: "select",
      searchable: false,
      className: "w-[140px]",
      options: [
        {
          value: "active",
          label: "Active",
          icon: <div className="size-2 rounded-full bg-green-500"></div>,
        },
        {
          value: "inactive",
          label: "Inactive",
          icon: <div className="bg-destructive size-2 rounded-full"></div>,
        },
        {
          value: "archived",
          label: "Archived",
          icon: <div className="size-2 rounded-full bg-zinc-400"></div>,
        },
      ],
    },
    {
      key: "availability",
      label: "Availability",
      icon: (
        <IconPlaceholder
          lucide="UserIcon"
          tabler="IconUser"
          hugeicons="UserIcon"
          phosphor="UserIcon"
          remixicon="RiUserLine"
          className="size-3.5"
        />
      ),
      type: "select",
      searchable: false,
      className: "w-[160px]",
      options: [
        {
          value: "online",
          label: "Online",
          icon: (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span>Online</span>
            </div>
          ),
        },
        {
          value: "away",
          label: "Away",
          icon: (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-yellow-500" />
              <span>Away</span>
            </div>
          ),
        },
        {
          value: "busy",
          label: "Busy",
          icon: (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-red-500" />
              <span>Busy</span>
            </div>
          ),
        },
        {
          value: "offline",
          label: "Offline",
          icon: (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-gray-400" />
              <span>Offline</span>
            </div>
          ),
        },
      ],
    },
    {
      key: "location",
      label: "Location",
      icon: (
        <IconPlaceholder
          lucide="MapPinIcon"
          tabler="IconMapPin"
          hugeicons="Location06Icon"
          phosphor="MapPinIcon"
          remixicon="RiMapPinLine"
          className="size-3.5"
        />
      ),
      type: "text",
      className: "w-40",
      placeholder: "Search locations...",
    },
  ]

  // Apply filters to data (shared function)
  const applyFiltersToData = useCallback((newFilters: Filter[]) => {
    let filtered = [...demoData]

    // Filter out empty filters before applying
    const activeFilters = getActiveFilters(newFilters)

    activeFilters.forEach((filter) => {
      const { field, operator, values } = filter

      filtered = filtered.filter((item) => {
        const fieldValue = item[field as keyof IData]

        switch (operator) {
          case "is":
            return values.includes(fieldValue)
          case "is_not":
            return !values.includes(fieldValue)
          case "contains":
            return values.some((value) =>
              String(fieldValue)
                .toLowerCase()
                .includes(String(value).toLowerCase())
            )
          case "not_contains":
            return !values.some((value) =>
              String(fieldValue)
                .toLowerCase()
                .includes(String(value).toLowerCase())
            )
          case "equals":
            return fieldValue === values[0]
          case "not_equals":
            return fieldValue !== values[0]
          case "greater_than":
            return Number(fieldValue) > Number(values[0])
          case "less_than":
            return Number(fieldValue) < Number(values[0])
          case "greater_than_or_equal":
            return Number(fieldValue) >= Number(values[0])
          case "less_than_or_equal":
            return Number(fieldValue) <= Number(values[0])
          case "between":
            if (values.length >= 2) {
              const min = Number(values[0])
              const max = Number(values[1])
              return Number(fieldValue) >= min && Number(fieldValue) <= max
            }
            return true
          case "not_between":
            if (values.length >= 2) {
              const min = Number(values[0])
              const max = Number(values[1])
              return Number(fieldValue) < min || Number(fieldValue) > max
            }
            return true
          case "before":
            return new Date(String(fieldValue)) < new Date(String(values[0]))
          case "after":
            return new Date(String(fieldValue)) > new Date(String(values[0]))
          default:
            return true
        }
      })
    })

    return filtered
  }, [])

  // Simulate async data filtering
  const simulateAsyncFiltering = useCallback(
    async (newFilters: Filter[]) => {
      setIsLoading(true) // Show loading on current data

      // Simulate API call delay
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 1200)
      )

      // Apply filters and update data after timeout
      const filtered = applyFiltersToData(newFilters)
      setFilteredData(filtered)
      setIsLoading(false)
    },
    [applyFiltersToData]
  )

  const handleFiltersChange = useCallback(
    (newFilters: Filter[]) => {
      const oldActive = getActiveFilters(filters)
      const newActive = getActiveFilters(newFilters)

      setFilters(newFilters)

      // Compare active filters to decide if we need to trigger async search
      // Use stringify for simple deep comparison of filter objects
      if (JSON.stringify(oldActive) === JSON.stringify(newActive)) {
        return
      }

      // Reset pagination when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      // Trigger async filtering
      simulateAsyncFiltering(newFilters)
    },
    [filters, simulateAsyncFiltering]
  )

  // Initial data load - only run once on mount
  useEffect(() => {
    if (isInitialLoad.current) {
      // Apply initial filter without loading state
      const initialFiltered = applyFiltersToData(filters)
      setFilteredData(initialFiltered)
      isInitialLoad.current = false
    }
  }, [filters, applyFiltersToData])

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Staff" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage
                  src={row.original.avatar}
                  alt={row.original.name}
                />
                <AvatarFallback>
                  {row.original.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="text-foreground font-medium">
                  {row.original.name}
                </div>
                <div className="text-muted-foreground truncate text-xs">
                  {row.original.email}
                </div>
              </div>
            </div>
          )
        },
        size: 200,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: "company",
        id: "company",
        header: ({ column }) => (
          <DataGridColumnHeader title="Company" column={column} />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 150,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        accessorKey: "role",
        id: "role",
        header: ({ column }) => (
          <DataGridColumnHeader title="Occupation" column={column} />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 125,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="h-4 w-16" />,
        },
      },
      {
        accessorKey: "status",
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status

          if (status == "active") {
            return <Badge variant="success-outline">Active</Badge>
          } else if (status == "inactive") {
            return <Badge variant="destructive-outline">Inactive</Badge>
          } else if (status == "archived") {
            return <Badge variant="warning-outline">Archived</Badge>
          }
        },
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-4 w-16 rounded-full" />,
        },
      },
      {
        accessorKey: "availability",
        id: "availability",
        header: "Availability",
        cell: ({ row }) => (
          <AvailabilityStatus availability={row.original.availability} />
        ),
        size: 120,
        enableSorting: true,
        meta: {
          skeleton: (
            <div className="flex items-center gap-1.5">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-3.5 w-12" />
            </div>
          ),
        },
      },
      {
        accessorKey: "location",
        id: "location",
        header: ({ column }) => (
          <DataGridColumnHeader title="Location" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <img
              src={`https://flagcdn.com/${row.original.flag.toLowerCase()}.svg`}
              alt={row.original.flag}
              className="size-4 rounded-full object-cover"
            />
            <span>{row.original.location}</span>
          </div>
        ),
        size: 180,
        enableSorting: true,
        meta: {
          skeleton: (
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ),
        },
      },
      {
        accessorKey: "balance",
        id: "balance",
        header: ({ column }) => (
          <DataGridColumnHeader title="Balance" column={column} />
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            ${row.original.balance.toLocaleString()}
          </span>
        ),
        size: 120,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-4 w-16" />,
        },
      },
    ],
    []
  )

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  )

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="w-full self-start">
      {/* Filters Section */}
      <div className="mb-3.5 flex items-start gap-2.5">
        <div className="flex-1">
          <Filters
            filters={filters}
            fields={fields}
            onChange={handleFiltersChange}
            size="sm"
            trigger={
              <Button variant="outline" size="icon-sm">
                <IconPlaceholder
                  lucide="ListFilterIcon"
                  tabler="IconFilter2"
                  hugeicons="FilterMailIcon"
                  phosphor="FunnelSimpleIcon"
                  remixicon="RiFilter3Line"
                />
              </Button>
            }
          />
        </div>
        {filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters([])
              simulateAsyncFiltering([])
            }}
            disabled={isLoading}
          >
            <IconPlaceholder
              lucide="FunnelXIcon"
              tabler="IconFilterX"
              hugeicons="FilterRemoveIcon"
              phosphor="FunnelXIcon"
              remixicon="RiFilterOffLine"
            />
            Clear
          </Button>
        )}
      </div>

      {/* Data Grid */}
      <DataGrid
        table={table}
        isLoading={isLoading}
        loadingMode="skeleton"
        recordCount={filteredData?.length || 0}
        tableLayout={{
          dense: true,
          columnsMovable: true,
        }}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
          <DataGridPagination />
        </div>
      </DataGrid>

      {/* Async Info Alert */}
      <Alert variant="success" className="mt-5">
        <IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconAlertCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        />
        <AlertTitle>
          Async Mode: Simulated API Delay of <strong>800-2000ms</strong>
        </AlertTitle>
      </Alert>
    </div>
  )
}
