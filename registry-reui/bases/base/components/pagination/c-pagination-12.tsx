// Description: Rows per page select with range info and first/prev/next/last icons
// Order: 12

import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/registry/bases/base/ui/pagination"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            Rows per page
          </span>
          <NativeSelect className="w-18" defaultValue="25">
            <NativeSelectOption value="10">10</NativeSelectOption>
            <NativeSelectOption value="25">25</NativeSelectOption>
            <NativeSelectOption value="50">50</NativeSelectOption>
            <NativeSelectOption value="100">100</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
        <PaginationItem className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            1-25 of 100
          </span>
          <div className="flex gap-1">
            <PaginationLink href="#" size="icon" aria-label="Go to first page">
              <IconPlaceholder
                lucide="ChevronFirstIcon"
                tabler="IconChevronLeftPipe"
                hugeicons="ArrowLeft03Icon"
                phosphor="CaretLineLeftIcon"
                remixicon="RiSkipLeftLine"
                className="size-4"
              />
            </PaginationLink>
            <PaginationLink
              href="#"
              size="icon"
              aria-label="Go to previous page"
            >
              <IconPlaceholder
                lucide="ChevronLeftIcon"
                tabler="IconChevronLeft"
                hugeicons="ArrowLeft01Icon"
                phosphor="CaretLeftIcon"
                remixicon="RiArrowLeftSLine"
                className="size-4"
              />
            </PaginationLink>
            <PaginationLink href="#" size="icon" aria-label="Go to next page">
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="size-4"
              />
            </PaginationLink>
            <PaginationLink href="#" size="icon" aria-label="Go to last page">
              <IconPlaceholder
                lucide="ChevronLastIcon"
                tabler="IconChevronRightPipe"
                hugeicons="ArrowRight03Icon"
                phosphor="CaretLineRightIcon"
                remixicon="RiSkipRightLine"
                className="size-4"
              />
            </PaginationLink>
          </div>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
