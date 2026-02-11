// Description: Select component inline with Input
// Order: 13

import { Input } from "@/registry/bases/radix/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"

const filterItems = [
  { label: "Filter", value: null },
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

export default function Pattern() {
  return (
    <div className="flex w-full max-w-xs items-center gap-2">
      <Input placeholder="Search..." className="flex-1" />
      <Select>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {filterItems.map((item) => (
              <SelectItem key={item.value} value={item.value as string}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
