// Description: Toggle with button and icon.
// Order: 4

import { Button } from "@/registry/bases/base/ui/button"
import { Toggle } from "@/registry/bases/base/ui/toggle"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          Button
        </Button>
        <Toggle variant="outline" size="sm" aria-label="Small toggle">
          Toggle
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </Button>
        <Toggle variant="outline" aria-label="Toggle bold icon">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </Toggle>
      </div>
    </div>
  )
}
