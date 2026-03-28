// Description: A combobox with a large list of options
// Order: 8

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/bases/base/ui/combobox"
import { Field } from "@/registry/bases/base/ui/field"

const largeListItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Combobox items={largeListItems}>
        <ComboboxInput placeholder="Search from 100 items" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
