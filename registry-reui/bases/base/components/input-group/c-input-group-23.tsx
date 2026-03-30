// Description: Input group with Sparkles icon and complex Kbd shortcut
// Order: 23

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { Kbd, KbdGroup } from "@/registry/bases/base/ui/kbd"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <IconPlaceholder
            lucide="SparklesIcon"
            tabler="IconSparkles"
            hugeicons="SparklesIcon"
            phosphor="SparkleIcon"
            remixicon="RiSparklingLine"
            className="text-emerald-500"
          />
        </InputGroupAddon>
        <InputGroupInput placeholder="Ask AI to generate..." />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>
              <IconPlaceholder
                lucide="CommandIcon"
                tabler="IconCommand"
                hugeicons="CommandIcon"
                phosphor="CommandIcon"
                remixicon="RiCommandLine"
                className="size-3"
              />
            </Kbd>
            <Kbd>Enter</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
