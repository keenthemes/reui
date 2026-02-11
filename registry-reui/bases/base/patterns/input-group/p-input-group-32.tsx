// Description: Member row with avatar, email and role selection
// Order: 32

"use client"

import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
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
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const roles = ["Admin", "Member", "Viewer"]

export default function Pattern() {
  const [role, setRole] = useState("Admin")

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon className="pr-1">
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </InputGroupAddon>

        <InputGroupInput defaultValue="@shadcn" className="pl-1!" />

        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton variant="ghost" className="h-7 text-xs" />
              }
            >
              {role}
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                className="size-3.5 opacity-60"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              {roles.map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
