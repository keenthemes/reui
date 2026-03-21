// Description: Badge with full radius (radius="full")
// Order: 19

import { Badge } from "@/registry-reui/bases/radix/reui/badge"

export default function Pattern() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2.5">
        <Badge size="sm" radius="full">
          3
        </Badge>
        <Badge size="default" radius="full">
          3
        </Badge>
        <Badge size="lg" radius="full">
          3
        </Badge>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge size="sm" radius="full">
          New
        </Badge>
        <Badge radius="full">New</Badge>
        <Badge size="lg" radius="full">
          New
        </Badge>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge size="sm" radius="full" variant="outline">
          New
        </Badge>
        <Badge radius="full" variant="secondary">
          New
        </Badge>
        <Badge size="lg" radius="full" variant="success-light">
          New
        </Badge>
      </div>
    </div>
  )
}
