// Description: Vertical slider with range selection
// Order: 4

import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-12">
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-40"
      />
      <Slider
        defaultValue={[25, 75]}
        max={100}
        step={5}
        orientation="vertical"
        className="h-40"
      />
    </div>
  )
}
