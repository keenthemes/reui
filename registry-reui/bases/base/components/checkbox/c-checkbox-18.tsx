// Description: Checkbox with label and tooltip info
// Order: 18

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="tooltip-checkbox" />
      <div className="flex items-center gap-1.5">
        <FieldLabel htmlFor="tooltip-checkbox">
          Enable advanced analytics
        </FieldLabel>
        <Tooltip>
          <TooltipTrigger className="text-muted-foreground">
            <IconPlaceholder
              lucide="HelpCircleIcon"
              tabler="IconHelpCircle"
              hugeicons="HelpCircleIcon"
              phosphor="QuestionIcon"
              remixicon="RiQuestionLine"
              aria-hidden="true"
              className="size-3.5"
            />
          </TooltipTrigger>
          <TooltipContent side="right">
            Advanced analytics provides deeper insights into user behavior and
            system performance.
          </TooltipContent>
        </Tooltip>
      </div>
    </Field>
  )
}
