// Description: Pagination with outline style buttons
// Order: 11

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
      <PaginationContent className="style-vera:rounded-lg style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-md gap-0 overflow-hidden border">
        <PaginationItem>
          <PaginationLink
            href="#"
            size="icon"
            aria-label="Go to previous page"
            className="border-border rounded-none border-0 border-e"
          >
            <IconPlaceholder
              lucide="ChevronLeftIcon"
              tabler="IconChevronLeft"
              hugeicons="ArrowLeft01Icon"
              phosphor="CaretLeftIcon"
              remixicon="RiArrowLeftSLine"
            />
          </PaginationLink>
        </PaginationItem>

        {
          /* Page numbers */
          Array.from({ length: 4 }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={index === 2}
                className="data-[active=true]:bg-muted border-border rounded-none border-0 border-e"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))
        }

        <PaginationItem className="border-border border-0 border-e">
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            size="icon"
            aria-label="Go to next page"
            className="rounded-none border-0"
          >
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
            />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
