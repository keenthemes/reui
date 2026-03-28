// Description: Basic slider.
// Order: 1

import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <Slider defaultValue={50} max={100} step={1} />
    </div>
  )
}
