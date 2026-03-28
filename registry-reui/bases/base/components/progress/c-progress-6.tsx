// Description: Progress bar with slider.
// Order: 6

"use client"

import { useState } from "react"

import { Progress } from "@/registry/bases/base/ui/progress"
import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  const [value, setValue] = useState(50)

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-6">
      <Progress value={value} />
      <Slider
        value={[value]}
        onValueChange={(value: number | readonly number[]) =>
          setValue(value as number)
        }
        min={0}
        max={100}
        step={1}
      />
    </div>
  )
}
