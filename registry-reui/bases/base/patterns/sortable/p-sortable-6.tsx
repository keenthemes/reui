// Description: Sortable sidebar navigation with frame
// Order: 6
// GridSize: 1

"use client"

import { ReactNode, useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/registry-reui/bases/base/reui/sortable"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface NavItem {
  id: string
  label: string
  icon: ReactNode
  count?: number
}

const defaultItems: NavItem[] = [
  {
    id: "1",
    label: "Dashboard",
    icon: (
      <IconPlaceholder
        lucide="LayoutDashboardIcon"
        tabler="IconLayoutDashboard"
        hugeicons="DashboardSquare02Icon"
        phosphor="LayoutIcon"
        remixicon="RiDashboardLine"
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    id: "2",
    label: "Inbox",
    icon: (
      <IconPlaceholder
        lucide="InboxIcon"
        tabler="IconInbox"
        hugeicons="InboxIcon"
        phosphor="TrayIcon"
        remixicon="RiInboxLine"
        className="text-muted-foreground size-4"
      />
    ),
    count: 5,
  },
  {
    id: "3",
    label: "Projects",
    icon: (
      <IconPlaceholder
        lucide="FolderIcon"
        tabler="IconFolder"
        hugeicons="FolderIcon"
        phosphor="FolderIcon"
        remixicon="RiFolderLine"
        className="text-muted-foreground size-4"
      />
    ),
    count: 12,
  },
  {
    id: "4",
    label: "Calendar",
    icon: (
      <IconPlaceholder
        lucide="CalendarIcon"
        tabler="IconCalendarEvent"
        hugeicons="Calendar04Icon"
        phosphor="CalendarBlankIcon"
        remixicon="RiCalendarLine"
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    id: "5",
    label: "Analytics",
    icon: (
      <IconPlaceholder
        lucide="BarChart3Icon"
        tabler="IconChartBar"
        hugeicons="ChartBarLineIcon"
        phosphor="ChartBarIcon"
        remixicon="RiBarChartBoxLine"
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    id: "6",
    label: "Settings",
    icon: (
      <IconPlaceholder
        lucide="SettingsIcon"
        tabler="IconSettings"
        hugeicons="SettingsIcon"
        phosphor="GearIcon"
        remixicon="RiSettings3Line"
        className="text-muted-foreground size-4"
      />
    ),
  },
]

export default function Pattern() {
  const [items, setItems] = useState<NavItem[]>(defaultItems)

  return (
    <div className="mx-auto w-full max-w-xs">
      <Frame spacing="xs">
        <FrameHeader>
          <FrameTitle>Navigation</FrameTitle>
        </FrameHeader>
        <FramePanel className="p-2!">
          <Sortable
            value={items}
            onValueChange={setItems}
            getItemValue={(item) => item.id}
            strategy="vertical"
            className="space-y-0.5"
          >
            {items.map((item) => (
              <SortableItem key={item.id} value={item.id}>
                <div className="hover:bg-accent flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100 [div:hover>&]:opacity-100">
                    <IconPlaceholder
                      lucide="GripVerticalIcon"
                      tabler="IconGripVertical"
                      hugeicons="DragDropVerticalIcon"
                      phosphor="DotsSixVerticalIcon"
                      remixicon="RiDraggable"
                      className="size-3.5"
                    />
                  </SortableItemHandle>
                  {item.icon}
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.count && (
                    <Badge variant="outline" size="sm" className="rounded-full">
                      {item.count}
                    </Badge>
                  )}
                </div>
              </SortableItem>
            ))}
          </Sortable>
        </FramePanel>
      </Frame>
    </div>
  )
}
