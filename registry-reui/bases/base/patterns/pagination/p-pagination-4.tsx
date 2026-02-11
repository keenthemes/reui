// Description: Pagination with circle buttons.
// Order: 4

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/registry/bases/base/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/bases/base/ui/pagination"

export default function Pattern() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" className="rounded-full" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" className="rounded-full">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive className={cn("rounded-full")}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" className="rounded-full">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" className="rounded-full" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
