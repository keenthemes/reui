// Description: Tooltip on disabled button with wrapper
// Order: 12

import { Button } from "@/registry/bases/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Tooltip>
        <TooltipTrigger className="cursor-not-allowed" render={<span />}>
          <Button variant="outline" disabled>
            Delete Project
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">You need admin access to delete projects</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
