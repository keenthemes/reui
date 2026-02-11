// Description: Item with header and footer sections
// Order: 10

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { Progress } from "@/registry/bases/base/ui/progress"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <Item variant="outline">
        <ItemHeader>
          <div className="flex items-center gap-2">
            <IconPlaceholder
              lucide="FolderIcon"
              tabler="IconFolder"
              hugeicons="FolderIcon"
              phosphor="FolderIcon"
              remixicon="RiFolderLine"
              className="text-muted-foreground size-3.5"
              aria-hidden="true"
            />
            <span className="text-muted-foreground text-xs">Project</span>
          </div>
          <Badge variant="info-light" size="xs">
            In Progress
          </Badge>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Website Redesign</ItemTitle>
          <ItemDescription>
            Complete overhaul of the marketing site with a focus on conversion
            optimization and modern design patterns.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </ItemActions>
        <ItemFooter>
          <AvatarGroup>
            <Avatar size="sm">
              <AvatarImage
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80"
                alt="SC"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
                alt="AJ"
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80"
                alt="EP"
              />
              <AvatarFallback>EP</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <div className="flex items-center gap-2">
            <Progress value={65} className="w-20" />
            <span className="text-muted-foreground text-xs">65%</span>
          </div>
        </ItemFooter>
      </Item>
    </div>
  )
}
