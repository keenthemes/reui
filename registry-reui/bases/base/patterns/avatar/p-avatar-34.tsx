// Description: Avatar with multiple badges
// Order: 34

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <Avatar className="relative">
      <AvatarImage
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
        alt="Alex Johnson"
      />
      <AvatarFallback>JB</AvatarFallback>
      <AvatarBadge className="bg-green-500" />
      <span className="border-background absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border-2 bg-red-500 text-xs font-medium text-white">
        3
      </span>
    </Avatar>
  )
}
