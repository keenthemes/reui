// Description: Sheets that open from any side.
// Order: 3

import { Button } from "@/registry/bases/base/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/bases/base/ui/sheet"

const sides = ["top", "right", "bottom", "left"] as const

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger
            render={<Button variant="outline" className="capitalize" />}
          >
            {side}
          </SheetTrigger>
          <SheetContent
            side={side}
            className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
          >
            <SheetHeader>
              <SheetTitle>Sheet Side: {side}</SheetTitle>
              <SheetDescription>
                This sheet opens from the {side} side of the screen.
              </SheetDescription>
            </SheetHeader>
            <div className="text-muted-foreground p-4 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <p key={i} className="mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              ))}
            </div>
            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Close
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
