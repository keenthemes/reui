// Description: Basic input group
// Order: 1

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>
    </Field>
  )
}
