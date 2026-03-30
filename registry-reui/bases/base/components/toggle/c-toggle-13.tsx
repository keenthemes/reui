// Description: Disabled toggle states
// Order: 13

import { Toggle } from "@/registry/bases/base/ui/toggle"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Enabled default">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </Toggle>
      <Toggle variant="outline" aria-label="Enabled outline">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
      </Toggle>
      <Toggle disabled aria-label="Disabled default">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
      </Toggle>
      <Toggle variant="outline" disabled aria-label="Disabled outline">
        <IconPlaceholder
          lucide="StrikethroughIcon"
          tabler="IconStrikethrough"
          hugeicons="TextStrikethroughIcon"
          phosphor="TextStrikethroughIcon"
          remixicon="RiStrikethrough"
        />
      </Toggle>
    </div>
  )
}
