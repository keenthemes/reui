// Description: Avatar with user details and badge
// Order: 16

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <div className="flex items-center gap-1.5">
      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
          alt="Alex Johnson"
        />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">Alex Johnson</span>
          <Badge variant="default" size="xs">
            Pro
          </Badge>
        </div>
        <span className="text-muted-foreground text-xs">Founder & CEO</span>
      </div>
    </div>
  )
}
