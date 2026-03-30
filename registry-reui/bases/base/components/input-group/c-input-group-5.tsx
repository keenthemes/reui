// Description: Input group with suffix icon
// Order: 5

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput type="email" placeholder="you@example.com" />
        <InputGroupAddon align="inline-end">
          <IconPlaceholder
            lucide="MailIcon"
            tabler="IconMail"
            hugeicons="MailIcon"
            phosphor="EnvelopeIcon"
            remixicon="RiMailLine"
          />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
