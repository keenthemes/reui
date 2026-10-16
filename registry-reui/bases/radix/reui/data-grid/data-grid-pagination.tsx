"use client"

// Opted out of React Compiler with the rest of the grid (see data-grid.tsx).
"use no memo"

import type { JSX, ReactNode } from "react"
import { useDataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"

import { cn } from "cn"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import { Skeleton } from "@/registry/bases/radix/ui/skeleton"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface DataGridPaginationProps {
  sizes?: number[]
  sizesInfo?: string
  sizesLabel?: string
  sizesDescription?: string
  sizesSkeleton?: ReactNode
  more?: boolean
  /** Page buttons the truncated middle shows; the row adds first, last and
   *  an ellipsis for each hidden stretch. Clamped to a minimum of 3. */
  moreLimit?: number
  info?: string
  infoSkeleton?: ReactNode
  className?: string
  rowsPerPageLabel?: string
  previousPageLabel?: string
  nextPageLabel?: string
  ellipsisText?: string
}

/**
 * One slot in the page row: a page button, or an ellipsis that jumps over the
 * pages it stands for.
 */
type DataGridPaginationItem =
  | { type: "page"; index: number }
  | { type: "ellipsis"; direction: "previous"; target: number }
  | { type: "ellipsis"; direction: "next"; target: number }

/**
 * The adaptive window: first page, the run around the current one, last page,
 * with an ellipsis standing in for each hidden stretch. It replaced fixed
 * BLOCKS (1-5, then 6-10) because a block never shows the last page, so on a
 * 50-page grid there was no way to reach the end - the primitive wires only
 * `previousPage()` / `nextPage()`, so there is no last-page arrow either.
 *
 * `limit` is `moreLimit`: how many page buttons the truncated middle shows.
 * At the default of 5 this emits exactly the same rows as the block version
 * did at `moreLimit: 5`, so the prop keeps both its meaning and its default.
 * An ellipsis never stands for a single page, because the early return covers
 * every count a full row could hold.
 */
function getDataGridPaginationItems(
  pageIndex: number,
  pageCount: number,
  limit: number
): DataGridPaginationItem[] {
  // Pages flanking the current one, per side. The run is rebuilt from it so
  // the count is always odd: an even `limit` would make the head and tail
  // rows one slot wider than the middle, and the footer would twitch as the
  // user pages through.
  const sibling = Math.max(0, Math.floor(((Math.floor(limit) || 3) - 3) / 2))
  const pages = sibling * 2 + 3

  // Two ellipses cost the width of two pages, so below this there is nothing
  // to gain by hiding any.
  if (pageCount <= pages + 2) {
    return Array.from({ length: pageCount }, (_, index) => ({
      type: "page" as const,
      index,
    }))
  }

  if (pageIndex <= sibling + 2) {
    return [
      ...Array.from({ length: pages }, (_, index) => ({
        type: "page" as const,
        index,
      })),
      { type: "ellipsis", direction: "next", target: pages },
      { type: "page", index: pageCount - 1 },
    ]
  }

  if (pageIndex >= pageCount - sibling - 3) {
    return [
      { type: "page", index: 0 },
      {
        type: "ellipsis",
        direction: "previous",
        target: pageCount - pages - 1,
      },
      ...Array.from({ length: pages }, (_, offset) => ({
        type: "page" as const,
        index: pageCount - pages + offset,
      })),
    ]
  }

  return [
    { type: "page", index: 0 },
    {
      type: "ellipsis",
      direction: "previous",
      target: pageIndex - sibling - 1,
    },
    ...Array.from({ length: sibling * 2 + 1 }, (_, offset) => ({
      type: "page" as const,
      index: pageIndex - sibling + offset,
    })),
    { type: "ellipsis", direction: "next", target: pageIndex + sibling + 1 },
    { type: "page", index: pageCount - 1 },
  ]
}

/**
 * A page button is square at one digit and grows from there, so the row does
 * not reflow when the count crosses 10 or 100. The floor is each style's own
 * `icon-sm` square, which is also its `sm` HEIGHT, so the numbers stay square
 * and keep the arrows' height. Hardcoding one value would be right in three
 * styles and wrong in five.
 */
const PAGE_BUTTON_WIDTH_CLASS =
  "style-vega:min-w-8 style-nova:min-w-7 style-maia:min-w-8 style-lyra:min-w-7 style-mira:min-w-6 style-luma:min-w-8 style-sera:min-w-9 style-rhea:min-w-7"

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

  const paginationItems = getDataGridPaginationItems(
    pageIndex,
    pageCount,
    mergedProps.moreLimit ?? 5
  )

  return (
    <div
      data-slot="data-grid-pagination"
      className={cn(
        "flex grow flex-col flex-wrap items-center justify-between gap-2.5 py-2.5 sm:flex-row sm:py-0",
        mergedProps.className
      )}
    >
      <div className="order-2 flex flex-wrap items-center gap-x-2.5 pb-2.5 sm:order-1 sm:pb-0">
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
                position="popper"
                align="start"
                className="min-w-(--radix-select-trigger-width)"
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
      <div className="order-1 flex flex-col items-center justify-center gap-2.5 pt-2.5 sm:order-2 sm:flex-row sm:justify-end sm:pt-0">
        {isLoading ? (
          mergedProps.infoSkeleton
        ) : (
          <>
            <div className="text-muted-foreground order-2 text-sm text-nowrap sm:order-1">
              {paginationInfo}
            </div>
            {pageCount > 1 && (
              <div className="order-1 flex flex-wrap items-center justify-center gap-1 sm:flex-nowrap">
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
                      size="sm"
                      variant="ghost"
                      aria-label={i18n.labels.goToPage(item.index + 1)}
                      aria-current={
                        pageIndex === item.index ? "page" : undefined
                      }
                      className={cn(
                        PAGE_BUTTON_WIDTH_CLASS,
                        "px-1.5 text-sm",
                        "text-muted-foreground",
                        {
                          "bg-accent text-accent-foreground":
                            pageIndex === item.index,
                        }
                      )}
                      onClick={() => {
                        if (pageIndex !== item.index) {
                          table.setPageIndex(item.index)
                        }
                      }}
                    >
                      {item.index + 1}
                    </Button>
                  ) : (
                    /* Clickable, unlike the shadcn PaginationEllipsis, which is
                       an aria-hidden span. This one MOVES the user, so it needs
                       a name saying where. */
                    <Button
                      key={`ellipsis-${item.direction}`}
                      size="icon-sm"
                      className={btnBaseClasses}
                      variant="ghost"
                      aria-label={i18n.labels.goToPage(item.target + 1)}
                      onClick={() => table.setPageIndex(item.target)}
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
