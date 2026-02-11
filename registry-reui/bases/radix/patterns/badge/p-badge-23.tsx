// Description: Badge rendered as a link
// Order: 23

import Link from "next/link"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"

export default function Pattern() {
  return (
    <Badge variant="outline" asChild>
      <Link href="#">Badge</Link>
    </Badge>
  )
}
