// Description: User profile dropdown menu
// Order: 9

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" className="w-52" />}
        >
          <div className="style-vega:gap-2 style-nova:gap-1.5 style-lyra:gap-1.5 style-maia:gap-1.5 style-mira:gap-1.5 flex items-center">
            <Avatar className="size-5">
              <AvatarImage
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
                alt="Alex Johnson"
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Alex Johnson</span>
          </div>

          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconChevronDown"
            hugeicons="ArrowDown01Icon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
            className="ml-auto size-4 opacity-60"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 py-2">
              <Avatar className="size-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
                  alt="Alex Johnson"
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-medium">
                  Alex Johnson
                </span>
                <span className="text-muted-foreground text-xs font-normal">
                  alex@example.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="UserIcon"
                  tabler="IconUser"
                  hugeicons="UserIcon"
                  phosphor="UserIcon"
                  remixicon="RiUserLine"
                  aria-hidden="true"
                />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CreditCardIcon"
                  tabler="IconCreditCard"
                  hugeicons="CreditCardIcon"
                  phosphor="CreditCardIcon"
                  remixicon="RiBankCardLine"
                  aria-hidden="true"
                />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="SettingsIcon"
                  tabler="IconSettings"
                  hugeicons="SettingsIcon"
                  phosphor="GearIcon"
                  remixicon="RiSettings3Line"
                  aria-hidden="true"
                />
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="UsersIcon"
                  tabler="IconUsers"
                  hugeicons="UserMultiple02Icon"
                  phosphor="UsersIcon"
                  remixicon="RiGroupLine"
                  aria-hidden="true"
                />
                Team
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                  aria-hidden="true"
                />
                Invite Members
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="LifeBuoyIcon"
                  tabler="IconLifebuoy"
                  hugeicons="LifebuoyIcon"
                  phosphor="LifebuoyIcon"
                  remixicon="RiLifebuoyLine"
                  aria-hidden="true"
                />
                Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="BookOpenIcon"
                  tabler="IconBook"
                  hugeicons="BookOpen01Icon"
                  phosphor="BookOpenIcon"
                  remixicon="RiBookOpenLine"
                  aria-hidden="true"
                />
                Documentation
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <IconPlaceholder
                lucide="LogOutIcon"
                tabler="IconLogout"
                hugeicons="LogoutSquare01Icon"
                phosphor="SignOutIcon"
                remixicon="RiLogoutBoxRLine"
                aria-hidden="true"
              />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
