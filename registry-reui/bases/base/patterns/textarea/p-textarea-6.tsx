// Description: Auto-resize textarea with character count
// Order: 6

"use client"

import { useCallback, useRef, useState } from "react"

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Textarea } from "@/registry/bases/base/ui/textarea"

const MAX_CHARS = 280

export default function Pattern() {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (newValue.length <= MAX_CHARS) {
        setValue(newValue)
      }

      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    },
    []
  )

  const remaining = MAX_CHARS - value.length
  const isNearLimit = remaining <= 20
  const isAtLimit = remaining === 0

  return (
    <div className="mx-auto w-full max-w-xs">
      <Field className="w-full">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="auto-resize-textarea">Bio</FieldLabel>
          <span
            className={`text-xs tabular-nums ${
              isAtLimit
                ? "text-destructive font-semibold"
                : isNearLimit
                  ? "text-warning"
                  : "text-muted-foreground"
            }`}
          >
            {value.length}/{MAX_CHARS}
          </span>
        </div>
        <Textarea
          ref={textareaRef}
          id="auto-resize-textarea"
          value={value}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          rows={2}
          className="resize-none overflow-hidden"
        />
      </Field>
    </div>
  )
}
