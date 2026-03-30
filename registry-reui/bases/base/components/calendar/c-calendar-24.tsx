// Description: Calendar with date picker
// Order: 24

"use client"

import { useId, useState } from "react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const id = useId()
  const [date, setDate] = useState<Date | undefined>()

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="group/pick-date w-60 justify-between"
          id={id}
          variant="outline"
        >
          <span className={cn("truncate", !date && "text-muted-foreground")}>
            {date ? format(date, "PPP") : "Pick a date"}
          </span>
          <IconPlaceholder
            lucide="CalendarIcon"
            tabler="IconCalendarEvent"
            hugeicons="Calendar04Icon"
            phosphor="CalendarBlankIcon"
            remixicon="RiCalendarLine"
            aria-hidden="true"
            className="opacity-60 transition-opacity group-hover/pick-date:opacity-100"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="single" onSelect={setDate} selected={date} />
      </PopoverContent>
    </Popover>
  )
}
