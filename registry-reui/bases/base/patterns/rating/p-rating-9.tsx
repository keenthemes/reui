// Description: Rating with review text input
// Order: 9

"use client"

import { useState } from "react"
import { Rating } from "@/registry-reui/bases/base/reui/rating"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { Label } from "@/registry/bases/base/ui/label"
import { Textarea } from "@/registry/bases/base/ui/textarea"

export default function Pattern() {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  return (
    <Card className="mx-auto w-full max-w-xs">
      <CardContent className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-sm font-semibold">Write a Review</h3>
          <Rating rating={rating} onRatingChange={setRating} editable />
          {rating > 0 && (
            <p className="text-muted-foreground text-xs">
              {rating <= 2
                ? "We're sorry to hear that"
                : rating <= 3
                  ? "Thanks for your feedback"
                  : "Glad you enjoyed it!"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-text" className="text-sm">
            Your review
          </Label>
          <Textarea
            id="review-text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us what you think..."
            rows={3}
          />
        </div>

        <Button disabled={rating === 0} size="sm" className="w-full">
          Submit Review
        </Button>
      </CardContent>
    </Card>
  )
}
