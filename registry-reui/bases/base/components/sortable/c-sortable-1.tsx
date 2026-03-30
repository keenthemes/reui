// Description: Sortable list of items with drag-and-drop
// Order: 1
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

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface SortableItem {
  id: string
  title: string
  description: string
  type: "image" | "document" | "audio" | "video"
  size: string
}

const defaultItems: SortableItem[] = [
  {
    id: "1",
    title: "Product Demo",
    description: "Main product image",
    type: "image",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Product Specification",
    description: "Technical details document",
    type: "document",
    size: "1.2 MB",
  },
  {
    id: "3",
    title: "Product Demo Video",
    description: "How to use the product",
    type: "video",
    size: "15.7 MB",
  },
  {
    id: "4",
    title: "Product Audio Guide",
    description: "Audio instructions",
    type: "audio",
    size: "8.3 MB",
  },
  {
    id: "5",
    title: "Product Specification",
    description: "Additional product view",
    type: "image",
    size: "3.1 MB",
  },
]

const getTypeIcon = (type: SortableItem["type"]) => {
  switch (type) {
    case "image":
      return (
        <IconPlaceholder
          lucide="ImageIcon"
          tabler="IconPhoto"
          hugeicons="ImageIcon"
          phosphor="ImageIcon"
          remixicon="RiImageLine"
          className="h-4 w-4"
        />
      )
    case "document":
      return (
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="File02Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
          className="h-4 w-4"
        />
      )
    case "audio":
      return (
        <IconPlaceholder
          lucide="MusicIcon"
          tabler="IconMusic"
          hugeicons="MusicNote03Icon"
          phosphor="MusicNotesIcon"
          remixicon="RiMusic2Line"
          className="h-4 w-4"
        />
      )
    case "video":
      return (
        <IconPlaceholder
          lucide="VideoIcon"
          tabler="IconVideo"
          hugeicons="Video02Icon"
          phosphor="VideoCameraIcon"
          remixicon="RiVideoOnLine"
          className="h-4 w-4"
        />
      )
  }
}

const getTypeColor = (type: SortableItem["type"]) => {
  switch (type) {
    case "image":
      return "primary-light"
    case "document":
      return "success-light"
    case "audio":
      return "destructive-light"
    case "video":
      return "info-light"
  }
}

export default function Pattern() {
  const [items, setItems] = useState<SortableItem[]>(defaultItems)

  const handleValueChange = (newItems: SortableItem[]) => {
    setItems(newItems)

    // Show toast with new order
    toast.success("Items reordered successfully!", {
      description: newItems
        .map((item, index) => `${index + 1}. ${item.title}`)
        .join(", "),
    })
  }

  const getItemValue = (item: SortableItem) => item.id

  return (
    <div className="mx-auto w-full max-w-xl space-y-8 p-6">
      <Sortable
        value={items}
        onValueChange={handleValueChange}
        getItemValue={getItemValue}
        strategy="vertical"
        className="space-y-2"
      >
        {items.map((item) => (
          <SortableItem key={item.id} value={item.id}>
            <div
              className="bg-background border-border hover:bg-accent/50 style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex cursor-pointer items-center gap-3 border p-3 transition-colors"
              onClick={() => {}}
            >
              <SortableItemHandle className="text-muted-foreground hover:text-foreground">
                <IconPlaceholder
                  lucide="GripVerticalIcon"
                  tabler="IconGripVertical"
                  hugeicons="DragDropVerticalIcon"
                  phosphor="DotsSixVerticalIcon"
                  remixicon="RiDraggable"
                  className="h-4 w-4"
                />
              </SortableItemHandle>

              <div className="text-muted-foreground flex items-center gap-2">
                {getTypeIcon(item.type)}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium">{item.title}</h4>
                <p className="text-muted-foreground truncate text-xs">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={getTypeColor(item.type)}>{item.type}</Badge>
                <span className="text-muted-foreground text-xs">
                  {item.size}
                </span>
              </div>
            </div>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  )
}
