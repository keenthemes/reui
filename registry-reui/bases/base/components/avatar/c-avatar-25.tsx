// Description: Avatar group with numerical count
// Order: 25

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <div className="border-border flex items-center gap-1.5 rounded-full border p-0.5 shadow-sm shadow-black/5">
      <div className="flex -space-x-1.5">
        <Avatar className="border-background size-7 border-2">
          <AvatarImage
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
            alt="Alex Johnson"
          />
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        <Avatar className="border-background size-7 border-2">
          <AvatarImage
            src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80"
            alt="Sarah Chen"
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar className="border-background size-7 border-2">
          <AvatarImage
            src="https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80"
            alt="Michael Rodriguez"
          />
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>
        <Avatar className="border-background size-7 border-2">
          <AvatarImage
            src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80"
            alt="Emma Wilson"
          />
          <AvatarFallback>EW</AvatarFallback>
        </Avatar>
      </div>

      <p className="text-muted-foreground me-1.5 text-xs">+3</p>
    </div>
  )
}
