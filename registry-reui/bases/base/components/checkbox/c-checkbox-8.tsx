// Description: Checkbox group
// Order: 8

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"

export default function Pattern() {
  return (
    <Field className="w-auto">
      <FieldLabel>Notification Settings</FieldLabel>
      <Field orientation="horizontal">
        <Checkbox id="group-1" defaultChecked />
        <FieldLabel htmlFor="group-1">Email notifications</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="group-2" />
        <FieldLabel htmlFor="group-2">SMS notifications</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="group-3" defaultChecked />
        <FieldLabel htmlFor="group-3">Push notifications</FieldLabel>
      </Field>
    </Field>
  )
}
