// Description: Slider with dynamic tooltip indicator
// Order: 11

"use client"

import { useState } from "react"

import { Label } from "@/registry/bases/base/ui/label"
import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  const [value, setValue] = useState(50)
  const min = 0
  const max = 100
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Label className="text-sm font-medium">Volume</Label>
      <div className="relative pt-7">
        <div
          className="bg-foreground text-background absolute top-0 rounded px-2 py-0.5 text-xs font-semibold tabular-nums"
          style={{
            left: `${percentage}%`,
            transform: "translateX(-50%)",
          }}
        >
          {value}%
          <div className="bg-foreground absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
        </div>
        <Slider
          value={[value]}
          onValueChange={(val) =>
            setValue(Array.isArray(val) ? (val[0] ?? 50) : val)
          }
          min={min}
          max={max}
          step={1}
        />
      </div>
    </div>
  )
}
