"use client"

import type { JSX, ReactNode } from "react"
import { useDataGrid } from "@/registry-reui/bases/base/reui/data-grid/data-grid"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface DataGridPaginationProps {
  sizes?: number[]
  sizesInfo?: string
  sizesLabel?: string
  sizesDescription?: string
  sizesSkeleton?: ReactNode
  more?: boolean
  moreLimit?: number
  info?: string
  infoSkeleton?: ReactNode
  className?: string
  rowsPerPageLabel?: string
  previousPageLabel?: string
  nextPageLabel?: string
  ellipsisText?: string
}

type PaginationItem =
  | { type: "page"; index: number }
  | { type: "ellipsis"; direction: "previous" | "next" }

function getPaginationItems(
  pageIndex: number,
  pageCount: number
): PaginationItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => ({
      type: "page",
      index,
    }))
  }

  if (pageIndex <= 3) {
    return [
      ...Array.from({ length: 5 }, (_, index) => ({
        type: "page" as const,
        index,
      })),
      { type: "ellipsis", direction: "next" },
      { type: "page", index: pageCount - 1 },
    ]
  }

  if (pageIndex >= pageCount - 4) {
    return [
      { type: "page", index: 0 },
      { type: "ellipsis", direction: "previous" },
      ...Array.from({ length: 5 }, (_, offset) => ({
        type: "page" as const,
        index: pageCount - 5 + offset,
      })),
    ]
  }

  return [
    { type: "page", index: 0 },
    { type: "ellipsis", direction: "previous" },
    { type: "page", index: pageIndex - 1 },
    { type: "page", index: pageIndex },
    { type: "page", index: pageIndex + 1 },
    { type: "ellipsis", direction: "next" },
    { type: "page", index: pageCount - 1 },
  ]
}

function DataGridPagination(props: DataGridPaginationProps): JSX.Element {
  const { i18n, table, recordCount, isLoading } = useDataGrid()

  const defaultProps: Partial<DataGridPaginationProps> = {
    sizes: [5, 10, 25, 50, 100],
    sizesSkeleton: <Skeleton className="h-8 w-44" />,
    moreLimit: 5,
    infoSkeleton: <Skeleton className="h-8 w-60" />,
    rowsPerPageLabel: i18n.labels.rowsPerPage,
    previousPageLabel: i18n.labels.previousPage,
    nextPageLabel: i18n.labels.nextPage,
    ellipsisText: i18n.labels.paginationEllipsis,
  }

  const mergedProps: DataGridPaginationProps = { ...defaultProps, ...props }

  const btnBaseClasses = "p-0 text-sm"
  const btnArrowClasses = btnBaseClasses + " rtl:transform rtl:rotate-180"
  const pageIndex = table.state.pagination.pageIndex
  const pageSize = table.state.pagination.pageSize
  const from = recordCount === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, recordCount)
  const pageCount = table.getPageCount()

  // A supplied `info` keeps its placeholder-template contract; the default
  // routes through the i18n label function, where word order is free.
  const paginationInfo = mergedProps.info
    ? mergedProps.info
        .replaceAll("{from}", from.toString())
        .replaceAll("{to}", to.toString())
        .replaceAll("{count}", recordCount.toString())
    : i18n.labels.paginationInfo({ from, to, count: recordCount })

  const paginationItems = getPaginationItems(pageIndex, pageCount)

  return (
    <div
      data-slot="data-grid-pagination"
      className={cn(
        "flex grow flex-col flex-wrap items-center justify-between gap-2.5 py-2.5 sm:flex-row sm:flex-nowrap sm:py-0",
        mergedProps.className
      )}
    >
      <div className="order-2 flex flex-wrap items-center space-x-2.5 pb-2.5 sm:order-1 sm:pb-0">
        {isLoading ? (
          mergedProps.sizesSkeleton
        ) : (
          <>
            <div className="text-muted-foreground text-sm">
              {mergedProps.rowsPerPageLabel}
            </div>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const newPageSize = Number(value)
                table.setPageSize(newPageSize)
              }}
            >
              {/* w-fit with a min, never a fixed width: a fixed w-16 clipped
                  the value "100" by 1px at nova's paddings, while fit-content
                  grows the trigger for 3-digit sizes and the min keeps the
                  1-2 digit ones from collapsing narrower than 64px. */}
              <SelectTrigger
                aria-label={mergedProps.rowsPerPageLabel}
                className="w-fit min-w-16"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="min-w-(--anchor-width)"
              >
                {mergedProps.sizes?.map((size: number) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div className="order-1 flex w-full flex-col items-center justify-center gap-2.5 pt-2.5 sm:order-2 sm:w-auto sm:flex-row sm:justify-end sm:pt-0">
        {isLoading ? (
          mergedProps.infoSkeleton
        ) : (
          <>
            <div className="text-muted-foreground order-2 w-full text-center text-sm text-nowrap sm:order-1 sm:w-auto sm:text-start">
              {paginationInfo}
            </div>
            {pageCount > 1 && (
              <div className="order-1 flex w-full flex-wrap items-center justify-center gap-1 sm:w-auto sm:flex-nowrap">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">
                    {mergedProps.previousPageLabel}
                  </span>
                  <IconPlaceholder
                    lucide="ChevronLeftIcon"
                    tabler="IconChevronLeft"
                    hugeicons="ArrowLeft01Icon"
                    phosphor="CaretLeftIcon"
                    remixicon="RiArrowLeftSLine"
                    className="size-4"
                  />
                </Button>

                {paginationItems.map((item) =>
                  item.type === "page" ? (
                    <Button
                      key={`page-${item.index}`}
                      size="icon-sm"
                      variant="ghost"
                      className={cn(btnBaseClasses, "text-muted-foreground", {
                        "bg-accent text-accent-foreground":
                          pageIndex === item.index,
                      })}
                      onClick={() => {
                        if (pageIndex !== item.index) {
                          table.setPageIndex(item.index)
                        }
                      }}
                    >
                      {item.index + 1}
                    </Button>
                  ) : (
                    <Button
                      key={`ellipsis-${item.direction}`}
                      size="icon-sm"
                      className={btnBaseClasses}
                      variant="ghost"
                      onClick={() => {
                        const target =
                          item.direction === "previous"
                            ? Math.max(0, pageIndex - 3)
                            : Math.min(pageCount - 1, pageIndex + 3)
                        table.setPageIndex(target)
                      }}
                    >
                      {mergedProps.ellipsisText}
                    </Button>
                  )
                )}

                <Button
                  size="icon-sm"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">{mergedProps.nextPageLabel}</span>
                  <IconPlaceholder
                    lucide="ChevronRightIcon"
                    tabler="IconChevronRight"
                    hugeicons="ArrowRight01Icon"
                    phosphor="CaretRightIcon"
                    remixicon="RiArrowRightSLine"
                    className="size-4"
                  />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { DataGridPagination, type DataGridPaginationProps }
