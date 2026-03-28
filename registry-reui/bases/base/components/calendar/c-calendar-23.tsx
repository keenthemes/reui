// Description: Localize calendar
// Order: 23

"use client"

import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { enUS, zhCN } from "react-day-picker/locale"

import { Calendar } from "@/registry/bases/base/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const localizedStrings = {
  en: {
    title: "Schedule a meeting",
    description: "Choose your preferred dates",
  },
  zh: {
    title: "安排会议",
    description: "选择您偏好的日期",
  },
} as const

export default function Pattern() {
  const [locale, setLocale] = useState<keyof typeof localizedStrings>("en")

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 1, 9),
    to: new Date(2026, 1, 17),
  })

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{localizedStrings[locale].title}</CardTitle>
        <CardAction>
          <Select
            value={locale}
            onValueChange={(value) =>
              setLocale(value as keyof typeof localizedStrings)
            }
          >
            <SelectTrigger className="w-[60px]" aria-label="Select language">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="border-t pt-3">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          defaultMonth={dateRange?.from}
          locale={locale === "zh" ? zhCN : enUS}
          numerals="latn"
          className="w-full bg-transparent p-0"
          buttonVariant="ghost"
        />
      </CardContent>
    </Card>
  )
}
