// Description: Textarea input group with dynamic character limit
// Order: 17

"use client"

import { useState } from "react"

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [value, setValue] = useState("")
  const maxLength = 140

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupTextarea
          placeholder="Description..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
          className="min-h-16 pb-12"
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground text-xs">
            {value.length}/{maxLength} characters
          </InputGroupText>
          <IconPlaceholder
            lucide="InfoIcon"
            tabler="IconInfoCircle"
            hugeicons="InformationCircleIcon"
            phosphor="InfoIcon"
            remixicon="RiInformationLine"
            className="text-muted-foreground ml-auto"
          />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
