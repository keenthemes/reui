// Description: Tooltip with avatar and role badge
// Order: 11

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center p-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage
                src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80"
                alt="Emma Wilson"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage
                src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80"
                alt="Emma Wilson"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <span className="font-semibold">Emma Wilson</span>
                <Badge variant="info" size="xs">
                  Admin
                </Badge>
              </div>
              <p className="opacity-80">emma@example.com</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
