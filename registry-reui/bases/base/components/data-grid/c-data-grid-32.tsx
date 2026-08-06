"use client"

import { useMemo, useState } from "react"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/base/reui/data-grid/data-grid-column-header"
import type { DataGridI18nOverrides } from "@/registry-reui/bases/base/reui/data-grid/data-grid-i18n"
import { DataGridPagination } from "@/registry-reui/bases/base/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/registry-reui/bases/base/reui/data-grid/data-grid-scroll-area"
import { DataGridTable } from "@/registry-reui/bases/base/reui/data-grid/data-grid-table"
import {
  ColumnDef,
  PaginationState,
  SortingState,
  useTable,
} from "@tanstack/react-table"

type Project = {
  id: string
  project: string
  owner: string
  status: "Active" | "Paused" | "Complete"
}

const projects: Project[] = [
  {
    id: "1",
    project: "Website refresh",
    owner: "Alex Johnson",
    status: "Active",
  },
  {
    id: "2",
    project: "Mobile onboarding",
    owner: "Sarah Chen",
    status: "Paused",
  },
  {
    id: "3",
    project: "Billing migration",
    owner: "Michael Rodriguez",
    status: "Complete",
  },
  {
    id: "4",
    project: "Support portal",
    owner: "Emma Wilson",
    status: "Active",
  },
  {
    id: "5",
    project: "Design system",
    owner: "David Kim",
    status: "Active",
  },
  {
    id: "6",
    project: "Usage reports",
    owner: "Aron Thompson",
    status: "Complete",
  },
]

const localizedLabels: DataGridI18nOverrides = {
  labels: {
    sortAscending: "A-Z",
    sortDescending: "Z-A",
    pinColumnStart: "Pin to start",
    pinColumnEnd: "Pin to end",
    rowsPerPage: "Per page",
    paginationInfo: ({ from, to, count }) =>
      `${from}-${to} of ${count} projects`,
  },
}

export default function Pattern() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<DataGridFeatures, Project>[]>(
    () => [
      {
        accessorKey: "project",
        header: ({ column }) => (
          <DataGridColumnHeader title="Project" column={column} />
        ),
        size: 220,
        enableSorting: true,
      },
      {
        accessorKey: "owner",
        header: ({ column }) => (
          <DataGridColumnHeader title="Owner" column={column} />
        ),
        size: 180,
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        size: 140,
        enableSorting: true,
      },
    ],
    []
  )

  const table = useTable({
    features: dataGridFeatures,
    data: projects,
    columns,
    pageCount: Math.ceil(projects.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  return (
    <DataGrid
      table={table}
      recordCount={projects.length}
      i18n={localizedLabels}
      tableLayout={{ columnsPinnable: true, columnsMovable: true }}
    >
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <DataGridPagination />
      </div>
    </DataGrid>
  )
}
