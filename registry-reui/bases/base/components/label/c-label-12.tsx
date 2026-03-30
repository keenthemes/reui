// Description: Label with inline edit toggle
// Order: 12

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import { Field, FieldDescription } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import { Label } from "@/registry/bases/base/ui/label"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState("My Awesome Project")

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-inline-edit" className="gap-2">
        Project Name
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
              className="size-3.5"
            />
          ) : (
            <IconPlaceholder
              lucide="PencilIcon"
              tabler="IconPencil"
              hugeicons="PenIcon"
              phosphor="PencilIcon"
              remixicon="RiPencilLine"
              className="size-3.5"
            />
          )}
        </Button>
      </Label>
      {isEditing ? (
        <Input
          id="label-inline-edit"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      ) : (
        <FieldDescription>{value}</FieldDescription>
      )}
    </Field>
  )
}
