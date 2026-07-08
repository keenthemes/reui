import { Button } from "@/registry/bases/radix/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"

const sides = ["top", "right", "bottom", "left"] as const

export default function Pattern() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {sides.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full capitalize">
              {side.replace("-", " ")}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-40">
            <p>Popover on {side.replace("-", " ")}</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
