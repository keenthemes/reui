// Description: Button group with comprehensive action menu
// Order: 17

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <IconPlaceholder
          lucide="MessageCircleIcon"
          tabler="IconMessageCircle"
          hugeicons="Message02Icon"
          phosphor="ChatCircleIcon"
          remixicon="RiChat3Line"
          aria-hidden="true"
        />
        <span>Conversation</span>
      </Button>
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
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="VolumeXIcon"
                tabler="IconVolume3"
                hugeicons="VolumeMute02Icon"
                phosphor="SpeakerSimpleXIcon"
                remixicon="RiVolumeMuteLine"
                aria-hidden="true"
              />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                aria-hidden="true"
              />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="AlertTriangleIcon"
                tabler="IconAlertTriangle"
                hugeicons="Alert02Icon"
                phosphor="WarningIcon"
                remixicon="RiAlertLine"
                aria-hidden="true"
              />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="UserRoundXIcon"
                tabler="IconUserX"
                hugeicons="UserRemove01Icon"
                phosphor="UserGearIcon"
                remixicon="RiUserUnfollowLine"
                aria-hidden="true"
              />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="UploadIcon"
                tabler="IconUpload"
                hugeicons="Upload01Icon"
                phosphor="UploadSimple"
                remixicon="RiUpload2Line"
                aria-hidden="true"
              />
              Share Conversation
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
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="DeleteIcon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
                aria-hidden="true"
              />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
