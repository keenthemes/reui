// Description: Button group with dropdown menu and view toggle
// Order: 32

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [view, setView] = useState<"grid" | "list">("list")

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="icon" aria-label="Sort" />}
        >
          <IconPlaceholder
            lucide="ListFilterIcon"
            tabler="IconFilter2"
            hugeicons="FilterMailIcon"
            phosphor="FunnelSimpleIcon"
            remixicon="RiFilter3Line"
            className="..."
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          <DropdownMenuItem>Newest</DropdownMenuItem>
          <DropdownMenuItem>Oldest</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Recently Updated</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          className={cn(view === "grid" && "bg-muted")}
          onClick={() => setView("grid")}
          aria-label="Grid view"
        >
          <IconPlaceholder
            lucide="LayoutGridIcon"
            tabler="IconLayoutGrid"
            hugeicons="GridViewIcon"
            phosphor="SquaresFourIcon"
            remixicon="RiGalleryView2"
            aria-hidden="true"
          />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(view === "list" && "bg-muted")}
          onClick={() => setView("list")}
          aria-label="List view"
        >
          <IconPlaceholder
            lucide="ListIcon"
            tabler="IconList"
            hugeicons="Menu01Icon"
            phosphor="ListIcon"
            remixicon="RiListUnordered"
            aria-hidden="true"
          />
        </Button>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button />}>
          Add New...
          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconChevronDown"
            hugeicons="ArrowDown01Icon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
            aria-hidden="true"
            className="opacity-60"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              aria-hidden="true"
            />
            Project
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              aria-hidden="true"
            />
            Domain
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              aria-hidden="true"
            />
            Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
