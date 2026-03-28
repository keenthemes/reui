// Description: Avatar group with hover tooltips and lift effect
// Order: 22

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"

const avatars = [
  {
    src: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    fallback: "DK",
    name: "David Kim",
  },
  {
    src: "https://github.com/maxleiter.png",
    fallback: "ML",
    name: "Max Leiter",
  },
  {
    src: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    fallback: "ER",
    name: "James Brown",
  },
  {
    src: "https://github.com/pranathip.png",
    fallback: "JW",
    name: "Jenny Wilson",
  },
]

export default function Pattern() {
  return (
    <div className="flex -space-x-2">
      {avatars.map((avatar, index) => (
        <Tooltip key={index}>
          <TooltipTrigger>
            <Avatar className="ring-background ring-2 transition-all duration-300 ease-in-out hover:z-1 hover:-translate-y-1 hover:shadow-md">
              <AvatarImage src={avatar.src} alt={avatar.name} />
              <AvatarFallback className="text-xs">
                {avatar.fallback}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>{avatar.name}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
