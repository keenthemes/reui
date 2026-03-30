// Description: Tooltip with keyboard shortcut.
// Order: 4

import { Button } from "@/registry/bases/radix/ui/button"
import { Kbd } from "@/registry/bases/radix/ui/kbd"
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
            <Button variant="outline" size="icon-sm" aria-label="Save">
              <IconPlaceholder
                lucide="SaveIcon"
                tabler="IconDeviceFloppy"
                hugeicons="FloppyDiskIcon"
                phosphor="FloppyDiskIcon"
                remixicon="RiSaveLine"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="pr-1.5">
            <div className="flex items-center gap-2 text-sm">
              Save Changes <Kbd>S</Kbd>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
