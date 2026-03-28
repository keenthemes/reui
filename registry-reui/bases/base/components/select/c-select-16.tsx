// Description: Select with custom access level descriptions
// Order: 16

import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const accessLevels = [
  {
    value: "full_access",
    label: "Full access",
    description: "Can modify list access",
  },
  {
    value: "read_write",
    label: "Read and write",
    description: "Can edit & publish lists",
  },
  {
    value: "read_only",
    label: "Read only",
    description: "Can only view lists",
  },
  {
    value: "no_access",
    label: "No access",
    description: "Cannot view or edit lists",
  },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={accessLevels[1]} items={accessLevels}>
        <SelectTrigger className="w-[240px] [&_small]:hidden">
          <SelectValue>
            {(item: (typeof accessLevels)[number]) => item?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {accessLevels.map((level) => (
              <SelectItem
                key={level.value}
                value={level}
                className="[&_svg]:text-primary"
              >
                <span className="flex flex-col items-start gap-px">
                  <span className="font-medium">{level.label}</span>
                  <small className="text-muted-foreground text-xs">
                    {level.description}
                  </small>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
