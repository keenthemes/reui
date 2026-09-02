"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import {
  DataGrid,
  dataGridFeatures,
  type DataGridApiFetchParams,
  type DataGridApiResponse,
  type DataGridFeatures,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-column-header"
import { DataGridPagination } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-scroll-area"
import { DataGridTable } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-table"
import {
  ColumnDef,
  PaginationState,
  SortingState,
  useTable,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import { Skeleton } from "@/registry/bases/radix/ui/skeleton"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface IData {
  id: string
  name: string
  avatar: string
  email: string
  company: string
  status: "Active" | "Inactive" | "Pending"
  balance: number
}

type StatusFilter = "all" | IData["status"]

type ServerFetchParams = DataGridApiFetchParams & {
  status: StatusFilter
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

const companies = [
  "Apple",
  "OpenAI",
  "Meta",
  "Tesla",
  "SAP",
  "Keenthemes",
  "BBVA",
  "Sony",
  "LVMH",
  "ENI",
]

const statuses: IData["status"][] = ["Active", "Inactive", "Pending"]

// Deterministic, so sorting and paging are reproducible across fetches. A
// non-round total makes the "1 - 5 of 487" info text read like a real API.
const TOTAL_SERVER_RECORDS = 487

const serverRecords: IData[] = Array.from(
  { length: TOTAL_SERVER_RECORDS },
  (_, index) => {
    const name = names[index % names.length]
    return {
      id: String(index + 1),
      name,
      avatar: avatars[index % avatars.length],
      email: `${name.toLowerCase().replace(" ", ".")}${index + 1}@company.com`,
      company: companies[(index * 3) % companies.length],
      status: statuses[index % statuses.length],
      balance: Math.round((1000 + ((index * 137.17) % 9000)) * 100) / 100,
    }
  }
)

/**
 * The simulated server. Everything inside this function is what a real
 * backend does with the query string of a paged endpoint: filter, sort, count,
 * slice. Replace the whole body with a fetch to your own API and keep the
 * return shape - one page of rows plus the total AFTER filtering.
 */
async function fetchServerPage(
  params: ServerFetchParams,
  signal: AbortSignal
): Promise<DataGridApiResponse<IData>> {
  // Latency, so the built-in skeleton state is actually visible in the demo.
  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, 500)

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId)
        reject(new DOMException("Request aborted", "AbortError"))
      },
      { once: true }
    )
  })

  const search = params.searchQuery?.toLowerCase() ?? ""
  let rows = serverRecords
  if (params.status !== "all") {
    rows = rows.filter((record) => record.status === params.status)
  }
  if (search) {
    rows = rows.filter((record) =>
      [record.name, record.email, record.company].some((value) =>
        value.toLowerCase().includes(search)
      )
    )
  }

  if (params.sorting?.length) {
    rows = [...rows].sort((leftRow, rightRow) => {
      for (const sort of params.sorting ?? []) {
        const left = leftRow[sort.id as keyof IData]
        const right = rightRow[sort.id as keyof IData]
        const comparison =
          typeof left === "number" && typeof right === "number"
            ? left - right
            : String(left).localeCompare(String(right))

        if (comparison !== 0) {
          return sort.desc ? -comparison : comparison
        }
      }

      return 0
    })
  }

  const start = params.pageIndex * params.pageSize
  const data = rows.slice(start, start + params.pageSize)

  return {
    data,
    empty: rows.length === 0,
    pagination: {
      total: rows.length,
      page: params.pageIndex,
    },
  }
}

export default function Pattern() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [result, setResult] = useState<DataGridApiResponse<IData>>({
    data: [],
    empty: false,
    pagination: { total: 0, page: 0 },
  })
  const request = useMemo<ServerFetchParams>(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      searchQuery: search,
      status,
    }),
    [pagination.pageIndex, pagination.pageSize, search, sorting, status]
  )
  const requestKey = JSON.stringify(request)
  const [loadState, setLoadState] = useState<{
    requestKey: string
    error?: string
  }>()
  const isLoading = loadState?.requestKey !== requestKey
  const error =
    loadState?.requestKey === requestKey ? loadState.error : undefined

  const hasActiveFilters = searchInput.trim() !== "" || status !== "all"

  const resetToFirstPage = () =>
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
    )

  // Debounce typing into one server query, and return to the first page: the
  // old page index is meaningless against a different filtered set.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPagination((current) =>
        current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
      )
    }, 350)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  // One fetch per settled query state. Cleanup aborts superseded requests so a
  // slow response cannot overwrite fresher rows or waste backend work.
  useEffect(() => {
    const controller = new AbortController()

    fetchServerPage(request, controller.signal)
      .then((response) => {
        setResult(response)
        setLoadState({ requestKey })
      })
      .catch((fetchError: unknown) => {
        if (
          !(
            fetchError instanceof DOMException &&
            fetchError.name === "AbortError"
          )
        ) {
          setLoadState({ requestKey, error: "Could not load records" })
        }
      })

    return () => controller.abort()
  }, [request, requestKey])

  const columns = useMemo<ColumnDef<DataGridFeatures, IData>[]>(
    () => [
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
                  .map((namePart) => namePart[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-foreground font-medium">
                {row.original.name}
              </div>
              <div className="text-muted-foreground text-xs">
                {row.original.email}
              </div>
            </div>
          </div>
        ),
        minSize: 220,
        meta: {
          autoSize: true,
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ),
        },
        enableSorting: true,
      },
      {
        accessorKey: "company",
        id: "company",
        header: ({ column }) => (
          <DataGridColumnHeader title="Company" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.company}</span>
        ),
        size: 130,
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
        enableSorting: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => {
          const rowStatus = row.original.status

          if (rowStatus === "Active") {
            return <Badge variant="success-outline">Active</Badge>
          }

          if (rowStatus === "Inactive") {
            return <Badge variant="info-outline">Inactive</Badge>
          }

          return <Badge variant="warning-outline">Pending</Badge>
        },
        size: 120,
        meta: {
          skeleton: <Skeleton className="h-5 w-16" />,
        },
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
        meta: {
          skeleton: <Skeleton className="h-4 w-24" />,
        },
        enableSorting: true,
      },
    ],
    []
  )

  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: result.data,
    // Server-side mode: `data` is exactly one page, so paging and sorting are
    // the server's job instead of the row models'.
    manualPagination: true,
    manualSorting: true,
    // The server-side total. REQUIRED alongside recordCount below: without it
    // getPageCount() is derived from the one loaded page and the pagination
    // buttons collapse to a single page, while the info text still claims the
    // full count. recordCount only drives the "1 - 5 of N" text.
    rowCount: result.pagination.total,
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  return (
    <DataGrid
      table={table}
      recordCount={result.pagination.total}
      isLoading={isLoading}
      tableLayout={{ columnsResizable: true }}
    >
      <Card className="w-full gap-3 py-3.5">
        <CardHeader className="items-center px-3.5">
          <CardTitle className="flex items-center gap-2">
            Users
            <Badge
              variant={error ? "destructive" : "secondary"}
              size="sm"
              className="tabular-nums"
            >
              {error ?? result.pagination.total}
            </Badge>
          </CardTitle>
          <CardAction className="flex flex-wrap items-center justify-end gap-2">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              aria-label="Search users"
              placeholder="Search name, email, company..."
              className="w-56"
            />
            <Select
              value={status}
              /* The primitive types the callback value as nullable; a null
                 (nothing selected) means the unfiltered view. */
              onValueChange={(next) => {
                setStatus((next ?? "all") as StatusFilter)
                resetToFirstPage()
              }}
            >
              <SelectTrigger className="w-32" aria-label="Filter by status">
                {/* Explicit label: the primitive can only resolve a value to
                    its item label after the popup has mounted the items, so a
                    fresh render would show the raw "all". */}
                <SelectValue placeholder="Status">
                  {status === "all" ? "All statuses" : status}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            {/* Present only while a filter is active, so the resting toolbar
                stays quiet. Search is cleared through both halves at once:
                waiting out the debounce would leave stale rows for 350ms. */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput("")
                  setSearch("")
                  setStatus("all")
                  resetToFirstPage()
                }}
              >
                <IconPlaceholder
                  lucide="XIcon"
                  tabler="IconX"
                  hugeicons="Cancel01Icon"
                  phosphor="XIcon"
                  remixicon="RiCloseLine"
                  className="size-4"
                />
                Clear
              </Button>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="border-t p-0">
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className="border-none bg-transparent! px-3.5 py-0">
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}
