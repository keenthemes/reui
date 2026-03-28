// Description: Select component in an invalid state
// Order: 9

import { Field, FieldError, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const items = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="select-fruit-invalid">Favorite Fruit</FieldLabel>
      <Select items={items}>
        <SelectTrigger id="select-fruit-invalid" aria-invalid>
          <SelectValue />
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
      <FieldError errors={[{ message: "Please select a valid fruit." }]} />
    </Field>
  )
}
