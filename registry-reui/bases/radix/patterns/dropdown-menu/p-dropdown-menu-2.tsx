// Description: Dropdown menus opening positions
// Order: 2

import { Button } from "@/registry/bases/radix/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"

const sides = ["left", "top", "bottom", "right"] as const

export default function Pattern() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {sides.map((side) => (
        <DropdownMenu key={side}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {side.replace("-", " ").charAt(0).toUpperCase() +
                side.replace("-", " ").slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={side as "left" | "top" | "bottom" | "right"}
          >
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
