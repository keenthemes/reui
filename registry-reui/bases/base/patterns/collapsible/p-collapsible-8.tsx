// Description: Collapsible User profile
// Order: 8

import {
  Frame,
  FrameHeader,
  FramePanel,
} from "@/registry-reui/bases/base/reui/frame"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="h-54 w-full max-w-xs">
      <Frame stacked dense spacing="sm" className="w-full">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full">
            <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="relative size-5">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-foreground text-sm font-medium">
                  @shadcn
                </span>
              </div>
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                aria-hidden="true"
                className="text-muted-foreground size-4 transition-transform in-data-open:rotate-90"
              />
            </FrameHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <FramePanel>
              {/* User profile information */}
              <div className="space-y-2.5">
                {/* Last activity */}
                <div className="flex items-center gap-2">
                  <IconPlaceholder
                    lucide="MessageSquareIcon"
                    tabler="IconMessageDots"
                    hugeicons="Message02Icon"
                    phosphor="ChatIcon"
                    remixicon="RiChat4Line"
                    aria-hidden="true"
                    className="text-muted-foreground size-3.5"
                  />
                  <span className="text-muted-foreground text-xs">
                    Last activity:
                  </span>
                  <span className="text-foreground text-xs font-medium">
                    2 hours ago
                  </span>
                </div>
                {/* Online since */}
                <div className="flex items-center gap-2">
                  <IconPlaceholder
                    lucide="ClockIcon"
                    tabler="IconClock"
                    hugeicons="ClockIcon"
                    phosphor="ClockIcon"
                    remixicon="RiTimeLine"
                    aria-hidden="true"
                    className="text-muted-foreground size-3.5"
                  />
                  <span className="text-muted-foreground text-xs">
                    Online since:
                  </span>
                  <span className="text-foreground text-xs font-medium">
                    Today, 9:00 AM
                  </span>
                </div>
                {/* Location */}
                <div className="flex items-center gap-2">
                  <IconPlaceholder
                    lucide="MapPinIcon"
                    tabler="IconMapPin"
                    hugeicons="Location06Icon"
                    phosphor="MapPinIcon"
                    remixicon="RiMapPinLine"
                    aria-hidden="true"
                    className="text-muted-foreground size-3.5"
                  />
                  <span className="text-muted-foreground text-xs">
                    Location:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground text-xs font-medium">
                      Canada
                    </span>
                    <img
                      src={`https://flagcdn.com/ca.svg`}
                      alt="Canada"
                      className="size-4 shrink-0 rounded-full border object-cover"
                    />
                  </div>
                </div>
              </div>
            </FramePanel>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </div>
  )
}
