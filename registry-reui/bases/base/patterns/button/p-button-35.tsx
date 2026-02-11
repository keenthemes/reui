// Description: Ghost button with more/less toggle
// Order: 35

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? "Show less" : "Show more"}
      {isExpanded ? (
        <IconPlaceholder
          lucide="ChevronUpIcon"
          tabler="IconChevronUp"
          hugeicons="ArrowUp01Icon"
          phosphor="CaretUpIcon"
          remixicon="RiArrowUpSLine"
          aria-hidden="true"
        />
      ) : (
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          aria-hidden="true"
        />
      )}
    </Button>
  )
}
