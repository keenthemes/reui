// Description: Quick action menu
// Order: 16

import { Button } from "@/registry/bases/radix/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const icons = {
  more: (
    <IconPlaceholder
      lucide="MoreHorizontalIcon"
      tabler="IconDots"
      hugeicons="MoreHorizontalCircle01Icon"
      phosphor="DotsThreeIcon"
      remixicon="RiMoreLine"
      aria-hidden="true"
    />
  ),
  settings: (
    <IconPlaceholder
      lucide="SettingsIcon"
      tabler="IconSettings"
      hugeicons="Settings01Icon"
      phosphor="GearIcon"
      remixicon="RiSettings3Line"
      aria-hidden="true"
    />
  ),
  share: (
    <IconPlaceholder
      lucide="Share2Icon"
      tabler="IconShare"
      hugeicons="Share08Icon"
      phosphor="ShareNetworkIcon"
      remixicon="RiStackshareLine"
      aria-hidden="true"
    />
  ),
  trash: (
    <IconPlaceholder
      lucide="TrashIcon"
      tabler="IconTrash"
      hugeicons="DeleteIcon"
      phosphor="TrashIcon"
      remixicon="RiDeleteBinLine"
      aria-hidden="true"
    />
  ),
}

export default function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-me-1.5"
          aria-label="More options"
        >
          {icons.more}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {icons.settings}
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            {icons.share}
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            {icons.trash}
            Remove
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
