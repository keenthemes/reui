// Description: Avatar inside small outline button
// Order: 19

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <Button variant="outline" size="sm" className="gap-1.5">
      <Avatar className="size-5">
        <AvatarImage
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&q=80"
          alt="@nick.bold"
        />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <span className="text-xs">@nick.bold</span>
    </Button>
  )
}
