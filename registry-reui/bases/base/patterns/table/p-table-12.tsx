// Description: API keys table with permission badges and actions
// Order: 12
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const apiKeys = [
  {
    name: "Production API",
    token: "sk_live_••••••••4f3a",
    permissions: ["read", "write"],
    lastUsed: "2 minutes ago",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    name: "Staging API",
    token: "sk_test_••••••••8b2c",
    permissions: ["read", "write", "admin"],
    lastUsed: "1 hour ago",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    name: "CI/CD Pipeline",
    token: "sk_ci_••••••••1d9e",
    permissions: ["read"],
    lastUsed: "3 days ago",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    name: "Legacy Integration",
    token: "sk_old_••••••••7a5f",
    permissions: ["read", "write"],
    lastUsed: "30 days ago",
    status: "Expired",
    statusVariant: "destructive-light" as const,
  },
]

const permissionVariant: Record<
  string,
  "outline" | "info-light" | "warning-light"
> = {
  read: "outline",
  write: "info-light",
  admin: "warning-light",
}

export default function Pattern() {
  return (
    <Card className="mx-auto flex w-full max-w-2xl p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.name}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{key.name}</span>
                    <span className="text-muted-foreground text-xs">
                      Last used: {key.lastUsed}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                    {key.token}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {key.permissions.map((perm) => (
                      <Badge
                        key={perm}
                        variant={permissionVariant[perm] ?? "outline"}
                        size="xs"
                      >
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={key.statusVariant} size="sm">
                    {key.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="size-7">
                      <IconPlaceholder
                        lucide="CopyIcon"
                        tabler="IconCopy"
                        hugeicons="Copy01Icon"
                        phosphor="CopyIcon"
                        remixicon="RiFileCopyLine"
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Copy key</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7">
                      <IconPlaceholder
                        lucide="RotateCcwIcon"
                        tabler="IconRotate2"
                        hugeicons="Refresh04Icon"
                        phosphor="ArrowCounterClockwiseIcon"
                        remixicon="RiRestartLine"
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Regenerate key</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
