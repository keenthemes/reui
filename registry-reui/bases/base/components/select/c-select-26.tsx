// Description: Status filter select with colored dots
// Order: 26

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
  { value: "all", label: "All Status", color: "" },
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-red-500" },
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "archived", label: "Archived", color: "bg-gray-400" },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={statuses[0]} items={statuses}>
        <SelectTrigger>
          <SelectValue>
            {(item: (typeof statuses)[number]) => (
              <span className="flex items-center gap-2">
                {item?.color && (
                  <span
                    className={`size-2 shrink-0 rounded-full ${item.color}`}
                  />
                )}
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
                  {status.color && (
                    <span
                      className={`size-2 shrink-0 rounded-full ${status.color}`}
                    />
                  )}
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
