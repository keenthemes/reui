// Description: Basic checkbox with label
// Order: 1

import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/radix/ui/field"

export default function Pattern() {
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="terms" />
      <FieldLabel htmlFor="terms">Basic checkbox</FieldLabel>
    </Field>
  )
}
