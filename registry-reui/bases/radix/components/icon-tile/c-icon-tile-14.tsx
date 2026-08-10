import { IconTile } from "@/registry-reui/bases/radix/reui/icon-tile"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <span className="relative inline-flex" aria-hidden="true">
        <IconTile variant="elevated">
          <IconPlaceholder
            lucide="GlobeIcon"
            tabler="IconWorld"
            hugeicons="Globe02Icon"
            phosphor="GlobeSimpleIcon"
            remixicon="RiGlobalLine"
          />
        </IconTile>
        <span className="border-background bg-success absolute -end-0.5 -top-0.5 size-3 rounded-full border-2" />
      </span>
    </div>
  )
}
