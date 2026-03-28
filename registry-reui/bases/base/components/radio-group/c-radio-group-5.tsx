// Description: Colored radio group
// Order: 5

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/base/ui/radio-group"

export default function Pattern() {
  return (
    <RadioGroup defaultValue="blue" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem
          value="blue"
          id="color-blue"
          className="border-blue-500 data-checked:border-blue-500 [&_.cn-radio-group-indicator]:text-blue-500"
        />
        <FieldLabel htmlFor="color-blue">Blue</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem
          value="green"
          id="color-green"
          className="border-green-500 data-checked:border-green-500 [&_.cn-radio-group-indicator]:text-green-500"
        />
        <FieldLabel htmlFor="color-green">Green</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem
          value="yellow"
          id="color-yellow"
          className="border-yellow-500 data-checked:border-yellow-500 [&_.cn-radio-group-indicator]:text-yellow-500"
        />
        <FieldLabel htmlFor="color-yellow">Yellow</FieldLabel>
      </Field>
    </RadioGroup>
  )
}
