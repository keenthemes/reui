// Description: Circle checkbox
// Order: 7

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"

export default function Pattern() {
  return (
    <Field orientation="horizontal" className="relative w-auto">
      <Checkbox id="circle" className="rounded-full" defaultChecked />
      <FieldLabel
        htmlFor="circle"
        className="peer-data-checked:text-muted-foreground relative transition-colors after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-translate-y-1/2 after:scale-x-0 after:bg-current after:transition-transform peer-data-checked:after:scale-x-100"
      >
        Circle checkbox
      </FieldLabel>
    </Field>
  )
}
