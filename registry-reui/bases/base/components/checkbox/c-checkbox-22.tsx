// Description: Checkbox with feature badge
// Order: 22

import { Badge } from "@/registry/bases/base/ui/badge"
import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"

export default function Pattern() {
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="badge-1" defaultChecked />
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor="badge-1">AI-powered suggestions</FieldLabel>
          <Badge className="h-4.5 rounded-full px-1.5 text-[10px] tracking-wider uppercase">
            New
          </Badge>
        </div>
      </Field>

      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="badge-2" />
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor="badge-2">Beta feature access</FieldLabel>
          <Badge
            variant="secondary"
            className="h-4.5 rounded-full px-1.5 text-[10px] tracking-wider uppercase"
          >
            Beta
          </Badge>
        </div>
      </Field>
    </div>
  )
}
