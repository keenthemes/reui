// Description: Avatars with different border radiuses
// Order: 4

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="rounded-md after:rounded-md">
        <AvatarImage
          src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80"
          alt="Emma Wilson"
          className="rounded-md"
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg after:rounded-lg">
        <AvatarImage
          src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80"
          alt="Emma Wilson"
          className="rounded-lg"
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg after:rounded-xl">
        <AvatarImage
          src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80"
          alt="Emma Wilson"
          className="rounded-xl"
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80"
          alt="Emma Wilson"
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
    </div>
  )
}
