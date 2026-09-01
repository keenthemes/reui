"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-column-header"
import type { DataGridI18nOverrides } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-i18n"
import { DataGridPagination } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/registry-reui/bases/radix/reui/data-grid/data-grid-scroll-area"
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-table"
import { useTable } from "@tanstack/react-table"
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/radix/ui/toggle-group"

interface IOrder {
  id: string
  reference: string
  customer: string
  avatar: string
  initials: string
  city: string
  status: "shipped" | "processing"
  total: number
}

type Locale = "en" | "de" | "ja"

const orders: IOrder[] = [
  {
    id: "1",
    reference: "ORD-4417",
    customer: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
    city: "Berlin",
    status: "shipped",
    total: 249.9,
  },
  {
    id: "2",
    reference: "ORD-4418",
    customer: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
    city: "Osaka",
    status: "processing",
    total: 89.0,
  },
  {
    id: "3",
    reference: "ORD-4421",
    customer: "Michael Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    initials: "MR",
    city: "Madrid",
    status: "shipped",
    total: 1290.5,
  },
  {
    id: "4",
    reference: "ORD-4425",
    customer: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    initials: "EW",
    city: "Hamburg",
    status: "processing",
    total: 45.25,
  },
  {
    id: "5",
    reference: "ORD-4430",
    customer: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    initials: "DK",
    city: "Seoul",
    status: "shipped",
    total: 615.0,
  },
  {
    id: "6",
    reference: "ORD-4433",
    customer: "Maria Garcia",
    avatar:
      "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    initials: "MG",
    city: "Lisbon",
    status: "processing",
    total: 132.75,
  },
  {
    id: "7",
    reference: "ORD-4440",
    customer: "James Brown",
    avatar:
      "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    initials: "JB",
    city: "Toronto",
    status: "shipped",
    total: 78.4,
  },
]

/**
 * One entry per locale: the grid's own copy through `i18n`, plus the column
 * titles and cell text the consumer owns. The grid never translates content,
 * only its built-in chrome, so a real app pairs the two exactly like this.
 */
const localeContent: Record<
  Locale,
  {
    label: string
    columns: {
      reference: string
      customer: string
      city: string
      status: string
      total: string
    }
    status: { shipped: string; processing: string }
    currency: string
    i18n: DataGridI18nOverrides
  }
> = {
  en: {
    label: "EN",
    columns: {
      reference: "Order",
      customer: "Customer",
      city: "City",
      status: "Status",
      total: "Total",
    },
    status: { shipped: "Shipped", processing: "Processing" },
    currency: "USD",
    i18n: {},
  },
  de: {
    label: "DE",
    columns: {
      reference: "Bestellung",
      customer: "Kunde",
      city: "Stadt",
      status: "Status",
      total: "Summe",
    },
    status: { shipped: "Versandt", processing: "In Bearbeitung" },
    currency: "EUR",
    i18n: {
      labels: {
        sortAscending: "Aufsteigend",
        sortDescending: "Absteigend",
        pinColumnStart: "Links anheften",
        pinColumnEnd: "Rechts anheften",
        moveColumnStart: "Nach links verschieben",
        moveColumnEnd: "Nach rechts verschieben",
        columnsMenu: "Spalten",
        toggleColumns: "Spalten ein- und ausblenden",
        selectAll: "Alle auswählen",
        selectRow: "Zeile auswählen",
        rowsPerPage: "Zeilen pro Seite",
        paginationInfo: ({ from, to, count }) => `${from}-${to} von ${count}`,
        previousPage: "Vorherige Seite",
        nextPage: "Nächste Seite",
        goToPage: (page) => `Seite ${page}`,
        empty: "Keine Daten vorhanden",
      },
    },
  },
  ja: {
    label: "日本語",
    columns: {
      reference: "注文",
      customer: "顧客",
      city: "都市",
      status: "状態",
      total: "合計",
    },
    status: { shipped: "発送済み", processing: "処理中" },
    currency: "JPY",
    i18n: {
      labels: {
        sortAscending: "昇順",
        sortDescending: "降順",
        pinColumnStart: "左に固定",
        pinColumnEnd: "右に固定",
        moveColumnStart: "左へ移動",
        moveColumnEnd: "右へ移動",
        columnsMenu: "列",
        toggleColumns: "列の表示切り替え",
        selectAll: "すべて選択",
        selectRow: "行を選択",
        rowsPerPage: "1ページの行数",
        /* Japanese counts the total first, the reason these labels are
           functions rather than templates with fixed placeholders. */
        paginationInfo: ({ from, to, count }) => `${count}件中 ${from}-${to}件`,
        previousPage: "前のページ",
        nextPage: "次のページ",
        goToPage: (page) => `${page}ページ目`,
        empty: "データがありません",
      },
    },
  },
}

const localeTags: Record<Locale, string> = {
  en: "en-US",
  de: "de-DE",
  ja: "ja-JP",
}

export default function Pattern() {
  const [locale, setLocale] = useState<Locale>("en")
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const content = localeContent[locale]

  const columns = useMemo<ColumnDef<DataGridFeatures, IOrder>[]>(() => {
    const money = new Intl.NumberFormat(localeTags[locale], {
      style: "currency",
      currency: content.currency,
      maximumFractionDigits: content.currency === "JPY" ? 0 : 2,
    })

    return [
      {
        id: "select",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        size: 44,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
      {
        accessorKey: "reference",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={content.columns.reference}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.reference}</span>
        ),
        size: 110,
      },
      {
        accessorKey: "customer",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={content.columns.customer}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={row.original.avatar}
                alt={row.original.customer}
              />
              <AvatarFallback className="text-[10px]">
                {row.original.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground truncate font-medium">
              {row.original.customer}
            </span>
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <DataGridColumnHeader title={content.columns.city} column={column} />
        ),
        cell: ({ row }) => (
          <span className="truncate">{row.original.city}</span>
        ),
        size: 120,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={content.columns.status}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "shipped"
                ? "success-light"
                : "warning-light"
            }
          >
            {content.status[row.original.status]}
          </Badge>
        ),
        size: 140,
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <DataGridColumnHeader title={content.columns.total} column={column} />
        ),
        cell: ({ row }) => (
          <span className="block text-end tabular-nums">
            {money.format(row.original.total)}
          </span>
        ),
        size: 130,
        meta: { headerClassName: "text-end [&>div]:justify-end" },
      },
    ]
  }, [content, locale])

  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: orders,
    getRowId: (row: IOrder) => row.id,
    state: { sorting, pagination, rowSelection },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  })

  return (
    <DataGrid
      table={table}
      recordCount={orders.length}
      /* The whole point of the example: one prop swaps every built-in
         string, and the untouched keys keep their English defaults. */
      i18n={content.i18n}
      tableLayout={{ columnsPinnable: true, columnsMovable: true }}
    >
      <Card className="w-full gap-3 py-3.5">
        <CardHeader className="items-center px-3.5">
          <CardTitle>Orders</CardTitle>
          <CardAction>
            <ToggleGroup
              variant="outline"
              size="sm"
              type="single"
              value={locale}
              onValueChange={(next: string) =>
                next && setLocale(next as Locale)
              }
              aria-label="Grid language"
            >
              {(Object.keys(localeContent) as Locale[]).map((value) => (
                <ToggleGroupItem key={value} value={value}>
                  {localeContent[value].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardAction>
        </CardHeader>
        <DataGridContainer className="border-y">
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <CardFooter className="border-none bg-transparent! px-3.5 py-0">
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}
