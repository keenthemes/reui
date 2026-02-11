// Description: Indeterminate checkbox
// Order: 4

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"

export default function Pattern() {
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="indeterminate" indeterminate />
      <FieldLabel htmlFor="indeterminate">Indeterminate state</FieldLabel>
    </Field>
  )
}
