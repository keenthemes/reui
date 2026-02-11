// Description: Button group using icons for visual actions
// Order: 6

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="FlipHorizontalIcon"
          tabler="IconBorderHorizontal"
          hugeicons="BorderHorizontalIcon"
          phosphor="SquareSplitHorizontalIcon"
          remixicon="RiSplitCellsHorizontal"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="FlipVerticalIcon"
          tabler="IconBorderVertical"
          hugeicons="BorderVerticalIcon"
          phosphor="SquareSplitVerticalIcon"
          remixicon="RiSplitCellsVertical"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="RotateCwIcon"
          tabler="IconRotateClockwise"
          hugeicons="Rotate01Icon"
          phosphor="ArrowClockwiseIcon"
          remixicon="RiResetRightLine"
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  )
}
