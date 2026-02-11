// Description: Sortable list of items with nested layout
// Order: 3
// GridSize: 1

"use client"

import { useState } from "react"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/registry-reui/bases/base/reui/sortable"
import { toast } from "sonner"

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface OptionValue {
  id: string
  value: string
}

interface OptionGroup {
  id: string
  name: string
  values: OptionValue[]
}

const defaultOptionGroups: OptionGroup[] = [
  {
    id: "1",
    name: "Colors",
    values: [
      { id: "1-1", value: "White" },
      { id: "1-2", value: "Black" },
      { id: "1-3", value: "Grey" },
      { id: "1-4", value: "Green" },
    ],
  },
  {
    id: "2",
    name: "Sizes",
    values: [
      { id: "2-1", value: "Small" },
      { id: "2-2", value: "Medium" },
      { id: "2-3", value: "Large" },
    ],
  },
  {
    id: "3",
    name: "Materials",
    values: [
      { id: "3-1", value: "Cotton" },
      { id: "3-2", value: "Polyester" },
      { id: "3-3", value: "Wool" },
    ],
  },
]

export default function Pattern() {
  const [optionGroups, setOptionGroups] =
    useState<OptionGroup[]>(defaultOptionGroups)

  const handleParentReorder = (newGroups: OptionGroup[]) => {
    setOptionGroups(newGroups)

    toast.success("Option groups reordered successfully!", {
      description: `${newGroups.map((group, index) => `${index + 1}. ${group.name}`).join(", ")}`,
    })
  }

  const getParentValue = (group: OptionGroup) => group.id
  const getChildValue = (value: OptionValue) => value.id

  const handleChildReorder = (groupId: string, newValues: OptionValue[]) => {
    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, values: newValues } : group
      )
    )

    toast.success("Values reordered successfully!", {
      description: newValues
        .map((value, index) => `${index + 1}. ${value.value}`)
        .join(", "),
    })
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6 p-6">
      <Sortable
        value={optionGroups}
        onValueChange={handleParentReorder}
        getItemValue={getParentValue}
        strategy="vertical"
        className="space-y-4"
      >
        {optionGroups.map((group) => (
          <SortableItem key={group.id} value={group.id}>
            <Card className="p-2">
              <CardContent className="p-0">
                {/* Group Header */}
                <div className="mb-2 flex items-center gap-2">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground cursor-grab">
                    <IconPlaceholder
                      lucide="GripVerticalIcon"
                      tabler="IconGripVertical"
                      hugeicons="DragDropVerticalIcon"
                      phosphor="DotsSixVerticalIcon"
                      remixicon="RiDraggable"
                      className="h-4 w-4"
                    />
                  </SortableItemHandle>
                  <h3 className="text-sm font-semibold">{group.name}</h3>
                </div>

                {/* Option Values - Child Level */}
                <Sortable
                  value={group.values}
                  onValueChange={(newValues) =>
                    handleChildReorder(group.id, newValues)
                  }
                  getItemValue={getChildValue}
                  strategy="vertical"
                  className="space-y-2"
                >
                  {group.values.map((value) => (
                    <SortableItem key={value.id} value={value.id}>
                      <div className="border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex items-center gap-2 border p-1.5">
                        <SortableItemHandle className="text-muted-foreground hover:text-foreground cursor-grab">
                          <IconPlaceholder
                            lucide="GripVerticalIcon"
                            tabler="IconGripVertical"
                            hugeicons="DragDropVerticalIcon"
                            phosphor="DotsSixVerticalIcon"
                            remixicon="RiDraggable"
                            className="h-4 w-4"
                          />
                        </SortableItemHandle>
                        <span className="flex-1 text-sm">{value.value}</span>
                      </div>
                    </SortableItem>
                  ))}
                </Sortable>
              </CardContent>
            </Card>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  )
}
