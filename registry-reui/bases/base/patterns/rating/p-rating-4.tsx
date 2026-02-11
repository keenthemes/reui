// Description: Rating with editable.
// Order: 4

"use client"

import { useState } from "react"
import { Rating } from "@/registry-reui/bases/base/reui/rating"
import { toast } from "sonner"

export default function Pattern() {
  const [productRating, setProductRating] = useState(0)

  const handleRatingChange = (rating: number) => {
    setProductRating(rating)

    toast.success("Rated {rating} out of 5", {
      description: `Rated ${rating} out of 5`,
    })
  }

  return (
    <div className="space-y-8">
      <Rating
        rating={productRating}
        editable={true}
        onRatingChange={handleRatingChange}
        showValue={true}
      />
    </div>
  )
}
