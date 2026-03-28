// Description: Inline horizontal checkbox group
// Order: 21

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="inline-1" defaultChecked />
        <FieldLabel htmlFor="inline-1" className="cursor-pointer">
          Read
        </FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="inline-2" />
        <FieldLabel htmlFor="inline-2" className="cursor-pointer">
          Write
        </FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="inline-4" defaultChecked />
        <FieldLabel htmlFor="inline-4" className="cursor-pointer">
          Delete
        </FieldLabel>
      </Field>
    </div>
  )
}
