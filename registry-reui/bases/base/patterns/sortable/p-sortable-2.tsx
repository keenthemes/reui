// Description: Sortable list of items with grid layout
// Order: 2
// GridSize: 1

"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/registry-reui/bases/base/reui/sortable"
import { toast } from "sonner"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface GridItem {
  id: string
  title: string
  description: string
  type: "image" | "document" | "audio" | "video" | "featured"
  size: string
  priority: "high" | "medium" | "low"
}

const defaultGridItems: GridItem[] = [
  {
    id: "1",
    title: "Hero Image",
    description: "Main banner image",
    type: "image",
    size: "2.4 MB",
    priority: "high",
  },
  {
    id: "2",
    title: "Product Specs",
    description: "Technical documentation",
    type: "document",
    size: "1.2 MB",
    priority: "medium",
  },
  {
    id: "3",
    title: "Demo Video",
    description: "Product demonstration",
    type: "video",
    size: "15.7 MB",
    priority: "high",
  },
  {
    id: "4",
    title: "Audio Guide",
    description: "Voice instructions",
    type: "audio",
    size: "8.3 MB",
    priority: "low",
  },
  {
    id: "5",
    title: "Gallery Photo 1",
    description: "Product view 1",
    type: "image",
    size: "3.1 MB",
    priority: "medium",
  },
  {
    id: "6",
    title: "Gallery Photo 2",
    description: "Product view 2",
    type: "image",
    size: "2.8 MB",
    priority: "medium",
  },
  {
    id: "7",
    title: "User Manual",
    description: "Installation guide",
    type: "document",
    size: "4.2 MB",
    priority: "high",
  },
  {
    id: "8",
    title: "Background Music",
    description: "Ambient soundtrack",
    type: "audio",
    size: "12.1 MB",
    priority: "low",
  },
  {
    id: "9",
    title: "Feature Highlight",
    description: "Key product features",
    type: "featured",
    size: "N/A",
    priority: "high",
  },
]

const getTypeColor = (type: GridItem["type"]) => {
  switch (type) {
    case "image":
      return "primary-light"
    case "document":
      return "success-light"
    case "audio":
      return "destructive-light"
    case "video":
      return "info-light"
    case "featured":
      return "warning-light"
  }
}

const getItemSize = (type: GridItem["type"]) => {
  switch (type) {
    case "featured":
      return "col-span-2 row-span-2"
    case "image":
    case "video":
      return "col-span-1 row-span-1"
    case "document":
    case "audio":
      return "col-span-1 row-span-1"
    default:
      return "col-span-1 row-span-1"
  }
}

export default function Pattern() {
  const [items, setItems] = useState<GridItem[]>(defaultGridItems)

  const handleValueChange = (newItems: GridItem[]) => {
    setItems(newItems)

    // Show toast with new order
    toast.success("Grid items reordered successfully!", {
      description: `New order: ${newItems.map((item, index) => `${index + 1}. ${item.title}`).join(", ")}`,
    })
  }

  const getItemValue = (item: GridItem) => item.id

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4">
      <Sortable
        value={items}
        onValueChange={handleValueChange}
        getItemValue={getItemValue}
        strategy="grid"
        className="grid auto-rows-fr grid-cols-3 gap-3"
      >
        {items.map((item) => (
          <SortableItem key={item.id} value={item.id}>
            <div
              className={cn(
                "group bg-background border-border hover:bg-accent/50 style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md relative cursor-pointer border p-3 transition-colors",
                getItemSize(item.type),
                "flex min-h-[100px] flex-col"
              )}
              onClick={() => {}}
            >
              <SortableItemHandle className="text-muted-foreground hover:text-foreground absolute end-1.5 top-2.5 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <IconPlaceholder
                  lucide="GripVerticalIcon"
                  tabler="IconGripVertical"
                  hugeicons="DragDropVerticalIcon"
                  phosphor="DotsSixVerticalIcon"
                  remixicon="RiDraggable"
                  className="h-3.5 w-3.5"
                />
              </SortableItemHandle>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium">{item.title}</h4>
                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                  {item.description}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <Badge variant={getTypeColor(item.type)} size="sm">
                  {item.type}
                </Badge>
                {item.type !== "featured" && (
                  <span className="text-muted-foreground text-xs">
                    {item.size}
                  </span>
                )}
              </div>
            </div>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  )
}
