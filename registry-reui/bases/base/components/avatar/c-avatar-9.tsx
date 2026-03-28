// Description: Avatar with different badge positions
// Order: 9

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
          alt="Alex Johnson (away)"
          className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md"
        />
        <AvatarFallback>AJ</AvatarFallback>
        <AvatarBadge className="-top-1 -right-1 bg-green-500" />
      </Avatar>
      <Avatar className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80"
          alt="Sarah Chen"
          className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md"
        />
        <AvatarFallback>SC</AvatarFallback>
        <AvatarBadge className="-right-1 -bottom-1 bg-yellow-500" />
      </Avatar>
      <Avatar className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80"
          alt="Michael Rodriguez"
          className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md"
        />
        <AvatarFallback>MR</AvatarFallback>
        <AvatarBadge className="bg-destructive -top-1 right-auto bottom-auto -left-1" />
      </Avatar>
      <Avatar className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80"
          alt="Emma Wilson"
          className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md"
        />
        <AvatarFallback>EW</AvatarFallback>
        <AvatarBadge className="right-auto -bottom-1 -left-1 bg-blue-500" />
      </Avatar>
    </div>
  )
}
