// Description: Calendar with date and time range picker
// Order: 30

"use client"

import { useId, useState } from "react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { Separator } from "@/registry/bases/base/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const id = useId()
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="group/pick-date w-60 justify-between"
          id={id}
          variant={"outline"}
        >
          <span className={cn("truncate", date && "text-muted-foreground")}>
            {date ? format(date, "PPP") : "Pick a date and time"}
          </span>
          <IconPlaceholder
            lucide="CalendarIcon"
            tabler="IconCalendarEvent"
            hugeicons="Calendar04Icon"
            phosphor="CalendarBlankIcon"
            remixicon="RiCalendarLine"
            aria-hidden="true"
            className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
        />

        <Separator />

        <FieldGroup className="grid grid-cols-2 gap-2.5">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <IconPlaceholder
                  lucide="ClockIcon"
                  tabler="IconClock"
                  hugeicons="ClockIcon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field className="gap-1.5">
            <FieldLabel htmlFor="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-to"
                type="time"
                step="1"
                defaultValue="12:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <IconPlaceholder
                  lucide="ClockIcon"
                  tabler="IconClock"
                  hugeicons="ClockIcon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
