// Description: Colored checkbox
// Order: 6

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"

export default function Pattern() {
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox
          id="color-1"
          defaultChecked
          className="data-checked:border-blue-500 data-checked:bg-blue-500 dark:data-checked:border-blue-500 dark:data-checked:bg-blue-500"
        />
        <FieldLabel htmlFor="color-1">Blue checkbox</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox
          id="color-2"
          defaultChecked
          className="data-checked:border-green-500 data-checked:bg-green-500 dark:data-checked:border-green-500 dark:data-checked:bg-green-500"
        />
        <FieldLabel htmlFor="color-2">Green checkbox</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox
          id="color-3"
          defaultChecked
          className="data-checked:border-yellow-500 data-checked:bg-yellow-500 dark:data-checked:border-yellow-500 dark:data-checked:bg-yellow-500"
        />
        <FieldLabel htmlFor="color-3">Yellow checkbox</FieldLabel>
      </Field>
    </div>
  )
}
