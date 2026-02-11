// Description: Priority select with colored badges
// Order: 30

import { Badge } from "@/registry-reui/bases/radix/reui/badge"

import { Field } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"

const priorities = [
  { value: "none", label: "No Priority", variant: "outline" as const },
  { value: "urgent", label: "Urgent", variant: "destructive" as const },
  { value: "high", label: "High", variant: "warning" as const },
  { value: "medium", label: "Medium", variant: "warning-light" as const },
  { value: "low", label: "Low", variant: "info" as const },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={priorities[0].value}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                <span className="flex items-center gap-2">
                  <Badge variant={priority.variant} size="sm">
                    {priority.label}
                  </Badge>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
