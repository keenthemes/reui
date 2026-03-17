// Description: Pipeline stage mover with dropdown
// Order: 44

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"]

const icons = {
  prev: (
    <IconPlaceholder
      lucide="ChevronLeftIcon"
      tabler="IconChevronLeft"
      hugeicons="ArrowLeft01Icon"
      phosphor="CaretLeftIcon"
      remixicon="RiArrowLeftSLine"
      aria-hidden="true"
    />
  ),
  next: (
    <IconPlaceholder
      lucide="ChevronRightIcon"
      tabler="IconChevronRight"
      hugeicons="ArrowRight01Icon"
      phosphor="CaretRightIcon"
      remixicon="RiArrowRightSLine"
      aria-hidden="true"
    />
  ),
  chevronsUpDown: (
    <IconPlaceholder
      lucide="ChevronsUpDownIcon"
      tabler="IconSelector"
      hugeicons="ArrowUpDown02Icon"
      phosphor="CaretUpDownIcon"
      remixicon="RiExpandUpDownLine"
      aria-hidden="true"
      className="size-3.5 shrink-0 opacity-50"
    />
  ),
  check: (
    <IconPlaceholder
      lucide="CheckIcon"
      tabler="IconCheck"
      hugeicons="Tick02Icon"
      phosphor="CheckIcon"
      remixicon="RiCheckLine"
      aria-hidden="true"
      className="text-primary ml-auto size-3.5"
    />
  ),
}

export default function Pattern() {
  const [stageIndex, setStageIndex] = useState(2)

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous stage"
        disabled={stageIndex === 0}
        onClick={() => setStageIndex((i) => i - 1)}
      >
        {icons.prev}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-36 justify-between">
            <span className="truncate">{stages[stageIndex]}</span>
            {icons.chevronsUpDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Jump to stage</DropdownMenuLabel>
            {stages.map((stage, i) => (
              <DropdownMenuItem key={stage} onClick={() => setStageIndex(i)}>
                {stage}
                {i === stageIndex ? icons.check : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        aria-label="Next stage"
        disabled={stageIndex === stages.length - 1}
        onClick={() => setStageIndex((i) => i + 1)}
      >
        {icons.next}
      </Button>
    </ButtonGroup>
  )
}
