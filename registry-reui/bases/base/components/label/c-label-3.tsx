// Description: Label for a textarea field.
// Order: 3

import { Field } from "@/registry/bases/base/ui/field"
import { Label } from "@/registry/bases/base/ui/label"
import { Textarea } from "@/registry/bases/base/ui/textarea"

export default function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-demo-message">Message</Label>
      <Textarea id="label-demo-message" placeholder="Type your message here…" />
    </Field>
  )
}
