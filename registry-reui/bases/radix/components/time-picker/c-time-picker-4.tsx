"use client"

import { useState } from "react"
import {
  TimePicker,
  TimePickerColumn,
  TimePickerConfirm,
  TimePickerContent,
  TimePickerFooter,
  TimePickerGroup,
  TimePickerNow,
  TimePickerTrigger,
} from "@/registry-reui/bases/radix/reui/time-picker"

import { Button } from "@/registry/bases/radix/ui/button"

export default function Pattern() {
  const [time, setTime] = useState<string>("14:00")

  return (
    <TimePicker value={time} onChange={setTime}>
      <TimePickerTrigger asChild>
        <Button variant="outline" className="font-mono text-sm">
          {time || "Custom Trigger"}
        </Button>
      </TimePickerTrigger>
      <TimePickerContent align="start">
        <TimePickerGroup>
          <TimePickerColumn type="hour" label="Hour" />
          <TimePickerColumn type="minute" label="Minute" />
        </TimePickerGroup>
        <TimePickerFooter>
          <TimePickerNow />
          <TimePickerConfirm />
        </TimePickerFooter>
      </TimePickerContent>
    </TimePicker>
  )
}
