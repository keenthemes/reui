// Description: Toggle group for view mode switching
// Order: 8

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup defaultValue={["list"]} variant="outline">
        <ToggleGroupItem value="list" aria-label="List view">
          <IconPlaceholder
            lucide="ListIcon"
            tabler="IconList"
            hugeicons="Menu01Icon"
            phosphor="ListIcon"
            remixicon="RiListUnordered"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <IconPlaceholder
            lucide="LayoutGridIcon"
            tabler="IconLayoutGrid"
            hugeicons="GridViewIcon"
            phosphor="SquaresFourIcon"
            remixicon="RiGalleryView2"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban" aria-label="Kanban view">
          <IconPlaceholder
            lucide="Columns2Icon"
            tabler="IconColumns2"
            hugeicons="LayoutTwoColumnIcon"
            phosphor="SquareSplitHorizontalIcon"
            remixicon="RiLayoutColumnLine"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
