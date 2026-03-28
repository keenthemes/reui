// Description: Button group with select status addon
// Order: 27

import { cn } from "@/lib/utils"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import { Input } from "@/registry/bases/base/ui/input"
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
    <ButtonGroup className="max-w-xs">
      <Select defaultValue={statuses[1]} items={statuses}>
        <SelectTrigger className="min-w-36">
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
      <Input placeholder="Search tasks..." />
    </ButtonGroup>
  )
}
