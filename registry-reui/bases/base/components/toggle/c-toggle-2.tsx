// Description: Toggle buttons with outline variant.
// Order: 2

import { Toggle } from "@/registry/bases/base/ui/toggle"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle variant="outline" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
        Bold
      </Toggle>
    </div>
  )
}
