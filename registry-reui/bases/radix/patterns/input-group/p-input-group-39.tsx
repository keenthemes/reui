// Description: Contact search input with filter and actions menu
// Order: 39

"use client"

import { useState } from "react"

import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { Label } from "@/registry/bases/radix/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const statuses = ["Active", "Lead", "Prospect"] as const

const statusCounts: Record<(typeof statuses)[number], number> = {
  Active: 12,
  Lead: 7,
  Prospect: 5,
}

export default function Pattern() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<
    (typeof statuses)[number][]
  >([])

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
          placeholder="Search contacts..."
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

          <Popover>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="xs"
                className="gap-1.5"
                aria-label="Filter contacts"
              >
                <IconPlaceholder
                  lucide="ListFilterIcon"
                  tabler="IconFilter"
                  hugeicons="FilterIcon"
                  phosphor="FunnelIcon"
                  remixicon="RiFilterLine"
                  className="size-3.5"
                  aria-hidden="true"
                />
                {selectedStatuses.length > 0 ? (
                  <span className="tabular-nums">
                    {selectedStatuses.length}
                  </span>
                ) : (
                  "Status"
                )}
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-3">
              <div className="flex flex-col gap-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`contact-status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((previous) =>
                          previous.includes(status)
                            ? previous.filter((item) => item !== status)
                            : [...previous, status]
                        )
                      }
                    />
                    <Label
                      htmlFor={`contact-status-${status}`}
                      className="flex grow items-center justify-between gap-1.5 font-normal"
                    >
                      {status}
                      <span className="text-muted-foreground text-xs">
                        {statusCounts[status]}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label="More actions"
              >
                <IconPlaceholder
                  lucide="MoreHorizontalIcon"
                  tabler="IconDots"
                  hugeicons="MoreHorizontalCircle01Icon"
                  phosphor="DotsThreeIcon"
                  remixicon="RiMoreLine"
                  aria-hidden="true"
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuGroup>
                <DropdownMenuItem>Bulk email</DropdownMenuItem>
                <DropdownMenuItem>Export CSV</DropdownMenuItem>
                <DropdownMenuItem>Add contact</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
