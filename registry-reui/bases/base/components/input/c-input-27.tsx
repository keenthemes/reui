// Description: Input with bottom border only
// Order: 27

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"

export default function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="bottom-border">Bottom Border Only</FieldLabel>
      <Input
        id="bottom-border"
        className="focus-visible:border-primary rounded-none border-x-0 border-t-0 border-b-2 px-0 shadow-none focus-visible:ring-0"
        placeholder="Type here..."
      />
    </Field>
  )
}
