// Description: Slider with controlled value tracking
// Order: 5

"use client"

import { useState } from "react"

import { Label } from "@/registry/bases/base/ui/label"
import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  const [value, setValue] = useState([0.3, 0.7])

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="slider-controlled" className="text-sm font-medium">
          Controlled Range
        </Label>
        <span className="text-secondary-foreground text-xs font-semibold">
          {value[0]?.toFixed(1)} – {value[1]?.toFixed(1)}
        </span>
      </div>
      <Slider
        id="slider-controlled"
        value={value}
        onValueChange={(val) => setValue(val as number[])}
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  )
}
