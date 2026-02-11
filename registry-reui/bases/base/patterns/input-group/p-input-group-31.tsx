// Description: Input group with inline start and block-end addon
// Order: 31

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
        <InputGroupAddon className="pr-0 pl-3">
          <InputGroupText className="text-muted-foreground">€</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="0.00"
          className="border-border border-r"
        />
        <InputGroupAddon align="inline-end" className="pl-2">
          <InputGroupText>EUR</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
