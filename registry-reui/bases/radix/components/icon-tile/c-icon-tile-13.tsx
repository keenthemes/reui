import { IconTile } from "@/registry-reui/bases/radix/reui/icon-tile"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <IconTile
        asChild
        variant="elevated"
        className="hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <a href="#" aria-label="Open settings">
          <IconPlaceholder
            lucide="Settings2Icon"
            tabler="IconAdjustmentsHorizontal"
            hugeicons="SlidersHorizontalIcon"
            phosphor="SlidersHorizontalIcon"
            remixicon="RiEqualizer2Line"
            aria-hidden="true"
          />
        </a>
      </IconTile>
    </div>
  )
}
