// Description: Orders table with customer info and payment status
// Order: 7
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"

const orders = [
  {
    id: "#3210",
    customer: "Olivia Martin",
    email: "olivia@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    amount: "$1,999.00",
    status: "Paid",
    statusVariant: "success" as const,
    date: "Feb 1, 2025",
  },
  {
    id: "#3209",
    customer: "Jackson Lee",
    email: "jackson@example.com",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    amount: "$39.00",
    status: "Pending",
    statusVariant: "warning" as const,
    date: "Jan 28, 2025",
  },
  {
    id: "#3208",
    customer: "Isabella Nguyen",
    email: "isabella@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    amount: "$299.00",
    status: "Paid",
    statusVariant: "success" as const,
    date: "Jan 25, 2025",
  },
  {
    id: "#3207",
    customer: "William Kim",
    email: "will@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
    amount: "$99.00",
    status: "Refunded",
    statusVariant: "destructive-light" as const,
    date: "Jan 22, 2025",
  },
  {
    id: "#3206",
    customer: "Sofia Davis",
    email: "sofia@example.com",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    amount: "$2,500.00",
    status: "Paid",
    statusVariant: "success" as const,
    date: "Jan 18, 2025",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">{order.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarImage src={order.avatar} alt={order.customer} />
                    <AvatarFallback>
                      {order.customer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {order.customer}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {order.date}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={order.statusVariant} size="sm">
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {order.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
