// Description: Tooltip with action button inside
// Order: 16

import { Button } from "@/registry/bases/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Notifications" />
          }
        >
          <div className="relative">
            <IconPlaceholder
              lucide="BellIcon"
              tabler="IconBell"
              hugeicons="NotificationIcon"
              phosphor="BellIcon"
              remixicon="RiNotificationLine"
            />
            <span className="bg-destructive absolute -top-1 -right-1 block size-2 rounded-full" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium">3 new notifications</p>
            <a
              href="#"
              className="text-xs font-medium underline underline-offset-2"
            >
              View all &rarr;
            </a>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
