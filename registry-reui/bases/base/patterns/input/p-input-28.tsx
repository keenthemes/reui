// Description: Color input
// Order: 28

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"

export default function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="color-picker">Theme Color</FieldLabel>
      <Input
        id="color-picker"
        type="color"
        className="h-10 w-20 cursor-pointer p-1"
        defaultValue="#3b82f6"
      />
    </Field>
  )
}
