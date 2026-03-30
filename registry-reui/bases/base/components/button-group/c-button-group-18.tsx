// Description: Advanced git toolbar with branch selection and split commit button
// Order: 18

import { Button } from "@/registry/bases/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup className="**:data-[slot=button]:border-r-0">
      <Button>
        <IconPlaceholder
          lucide="PlayIcon"
          tabler="IconPlayerPlay"
          hugeicons="PlayIcon"
          phosphor="PlayIcon"
          remixicon="RiPlayLine"
          aria-hidden="true"
          className="fill-current"
        />
        <span>Execute</span>
      </Button>
      <ButtonGroupSeparator className="bg-primary/72" />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="icon"
              className="border-primary-foreground/20 rounded-l-none border-l"
            />
          }
        >
          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconChevronDown"
            hugeicons="ArrowDown01Icon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>Commit & Push</DropdownMenuItem>
          <DropdownMenuItem>Commit & Sync</DropdownMenuItem>
          <DropdownMenuItem>Amend Last Commit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
