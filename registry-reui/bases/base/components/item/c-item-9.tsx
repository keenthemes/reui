// Description: Team members with roles and multiple actions
// Order: 9

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const members = [
  {
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    role: "Admin",
    roleVariant: "default" as const,
  },
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    role: "Editor",
    roleVariant: "info-light" as const,
  },
  {
    name: "Emily Park",
    email: "emily@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    role: "Viewer",
    roleVariant: "outline" as const,
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup>
        {members.map((member, index) => (
          <div key={member.email}>
            <Item variant="outline" size="xs">
              <ItemMedia>
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{member.name}</ItemTitle>
                <ItemDescription>{member.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant={member.roleVariant} size="sm">
                  {member.role}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 size-7"
                      />
                    }
                  >
                    <IconPlaceholder
                      lucide="MoreHorizontalIcon"
                      tabler="IconDots"
                      hugeicons="MoreHorizontalCircle01Icon"
                      phosphor="DotsThreeIcon"
                      remixicon="RiMoreLine"
                    />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          </div>
        ))}
      </ItemGroup>
    </div>
  )
}
