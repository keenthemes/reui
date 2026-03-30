// Description: Refresh share and export dropdown
// Order: 52

import { Button } from "@/registry/bases/radix/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/registry/bases/radix/ui/button-group"
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
  refresh: (
    <IconPlaceholder
      lucide="RefreshCwIcon"
      tabler="IconRefresh"
      hugeicons="Refresh04Icon"
      phosphor="ArrowsClockwiseIcon"
      remixicon="RiRefreshLine"
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
  pencil: (
    <IconPlaceholder
      lucide="PencilIcon"
      tabler="IconPencil"
      hugeicons="Pen01Icon"
      phosphor="PencilSimpleIcon"
      remixicon="RiPencilLine"
      aria-hidden="true"
    />
  ),
  fileText: (
    <IconPlaceholder
      lucide="FileTextIcon"
      tabler="IconFileText"
      hugeicons="FileEditIcon"
      phosphor="FileTextIcon"
      remixicon="RiFileTextLine"
      aria-hidden="true"
    />
  ),
  image: (
    <IconPlaceholder
      lucide="ImageIcon"
      tabler="IconPhoto"
      hugeicons="Image01Icon"
      phosphor="ImageIcon"
      remixicon="RiImageLine"
      aria-hidden="true"
    />
  ),
}

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label="Refresh">
        {icons.refresh}
      </Button>
      <Button variant="outline" size="sm">
        {icons.share}
        Share
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="More options">
            {icons.more}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44" sideOffset={9}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.pencil}
              Edit dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {icons.fileText}
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.image}
              Export PNG
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
