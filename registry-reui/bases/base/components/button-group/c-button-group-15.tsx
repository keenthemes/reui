// Description: Star button group with count and dropdown
// Order: 15

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
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
          lucide="StarIcon"
          tabler="IconStar"
          hugeicons="StarIcon"
          phosphor="StarIcon"
          remixicon="RiStarLine"
          aria-hidden="true"
        />
        <span>Star</span>
        <Badge variant="secondary">2.4k</Badge>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconChevronDown"
            hugeicons="ArrowDown01Icon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
            aria-hidden="true"
          />
          <span className="sr-only">Toggle dropdown</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="EyeIcon"
              tabler="IconEye"
              hugeicons="ViewIcon"
              phosphor="EyeIcon"
              remixicon="RiEyeLine"
              aria-hidden="true"
            />
            Watch
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="GitForkIcon"
              tabler="IconGitFork"
              hugeicons="GitForkIcon"
              phosphor="GitForkIcon"
              remixicon="RiGitForkLine"
              aria-hidden="true"
            />
            Fork
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="ListPlusIcon"
              tabler="IconPlaylistAdd"
              hugeicons="ListSettingIcon"
              phosphor="ListPlusIcon"
              remixicon="RiPlayListAddLine"
              aria-hidden="true"
            />
            Add to list
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
              lucide="BellIcon"
              tabler="IconBell"
              hugeicons="NotificationIcon"
              phosphor="BellIcon"
              remixicon="RiNotificationLine"
              aria-hidden="true"
            />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="FlagIcon"
              tabler="IconFlag"
              hugeicons="Flag02Icon"
              phosphor="FlagIcon"
              remixicon="RiFlagLine"
              aria-hidden="true"
            />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
