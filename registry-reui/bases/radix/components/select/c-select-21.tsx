// Description: Select with clear button
// Order: 21

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Field } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "svelte", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export default function Pattern() {
  const [value, setValue] = useState("")

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setValue("")
  }

  return (
    <Field className="max-w-xs">
      <Select key={value || "__empty__"} value={value} onValueChange={setValue}>
        <SelectTrigger
          className={cn(value !== "" && "[&>svg:last-child]:hidden!")}
        >
          <SelectValue placeholder="Select framework" />
          {value !== "" ? (
            <div
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              onPointerDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            >
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="MultiplicationSignIcon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
                className="size-4"
              />
              <span className="sr-only">Clear selection</span>
            </div>
          ) : null}
        </SelectTrigger>
        <SelectContent position="popper">
          {frameworks.map((framework) => (
            <SelectItem key={framework.value} value={framework.value}>
              {framework.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
