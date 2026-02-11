// Description: Slider synced with number input
// Order: 7

"use client"

import { useState } from "react"

import { Input } from "@/registry/bases/base/ui/input"
import { Label } from "@/registry/bases/base/ui/label"
import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  const [value, setValue] = useState(50)

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="slider-input" className="text-sm font-medium">
          Opacity
        </Label>
        <div className="flex items-center gap-1.5">
          <Input
            id="slider-input"
            type="number"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (v >= 0 && v <= 100) setValue(v)
            }}
            min={0}
            max={100}
            className="h-8 w-16 text-center text-sm tabular-nums"
          />
          <span className="text-muted-foreground text-xs">%</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(val) =>
          setValue(
            Array.isArray(val) ? ((val[0] as number) ?? 50) : (val as number)
          )
        }
        max={100}
        step={1}
      />
    </div>
  )
}
