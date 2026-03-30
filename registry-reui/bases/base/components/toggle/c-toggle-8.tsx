// Description: Toggle size variants showcase
// Order: 8

import { Toggle } from "@/registry/bases/base/ui/toggle"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">Small</span>
        <Toggle variant="outline" size="sm" aria-label="Toggle star small">
          <IconPlaceholder
            lucide="StarIcon"
            tabler="IconStar"
            hugeicons="StarIcon"
            phosphor="StarIcon"
            remixicon="RiStarLine"
          />
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">Default</span>
        <Toggle
          variant="outline"
          size="default"
          aria-label="Toggle star default"
        >
          <IconPlaceholder
            lucide="StarIcon"
            tabler="IconStar"
            hugeicons="StarIcon"
            phosphor="StarIcon"
            remixicon="RiStarLine"
          />
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">Large</span>
        <Toggle variant="outline" size="lg" aria-label="Toggle star large">
          <IconPlaceholder
            lucide="StarIcon"
            tabler="IconStar"
            hugeicons="StarIcon"
            phosphor="StarIcon"
            remixicon="RiStarLine"
          />
        </Toggle>
      </div>
    </div>
  )
}
