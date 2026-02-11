// Description: A combobox used within a form
// Order: 11

"use client"

import { FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/bases/base/ui/combobox"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export default function Pattern() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const framework = formData.get("framework") as string
    toast(`You selected ${framework} as your framework.`)
  }

  return (
    <form
      id="form-with-combobox"
      onSubmit={handleSubmit}
      className="w-full max-w-xs space-y-4"
    >
      <Field>
        <FieldLabel htmlFor="framework">Framework</FieldLabel>
        <Combobox items={frameworks}>
          <ComboboxInput
            id="framework"
            name="framework"
            placeholder="Select a framework"
            required
          />
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
      <Button type="submit" form="form-with-combobox" className="w-full">
        Submit
      </Button>
    </form>
  )
}
