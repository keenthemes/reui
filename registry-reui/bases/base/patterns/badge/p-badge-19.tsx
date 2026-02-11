// Description: Badge with full radius
// Order: 19

import { Badge } from "@/registry-reui/bases/base/reui/badge"

export default function Pattern() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2.5">
        <Badge size="sm" className="rounded-full!">
          3
        </Badge>
        <Badge size="default" className="rounded-full!">
          3
        </Badge>
        <Badge size="lg" className="rounded-full!">
          3
        </Badge>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge size="sm" className="rounded-full">
          New
        </Badge>
        <Badge className="rounded-full">New</Badge>
        <Badge size="lg" className="rounded-full">
          New
        </Badge>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge size="sm" className="rounded-full">
          New
        </Badge>
        <Badge className="rounded-full">New</Badge>
        <Badge size="lg" className="rounded-full">
          New
        </Badge>
      </div>
    </div>
  )
}
