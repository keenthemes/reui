// Description: Textarea input group with action buttons
// Order: 26

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/registry/bases/base/ui/input-group"

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupTextarea
          placeholder="Share your thoughts..."
          className="min-h-24"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton variant="secondary" size="sm">
            Cancel
          </InputGroupButton>
          <InputGroupButton variant="default" size="sm" className="ml-auto">
            Post Comment
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
