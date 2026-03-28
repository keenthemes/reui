// Description: Rating slider with emoji feedback
// Order: 12

"use client"

import { useState } from "react"

import { Label } from "@/registry/bases/base/ui/label"
import { Slider } from "@/registry/bases/base/ui/slider"

const emojis = ["😡", "🙁", "😐", "🙂", "😍"]
const labels = ["Awful", "Poor", "Okay", "Good", "Amazing"]

export default function Pattern() {
  const [value, setValue] = useState(3)

  return (
    <div className="mx-auto grid w-full max-w-sm gap-3">
      <Label className="text-sm font-medium">Rate your experience</Label>
      <div className="flex items-center gap-3">
        <Slider
          value={[value]}
          onValueChange={(val) =>
            setValue(Array.isArray(val) ? (val[0] ?? 3) : val)
          }
          min={1}
          max={5}
          step={1}
        />
        <span className="text-2xl" aria-hidden="true">
          {emojis[value - 1]}
        </span>
      </div>
      <span className="text-muted-foreground text-center text-xs font-medium">
        {labels[value - 1]}
      </span>
    </div>
  )
}
