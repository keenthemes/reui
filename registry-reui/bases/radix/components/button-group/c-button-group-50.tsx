// Description: Toolbar filter sort and more
// Order: 50

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
  filter: (
    <IconPlaceholder
      lucide="FilterIcon"
      tabler="IconFilter"
      hugeicons="FilterIcon"
      phosphor="FunnelIcon"
      remixicon="RiFilterLine"
      aria-hidden="true"
    />
  ),
  sort: (
    <IconPlaceholder
      lucide="ArrowUpDownIcon"
      tabler="IconArrowsSort"
      hugeicons="Sorting04Icon"
      phosphor="ArrowsDownUpIcon"
      remixicon="RiSortAsc"
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
  copy: (
    <IconPlaceholder
      lucide="CopyIcon"
      tabler="IconCopy"
      hugeicons="Copy01Icon"
      phosphor="CopyIcon"
      remixicon="RiFileCopyLine"
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
  download: (
    <IconPlaceholder
      lucide="DownloadIcon"
      tabler="IconDownload"
      hugeicons="Download01Icon"
      phosphor="DownloadSimpleIcon"
      remixicon="RiDownload2Line"
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
}

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label="Filter">
        {icons.filter}
      </Button>
      <Button variant="outline" size="sm" aria-label="Sort">
        {icons.sort}
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="More options">
            {icons.more}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.copy}
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.share}
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.download}
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {icons.settings}
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
