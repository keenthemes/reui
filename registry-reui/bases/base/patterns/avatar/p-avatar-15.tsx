// Description: Avatar with a solid background color fallback
// Order: 15

import { Avatar, AvatarFallback } from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="after:border-primary">
        <AvatarFallback className="bg-primary text-primary-foreground">
          AB
        </AvatarFallback>
      </Avatar>
      <Avatar className="after:border-destructive">
        <AvatarFallback className="bg-destructive text-white">
          AB
        </AvatarFallback>
      </Avatar>
      <Avatar className="after:border-green-500">
        <AvatarFallback className="bg-green-500 text-white">AB</AvatarFallback>
      </Avatar>
      <Avatar className="after:border-blue-500">
        <AvatarFallback className="bg-blue-500 text-white">CB</AvatarFallback>
      </Avatar>
    </div>
  )
}
