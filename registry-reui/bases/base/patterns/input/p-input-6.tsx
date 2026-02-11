// Description: Input with character counter
// Order: 6

"use client"

import { useState } from "react"

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"

export default function Pattern() {
  const [value, setValue] = useState("")
  const maxLength = 50

  return (
    <Field className="max-w-xs">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="bio">Description</FieldLabel>
        <span className="text-muted-foreground text-xs">
          {value.length}/{maxLength}
        </span>
      </div>
      <Input
        id="bio"
        maxLength={maxLength}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Description of your project"
      />
    </Field>
  )
}
