// Description: Interactive half-star rating
// Order: 7

"use client"

import { useState } from "react"
import { Rating } from "@/registry-reui/bases/base/reui/rating"

export default function Pattern() {
  const [rating, setRating] = useState(3.5)

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-4">
      <Rating rating={rating} onRatingChange={setRating} editable />
      <p className="text-muted-foreground text-sm">
        Your rating:{" "}
        <span className="text-foreground font-semibold">
          {rating.toFixed(1)}
        </span>{" "}
        / 5
      </p>
    </div>
  )
}
