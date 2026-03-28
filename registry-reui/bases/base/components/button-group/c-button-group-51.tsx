// Description: New button with create dropdown
// Order: 51

import { Button } from "@/registry/bases/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/customizer/icon-placeholder"

const icons = {
  plus: (
    <IconPlaceholder
      lucide="PlusIcon"
      tabler="IconPlus"
      hugeicons="PlusSignIcon"
      phosphor="PlusIcon"
      remixicon="RiAddLine"
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
  userPlus: (
    <IconPlaceholder
      lucide="UserPlusIcon"
      tabler="IconUserPlus"
      hugeicons="UserAdd01Icon"
      phosphor="UserPlusIcon"
      remixicon="RiUserAddLine"
      aria-hidden="true"
    />
  ),
  cart: (
    <IconPlaceholder
      lucide="ShoppingCartIcon"
      tabler="IconShoppingCart"
      hugeicons="ShoppingCart01Icon"
      phosphor="ShoppingCartIcon"
      remixicon="RiShoppingCartLine"
      aria-hidden="true"
    />
  ),
  fileText: (
    <IconPlaceholder
      lucide="FileTextIcon"
      tabler="IconFileText"
      hugeicons="File02Icon"
      phosphor="FileTextIcon"
      remixicon="RiFileTextLine"
      aria-hidden="true"
    />
  ),
}

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label="More options">
        {icons.plus}
        New
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size="icon-sm" variant="outline">
              {icons.more}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuItem>
              {icons.userPlus}
              New Customer
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.cart}
              New Order
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.fileText}
              New Invoice
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
