// Description: Label paired with a checkbox.
// Order: 2

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field } from "@/registry/bases/base/ui/field"
import { Label } from "@/registry/bases/base/ui/label"

export default function Pattern() {
  return (
    <Field orientation="horizontal" className="mx-auto w-auto">
      <Checkbox id="label-demo-terms" />
      <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
    </Field>
  )
}
