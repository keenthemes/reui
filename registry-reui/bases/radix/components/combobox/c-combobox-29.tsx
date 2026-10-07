"use client"

import * as React from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/radix/ui/combobox"
import { Field } from "@/registry/bases/radix/ui/field"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export default function Pattern() {
  const [value, setValue] = React.useState<string | null>(frameworks[0])

  return (
    <Field className="max-w-xs">
      <Combobox
        items={frameworks}
        value={value}
        onValueChange={setValue}
      >
        <ComboboxTrigger
          clearable
          clearAriaLabel="Clear framework"
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
            />
          }
        >
          <ComboboxValue placeholder="Select a framework">
            {value ?? <span className="text-muted-foreground">Select a framework</span>}
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput showTrigger={false} placeholder="Search framework..." />
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
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
