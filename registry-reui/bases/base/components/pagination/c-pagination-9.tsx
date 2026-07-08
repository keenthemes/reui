import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/bases/base/ui/pagination"

export default function Pattern() {
  return (
    <Pagination className="w-full max-w-xs">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <span className="text-muted-foreground text-xs">
            Page <span className="text-foreground font-medium">1</span> of{" "}
            <span className="text-foreground font-medium">10</span>
          </span>
        </PaginationItem>
        <PaginationItem className="flex gap-1">
          <PaginationPrevious href="#" />
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
