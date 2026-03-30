// Description: Compact time interval selector
// Order: 46

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const intervals = [
  {
    id: "1m",
    icon: (
      <IconPlaceholder
        lucide="ClockIcon"
        tabler="IconClock"
        hugeicons="ClockIcon"
        phosphor="ClockIcon"
        remixicon="RiTimeLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "5m",
    icon: (
      <IconPlaceholder
        lucide="ClockIcon"
        tabler="IconClock"
        hugeicons="ClockIcon"
        phosphor="ClockIcon"
        remixicon="RiTimeLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "1H",
    icon: (
      <IconPlaceholder
        lucide="ClockIcon"
        tabler="IconClock"
        hugeicons="ClockIcon"
        phosphor="ClockIcon"
        remixicon="RiTimeLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "1D",
    icon: (
      <IconPlaceholder
        lucide="CalendarIcon"
        tabler="IconCalendar"
        hugeicons="Calendar02Icon"
        phosphor="CalendarIcon"
        remixicon="RiCalendarLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "1W",
    icon: (
      <IconPlaceholder
        lucide="CalendarDaysIcon"
        tabler="IconCalendarWeek"
        hugeicons="Calendar03Icon"
        phosphor="CalendarBlankIcon"
        remixicon="RiCalendarCheckLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "Auto",
    icon: (
      <IconPlaceholder
        lucide="SparklesIcon"
        tabler="IconSparkles"
        hugeicons="MagicWand01Icon"
        phosphor="MagicWandIcon"
        remixicon="RiMagicLine"
        aria-hidden="true"
      />
    ),
  },
]

export default function Pattern() {
  const [active, setActive] = useState("1H")

  return (
    <ButtonGroup>
      {intervals.map((interval) => (
        <Button
          key={interval.id}
          variant="outline"
          size="sm"
          className={cn(
            "h-7 gap-1.5 px-2.5 text-xs tabular-nums",
            active === interval.id ? "bg-muted" : ""
          )}
          onClick={() => setActive(interval.id)}
        >
          {interval.icon}
          {interval.id}
        </Button>
      ))}
    </ButtonGroup>
  )
}
