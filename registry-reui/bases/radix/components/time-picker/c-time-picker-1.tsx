"use client"

import { useState } from "react"
import { TimePicker } from "@/registry-reui/bases/radix/reui/time-picker"

export default function Pattern() {
  const [time, setTime] = useState<string>("09:30")

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <label className="text-sm font-medium">Meeting Time</label>
      <TimePicker
        value={time}
        onChange={setTime}
        placeholder="Select time"
        clearable
      />
    </div>
  )
}
