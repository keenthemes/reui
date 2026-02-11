// Description: Dropdown menu with status indicator
// Order: 7

import { Button } from "@/registry/bases/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="gap-2">
              <IconPlaceholder
                lucide="GitMergeIcon"
                tabler="IconGitMerge"
                hugeicons="GitMergeIcon"
                phosphor="GitMergeIcon"
                remixicon="RiGitMergeLine"
                aria-hidden="true"
              />
              <span>main</span>
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                aria-hidden="true"
                className="size-3.5 opacity-60"
              />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="GitBranchIcon"
                tabler="IconGitBranch"
                hugeicons="GitBranchIcon"
                phosphor="GitBranchIcon"
                remixicon="RiGitBranchLine"
                aria-hidden="true"
              />
              <span>main</span>
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                aria-hidden="true"
                className="text-primary ml-auto size-3.5"
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="GitBranchIcon"
                tabler="IconGitBranch"
                hugeicons="GitBranchIcon"
                phosphor="GitBranchIcon"
                remixicon="RiGitBranchLine"
                aria-hidden="true"
              />
              <span>develop</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="GitBranchIcon"
                tabler="IconGitBranch"
                hugeicons="GitBranchIcon"
                phosphor="GitBranchIcon"
                remixicon="RiGitBranchLine"
                aria-hidden="true"
              />
              <span>feature/auth</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroupText className="bg-transparent">
        <div className="size-1.5 animate-pulse rounded-full bg-green-600" />
        <span>Production</span>
      </ButtonGroupText>

      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="RefreshCwIcon"
          tabler="IconRefreshDot"
          hugeicons="Refresh04Icon"
          phosphor="ArrowsClockwiseIcon"
          remixicon="RiRestartLine"
          aria-hidden="true"
        />
      </Button>

      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="ExternalLinkIcon"
          tabler="IconExternalLink"
          hugeicons="LinkSquare01Icon"
          phosphor="ArrowSquareOutIcon"
          remixicon="RiExternalLinkLine"
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  )
}
