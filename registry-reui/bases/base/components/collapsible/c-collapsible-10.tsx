// Description: Tree view with file actions
// Order: 10

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent, CardHeader } from "@/registry/bases/base/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import {
  Item,
  ItemActions,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { Tabs, TabsList, TabsTrigger } from "@/registry/bases/base/ui/tabs"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] }

const fileTree: FileTreeItem[] = [
  {
    name: "components",
    items: [
      {
        name: "ui",
        items: [
          { name: "button.tsx" },
          { name: "card.tsx" },
          { name: "dialog.tsx" },
        ],
      },
      { name: "login-form.tsx" },
    ],
  },
  {
    name: "lib",
    items: [{ name: "utils.ts" }, { name: "api.ts" }],
  },
  {
    name: "hooks",
    items: [{ name: "use-debounce.ts" }, { name: "use-local-storage.ts" }],
  },
  { name: "app.tsx" },
  { name: "package.json" },
]

function TreeItem({
  item,
  level = 0,
  selectedId,
  onSelect,
}: {
  item: FileTreeItem
  level?: number
  selectedId?: string | null
  onSelect?: (name: string) => void
}) {
  const isFolder = "items" in item
  const isSelected = selectedId === item.name

  if (isFolder) {
    return (
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger
          render={
            <Item
              size="xs"
              className="hover:bg-accent data-[state=open]:bg-accent cursor-pointer py-1.5"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
            />
          }
        >
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              aria-hidden="true"
              className="text-muted-foreground size-3 transition-transform in-data-open:rotate-90"
            />
            <IconPlaceholder
              lucide="FolderIcon"
              tabler="IconFolder"
              hugeicons="FolderIcon"
              phosphor="FolderIcon"
              remixicon="RiFolderLine"
              aria-hidden="true"
              className="text-muted-foreground group-hover/item:text-foreground size-3.5"
            />
          </ItemMedia>
          <ItemTitle className="text-sm">{item.name}</ItemTitle>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden pt-0.5">
          <div className="flex flex-col gap-0.5 ps-1.5">
            {item.items.map((child) => (
              <TreeItem
                key={child.name}
                item={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Item
      className="group/item hover:bg-accent data-[active=true]:bg-accent cursor-pointer py-1.5"
      data-active={isSelected}
      style={{ paddingLeft: `${level * 12 + 9}px` }}
      onClick={() => onSelect?.(item.name)}
    >
      <ItemMedia variant="icon">
        <IconPlaceholder
          lucide="FileIcon"
          tabler="IconFile"
          hugeicons="FileEmpty02Icon"
          phosphor="FileIcon"
          remixicon="RiFileLine"
          aria-hidden="true"
          className="text-muted-foreground group-hover/item:text-foreground group-data-[active=true]/item:text-foreground size-4"
        />
      </ItemMedia>
      <ItemTitle className="text-secondary-foreground group-hover/item:text-foreground group-data-[active=true]/item:text-foreground text-sm">
        {item.name}
      </ItemTitle>
      <ItemActions className="-mr-2 ml-auto gap-0 opacity-0 transition-opacity group-hover/item:opacity-100 group-data-[active=true]/item:opacity-100">
        <Button size="icon-xs" variant="ghost">
          <IconPlaceholder
            lucide="DownloadIcon"
            tabler="IconDownload"
            hugeicons="Download01Icon"
            phosphor="DownloadSimpleIcon"
            remixicon="RiDownload2Line"
            aria-hidden="true"
          />
        </Button>
        <Button variant="ghost" size="icon-xs">
          <IconPlaceholder
            lucide="TrashIcon"
            tabler="IconTrash"
            hugeicons="DeleteIcon"
            phosphor="TrashIcon"
            remixicon="RiDeleteBinLine"
            aria-hidden="true"
          />
        </Button>
      </ItemActions>
    </Item>
  )
}

export default function Pattern() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="min-h-64 w-72">
      <Card size="sm" className="gap-1 p-1">
        <CardHeader className="p-0">
          <Tabs defaultValue="explorer">
            <TabsList className="bg-accent h-8 w-full p-1">
              <TabsTrigger value="explorer" className="text-xs">
                Explorer
              </TabsTrigger>
              <TabsTrigger value="outline" className="text-xs">
                Outline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col gap-0.5">
            {fileTree.map((item) => (
              <TreeItem
                key={item.name}
                item={item}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
