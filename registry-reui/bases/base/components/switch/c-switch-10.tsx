// Description: Switch with badges
// Order: 10

import { Badge } from "@/registry/bases/base/ui/badge"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Switch } from "@/registry/bases/base/ui/switch"

export default function Pattern() {
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Switch id="sw-badge-1" defaultChecked />
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor="sw-badge-1">AI Copilot</FieldLabel>
          <Badge className="h-4.5 rounded-full px-1.5 text-[10px] tracking-wider uppercase">
            New
          </Badge>
        </div>
      </Field>
      <Field orientation="horizontal">
        <Switch id="sw-badge-2" />
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor="sw-badge-2">Smart suggestions</FieldLabel>
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
