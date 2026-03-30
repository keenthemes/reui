// Description: Vertical table with server configuration details
// Order: 17
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/registry/bases/base/ui/table"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Frame spacing="sm">
        <FrameHeader className="px-2!">
          <FrameTitle>Droplet Status</FrameTitle>
          <FrameDescription>
            Primary production server{" "}
            <Badge variant="outline" size="sm">
              prod-api-us-east-1
            </Badge>
          </FrameDescription>
        </FrameHeader>
        <FramePanel className="p-0!">
          <Table>
            <TableBody>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 w-40 py-2 text-sm font-medium">
                  Status
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Operational
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  Instance Type
                </TableCell>
                <TableCell className="py-2">
                  <span className="font-mono text-sm">c6g.2xlarge</span>
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  Region
                </TableCell>
                <TableCell className="py-2 text-sm">
                  US East (N. Virginia)
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  CPU Usage
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: "42%" }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm">42%</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  Memory
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: "67%" }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm">
                      10.7 / 16 GB
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  Uptime
                </TableCell>
                <TableCell className="py-2 text-sm">
                  47 days, 12 hours
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  OS
                </TableCell>
                <TableCell className="py-2 text-sm">
                  Amazon Linux 2023
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  Tags
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" size="sm">
                      production
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      api
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      critical
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </FramePanel>
      </Frame>
    </div>
  )
}
