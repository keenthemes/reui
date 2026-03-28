// Description: Select component in an invalid state
// Order: 9

import { Field, FieldError, FieldLabel } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"

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
      <Select>
        <SelectTrigger id="select-fruit-invalid" aria-invalid>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value as string}>
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
