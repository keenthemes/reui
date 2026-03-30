// Description: Button group with buttons and badge
// Order: 3

import { Badge } from "@/registry-reui/bases/radix/reui/badge"

import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="File02Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
          aria-hidden="true"
        />
        <Badge variant="warning-light">Draft</Badge>
      </Button>

      <Button variant="outline">
        <IconPlaceholder
          lucide="PencilIcon"
          tabler="IconPencil"
          hugeicons="PenIcon"
          phosphor="PencilIcon"
          remixicon="RiPencilLine"
          aria-hidden="true"
        />
        <span>Edit</span>
      </Button>

      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="UploadIcon"
          tabler="IconUpload"
          hugeicons="Upload01Icon"
          phosphor="UploadSimple"
          remixicon="RiUpload2Line"
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  )
}
