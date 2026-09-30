"use client"

import { useState } from "react"
import { TimePicker } from "@/registry-reui/bases/base/reui/time-picker"

export default function Pattern() {
  const [time, setTime] = useState<string>("10:00")

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <label className="text-sm font-medium">
        Appointment Slot (15-min intervals)
      </label>
      <TimePicker
        value={time}
        onChange={setTime}
        minuteStep={15}
        minTime="08:00"
        maxTime="18:00"
      />
    </div>
  )
}
