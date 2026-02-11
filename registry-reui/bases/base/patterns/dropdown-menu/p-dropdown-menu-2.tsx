// Description: Dropdown menus opening positions
// Order: 2

import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"

const sides = [
  "inline-start",
  "left",
  "top",
  "bottom",
  "right",
  "inline-end",
] as const

export default function Pattern() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {sides.map((side) => (
        <DropdownMenu key={side}>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="w-full" />}
          >
            {side.replace("-", " ").charAt(0).toUpperCase() +
              side.replace("-", " ").slice(1)}
          </DropdownMenuTrigger>
          <DropdownMenuContent side={side}>
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  )
}
