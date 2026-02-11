// Description: Toggle buttons in different sizes.
// Order: 3

import { Toggle } from "@/registry/bases/base/ui/toggle"

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle variant="outline" size="sm" aria-label="Small toggle">
        Small
      </Toggle>
      <Toggle variant="outline" size="default" aria-label="Default toggle">
        Default
      </Toggle>
      <Toggle variant="outline" size="lg" aria-label="Large toggle">
        Large
      </Toggle>
    </div>
  )
}
