// Description: Subscriptions table with plan badges and billing info
// Order: 10
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"
import { Frame, FramePanel } from "@/registry-reui/bases/radix/reui/frame"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const subscriptions = [
  {
    service: "Vercel Pro",
    plan: "Pro",
    planVariant: "default" as const,
    billing: "$20/mo",
    nextBilling: "Mar 1, 2025",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    service: "GitHub Enterprise",
    plan: "Enterprise",
    planVariant: "info" as const,
    billing: "$21/user/mo",
    nextBilling: "Mar 15, 2025",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    service: "Figma Organization",
    plan: "Organization",
    planVariant: "warning-light" as const,
    billing: "$45/editor/mo",
    nextBilling: "Apr 1, 2025",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    service: "Slack Business+",
    plan: "Business+",
    planVariant: "secondary" as const,
    billing: "$12.50/user/mo",
    nextBilling: "—",
    status: "Cancelled",
    statusVariant: "destructive-light" as const,
  },
  {
    service: "Linear Standard",
    plan: "Standard",
    planVariant: "outline" as const,
    billing: "$8/user/mo",
    nextBilling: "Mar 20, 2025",
    status: "Trial",
    statusVariant: "info-light" as const,
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Billing</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.service}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{sub.service}</span>
                  <span className="text-muted-foreground text-xs">
                    Next: {sub.nextBilling}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={sub.planVariant} size="sm">
                  {sub.plan}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{sub.billing}</TableCell>
              <TableCell>
                <Badge variant={sub.statusVariant} size="sm">
                  {sub.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="h-7">
                  <IconPlaceholder
                    lucide="SettingsIcon"
                    tabler="IconSettings"
                    hugeicons="SettingsIcon"
                    phosphor="GearIcon"
                    remixicon="RiSettings3Line"
                    className="size-3.5"
                    aria-hidden="true"
                  />
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
