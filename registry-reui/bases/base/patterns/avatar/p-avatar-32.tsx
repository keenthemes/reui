// Description: Avatar with ring animation
// Order: 32

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <div className="relative w-fit">
      <Avatar className="ring-offset-background animate-pulse ring-2 ring-green-500 ring-offset-2">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span className="border-background absolute -right-1 -bottom-1 size-3 rounded-full border-2 bg-green-500" />
    </div>
  )
}
