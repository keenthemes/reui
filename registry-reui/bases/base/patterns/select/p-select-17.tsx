// Description: Select with colored bullets for status
// Order: 17

import { cn } from "@/lib/utils"
import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const statuses = [
  { value: "1", label: "In Progress", color: "bg-violet-500" },
  { value: "2", label: "Completed", color: "bg-green-500" },
  { value: "3", label: "Pending", color: "bg-primary" },
  { value: "4", label: "Cancelled", color: "bg-yellow-500" },
  { value: "5", label: "Rejected", color: "bg-destructive" },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={statuses[1]} items={statuses}>
        <SelectTrigger>
          <SelectValue>
            {(item: (typeof statuses)[number]) => (
              <span className="flex items-center gap-2">
                <span className={cn("size-1.5 rounded-full", item?.color)} />
                <span>{item?.label}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status}>
                <span className="flex items-center gap-2">
                  <span className={cn("size-1.5 rounded-full", status.color)} />
                  <span>{status.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
