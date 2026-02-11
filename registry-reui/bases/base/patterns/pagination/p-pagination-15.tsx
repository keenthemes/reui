// Description: Pagination with page info, numbered pages, ellipsis, and per-page select
// Order: 15
// GridSize: 1

import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/bases/base/ui/pagination"

export default function Pattern() {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <span className="text-muted-foreground text-sm">
            Page <span className="text-foreground font-medium">1</span> of{" "}
            <span className="text-foreground font-medium">10</span>
          </span>
        </PaginationItem>
        <PaginationItem className="flex items-center gap-1">
          <PaginationPrevious href="#" />
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
          <PaginationLink href="#">2</PaginationLink>
          <PaginationLink href="#">3</PaginationLink>
          <PaginationLink href="#">4</PaginationLink>
          <PaginationEllipsis />
          <PaginationNext href="#" />
        </PaginationItem>
        <PaginationItem>
          <NativeSelect className="w-28">
            <NativeSelectOption value="10">10 / page</NativeSelectOption>
            <NativeSelectOption value="20">20 / page</NativeSelectOption>
            <NativeSelectOption value="50">50 / page</NativeSelectOption>
            <NativeSelectOption value="100">100 / page</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
