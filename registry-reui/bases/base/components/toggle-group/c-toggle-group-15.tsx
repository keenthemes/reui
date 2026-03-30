// Description: Toggle group for sort direction
// Order: 15

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup defaultValue={["asc"]} variant="outline" size="sm">
        <ToggleGroupItem value="asc" aria-label="Sort ascending">
          <IconPlaceholder
            lucide="ArrowUpIcon"
            tabler="IconArrowUp"
            hugeicons="ArrowUp02Icon"
            phosphor="ArrowUpIcon"
            remixicon="RiArrowUpLine"
          />
          Ascending
        </ToggleGroupItem>
        <ToggleGroupItem value="desc" aria-label="Sort descending">
          <IconPlaceholder
            lucide="ArrowDownIcon"
            tabler="IconArrowDown"
            hugeicons="ArrowDown02Icon"
            phosphor="ArrowDownIcon"
            remixicon="RiArrowDownLine"
          />
          Descending
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
