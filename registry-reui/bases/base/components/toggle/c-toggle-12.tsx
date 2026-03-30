// Description: Toggle with tooltip
// Order: 12

import { Toggle } from "@/registry/bases/base/ui/toggle"
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
          render={<Toggle variant="outline" aria-label="Pin to sidebar" />}
        >
          <IconPlaceholder
            lucide="PinIcon"
            tabler="IconPin"
            hugeicons="Pin02Icon"
            phosphor="PushPinIcon"
            remixicon="RiPushpinLine"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Pin to sidebar</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
