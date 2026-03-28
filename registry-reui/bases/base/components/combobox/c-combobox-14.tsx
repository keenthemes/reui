// Description: A multi-select combobox in an invalid state
// Order: 14

"use client"

import { Fragment } from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/registry/bases/base/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/registry/bases/base/ui/field"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export default function Pattern() {
  const anchor = useComboboxAnchor()

  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="combobox-multiple-invalid">Frameworks</FieldLabel>
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0], frameworks[1]]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value} showRemove={true}>
                    {value}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="combobox-multiple-invalid"
                  placeholder="Select frameworks..."
                  aria-invalid
                />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
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
      <FieldError errors={[{ message: "This field is required." }]} />
    </Field>
  )
}
