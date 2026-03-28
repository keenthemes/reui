// Description: Activity log table with user avatars and timestamps
// Order: 9
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"
import { Frame, FramePanel } from "@/registry-reui/bases/radix/reui/frame"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"

const activities = [
  {
    user: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    action: "Deployed",
    target: "production",
    badge: "success" as const,
    timestamp: "2 minutes ago",
  },
  {
    user: "Marcus Johnson",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    action: "Merged",
    target: "feat/auth-flow",
    badge: "info" as const,
    timestamp: "15 minutes ago",
  },
  {
    user: "Emily Park",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    action: "Commented",
    target: "PR #284",
    badge: "outline" as const,
    timestamp: "1 hour ago",
  },
  {
    user: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
    action: "Reverted",
    target: "hotfix/api-crash",
    badge: "destructive" as const,
    timestamp: "3 hours ago",
  },
  {
    user: "Sofia Davis",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    action: "Created",
    target: "issue #512",
    badge: "secondary" as const,
    timestamp: "5 hours ago",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Frame spacing="xs">
        <FramePanel className="p-0!">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarImage
                          src={activity.avatar}
                          alt={activity.user}
                        />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {activity.user}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={activity.badge} size="sm">
                      {activity.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {activity.target}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right text-sm">
                    {activity.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FramePanel>
      </Frame>
    </div>
  )
}
