// Description: Range calendar with presets
// Order: 16

"use client"

import { useState } from "react"
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns"
import type { DateRange } from "react-day-picker"

import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent } from "@/registry/bases/base/ui/card"

export default function Pattern() {
  const today = new Date()
  const yesterday = {
    from: subDays(today, 1),
    to: subDays(today, 1),
  }
  const last7Days = {
    from: subDays(today, 6),
    to: today,
  }
  const last30Days = {
    from: subDays(today, 29),
    to: today,
  }
  const monthToDate = {
    from: startOfMonth(today),
    to: today,
  }
  const lastMonth = {
    from: startOfMonth(subMonths(today, 1)),
    to: endOfMonth(subMonths(today, 1)),
  }
  const yearToDate = {
    from: startOfYear(today),
    to: today,
  }
  const lastYear = {
    from: startOfYear(subYears(today, 1)),
    to: endOfYear(subYears(today, 1)),
  }
  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<DateRange | undefined>(last7Days)

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <div className="flex max-sm:flex-col">
          <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
            <div className="h-full sm:border-e">
              <div className="flex flex-col px-2">
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate({
                      from: today,
                      to: today,
                    })
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
                    setMonth(yesterday.to)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Yesterday
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(last7Days)
                    setMonth(last7Days.to)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Last 7 days
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(last30Days)
                    setMonth(last30Days.to)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Last 30 days
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(monthToDate)
                    setMonth(monthToDate.to)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Month to date
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(lastMonth)
                    setMonth(lastMonth.to)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Last month
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(yearToDate)
                    setMonth(yearToDate.to)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Year to date
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(lastYear)
                    setMonth(lastYear.to)
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
            mode="range"
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
  )
}
