// Description: Actions dropdown menu
// Order: 12

import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
          <IconPlaceholder
            lucide="EllipsisVerticalIcon"
            tabler="IconDotsVertical"
            hugeicons="MoreVerticalIcon"
            phosphor="DotsThreeVerticalIcon"
            remixicon="RiMore2Fill"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="PencilIcon"
                tabler="IconPencil"
                hugeicons="PenIcon"
                phosphor="PencilIcon"
                remixicon="RiPencilLine"
                aria-hidden="true"
              />
              Edit
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
                aria-hidden="true"
              />
              Duplicate
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <IconPlaceholder
                  lucide="ArrowRightIcon"
                  tabler="IconArrowRight"
                  hugeicons="ArrowRight02Icon"
                  phosphor="ArrowRightIcon"
                  remixicon="RiArrowRightLine"
                  aria-hidden="true"
                />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="FolderIcon"
                      tabler="IconFolder"
                      hugeicons="FolderIcon"
                      phosphor="FolderIcon"
                      remixicon="RiFolderLine"
                      aria-hidden="true"
                    />
                    Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="ArchiveIcon"
                      tabler="IconArchive"
                      hugeicons="Archive02Icon"
                      phosphor="ArchiveIcon"
                      remixicon="RiArchiveLine"
                      aria-hidden="true"
                    />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="StarIcon"
                      tabler="IconStar"
                      hugeicons="StarIcon"
                      phosphor="StarIcon"
                      remixicon="RiStarLine"
                      aria-hidden="true"
                    />
                    Favorites
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="Share2Icon"
                tabler="IconShare"
                hugeicons="Share08Icon"
                phosphor="ShareNetworkIcon"
                remixicon="RiStackshareLine"
                aria-hidden="true"
              />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="LinkIcon"
                tabler="IconLink"
                hugeicons="Link01Icon"
                phosphor="LinkIcon"
                remixicon="RiLinkM"
                aria-hidden="true"
              />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="DeleteIcon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
              aria-hidden="true"
            />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
