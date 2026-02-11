// Description: Input with subtle background
// Order: 26

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"

export default function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="subtle-bg">Subtle Background</FieldLabel>
      <Input
        id="subtle-bg"
        className="bg-muted focus-visible:bg-muted hover:bg-muted transition-colors duration-300"
        placeholder="Enter text..."
      />
    </Field>
  )
}
