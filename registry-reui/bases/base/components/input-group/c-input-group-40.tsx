// Description: Share link input with visibility selector and copy action
// Order: 40

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

const visibilityOptions = ["Private", "Team", "Public"]

export default function Pattern() {
  const [visibility, setVisibility] = useState(visibilityOptions[0])

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconPlaceholder
            lucide="LinkIcon"
            tabler="IconLink"
            hugeicons="Link01Icon"
            phosphor="LinkIcon"
            remixicon="RiLinkM"
            className="size-4 opacity-60"
            aria-hidden="true"
          />
        </InputGroupAddon>

        <InputGroupInput
          defaultValue="agentflow.ai/runbooks/q2-review"
          aria-label="Share link"
        />

        <InputGroupAddon align="inline-end" className="gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  size="xs"
                  className="gap-1.5"
                  aria-label="Select visibility"
                />
              }
            >
              {visibility}
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
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuGroup>
                {visibilityOptions.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onSelect={() => setVisibility(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            aria-label="Copy link"
          >
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="CopyIcon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
              aria-hidden="true"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
