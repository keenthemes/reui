// Description: Basic popover.
// Order: 1

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit">
            Open Popover
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="px-3 py-2">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}
