// Description: Hover card with an image and text content.
// Order: 5

import { Button } from "@/registry/bases/radix/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/bases/radix/ui/hover-card"

export default function Pattern() {
  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="outline">View Image</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-[320px] overflow-hidden p-0">
          <img
            src="https://picsum.photos/1000/800?grayscale&random=1"
            alt="Card Image"
            className="aspect-video w-full object-cover"
          />
          <div className="space-y-1 p-3">
            <p className="font-medium">Image Overview</p>
            <p className="text-muted-foreground leading-relaxed">
              Visual overview of generated landing page.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
