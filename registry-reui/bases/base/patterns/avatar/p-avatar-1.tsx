// Description: Basic avatar
// Order: 1

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <Avatar>
      <AvatarImage
        src="https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80"
        alt="Michael Rodriguez"
      />
      <AvatarFallback>MR</AvatarFallback>
    </Avatar>
  )
}
