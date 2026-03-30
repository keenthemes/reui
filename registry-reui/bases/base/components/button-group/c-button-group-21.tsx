// Description: Button group with dropdown menu and input group
// Order: 21

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <IconPlaceholder
            lucide="FileIcon"
            tabler="IconFile"
            hugeicons="FileEmpty02Icon"
            phosphor="FileIcon"
            remixicon="RiFileLine"
            aria-hidden="true"
          />
        </InputGroupAddon>
        <InputGroupInput placeholder="Enter file name..." />
      </InputGroup>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Filter">
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
                aria-hidden="true"
              />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>New File</DropdownMenuItem>
          <DropdownMenuItem>New Folder</DropdownMenuItem>
          <DropdownMenuItem>New Workspace</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
