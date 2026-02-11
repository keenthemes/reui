// Description: Select with clear button
// Order: 21

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const frameworks = [
  { label: "Select framework", value: null },
  { value: "next", label: "Next.js" },
  { value: "svelte", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export default function Pattern() {
  const [value, setValue] = useState<string | null>(null)

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue(null)
  }

  return (
    <Field className="max-w-xs">
      <Select value={value} onValueChange={setValue} items={frameworks}>
        <SelectTrigger className={cn(value && "[&>svg:last-child]:hidden!")}>
          <SelectValue />
          {value && (
            <div
              role="button"
              onClick={handleClear}
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
          )}
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {frameworks.slice(1).map((framework) => (
            <SelectItem key={framework.value} value={framework.value}>
              {framework.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
