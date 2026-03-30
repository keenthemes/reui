// Description: Tooltip with warning badge
// Order: 9

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
          render={<Button variant="outline" size="icon" aria-label="Warning" />}
        >
          <IconPlaceholder
            lucide="AlertTriangleIcon"
            tabler="IconAlertTriangle"
            hugeicons="Alert01Icon"
            phosphor="WarningIcon"
            remixicon="RiAlertLine"
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2 text-sm">
            <IconPlaceholder
              lucide="AlertTriangleIcon"
              tabler="IconAlertTriangle"
              hugeicons="Alert02Icon"
              phosphor="WarningIcon"
              remixicon="RiAlertLine"
              className="size-4 shrink-0"
            />
            This action cannot be undone
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
