// Description: Slider with tick marks
// Order: 10

import { cn } from "@/registry/bases/base/lib/utils"
import { Label } from "@/registry/bases/base/ui/label"
import { Slider } from "@/registry/bases/base/ui/slider"

export default function Pattern() {
  const max = 12
  const skipInterval = 2
  const ticks = Array.from({ length: max + 1 }, (_, i) => i)

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Label className="text-sm font-medium">Duration (months)</Label>
      <Slider defaultValue={5} max={max} />
      <span
        aria-hidden="true"
        className="text-muted-foreground flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium"
      >
        {ticks.map((tick) => (
          <span
            key={tick}
            className="flex w-0 flex-col items-center justify-center gap-2"
          >
            <span
              className={cn(
                "bg-muted-foreground/70 h-1 w-px",
                tick % skipInterval !== 0 && "h-0.5"
              )}
            />
            <span className={cn(tick % skipInterval !== 0 && "opacity-0")}>
              {tick}
            </span>
          </span>
        ))}
      </span>
    </div>
  )
}
