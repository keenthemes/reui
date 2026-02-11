// Description: File search command palette
// Order: 5

"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/bases/base/ui/command"
import { Kbd } from "@/registry/bases/base/ui/kbd"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const files = [
  { name: "page.tsx", path: "src/app/page.tsx", type: "tsx" },
  { name: "layout.tsx", path: "src/app/layout.tsx", type: "tsx" },
  { name: "globals.css", path: "src/styles/globals.css", type: "css" },
  { name: "utils.ts", path: "src/lib/utils.ts", type: "ts" },
  { name: "api.ts", path: "src/lib/api.ts", type: "ts" },
  { name: "button.tsx", path: "src/components/ui/button.tsx", type: "tsx" },
  { name: "package.json", path: "package.json", type: "json" },
  { name: "README.md", path: "README.md", type: "md" },
]

export default function Pattern() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" className="w-52">
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="Search01Icon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
          className="size-4"
        />
        Search files...
        <Kbd className="ml-auto">⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder="Search files by name..." />
          <CommandList>
            <CommandEmpty>No files found.</CommandEmpty>
            <CommandGroup heading="Files">
              {files.map((file) => (
                <CommandItem key={file.path} className="gap-2.5">
                  <IconPlaceholder
                    lucide="FileIcon"
                    tabler="IconFile"
                    hugeicons="FileEmpty02Icon"
                    phosphor="FileIcon"
                    remixicon="RiFileLine"
                    className="size-4 shrink-0"
                  />
                  <div className="flex flex-1 items-center gap-2">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {file.path}
                    </span>
                  </div>
                  <div className="ml-auto" data-slot="command-shortcut">
                    <Badge variant="outline" size="sm">
                      {file.type}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
