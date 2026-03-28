// Description: Select with status badges
// Order: 19

import { Badge, BadgeProps } from "@/registry-reui/bases/radix/reui/badge"

import { Field } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"

const statuses = [
  { value: "1", label: "In Progress", variant: "warning-outline" },
  { value: "2", label: "Completed", variant: "success-outline" },
  { value: "3", label: "Pending", variant: "info-outline" },
  { value: "4", label: "Cancelled", variant: "primary-outline" },
  { value: "5", label: "Rejected", variant: "destructive-outline" },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={statuses[2].value}>
        <SelectTrigger className="w-[200px]">
          <span className="flex items-center gap-2">
            Status:
            <SelectValue placeholder="Select status" />
          </span>
        </SelectTrigger>
        <SelectContent position="popper">
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              <Badge variant={status.variant as BadgeProps["variant"]}>
                {status.label}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
