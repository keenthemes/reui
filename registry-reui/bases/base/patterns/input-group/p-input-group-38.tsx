// Description: Company search input with region selector
// Order: 38

"use client"

import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const regions = ["Global", "United States", "Europe", "APAC"]

export default function Pattern() {
  const [searchQuery, setSearchQuery] = useState("")
  const [region, setRegion] = useState(regions[0])

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
            aria-hidden="true"
          />
        </InputGroupAddon>

        <InputGroupInput
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <InputGroupAddon align="inline-end" className="gap-1">
          {searchQuery.length > 0 ? (
            <InputGroupButton
              aria-label="Clear search"
              size="icon-xs"
              variant="ghost"
              onClick={() => setSearchQuery("")}
            >
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
                aria-hidden="true"
              />
            </InputGroupButton>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  size="xs"
                  className="gap-1.5"
                  aria-label="Select region"
                />
              }
            >
              <IconPlaceholder
                lucide="GlobeIcon"
                tabler="IconWorld"
                hugeicons="Globe01Icon"
                phosphor="GlobeIcon"
                remixicon="RiGlobalLine"
                className="size-3.5"
                aria-hidden="true"
              />
              {region}
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                className="size-3 opacity-60"
                aria-hidden="true"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuGroup>
                {regions.map((item) => (
                  <DropdownMenuItem key={item} onSelect={() => setRegion(item)}>
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
