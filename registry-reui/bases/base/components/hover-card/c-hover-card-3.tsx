// Description: Hover card with profile information.
// Order: 3

import { CalendarDays } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/bases/base/ui/hover-card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <HoverCard>
        <HoverCardTrigger
          delay={100}
          closeDelay={100}
          render={
            <div className="flex cursor-pointer items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80"
                  alt="Elena Soroka"
                />
                <AvatarFallback>ES</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium hover:underline">
                  Elena Soroka
                </p>
                <p className="text-muted-foreground text-xs">@e.soroka</p>
              </div>
            </div>
          }
        />
        <HoverCardContent className="w-64">
          <div className="flex space-x-2">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80"
                alt="Elena Soroka"
              />
              <AvatarFallback>ES</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div>
                <p className="text-sm font-medium hover:underline">
                  Elena Soroka
                </p>
                <p className="text-muted-foreground text-xs">@e.soroka</p>
              </div>
              <p className="text-foreground">Lead Product Designer at Vibe.</p>
              <div className="flex items-center gap-1">
                <IconPlaceholder
                  lucide="CalendarIcon"
                  tabler="IconCalendarEvent"
                  hugeicons="Calendar04Icon"
                  phosphor="CalendarBlankIcon"
                  remixicon="RiCalendarLine"
                  className="size-3.5 opacity-60"
                />
                <span className="text-muted-foreground text-xs leading-none">
                  Joined December 2023
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
