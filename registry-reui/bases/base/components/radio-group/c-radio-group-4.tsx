// Description: Invalid radio group
// Order: 4

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/base/ui/radio-group"

export default function Pattern() {
  return (
    <RadioGroup defaultValue="email" className="w-fit">
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem value="email" id="invalid-r1" aria-invalid />
        <FieldLabel htmlFor="invalid-r1">Email only</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem value="sms" id="invalid-r2" aria-invalid />
        <FieldLabel htmlFor="invalid-r2">SMS only</FieldLabel>
      </Field>
    </RadioGroup>
  )
}
