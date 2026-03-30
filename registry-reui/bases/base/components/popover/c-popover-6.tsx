// Description: Popover with user profile details.
// Order: 6

import { MapPinIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" className="h-auto justify-start py-1.5">
              <Avatar className="size-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=96&h=96&dpr=2&q=80"
                  alt="Marcus Chen"
                />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 text-left">
                <p className="leading-none font-medium">Marcus Chen</p>
                <p className="text-muted-foreground">@mchen_design</p>
              </div>
            </Button>
          }
        />
        <PopoverContent className="w-64">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <Avatar className="size-12">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=112&h=112&dpr=2&q=80"
                  alt="Marcus Chen"
                />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline">
                Follow
              </Button>
            </div>
            <div className="space-y-1">
              <h4 className="leading-none font-semibold">Marcus Chen</h4>
              <p className="text-muted-foreground">@mchen_design</p>
            </div>
            <p className="leading-relaxed">
              Product Designer specializing in design systems.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="font-semibold tabular-nums">1.2k</span>
                <span className="text-muted-foreground">Followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold tabular-nums">482</span>
                <span className="text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
