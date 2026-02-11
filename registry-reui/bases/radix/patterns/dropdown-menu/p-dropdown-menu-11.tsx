// Description: Notifications dropdown menu
// Order: 11

import { Badge } from "@/registry-reui/bases/radix/reui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const notifications = [
  {
    id: "1",
    user: "Sarah",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
    action: "commented on",
    target: "Design System v2",
    time: "2 min ago",
    unread: false,
  },
  {
    id: "2",
    user: "James Wilson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80",
    initials: "JW",
    action: "shared",
    target: "Q4 Report",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    user: "Emily Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    initials: "ED",
    action: "invited you to",
    target: "Project Alpha",
    time: "3 hours ago",
    unread: false,
  },
]

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <IconPlaceholder
              lucide="BellIcon"
              tabler="IconBell"
              hugeicons="NotificationIcon"
              phosphor="BellIcon"
              remixicon="RiNotificationLine"
              aria-hidden="true"
            />
            <Badge
              variant="destructive"
              size="sm"
              className="absolute -top-1.5 -right-2 rounded-full px-1"
              aria-hidden="true"
            >
              8
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <button className="text-foreground text-xs font-normal underline-offset-2 hover:underline">
                Mark all as read
              </button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-2 py-1"
                >
                  <Avatar className="mt-0.5 size-6 shrink-0">
                    <AvatarImage
                      src={notification.avatar}
                      alt={notification.user}
                    />
                    <AvatarFallback>{notification.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-px">
                    <p className="leading-snug">
                      <span className="font-medium">{notification.user}</span>{" "}
                      <span className="text-muted-foreground">
                        {notification.action}
                      </span>{" "}
                      <span className="font-medium">{notification.target}</span>
                    </p>
                    <span className="text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  {notification.unread && (
                    <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
