import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/radix/ui/combobox"
import { Field } from "@/registry/bases/radix/ui/field"

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
        <ButtonGroup>
          <ComboboxTrigger
            render={
              <Button
                variant="outline"
                className="min-w-40 flex-1 justify-between font-normal"
              />
            }
          >
            <ComboboxValue placeholder="Select a country">
              {(item: (typeof countries)[number] | null) =>
                item ? (
                  <span className="flex items-center gap-2">
                    <img
                      src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                      alt=""
                      width={16}
                      height={16}
                      className="rounded-xs"
                    />
                    <span>{item.label}</span>
                  </span>
                ) : (
                  "Select a country"
                )
              }
            </ComboboxValue>
          </ComboboxTrigger>
          <ComboboxClear render={<Button variant="outline" size="icon" />} />
        </ButtonGroup>
        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.code} value={item}>
                <img
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
