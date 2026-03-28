// Description: Keyboard keys grouped together.
// Order: 2

import { Kbd, KbdGroup } from "@/registry/bases/base/ui/kbd"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </div>
  )
}
