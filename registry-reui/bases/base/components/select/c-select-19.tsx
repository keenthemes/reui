// Description: Select with status badges
// Order: 19

import { Badge, BadgeProps } from "@/registry-reui/bases/base/reui/badge"

import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

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
      <Select defaultValue={statuses[2]} items={statuses}>
        <SelectTrigger className="w-[200px]">
          <span className="flex items-center gap-2">
            Status:
            <SelectValue>
              {(item: (typeof statuses)[number]) => (
                <Badge variant={item?.variant as BadgeProps["variant"]}>
                  {item?.label}
                </Badge>
              )}
            </SelectValue>
          </span>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status}>
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
