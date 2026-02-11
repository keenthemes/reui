// Description: Button group for editor text alignment controls
// Order: 12

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon-sm" aria-label="Align left">
        <IconPlaceholder
          lucide="AlignLeftIcon"
          tabler="IconAlignLeft"
          hugeicons="TextAlignLeftIcon"
          phosphor="TextAlignLeftIcon"
          remixicon="RiAlignLeft"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Align center">
        <IconPlaceholder
          lucide="AlignCenterIcon"
          tabler="IconAlignCenter"
          hugeicons="TextAlignCenterIcon"
          phosphor="TextAlignCenterIcon"
          remixicon="RiAlignCenter"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Align right">
        <IconPlaceholder
          lucide="AlignRightIcon"
          tabler="IconAlignRight"
          hugeicons="TextAlignRightIcon"
          phosphor="TextAlignRightIcon"
          remixicon="RiAlignRight"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Align justify">
        <IconPlaceholder
          lucide="MenuIcon"
          tabler="IconMenu2"
          hugeicons="Menu01Icon"
          phosphor="ListIcon"
          remixicon="RiMenuLine"
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  )
}
