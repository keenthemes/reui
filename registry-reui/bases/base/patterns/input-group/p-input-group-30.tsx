// Description: Input group with inline addons (no separating borders)
// Order: 30

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/base/ui/input-group"

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon className="pr-2">
          <InputGroupText>€</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="0.00"
          className="border-border border-x"
        />
        <InputGroupAddon align="inline-end" className="pl-2">
          <InputGroupText>EUR</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
