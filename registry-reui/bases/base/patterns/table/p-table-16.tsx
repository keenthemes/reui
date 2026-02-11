// Description: Vertical table with employee profile details
// Order: 16
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/registry/bases/base/ui/table"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <div className="bg-background overflow-hidden rounded-lg border">
        <Table>
          <TableBody>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 w-40 py-2 text-sm font-medium">
                Employee
              </TableCell>
              <TableCell className="py-2">
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80"
                      alt="Sarah Chen"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-medium">Sarah Chen</span>
                    <span className="text-muted-foreground text-xs">
                      Lead Product Designer
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                Department
              </TableCell>
              <TableCell className="py-2 text-sm">
                Design & User Experience
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                Email
              </TableCell>
              <TableCell className="text-primary py-2 text-sm">
                sarah.chen@acmecorp.com
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                Location
              </TableCell>
              <TableCell className="py-2 text-sm">San Francisco, CA</TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                Status
              </TableCell>
              <TableCell className="py-2">
                <Badge variant="success-light" size="sm">
                  Active
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                Start Date
              </TableCell>
              <TableCell className="py-2 text-sm">March 15, 2022</TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                Reports To
              </TableCell>
              <TableCell className="py-2 text-sm">
                James Rodriguez, VP of Design
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
