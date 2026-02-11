// Description: Input group in disabled state
// Order: 2

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"

export default function Pattern() {
  return (
    <Field className="max-w-xs" data-disabled="true">
      <InputGroup>
        <InputGroupInput placeholder="Disabled field" disabled />
      </InputGroup>
    </Field>
  )
}
