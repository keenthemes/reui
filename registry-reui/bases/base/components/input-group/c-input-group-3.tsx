// Description: Input group in invalid state
// Order: 3

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"

export default function Pattern() {
  return (
    <Field className="max-w-xs" data-invalid="true">
      <InputGroup>
        <InputGroupInput placeholder="Invalid field" aria-invalid="true" />
      </InputGroup>
    </Field>
  )
}
