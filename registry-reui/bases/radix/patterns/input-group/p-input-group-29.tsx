// Description: Pill-shaped input group with a category dropdown at the end
// Order: 29

"use client"

import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { Field } from "@/registry/bases/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/radix/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [category, setCategory] = useState("Category")

  return (
    <Field className="max-w-xs">
      <InputGroup className="rounded-full">
        <InputGroupInput
          placeholder="Search products"
          className="rounded-full px-5"
        />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                className="h-7 rounded-full px-3 text-xs"
              >
                {category}
                <IconPlaceholder
                  lucide="ChevronDownIcon"
                  tabler="IconChevronDown"
                  hugeicons="ArrowDown01Icon"
                  phosphor="CaretDownIcon"
                  remixicon="RiArrowDownSLine"
                  className="ml-1 size-3.5 opacity-60"
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => setCategory("Electronics")}>
                Electronics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("Clothing")}>
                Clothing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("Home")}>
                Home
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
