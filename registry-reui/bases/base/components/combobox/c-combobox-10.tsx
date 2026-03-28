// Description: A combobox rendered inside a popup
// Order: 10

import Image from "next/image"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/base/ui/combobox"
import { Field } from "@/registry/bases/base/ui/field"

const countries = [
  { code: "af", label: "Afghanistan" },
  { code: "al", label: "Albania" },
  { code: "dz", label: "Algeria" },
  { code: "as", label: "American Samoa" },
  { code: "ad", label: "Andorra" },
  { code: "ao", label: "Angola" },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Combobox
        items={countries}
        defaultValue={countries[0]}
        itemToStringValue={(item: (typeof countries)[number]) => item.label}
      >
        <ComboboxTrigger
          render={
            <Button variant="outline" className="justify-between font-normal" />
          }
        >
          <ComboboxValue>
            {(item: (typeof countries)[number]) => (
              <span className="flex items-center gap-2">
                <Image
                  src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                  alt=""
                  width={16}
                  height={16}
                  className="rounded-xs"
                />
                <span>{item.label}</span>
              </span>
            )}
          </ComboboxValue>
        </ComboboxTrigger>
        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.code} value={item}>
                <Image
                  src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                  alt=""
                  width={16}
                  height={12}
                  className="rounded-xs"
                />
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
