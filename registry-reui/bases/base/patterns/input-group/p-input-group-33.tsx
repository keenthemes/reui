// Description: Project save interface with status and action buttons
// Order: 33
// GridSize: 1

"use client"

import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [visibility, setVisibility] = useState("Personal")

  return (
    <Field className="max-w-3xl">
      <InputGroup className="bg-background h-auto items-start p-3 pl-4">
        <InputGroupAddon className="border-border bg-muted mt-1.5 inline-flex size-8 items-center justify-center rounded-md border p-0">
          <IconPlaceholder
            lucide="LayersIcon"
            tabler="IconStack2"
            hugeicons="Layers01Icon"
            phosphor="StackIcon"
            remixicon="RiStackLine"
            className="text-muted-foreground size-4"
          />
        </InputGroupAddon>

        <div className="flex flex-1 flex-col pt-2.5 pl-1">
          <InputGroupInput
            placeholder="Enter project name..."
            className="h-10 border-none text-base shadow-none focus-visible:ring-0"
          />
          <InputGroupTextarea
            placeholder="Description as multiple lines of text are supported..."
            className="text-muted-foreground min-h-16 border-none text-sm shadow-none focus-visible:ring-0"
          />
        </div>

        <InputGroupAddon align="inline-end" className="gap-2 border-none">
          <InputGroupText className="text-muted-foreground text-sm whitespace-nowrap">
            Save to
          </InputGroupText>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 font-normal"
                />
              }
            >
              <IconPlaceholder
                lucide="LockIcon"
                tabler="IconLock"
                hugeicons="SquareLock01Icon"
                phosphor="LockSimpleIcon"
                remixicon="RiLockLine"
                className="size-3.5"
              />
              {visibility}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setVisibility("Personal")}>
                Personal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVisibility("Team")}>
                Team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVisibility("Public")}>
                Public
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="bg-border mx-1 h-4 w-px self-center" />

          <InputGroupButton variant="secondary" size="sm">
            Cancel
          </InputGroupButton>
          <InputGroupButton variant="default" size="sm">
            Save
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
