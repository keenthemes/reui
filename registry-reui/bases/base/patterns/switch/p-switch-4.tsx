// Description: Switch in different sizes.
// Order: 4

import { Label } from "@/registry/bases/base/ui/label"
import { Switch } from "@/registry/bases/base/ui/switch"

export default function Pattern() {
  return (
    <div className="flex flex-col items-start justify-start gap-3">
      <div className="flex items-center gap-2">
        <Switch id="switch-sm" size="sm" />
        <Label htmlFor="switch-sm">Small Switch</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-default" size="default" />
        <Label htmlFor="switch-default">Default Switch</Label>
      </div>
    </div>
  )
}
