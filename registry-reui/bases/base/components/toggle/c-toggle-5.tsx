// Description: Disabled toggle.
// Order: 5

import { Toggle } from "@/registry/bases/base/ui/toggle"

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Disabled toggle" disabled>
        Disabled
      </Toggle>
      <Toggle variant="outline" aria-label="Disabled outline toggle" disabled>
        Disabled
      </Toggle>
    </div>
  )
}
