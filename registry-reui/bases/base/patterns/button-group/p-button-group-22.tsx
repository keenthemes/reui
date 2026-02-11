// Description: Basic button group with disabled button
// Order: 22

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" aria-label="Files">
        <IconPlaceholder
          lucide="FileIcon"
          tabler="IconFile"
          hugeicons="FileEmpty02Icon"
          phosphor="FileIcon"
          remixicon="RiFileLine"
          aria-hidden="true"
        />
        Files
      </Button>
      <Button variant="outline" disabled aria-label="Folder">
        <IconPlaceholder
          lucide="FolderIcon"
          tabler="IconFolder"
          hugeicons="FolderIcon"
          phosphor="FolderIcon"
          remixicon="RiFolderLine"
          aria-hidden="true"
        />
        Folder
      </Button>
      <Button variant="outline" aria-label="Trash">
        <IconPlaceholder
          lucide="TrashIcon"
          tabler="IconTrash"
          hugeicons="DeleteIcon"
          phosphor="TrashIcon"
          remixicon="RiDeleteBinLine"
          aria-hidden="true"
        />
        Trash
      </Button>
    </ButtonGroup>
  )
}
