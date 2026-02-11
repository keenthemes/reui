// Description: Nested vertical button group for complex tool palettes
// Order: 14

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup orientation="vertical">
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon" aria-label="Search">
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
            aria-hidden="true"
          />
        </Button>
        <Button variant="outline" size="icon" aria-label="Copy">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="CopyIcon"
            phosphor="CopyIcon"
            remixicon="RiFileCopyLine"
            aria-hidden="true"
          />
        </Button>
        <Button variant="outline" size="icon" aria-label="Share">
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
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Trash">
          <IconPlaceholder
            lucide="Trash2Icon"
            tabler="IconTrash"
            hugeicons="Delete02Icon"
            phosphor="TrashIcon"
            remixicon="RiDeleteBinLine"
            aria-hidden="true"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
