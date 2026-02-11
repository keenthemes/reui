// Description: Dialog with keyboard shortcuts list
// Order: 9

import { Button } from "@/registry/bases/base/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import { Kbd } from "@/registry/bases/base/ui/kbd"

const shortcuts = [
  { keys: ["⌘", "K"], action: "Search" },
  { keys: ["⌘", "B"], action: "Bold" },
  { keys: ["⌘", "I"], action: "Italic" },
  { keys: ["⌘", "S"], action: "Save" },
  { keys: ["⌘", "Z"], action: "Undo" },
  { keys: ["⌘", "⇧", "Z"], action: "Redo" },
  { keys: ["⌘", "N"], action: "New File" },
  { keys: ["⌘", "P"], action: "Quick Open" },
  { keys: ["⌘", "/"], action: "Toggle Comment" },
  { keys: ["⌘", "D"], action: "Duplicate Line" },
]

export default function Pattern() {
  const half = Math.ceil(shortcuts.length / 2)
  const leftColumn = shortcuts.slice(0, half)
  const rightColumn = shortcuts.slice(half)

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Keyboard Shortcuts
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Quick reference for commonly used keyboard shortcuts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[leftColumn, rightColumn].map((column, colIndex) => (
              <div key={colIndex} className="space-y-3">
                {column.map((shortcut) => (
                  <div
                    key={shortcut.action}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted-foreground text-sm">
                      {shortcut.action}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, index) => (
                        <Kbd key={index}>{key}</Kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
