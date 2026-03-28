// Description: Badge with a status dot
// Order: 22

import { Badge } from "@/registry-reui/bases/base/reui/badge"

export default function Pattern() {
  return (
    <Badge variant="info-light">
      <span className="ms-0.25 size-1.25 rounded-full! bg-[currentColor]" />{" "}
      Badge
    </Badge>
  )
}
