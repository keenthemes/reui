// Description: Pagination button group
// Order: 35

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="ChevronLeftIcon"
          tabler="IconChevronLeft"
          hugeicons="ArrowLeft01Icon"
          phosphor="CaretLeftIcon"
          remixicon="RiArrowLeftSLine"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon">
        1
      </Button>
      <Button variant="outline" size="icon">
        2
      </Button>
      <Button variant="default" size="icon" className="border-primary border">
        3
      </Button>
      <Button variant="outline" size="icon">
        4
      </Button>
      <Button variant="outline" size="icon">
        5
      </Button>
      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  )
}
