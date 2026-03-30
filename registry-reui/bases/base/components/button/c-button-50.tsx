// Description: Go back link button with animation
// Order: 50

import Link from "next/link"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button
      variant="link"
      className="group/back-button"
      render={<Link href="#" />}
      nativeButton={false}
    >
      <IconPlaceholder
        lucide="ChevronLeftIcon"
        tabler="IconChevronLeft"
        hugeicons="ArrowLeft01Icon"
        phosphor="CaretLeftIcon"
        remixicon="RiArrowLeftSLine"
        data-icon="inline-start"
        aria-hidden="true"
        className="transition-transform duration-200 group-hover/back-button:-translate-x-1"
      />
      Go back
    </Button>
  )
}
