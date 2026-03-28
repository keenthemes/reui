// Description: Order search input with status filter
// Order: 37

"use client"

import { useState } from "react"

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { Label } from "@/registry/bases/base/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { IconPlaceholder } from "@/app/(create)/customizer/icon-placeholder"

const statuses = ["Pending", "Shipped", "Cancelled"] as const

type Status = (typeof statuses)[number]

function toggleStatus(values: Status[], value: Status) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

export default function Pattern() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])

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
          placeholder="Search orders..."
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
            <PopoverTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  size="xs"
                  className="gap-1.5"
                  aria-label="Filter order status"
                />
              }
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
              Status
              {selectedStatuses.length > 0 ? (
                <span className="text-muted-foreground tabular-nums">
                  {selectedStatuses.length}
                </span>
              ) : null}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-3">
              <div className="flex flex-col gap-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`order-status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((previous) =>
                          toggleStatus(previous, status)
                        )
                      }
                    />
                    <Label
                      htmlFor={`order-status-${status}`}
                      className="text-sm font-normal"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
