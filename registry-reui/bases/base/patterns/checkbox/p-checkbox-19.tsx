// Description: Checkbox group with badge
// Order: 19

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"

export default function Pattern() {
  return (
    <Field className="w-auto">
      <Field orientation="horizontal">
        <Checkbox id="checkbox-badge-1" />
        <div className="flex items-center gap-3">
          <FieldLabel htmlFor="checkbox-badge-1">
            AI-powered suggestions
          </FieldLabel>
          <Badge className="rounded-full uppercase" size="sm">
            New
          </Badge>
        </div>
      </Field>
      <Field orientation="horizontal" defaultChecked>
        <Checkbox id="checkbox-badge-2" />
        <div className="flex items-center gap-3">
          <FieldLabel htmlFor="checkbox-badge-2">
            Beta feature access
          </FieldLabel>
          <Badge
            variant="secondary"
            className="rounded-full uppercase"
            size="sm"
          >
            Beta
          </Badge>
        </div>
      </Field>
    </Field>
  )
}
