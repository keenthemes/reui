// Description: Tooltip with label badges
// Order: 15

import { Badge } from "@/registry-reui/bases/base/reui/badge"

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
        <TooltipTrigger className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
          <div className="flex items-center gap-1.5 text-sm">
            <IconPlaceholder
              lucide="TagIcon"
              tabler="IconTag"
              hugeicons="Tag01Icon"
              phosphor="TagIcon"
              remixicon="RiPriceTag3Line"
              className="size-3.5"
              aria-hidden="true"
            />
            3 labels
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-3">
          <div className="flex flex-col gap-2">
            <span className="font-medium">Labels</span>
            <div className="flex items-center gap-1.5">
              <Badge variant="destructive" size="xs">
                Bug
              </Badge>
              <Badge variant="info" size="xs">
                Frontend
              </Badge>
              <Badge variant="warning" size="xs">
                High Priority
              </Badge>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
