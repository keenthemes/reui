// Description: Rating with size.
// Order: 5

import { Rating } from "@/registry-reui/bases/base/reui/rating"

export default function Pattern() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating rating={4} size="sm" />
      <Rating rating={4} />
      <Rating rating={4} size="lg" />
    </div>
  )
}
