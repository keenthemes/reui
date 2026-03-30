// Description: Go back link button
// Order: 49

import Link from "next/link"

import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button variant="link" asChild>
      <Link href="#">
        <IconPlaceholder
          lucide="ChevronLeftIcon"
          tabler="IconChevronLeft"
          hugeicons="ArrowLeft01Icon"
          phosphor="CaretLeftIcon"
          remixicon="RiArrowLeftSLine"
          data-icon="inline-start"
          aria-hidden="true"
        />
        Go back
      </Link>
    </Button>
  )
}
