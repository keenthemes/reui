// Description: Year select with navigation
// Order: 9

"use client"

import { ChangeEvent, ChangeEventHandler, useState } from "react"
import type { DropdownNavProps, DropdownProps } from "react-day-picker"

import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

export default function Pattern() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleCalendarChange = (
    _value: string | number,
    _e: ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as ChangeEvent<HTMLSelectElement>
    _e(_event)
  }

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar
          captionLayout="dropdown-years"
          classNames={{
            nav: "flex items-center w-full absolute top-0 inset-x-0 justify-between pointer-events-none [&>button]:pointer-events-auto",
          }}
          components={{
            DropdownNav: (props: DropdownNavProps) => {
              return (
                <div className="flex w-full items-center justify-center gap-3 [&>span]:text-sm [&>span]:font-medium">
                  {props.children}
                </div>
              )
            },
            YearsDropdown: (props: DropdownProps) => {
              return (
                <Select
                  onValueChange={(value) => {
                    if (value == null || !props.onChange) {
                      return
                    }
                    handleCalendarChange(value, props.onChange)
                  }}
                  value={String(props.value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {props.options?.map((option) => (
                      <SelectItem
                        disabled={option.disabled}
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            },
          }}
          defaultMonth={new Date()}
          mode="single"
          onSelect={setDate}
          selected={date}
          startMonth={new Date(1980, 6)}
        />
      </CardContent>
    </Card>
  )
}
