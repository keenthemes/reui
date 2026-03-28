// Description: Display 2 months with range picker
// Order: 21

"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/registry/bases/radix/ui/calendar"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth()
const endOfMonth = new Date(year, month + 1, 0).getDate()

const from = new Date(year, month, Math.min(6, endOfMonth))
const to = new Date(year, month, Math.min(18, endOfMonth))

export default function Pattern() {
  const [date, setDate] = useState<DateRange | undefined>({
    from,
    to,
  })

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  )
}
