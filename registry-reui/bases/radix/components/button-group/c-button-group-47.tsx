// Description: Review actions split button
// Order: 47

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
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const icons = {
  check: (
    <IconPlaceholder
      lucide="CheckIcon"
      tabler="IconCheck"
      hugeicons="Tick02Icon"
      phosphor="CheckIcon"
      remixicon="RiCheckLine"
      aria-hidden="true"
    />
  ),
  chevronDown: (
    <IconPlaceholder
      lucide="ChevronDownIcon"
      tabler="IconChevronDown"
      hugeicons="ArrowDown01Icon"
      phosphor="CaretDownIcon"
      remixicon="RiArrowDownSLine"
      aria-hidden="true"
    />
  ),
  checkCircle: (
    <IconPlaceholder
      lucide="CheckCircleIcon"
      tabler="IconCircleCheck"
      hugeicons="CheckmarkCircle01Icon"
      phosphor="CheckCircleIcon"
      remixicon="RiCheckboxCircleLine"
      aria-hidden="true"
    />
  ),
  messageSquare: (
    <IconPlaceholder
      lucide="MessageSquareIcon"
      tabler="IconMessageCircle"
      hugeicons="Message02Icon"
      phosphor="ChatCircleIcon"
      remixicon="RiChat3Line"
      aria-hidden="true"
    />
  ),
  x: (
    <IconPlaceholder
      lucide="XIcon"
      tabler="IconX"
      hugeicons="Cancel01Icon"
      phosphor="XIcon"
      remixicon="RiCloseLine"
      aria-hidden="true"
    />
  ),
}

export default function Pattern() {
  return (
    <ButtonGroup className="**:data-[slot=button]:border-x-0">
      <Button variant="default">
        {icons.check}
        Approve
      </Button>
      <ButtonGroupSeparator className="bg-primary-foreground/20" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="icon"
            aria-label="More approval options"
          >
            {icons.chevronDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.checkCircle}
              Approve with Conditions
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.messageSquare}
              Request Changes
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              {icons.x}
              Reject
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
