// Description: Button group with dropdown menu
// Order: 4

import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">Update</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem>Production</DropdownMenuItem>
          <DropdownMenuItem>Staging</DropdownMenuItem>
          <DropdownMenuItem>Development</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
