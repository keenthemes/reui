// Description: Tooltip with keyboard shortcut.
// Order: 4

import { Button } from "@/registry/bases/base/ui/button"
import { Kbd } from "@/registry/bases/base/ui/kbd"
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
          render={<Button variant="outline" size="icon-sm" aria-label="Save" />}
        >
          <IconPlaceholder
            lucide="SaveIcon"
            tabler="IconDeviceFloppy"
            hugeicons="FloppyDiskIcon"
            phosphor="FloppyDiskIcon"
            remixicon="RiSaveLine"
          />
        </TooltipTrigger>
        <TooltipContent className="pr-1.5">
          <div className="flex items-center gap-2 text-sm">
            Save Changes <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
