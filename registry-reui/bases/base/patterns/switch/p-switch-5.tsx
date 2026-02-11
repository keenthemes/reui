// Description: Switch group
// Order: 5

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Switch } from "@/registry/bases/base/ui/switch"

export default function Pattern() {
  return (
    <Field className="w-auto">
      <FieldLabel>Notification Settings</FieldLabel>
      <Field orientation="horizontal">
        <Switch id="sg-email" defaultChecked />
        <FieldLabel htmlFor="sg-email">Email notifications</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="sg-sms" />
        <FieldLabel htmlFor="sg-sms">SMS notifications</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="sg-push" defaultChecked />
        <FieldLabel htmlFor="sg-push">Push notifications</FieldLabel>
      </Field>
    </Field>
  )
}
