// Description: Context menu with destructive actions.
// Order: 8

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/registry/bases/base/ui/context-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex w-full items-center justify-center p-12">
      <ContextMenu>
        <ContextMenuTrigger className="text-muted-foreground style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md flex aspect-[2/0.5] w-full max-w-[300px] items-center justify-center border border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="PencilIcon"
                tabler="IconPencil"
                hugeicons="PenIcon"
                phosphor="PencilIcon"
                remixicon="RiPencilLine"
              />
              Edit
            </ContextMenuItem>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="UploadIcon"
                tabler="IconUpload"
                hugeicons="Upload01Icon"
                phosphor="UploadSimple"
                remixicon="RiUpload2Line"
              />
              Share
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="ArchiveIcon"
                tabler="IconArchive"
                hugeicons="Archive02Icon"
                phosphor="ArchiveIcon"
                remixicon="RiArchiveLine"
              />
              Archive
            </ContextMenuItem>
            <ContextMenuItem variant="destructive">
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="DeleteIcon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
              />
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
