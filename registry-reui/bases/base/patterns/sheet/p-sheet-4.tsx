// Description: Sheet with scrollable content
// Order: 4

import { Button } from "@/registry/bases/base/ui/button"
import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"
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

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Scrollable Sheet
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-0 space-y-0">
          <SheetHeader>
            <SheetTitle>Scrollable Content</SheetTitle>
            <SheetDescription>
              Description of the scrollable content.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow">
            <div className="space-y-4 px-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className="text-muted-foreground text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris.
                </p>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose render={<Button variant="outline" />}>
              Cancel
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
