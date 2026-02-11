// Description: Custom positioned checkbox
// Order: 13

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/registry/bases/base/ui/field"

export default function Pattern() {
  return (
    <FieldGroup className="w-full max-w-xs flex-row gap-4">
      <FieldLabel className="relative p-0">
        <Field orientation="horizontal">
          <Checkbox
            defaultChecked
            className="absolute -top-2 -right-2 size-5 rounded-full border-none shadow-none"
          />
          <FieldTitle className="justify-center">Billings</FieldTitle>
        </Field>
      </FieldLabel>
      <FieldLabel className="relative p-0">
        <Field orientation="horizontal" className="justify-center">
          <Checkbox className="absolute -top-2 -right-2 size-5 rounded-full border-none shadow-none" />
          <FieldTitle className="justify-center">Payments</FieldTitle>
        </Field>
      </FieldLabel>
      <FieldLabel className="relative p-0">
        <Field orientation="horizontal" className="justify-center">
          <Checkbox className="absolute -top-2 -right-2 size-5 rounded-full border-none shadow-none" />
          <FieldTitle className="justify-center">Invoices</FieldTitle>
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}
