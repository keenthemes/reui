import { IconTile } from "@/registry-reui/bases/base/reui/icon-tile"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <IconTile
        render={<a href="#" aria-label="Open settings" />}
        variant="elevated"
        className="hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <IconPlaceholder
          lucide="Settings2Icon"
          tabler="IconAdjustmentsHorizontal"
          hugeicons="SlidersHorizontalIcon"
          phosphor="SlidersHorizontalIcon"
          remixicon="RiEqualizer2Line"
          aria-hidden="true"
        />
      </IconTile>
    </div>
  )
}
