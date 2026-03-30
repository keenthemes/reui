// Description: Toggle group for text alignment
// Order: 7

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup defaultValue={["left"]} spacing={1}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <IconPlaceholder
            lucide="AlignLeftIcon"
            tabler="IconAlignLeft"
            hugeicons="TextAlignLeftIcon"
            phosphor="TextAlignLeftIcon"
            remixicon="RiAlignLeft"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <IconPlaceholder
            lucide="AlignCenterIcon"
            tabler="IconAlignCenter"
            hugeicons="TextAlignCenterIcon"
            phosphor="TextAlignCenterIcon"
            remixicon="RiAlignCenter"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <IconPlaceholder
            lucide="AlignRightIcon"
            tabler="IconAlignRight"
            hugeicons="TextAlignRightIcon"
            phosphor="TextAlignRightIcon"
            remixicon="RiAlignRight"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="Justify">
          <IconPlaceholder
            lucide="MenuIcon"
            tabler="IconMenu2"
            hugeicons="Menu01Icon"
            phosphor="ListIcon"
            remixicon="RiMenuLine"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
