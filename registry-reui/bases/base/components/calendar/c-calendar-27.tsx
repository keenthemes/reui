// Description: Calendar with date and appointment picker
// Order: 27

"use client"

import { useId, useState } from "react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const id = useId()
  const today = new Date()
  const [date, setDate] = useState<Date>(today)
  const [time, setTime] = useState<string | null>(null)

  // Mock time slots data
  const timeSlots = [
    { available: false, time: "09:00" },
    { available: false, time: "09:30" },
    { available: true, time: "10:00" },
    { available: true, time: "10:30" },
    { available: true, time: "11:00" },
    { available: true, time: "11:30" },
    { available: false, time: "12:00" },
    { available: true, time: "12:30" },
    { available: true, time: "13:00" },
    { available: true, time: "13:30" },
    { available: true, time: "14:00" },
    { available: false, time: "14:30" },
    { available: false, time: "15:00" },
    { available: true, time: "15:30" },
    { available: true, time: "16:00" },
    { available: true, time: "16:30" },
    { available: true, time: "17:00" },
    { available: true, time: "17:30" },
  ]

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="group/pick-date w-60 justify-between"
          id={id}
          variant={"outline"}
        >
          <span className={cn("truncate", date && "text-muted-foreground")}>
            {date ? format(date, "LLL dd, y") : "Pick a date"}
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
      <PopoverContent align="start" className="w-auto p-0">
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="flex max-sm:flex-col">
              <Calendar
                disabled={[{ before: today }]}
                mode="single"
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate)
                    setTime(null)
                  }
                }}
                selected={date}
              />
              <div className="relative w-full max-sm:h-48 sm:w-40">
                <div className="absolute inset-0 py-4 max-sm:border-t">
                  <ScrollArea className="h-full sm:border-s">
                    <div className="space-y-3">
                      <div className="flex h-5 shrink-0 items-center px-5">
                        <p className="text-sm font-medium">
                          {format(date, "EEEE, d")}
                        </p>
                      </div>
                      <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                        {timeSlots.map(({ time: timeSlot, available }) => (
                          <Button
                            className="w-full"
                            disabled={!available}
                            key={timeSlot}
                            onClick={() => setTime(timeSlot)}
                            size="sm"
                            variant={time === timeSlot ? "default" : "outline"}
                          >
                            {timeSlot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
