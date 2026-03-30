// Description: Pagination with page select dropdown and first/last navigation
// Order: 13

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
      <PaginationContent>
        <PaginationItem>
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
        </PaginationItem>
        <PaginationItem>
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
        </PaginationItem>
        <PaginationItem>
          <NativeSelect className="w-26" defaultValue="1">
            <NativeSelectOption value="1">Page 1</NativeSelectOption>
            <NativeSelectOption value="2">Page 2</NativeSelectOption>
            <NativeSelectOption value="3">Page 3</NativeSelectOption>
            <NativeSelectOption value="4">Page 4</NativeSelectOption>
            <NativeSelectOption value="5">Page 5</NativeSelectOption>
            <NativeSelectOption value="6">Page 6</NativeSelectOption>
            <NativeSelectOption value="7">Page 7</NativeSelectOption>
            <NativeSelectOption value="8">Page 8</NativeSelectOption>
            <NativeSelectOption value="9">Page 9</NativeSelectOption>
            <NativeSelectOption value="10">Page 10</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
        <PaginationItem>
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
        <PaginationItem>
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
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
