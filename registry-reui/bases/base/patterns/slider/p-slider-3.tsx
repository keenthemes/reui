// Description: Slider with multiple discrete values
// Order: 3

import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <Slider defaultValue={[10, 40, 80]} max={100} step={10} />
    </div>
  )
}
