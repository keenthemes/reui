// Description: Tooltip on notification bell with badge count
// Order: 5

import { Badge } from "@/registry-reui/bases/base/reui/badge"

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
            <Button variant="outline" size="icon" aria-label="Notifications" />
          }
        >
          <div className="relative">
            <IconPlaceholder
              lucide="InfoIcon"
              tabler="IconInfoCircle"
              hugeicons="InformationCircleIcon"
              phosphor="InfoIcon"
              remixicon="RiInformationLine"
            />
            <Badge
              variant="destructive"
              size="xs"
              className="absolute -top-3.5 -right-3.5"
            >
              3
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">Notifications</span>
              <Badge variant="destructive" size="xs">
                3 new
              </Badge>
            </div>
            <div className="flex flex-col gap-1 opacity-80">
              <p>• Sarah commented on your PR</p>
              <p>• Build #421 completed</p>
              <p>• New team member joined</p>
            </div>
            <a
              href="#"
              className="flex items-center gap-1 font-medium underline underline-offset-2"
            >
              View all
              <IconPlaceholder
                lucide="ArrowRightIcon"
                tabler="IconArrowRight"
                hugeicons="ArrowRightIcon"
                phosphor="ArrowRightIcon"
                remixicon="RiArrowRightLine"
                className="size-3.5"
              />
            </a>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
