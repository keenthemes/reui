// Description: Range input with value indicator
// Order: 29

"use client"

import { useState } from "react"

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"

export default function Pattern() {
  const [value, setValue] = useState(50)

  return (
    <Field className="w-full max-w-xs">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="range-slider">Volume</FieldLabel>
        <span className="text-muted-foreground text-xs font-medium">
          {value}
        </span>
      </div>
      <Input
        id="range-slider"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="bg-muted accent-primary h-2 cursor-pointer appearance-none"
      />
    </Field>
  )
}
