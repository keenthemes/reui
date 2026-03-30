// Description: Numbered pagination with go-to-page input
// Order: 14

import { Input } from "@/registry/bases/base/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/registry/bases/base/ui/pagination"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem className="flex items-center gap-1">
          <PaginationLink href="#" size="icon" aria-label="Go to previous page">
            <IconPlaceholder
              lucide="ChevronLeftIcon"
              tabler="IconChevronLeft"
              hugeicons="ArrowLeft01Icon"
              phosphor="CaretLeftIcon"
              remixicon="RiArrowLeftSLine"
              className="size-4"
            />
          </PaginationLink>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
          <PaginationLink href="#">2</PaginationLink>
          <PaginationLink href="#">3</PaginationLink>
          <PaginationLink href="#">4</PaginationLink>
          <PaginationEllipsis />
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
        </PaginationItem>
        <PaginationItem className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            Go to page
          </span>
          <Input
            type="number"
            min={1}
            max={10}
            defaultValue={1}
            className="h-9 w-16 text-center"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
