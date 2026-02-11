// Description: Today button
// Order: 12

"use client"

import { useState } from "react"
import { addDays } from "date-fns"

import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent } from "@/registry/bases/base/ui/card"

export default function Pattern() {
  const today = new Date()
  const selectedDay = addDays(today, -28)
  const [month, setMonth] = useState(selectedDay)
  const [date, setDate] = useState<Date | undefined>(selectedDay)

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onSelect={setDate}
          selected={date}
        />
        <Button
          className="mb-2 ml-4"
          onClick={() => {
            setDate(today)
            setMonth(today)
          }}
          size="sm"
          variant="outline"
        >
          Current today
        </Button>
      </CardContent>
    </Card>
  )
}
