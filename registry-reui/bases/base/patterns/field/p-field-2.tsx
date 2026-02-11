// Description: Field with input and textarea
// Order: 2

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import { Textarea } from "@/registry/bases/base/ui/textarea"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="ticket-subject">Subject</FieldLabel>
          <Input id="ticket-subject" placeholder="Briefly describe the issue" />
          <FieldDescription>
            Use a clear and descriptive subject line.
          </FieldDescription>
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="ticket-message">Message</FieldLabel>
            <span className="text-muted-foreground text-xs">0/500</span>
          </div>
          <Textarea
            id="ticket-message"
            placeholder="Tell us more about your problem…"
            className="min-h-[120px]"
          />
          <FieldDescription>
            Include any relevant details to help us resolve your issue.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
