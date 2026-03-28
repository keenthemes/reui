// Description: Display week numbers
// Order: 10

"use client"

import { useState } from "react"
import type { WeekNumberProps } from "react-day-picker"

import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent } from "@/registry/bases/base/ui/card"

export default function Pattern() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar
          components={{
            WeekNumber: ({ week, ...props }: WeekNumberProps) => {
              return (
                <th {...props}>
                  <span className="text-muted-foreground inline-flex size-8 items-center justify-center text-sm font-normal">
                    {week.weekNumber}
                  </span>
                </th>
              )
            },
          }}
          fixedWeeks
          mode="single"
          onSelect={setDate}
          selected={date}
          showWeekNumber
        />
      </CardContent>
    </Card>
  )
}
