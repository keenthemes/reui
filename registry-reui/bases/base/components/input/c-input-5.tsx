// Description: Input with error message
// Order: 5

import { Field, FieldError, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="input-demo-error">Email</FieldLabel>
      <Input
        id="input-demo-error"
        type="email"
        placeholder="name@example.com"
        aria-invalid="true"
      />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  )
}
