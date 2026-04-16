// Description: Data grid with async inline editing and optimistic rollback
// GridSize: 1
// Order: 31

"use client"

import { useCallback, useMemo, useState } from "react"
import {
  EditableDataGridColumn,
  useEditableDataGrid,
} from "@/registry-reui/bases/radix/hooks/use-editable-data-grid"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import {
  DataGrid,
  DataGridColumnEditor,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-column-header"
import {
  DataGridEditableCell,
  DataGridEditDialog,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-editing"
import { DataGridPagination } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-scroll-area"
import { DataGridTable } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-table"
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  Table,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/bases/radix/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { Skeleton } from "@/registry/bases/radix/ui/skeleton"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type Role = "Product Designer" | "Frontend Engineer" | "Engineering Manager"
type WorkMode = "Onsite" | "Hybrid" | "Remote"

interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  workMode: WorkMode
  salary: number
  mentor: boolean
  active: boolean
  rating: number
  notes: string
}

const roleOptions: Array<{ label: string; value: Role }> = [
  { label: "Product Designer", value: "Product Designer" },
  { label: "Frontend Engineer", value: "Frontend Engineer" },
  { label: "Engineering Manager", value: "Engineering Manager" },
]

const workModeOptions = [
  {
    label: "Onsite",
    value: "Onsite" as const,
    description: "Primarily office-based with in-person rituals.",
  },
  {
    label: "Hybrid",
    value: "Hybrid" as const,
    description: "Splits time between collaboration days and remote focus.",
  },
  {
    label: "Remote",
    value: "Remote" as const,
    description: "Works fully distributed across time zones.",
  },
]

const initialData: TeamMember[] = [
  {
    id: "tm-2001",
    name: "Avery Miles",
    email: "avery@reui.dev",
    role: "Product Designer",
    workMode: "Hybrid",
    salary: 92000,
    mentor: true,
    active: true,
    rating: 4,
    notes:
      "Owns the onboarding flows and keeps the design system examples polished.",
  },
  {
    id: "tm-2002",
    name: "Jordan Lee",
    email: "jordan@reui.dev",
    role: "Frontend Engineer",
    workMode: "Remote",
    salary: 108000,
    mentor: false,
    active: true,
    rating: 5,
    notes:
      "Maintains the registry pipeline and performance-sensitive interaction examples.",
  },
  {
    id: "tm-2003",
    name: "Naomi Cruz",
    email: "naomi@reui.dev",
    role: "Engineering Manager",
    workMode: "Onsite",
    salary: 132000,
    mentor: true,
    active: true,
    rating: 5,
    notes:
      "Pairs closely with contributors and reviews the open source roadmap every week.",
  },
  {
    id: "tm-2004",
    name: "Ethan Brooks",
    email: "ethan@reui.dev",
    role: "Frontend Engineer",
    workMode: "Hybrid",
    salary: 99000,
    mentor: false,
    active: false,
    rating: 3,
    notes:
      "Helping stabilize async demos and improve keyboard accessibility across the grid.",
  },
  {
    id: "tm-2005",
    name: "Camila Stone",
    email: "camila@reui.dev",
    role: "Product Designer",
    workMode: "Remote",
    salary: 96000,
    mentor: true,
    active: true,
    rating: 4,
    notes:
      "Focuses on visual QA and the component catalog presentation language.",
  },
  {
    id: "tm-2006",
    name: "Micah Patel",
    email: "micah@reui.dev",
    role: "Frontend Engineer",
    workMode: "Onsite",
    salary: 101000,
    mentor: true,
    active: true,
    rating: 4,
    notes:
      "Owns table-heavy patterns and keeps the data-grid examples aligned across bases.",
  },
]

const cellSkeletons = {
  name: (
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-5 w-28" />
    </div>
  ),
  email: <Skeleton className="h-5 w-40" />,
  role: <Skeleton className="h-9 w-32" />,
  workMode: <Skeleton className="h-9 w-36" />,
  salary: <Skeleton className="h-9 w-24" />,
  toggle: (
    <div className="flex justify-center">
      <Skeleton className="h-6 w-10 rounded-full" />
    </div>
  ),
  rating: <Skeleton className="h-5 w-24" />,
  notes: <Skeleton className="h-10 w-full" />,
  actions: (
    <div className="flex justify-end">
      <Skeleton className="size-8 rounded-md" />
    </div>
  ),
}

function validateEmail(value: unknown) {
  if (typeof value !== "string") {
    return "Email must be a string."
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : "Enter a valid email address."
}

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}

function normalizeTeamMember(row: TeamMember) {
  return {
    ...row,
    name: row.name.trim(),
    email: row.email.trim().toLowerCase(),
    notes: row.notes.trim(),
  }
}

function ActionsCell({
  row,
  table,
}: {
  row: Row<TeamMember>
  table: Table<TeamMember>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" size="icon" variant="ghost">
          <IconPlaceholder
            lucide="MoreHorizontalIcon"
            tabler="IconDots"
            hugeicons="MoreHorizontalCircle01Icon"
            phosphor="DotsThreeIcon"
            remixicon="RiMoreLine"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuItem
          onClick={() => table.options.meta?.editing?.openDialog(row.original)}
        >
          Edit via API form
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Pattern() {
  const [data, setData] = useState<TeamMember[]>(initialData)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    notes: false,
  })
  const [failNextSave, setFailNextSave] = useState(false)

  const handleResetAll = useCallback(() => {
    setData(initialData)
    setFailNextSave(false)
    toast.success("Server demo reset", {
      description:
        "The optimistic cache and simulated API state are back to the original snapshot.",
    })
  }, [])

  const simulateServerMutation = useCallback(async () => {
    await wait(900)

    if (failNextSave) {
      setFailNextSave(false)
      throw new Error(
        "Simulated API failure. Rollback applied. Retry the change."
      )
    }
  }, [failNextSave])

  const columns = useMemo<ColumnDef<TeamMember>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Name" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 180,
        meta: {
          skeleton: cellSkeletons.name,
          editor: {
            kind: "text",
            label: "Name",
            placeholder: "Avery Miles",
            required: true,
          },
        },
      },
      {
        accessorKey: "email",
        id: "email",
        header: ({ column }) => (
          <DataGridColumnHeader title="Email" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 220,
        meta: {
          skeleton: cellSkeletons.email,
          editor: {
            kind: "email",
            label: "Email",
            placeholder: "name@company.com",
            required: true,
            validate: validateEmail,
          },
        },
      },
      {
        accessorKey: "role",
        id: "role",
        header: ({ column }) => (
          <DataGridColumnHeader title="Role" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 180,
        meta: {
          skeleton: cellSkeletons.role,
          editor: {
            kind: "select",
            label: "Role",
            options: roleOptions,
            required: true,
          },
        },
      },
      {
        accessorKey: "workMode",
        id: "workMode",
        header: ({ column }) => (
          <DataGridColumnHeader title="Work Mode" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 240,
        enableSorting: false,
        meta: {
          skeleton: cellSkeletons.workMode,
          editor: {
            kind: "radio",
            label: "Work Mode",
            options: workModeOptions,
            required: true,
          },
        },
      },
      {
        accessorKey: "salary",
        id: "salary",
        header: ({ column }) => (
          <DataGridColumnHeader title="Salary" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 170,
        meta: {
          skeleton: cellSkeletons.salary,
          editor: {
            kind: "number",
            label: "Salary",
            min: 60000,
            max: 250000,
            step: 1000,
            required: true,
          },
        },
      },
      {
        accessorKey: "mentor",
        id: "mentor",
        header: ({ column }) => (
          <DataGridColumnHeader title="Mentor" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 110,
        enableSorting: false,
        meta: {
          skeleton: cellSkeletons.toggle,
          editor: {
            kind: "checkbox",
            label: "Mentor",
            description:
              "Mark whether this teammate is available for contributor pairing.",
          },
        },
      },
      {
        accessorKey: "active",
        id: "active",
        header: ({ column }) => (
          <DataGridColumnHeader title="Active" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 110,
        meta: {
          skeleton: cellSkeletons.toggle,
          editor: {
            kind: "switch",
            label: "Active",
            description:
              "Controls whether the teammate is currently active in the rotation.",
          },
        },
      },
      {
        accessorKey: "rating",
        id: "rating",
        header: ({ column }) => (
          <DataGridColumnHeader title="Quality" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 150,
        meta: {
          skeleton: cellSkeletons.rating,
          editor: {
            kind: "rating",
            label: "Quality score",
            description:
              "A quick internal confidence score for demo readiness.",
          },
        },
      },
      {
        accessorKey: "notes",
        id: "notes",
        header: ({ column }) => (
          <DataGridColumnHeader title="Notes" column={column} />
        ),
        cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
        size: 260,
        enableSorting: false,
        meta: {
          skeleton: cellSkeletons.notes,
          editor: {
            kind: "textarea",
            label: "Notes",
            description:
              "This field is hidden from the table but generated automatically inside the edit dialog.",
            placeholder: "Document extra context for the row here.",
            dialogOnly: true,
          },
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row, table }) => <ActionsCell row={row} table={table} />,
        size: 60,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        meta: {
          skeleton: cellSkeletons.actions,
        },
      },
    ],
    []
  )

  const editorColumns = useMemo(
    () =>
      columns.reduce<EditableDataGridColumn<TeamMember>[]>(
        (accumulator, column) => {
          if (column.id && column.meta?.editor) {
            accumulator.push({
              id: String(column.id),
              editor: column.meta.editor as DataGridColumnEditor<
                TeamMember,
                unknown
              >,
            })
          }

          return accumulator
        },
        []
      ),
    [columns]
  )

  const editing = useEditableDataGrid<TeamMember>({
    data,
    setData,
    getRowId: (row) => row.id,
    editorColumns,
    onSaveCell: async ({ nextRow }) => {
      await simulateServerMutation()
      return normalizeTeamMember(nextRow)
    },
    onSaveRow: async ({ nextRow }) => {
      await simulateServerMutation()
      const normalizedRow = normalizeTeamMember(nextRow)
      toast.success("Server update completed", {
        description: `${normalizedRow.name} was persisted through the mocked API.`,
      })
      return normalizedRow
    },
    onError: (_error, context) => {
      toast.error(context.message, {
        description:
          "The optimistic update was rolled back. Retry the change when you are ready.",
      })
    },
  })
  const isGridPending = editing.isGridPending()

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    meta: {
      editing,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataGrid
      table={table}
      recordCount={data.length}
      loadingMode="skeleton"
      tableLayout={{
        columnsResizable: true,
        headerSticky: true,
      }}
      tableClassNames={{
        headerSticky: "sticky top-0 z-10 bg-background/90 backdrop-blur-xs",
      }}
    >
      <Card className="w-full gap-0 p-0">
        <CardHeader className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-medium">
              Async Editing Sandbox
            </span>
            <Badge variant="info-outline" size="sm">
              Optimistic API
            </Badge>
            {isGridPending ? (
              <Badge variant="primary-outline" size="sm">
                Saving row
              </Badge>
            ) : null}
            {failNextSave ? (
              <Badge variant="warning-outline" size="sm">
                Fail next save
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={failNextSave ? "destructive" : "outline"}
              size="sm"
              onClick={() => setFailNextSave((currentValue) => !currentValue)}
              disabled={isGridPending}
            >
              <IconPlaceholder
                lucide="TriangleAlertIcon"
                tabler="IconAlertTriangle"
                hugeicons="Alert02Icon"
                phosphor="WarningCircleIcon"
                remixicon="RiAlarmWarningLine"
                className="size-4"
              />
              {failNextSave ? "Failure armed" : "Fail next save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAll}
              disabled={isGridPending}
            >
              <IconPlaceholder
                lucide="RotateCcwIcon"
                tabler="IconRotateClockwise2"
                hugeicons="ReloadIcon"
                phosphor="ArrowCounterClockwiseIcon"
                remixicon="RiRefreshLine"
                className="size-4"
              />
              Reset demo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="border-y p-0">
          <DataGridScrollArea className="h-[460px]">
            <DataGridTable />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className="border-none bg-transparent! px-4 py-3">
          <DataGridPagination />
        </CardFooter>
      </Card>

      <DataGridEditDialog
        table={table}
        title="Edit teammate over API"
        description="The grid commits optimistically, then the mocked API either confirms the update or rolls it back."
      />
    </DataGrid>
  )
}
