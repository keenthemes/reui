// Description: Badge size variations
// Order: 18

import { Badge } from "@/registry-reui/bases/base/reui/badge"

export default function Pattern() {
  return (
    <div className="flex items-center gap-2.5">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  )
}
