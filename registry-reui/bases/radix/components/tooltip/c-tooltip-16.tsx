// Description: Tooltip with action button inside
// Order: 16

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
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
            </Button>
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
      </TooltipProvider>
    </div>
  )
}
