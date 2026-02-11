// Description: Tooltip with status badge
// Order: 6

import { Badge } from "@/registry-reui/bases/radix/reui/badge"

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
            <Button variant="outline" className="w-fit">
              System Status
            </Button>
          </TooltipTrigger>
          <TooltipContent className="p-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">API</span>
                <Badge variant="success" size="sm">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">Database</span>
                <Badge variant="info" size="sm">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">CDN</span>
                <Badge variant="warning" size="sm">
                  Degraded
                </Badge>
              </div>
              <p className="text-[10px] opacity-80">Updated 2 min ago</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
