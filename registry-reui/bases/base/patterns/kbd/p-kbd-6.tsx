// Description: Keyboard shortcuts reference list
// Order: 6

import { Kbd, KbdGroup } from "@/registry/bases/base/ui/kbd"
import { Separator } from "@/registry/bases/base/ui/separator"

const shortcuts = [
  { label: "Search", keys: ["⌘", "K"] },
  { label: "New File", keys: ["⌘", "N"] },
  { label: "Save", keys: ["⌘", "S"] },
  { label: "Undo", keys: ["⌘", "Z"] },
  { label: "Redo", keys: ["⌘", "⇧", "Z"] },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col">
      <p className="mb-3 text-sm font-medium">Keyboard Shortcuts</p>
      <Separator />
      <div className="flex flex-col">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.label}
            className="flex items-center justify-between border-b py-2.5 last:border-b-0"
          >
            <span className="text-muted-foreground text-sm">
              {shortcut.label}
            </span>
            <KbdGroup>
              {shortcut.keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </KbdGroup>
          </div>
        ))}
      </div>
    </div>
  )
}
