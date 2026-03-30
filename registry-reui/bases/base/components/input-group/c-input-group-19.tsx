// Description: AI Chat interface with file and context attachments
// Order: 19

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
  InputGroupTextarea,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [model, setModel] = useState("GPT-4o")

  return (
    <Field className="max-w-xs">
      <InputGroup className="bg-background">
        <InputGroupAddon align="block-start" className="gap-2 px-3 pt-3">
          <InputGroupButton variant="outline" size="icon-xs">
            <IconPlaceholder
              lucide="AtSignIcon"
              tabler="IconAt"
              hugeicons="AtIcon"
              phosphor="AtIcon"
              remixicon="RiAtLine"
              className="size-3.5"
            />
          </InputGroupButton>
          <InputGroupButton variant="outline">
            <IconPlaceholder
              lucide="PaperclipIcon"
              tabler="IconPaperclip"
              hugeicons="Attachment02Icon"
              phosphor="PaperclipIcon"
              remixicon="RiAttachment2"
              className="size-3.5 not-only:rotate-45"
            />
            1
          </InputGroupButton>
          <InputGroupButton variant="outline">
            <IconPlaceholder
              lucide="FileTextIcon"
              tabler="IconFileText"
              hugeicons="File02Icon"
              phosphor="FileTextIcon"
              remixicon="RiFileTextLine"
              className="size-3.5 not-only:rotate-45"
            />
            1 Tab
          </InputGroupButton>
        </InputGroupAddon>

        <InputGroupTextarea
          placeholder="Plan, search, build anything"
          className="min-h-24 border-none py-4 shadow-none focus-visible:ring-0"
        />

        <InputGroupAddon align="block-end" className="px-3 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<InputGroupButton variant="secondary" size="sm" />}
            >
              {model}
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setModel("GPT-4o")}>
                GPT-4o
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModel("Claude 3.5 Sonnet")}>
                Claude 3.5 Sonnet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-2">
            <InputGroupButton variant="secondary" size="icon-sm">
              <IconPlaceholder
                lucide="ImageIcon"
                tabler="IconPhoto"
                hugeicons="ImageIcon"
                phosphor="ImageIcon"
                remixicon="RiImageLine"
                className="text-muted-foreground"
              />
            </InputGroupButton>
            <InputGroupButton variant="default" size="icon-sm">
              <IconPlaceholder
                lucide="CornerDownLeftIcon"
                tabler="IconCornerDownLeft"
                hugeicons="ArrowMoveDownLeftIcon"
                phosphor="ArrowBendDownLeftIcon"
                remixicon="RiCornerDownLeftLine"
              />
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
