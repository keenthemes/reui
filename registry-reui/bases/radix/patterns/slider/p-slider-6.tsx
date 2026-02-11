// Description: Slider with range selection
// Order: 6

import { Slider } from "@/registry/bases/radix/ui/slider"

export default function Pattern() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <Slider defaultValue={[25, 75]} max={100} step={5} />
    </div>
  )
}
