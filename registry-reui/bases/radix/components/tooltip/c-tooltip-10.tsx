// Description: Tooltip with feature badge and upgrade link
// Order: 10

import { Badge } from "@/registry-reui/bases/radix/reui/badge"

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
            <Button variant="outline" size="icon" aria-label="Pro feature">
              <IconPlaceholder
                lucide="LockIcon"
                tabler="IconLock"
                hugeicons="SquareLock01Icon"
                phosphor="LockSimpleIcon"
                remixicon="RiLockLine"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 p-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  Advanced Analytics
                </span>
                <Badge variant="success" size="sm">
                  Pro
                </Badge>
              </div>
              <p className="text-xs opacity-80">
                Unlock detailed insights, custom reports, and real-time
                dashboards.
              </p>
              <Button size="sm" className="border-border/40 border">
                Upgrade to Pro
                <IconPlaceholder
                  lucide="ArrowRightIcon"
                  tabler="IconArrowRight"
                  hugeicons="ArrowRight01Icon"
                  phosphor="ArrowRightIcon"
                  remixicon="RiArrowRightSLine"
                />
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
