// Description: Color temperature slider
// Order: 8

"use client"

import { useState } from "react"

import { Label } from "@/registry/bases/base/ui/label"
import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  const [temperature, setTemperature] = useState(4500)

  const getLabel = (temp: number) => {
    if (temp <= 3000) return "Warm"
    if (temp <= 4500) return "Neutral"
    if (temp <= 5500) return "Daylight"
    return "Cool"
  }

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Color Temperature</Label>
        <span className="text-muted-foreground text-xs font-medium tabular-nums">
          {temperature}K &middot; {getLabel(temperature)}
        </span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{
          background:
            "linear-gradient(to right, #ff8a2b, #ffd4a3, #fff5e6, #e8f0ff, #a3c9ff)",
        }}
      />
      <Slider
        value={[temperature]}
        onValueChange={(val) =>
          setTemperature(Array.isArray(val) ? (val[0] ?? 4500) : val)
        }
        min={2700}
        max={6500}
        step={100}
      />
    </div>
  )
}
