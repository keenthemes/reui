// Description: Tooltip on disabled button with wrapper
// Order: 12

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-not-allowed">
              <Button variant="outline" disabled>
                Delete Project
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">You need admin access to delete projects</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
