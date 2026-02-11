// Description: Priority select with colored badges
// Order: 30

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

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
      <Select defaultValue={priorities[0].value} items={priorities}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            {(item: (typeof priorities)[number]) => (
              <span className="flex items-center gap-2">
                {item ? (
                  <Badge variant={item.variant} size="sm">
                    {item.label}
                  </Badge>
                ) : null}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority}>
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
