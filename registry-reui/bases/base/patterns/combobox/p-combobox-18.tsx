// Description: A combobox with a custom trigger icon
// Order: 18

"use client"

import { useState } from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/bases/base/ui/combobox"
import { Field } from "@/registry/bases/base/ui/field"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export default function Pattern() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Field className="max-w-xs">
      <Combobox value={value} onValueChange={setValue} items={frameworks}>
        <ComboboxInput
          placeholder="Select framework"
          showTrigger={false}
          showClear={true}
        >
          {!value && (
            <ComboboxPrimitive.Trigger data-slot="combobox-trigger">
              <IconPlaceholder
                lucide="ChevronsUpDownIcon"
                tabler="IconSelector"
                hugeicons="UnfoldMoreIcon"
                phosphor="CaretUpDownIcon"
                remixicon="RiExpandUpDownLine"
                className="text-muted-foreground pointer-events-none size-4"
              />
            </ComboboxPrimitive.Trigger>
          )}
        </ComboboxInput>
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
