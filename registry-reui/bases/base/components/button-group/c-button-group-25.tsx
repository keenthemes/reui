// Description: Rating scale using numerical buttons
// Order: 25

"use client"

import { useState } from "react"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"

export default function Pattern() {
  const [rating, setRating] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">How likely are you to recommend us?</p>
      <ButtonGroup>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <Button
            key={n}
            variant="outline"
            size="icon-sm"
            onClick={() => setRating(n)}
            className={cn(
              rating === n &&
                "bg-primary hover:bg-primary hover:text-primary-foreground hover:border-primary text-primary-foreground border-primary"
            )}
          >
            {n}
          </Button>
        ))}
      </ButtonGroup>
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>Not likely</span>
        <span>Very likely</span>
      </div>
    </div>
  )
}
