// Description: Select component with multiple selection
// Order: 12

import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Watermelon", value: "watermelon" },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select items={items} multiple defaultValue={[]}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {(value: string[]) => {
              if (value.length === 0) {
                return "Select fruits"
              }
              if (value.length === 1) {
                return items.find((item) => item.value === value[0])?.label
              }
              return `${value.length} fruits selected`
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
