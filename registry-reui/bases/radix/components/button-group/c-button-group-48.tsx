// Description: Toolbar filter with export and view toggle
// Order: 48

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/registry/bases/radix/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const icons = {
  filter: (
    <IconPlaceholder
      lucide="ListFilterIcon"
      tabler="IconFilter"
      hugeicons="FilterIcon"
      phosphor="FunnelIcon"
      remixicon="RiFilterLine"
      aria-hidden="true"
    />
  ),
  download: (
    <IconPlaceholder
      lucide="DownloadIcon"
      tabler="IconDownload"
      hugeicons="Download01Icon"
      phosphor="DownloadSimpleIcon"
      remixicon="RiDownloadLine"
      aria-hidden="true"
    />
  ),
  chevronDown: (
    <IconPlaceholder
      lucide="ChevronDownIcon"
      tabler="IconChevronDown"
      hugeicons="ArrowDown01Icon"
      phosphor="CaretDownIcon"
      remixicon="RiArrowDownSLine"
      aria-hidden="true"
    />
  ),
  grid: (
    <IconPlaceholder
      lucide="LayoutGridIcon"
      tabler="IconLayoutGrid"
      hugeicons="GridViewIcon"
      phosphor="SquaresFourIcon"
      remixicon="RiGalleryView2"
      aria-hidden="true"
    />
  ),
  list: (
    <IconPlaceholder
      lucide="ListIcon"
      tabler="IconList"
      hugeicons="Menu01Icon"
      phosphor="ListIcon"
      remixicon="RiListUnordered"
      aria-hidden="true"
    />
  ),
  fileSpreadsheet: (
    <IconPlaceholder
      lucide="FileSpreadsheetIcon"
      tabler="IconFileSpreadsheet"
      hugeicons="GoogleSpreadsheetIcon"
      phosphor="FileXlsIcon"
      remixicon="RiFileExcel2Line"
      aria-hidden="true"
    />
  ),
  fileJson: (
    <IconPlaceholder
      lucide="FileJsonIcon"
      tabler="IconFileTypeJson"
      hugeicons="FileJsonIcon"
      phosphor="FilejsIcon"
      remixicon="RiFileCodeLine"
      aria-hidden="true"
    />
  ),
  filePdf: (
    <IconPlaceholder
      lucide="FileTextIcon"
      tabler="IconFileTypePdf"
      hugeicons="FilePdf01Icon"
      phosphor="FilePdfIcon"
      remixicon="RiFilePdf2Line"
      aria-hidden="true"
    />
  ),
}

export default function Pattern() {
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <ButtonGroup>
      <Button variant="outline">
        {icons.filter}
        Filter
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline">
        {icons.download}
        Export CSV
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="More export options"
          >
            {icons.chevronDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.fileSpreadsheet}
              Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.fileJson}
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.filePdf}
              Export PDF
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="icon"
        aria-label="Grid view"
        className={cn(view === "grid" ? "bg-muted" : "")}
        onClick={() => setView("grid")}
      >
        {icons.grid}
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="List view"
        className={cn(view === "list" ? "bg-muted" : "")}
        onClick={() => setView("list")}
      >
        {icons.list}
      </Button>
    </ButtonGroup>
  )
}
