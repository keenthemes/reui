// Description: Card with dropdown menu
// Order: 6

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs gap-2 pt-5">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Need a help in Claim?</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconPlaceholder
                lucide="MoreHorizontalIcon"
                tabler="IconDots"
                hugeicons="MoreHorizontalCircle01Icon"
                phosphor="DotsThreeIcon"
                remixicon="RiMoreLine"
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Team Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="UserIcon"
                  tabler="IconUser"
                  hugeicons="UserIcon"
                  phosphor="UserIcon"
                  remixicon="RiUserLine"
                  aria-hidden="true"
                />
                <span>Manage members</span>
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
                <span>Team preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="ExternalLinkIcon"
                tabler="IconExternalLink"
                hugeicons="LinkSquare01Icon"
                phosphor="ArrowSquareOutIcon"
                remixicon="RiExternalLinkLine"
                aria-hidden="true"
              />
              <span>Open dashboard</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="mb-2">
        <p>
          Go to this step by step guideline process on how to certify for your
          weekly benefits:
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <span className="text-xs">@shadcn</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
