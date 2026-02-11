// Description: Badge with flag image
// Order: 25

import Image from "next/image"
import { Badge } from "@/registry-reui/bases/base/reui/badge"

export default function Pattern() {
  return (
    <Badge variant="outline">
      <Image
        src="https://flagcdn.com/us.svg"
        alt="US"
        width={18}
        height={18}
        className="rounded-xs"
      />
      USA
    </Badge>
  )
}
