// Description: Right navigation
// Order: 7

"use client"

import { useState } from "react"

import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent } from "@/registry/bases/base/ui/card"

export default function Pattern() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar
          classNames={{
            month_caption: "ms-2.5 justify-start",
            nav: "flex items-center w-full absolute -top-1 inset-x-0 justify-end",
          }}
          mode="single"
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  )
}
