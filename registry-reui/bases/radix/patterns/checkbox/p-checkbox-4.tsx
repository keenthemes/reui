// Description: Indeterminate checkbox
// Order: 4

import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/radix/ui/field"

export default function Pattern() {
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="indeterminate" checked="indeterminate" />
      <FieldLabel htmlFor="indeterminate">Indeterminate state</FieldLabel>
    </Field>
  )
}
