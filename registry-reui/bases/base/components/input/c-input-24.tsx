// Description: Input with pulsed background animation
// Order: 24

"use client"

import { useState } from "react"

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"

export default function Pattern() {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="pulsed-input">Pulsed Background</FieldLabel>
      <div className="relative">
        <div
          className={`bg-primary/20 pointer-events-none absolute inset-0 rounded-md transition-opacity duration-300 ${
            isFocused ? "opacity-0" : "animate-pulse"
          }`}
        />
        <Input
          id="pulsed-input"
          placeholder="Animation stops on focus..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="focus-visible:bg-background relative bg-transparent shadow-none transition-colors duration-300"
        />
      </div>
    </Field>
  )
}
