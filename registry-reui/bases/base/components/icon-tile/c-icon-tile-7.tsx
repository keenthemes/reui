import { IconTile } from "@/registry-reui/bases/base/reui/icon-tile"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      <IconTile variant="elevated" className="size-14" aria-hidden="true">
        <IconPlaceholder
          lucide="ImageIcon"
          tabler="IconPhoto"
          hugeicons="ImageIcon"
          phosphor="ImageIcon"
          remixicon="RiImageLine"
          className="size-7"
        />
      </IconTile>
      <IconTile
        variant="elevated"
        className="[--icon-tile-icon-size:--spacing(7)] [--icon-tile-size:--spacing(14)]"
        aria-hidden="true"
      >
        <IconPlaceholder
          lucide="Settings2Icon"
          tabler="IconAdjustmentsHorizontal"
          hugeicons="SlidersHorizontalIcon"
          phosphor="SlidersHorizontalIcon"
          remixicon="RiEqualizer2Line"
        />
      </IconTile>
    </div>
  )
}
