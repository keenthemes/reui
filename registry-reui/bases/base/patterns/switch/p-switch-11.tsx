// Description: Colored switches
// Order: 11

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Switch } from "@/registry/bases/base/ui/switch"

export default function Pattern() {
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal" className="w-auto">
        <Switch
          id="sw-blue"
          defaultChecked
          className="data-checked:bg-blue-500"
        />
        <FieldLabel htmlFor="sw-blue">Blue</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Switch
          id="sw-green"
          defaultChecked
          className="data-checked:bg-green-500"
        />
        <FieldLabel htmlFor="sw-green">Green</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Switch
          id="sw-yellow"
          defaultChecked
          className="data-checked:bg-yellow-500"
        />
        <FieldLabel htmlFor="sw-yellow">Yellow</FieldLabel>
      </Field>
    </div>
  )
}
