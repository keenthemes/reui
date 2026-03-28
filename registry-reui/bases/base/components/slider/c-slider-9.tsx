// Description: Slider with reference labels
// Order: 9

import { Label } from "@/registry/bases/base/ui/label"
import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Label className="text-sm font-medium">Storage</Label>
      <Slider defaultValue={15} max={35} min={5} />
      <span
        aria-hidden="true"
        className="text-muted-foreground flex w-full items-center justify-between text-xs font-medium"
      >
        <span>5 GB</span>
        <span>20 GB</span>
        <span>35 GB</span>
      </span>
    </div>
  )
}
