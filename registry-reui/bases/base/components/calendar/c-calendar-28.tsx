// Description: Calendar with date picker and presets
// Order: 28

"use client"

import { useId, useState } from "react"
import { format, subDays, subMonths, subYears } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const id = useId()
  const today = new Date()
  const yesterday = subDays(today, 1)
  const lastWeek = subDays(today, 7)
  const lastMonth = subMonths(today, 1)
  const lastYear = subYears(today, 1)
  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<Date>(today)

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
              <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
                <div className="h-full sm:border-e">
                  <div className="flex flex-col px-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(today)
                        setMonth(today)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Today
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(yesterday)
                        setMonth(yesterday)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Yesterday
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(lastWeek)
                        setMonth(lastWeek)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Last week
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(lastMonth)
                        setMonth(lastMonth)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Last month
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(lastYear)
                        setMonth(lastYear)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Last year
                    </Button>
                  </div>
                </div>
              </div>
              <Calendar
                disabled={[{ after: today }]}
                mode="single"
                month={month}
                onMonthChange={setMonth}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate)
                  }
                }}
                selected={date}
              />
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
