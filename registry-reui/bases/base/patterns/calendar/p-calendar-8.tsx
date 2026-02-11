// Description: Month and year selection
// Order: 8

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
          captionLayout="dropdown"
          classNames={{
            month_caption: "mx-0",
          }}
          components={{
            Dropdown: (props: DropdownProps) => {
              return (
                <Select
                  onValueChange={(value) => {
                    if (props.onChange && value !== null) {
                      handleCalendarChange(value, props.onChange)
                    }
                  }}
                  value={String(props.value)}
                >
                  <SelectTrigger className="first:grow">
                    <SelectValue>
                      {
                        props.options?.find(
                          (option) => option.value === props.value
                        )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start">
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
            DropdownNav: (props: DropdownNavProps) => {
              return (
                <div className="flex w-full items-center gap-2">
                  {props.children}
                </div>
              )
            },
          }}
          defaultMonth={new Date()}
          hideNavigation
          mode="single"
          onSelect={setDate}
          selected={date}
          startMonth={new Date(1980, 6)}
        />
      </CardContent>
    </Card>
  )
}
