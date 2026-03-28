// Description: Label with character counter
// Order: 9

"use client"

import { useState } from "react"

import { Field } from "@/registry/bases/base/ui/field"
import { Label } from "@/registry/bases/base/ui/label"
import { Textarea } from "@/registry/bases/base/ui/textarea"

export default function Pattern() {
  const [length, setLength] = useState(0)

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-counter" className="justify-between">
        Bio
        <span className="text-muted-foreground">{length}/200</span>
      </Label>
      <Textarea
        id="label-counter"
        placeholder="Tell us about yourself…"
        maxLength={200}
        onChange={(e) => setLength(e.target.value.length)}
      />
    </Field>
  )
}
