// Description: Toggle group for layout columns
// Order: 14

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup defaultValue={["2"]} variant="outline">
        <ToggleGroupItem value="1" aria-label="1 column">
          <IconPlaceholder
            lucide="SquareIcon"
            tabler="IconSquare"
            hugeicons="SquareIcon"
            phosphor="SquareIcon"
            remixicon="RiCheckboxBlankLine"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="2" aria-label="2 columns">
          <IconPlaceholder
            lucide="Columns2Icon"
            tabler="IconColumns2"
            hugeicons="LayoutTwoColumnIcon"
            phosphor="SquareSplitHorizontalIcon"
            remixicon="RiLayoutColumnLine"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="3" aria-label="3 columns">
          <IconPlaceholder
            lucide="Columns3Icon"
            tabler="IconColumns3"
            hugeicons="LayoutThreeColumnIcon"
            phosphor="ColumnsPlusRightIcon"
            remixicon="RiLayoutVerticalLine"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="4" aria-label="4 columns">
          <IconPlaceholder
            lucide="LayoutGridIcon"
            tabler="IconLayoutGrid"
            hugeicons="GridViewIcon"
            phosphor="SquaresFourIcon"
            remixicon="RiGalleryView2"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
