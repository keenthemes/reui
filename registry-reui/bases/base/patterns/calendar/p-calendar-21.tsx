// Description: Display 2 months with range picker
// Order: 21

"use client"

import { useState } from "react"
import { faker } from "@faker-js/faker"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent } from "@/registry/bases/base/ui/card"

const now = new Date()
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

const from = faker.date.between({
  from: startOfMonth,
  to: new Date(now.getFullYear(), now.getMonth(), 15),
})
const to = faker.date.between({
  from: new Date(now.getFullYear(), now.getMonth(), 16),
  to: endOfMonth,
})

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
