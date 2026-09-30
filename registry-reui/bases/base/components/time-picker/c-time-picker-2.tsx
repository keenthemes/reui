"use client"

import { useState } from "react"
import { TimePicker } from "@/registry-reui/bases/base/reui/time-picker"

export default function Pattern() {
  const [time, setTime] = useState<string>("02:45:00 PM")

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <label className="text-sm font-medium">Broadcast Schedule</label>
      <TimePicker value={time} onChange={setTime} use12Hours showSeconds />
    </div>
  )
}
