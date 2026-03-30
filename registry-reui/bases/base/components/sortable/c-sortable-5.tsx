// Description: Sortable settings priority with frame
// Order: 5
// GridSize: 1

"use client"

import { useState } from "react"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/registry-reui/bases/base/reui/sortable"

import { Switch } from "@/registry/bases/base/ui/switch"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface NotificationChannel {
  id: string
  name: string
  description: string
  enabled: boolean
}

const defaultChannels: NotificationChannel[] = [
  {
    id: "1",
    name: "Email",
    description: "Send notifications via email",
    enabled: true,
  },
  {
    id: "2",
    name: "Push Notifications",
    description: "Browser and mobile push",
    enabled: true,
  },
  { id: "3", name: "SMS", description: "Text message alerts", enabled: false },
  {
    id: "4",
    name: "Slack",
    description: "Post to Slack channels",
    enabled: true,
  },
  {
    id: "5",
    name: "Webhook",
    description: "Send to custom endpoint",
    enabled: false,
  },
]

export default function Pattern() {
  const [channels, setChannels] =
    useState<NotificationChannel[]>(defaultChannels)

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, enabled: !ch.enabled } : ch))
    )
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Frame spacing="sm">
        <FrameHeader>
          <FrameTitle>Notification Priority</FrameTitle>
          <FrameDescription>
            Drag to reorder by priority. Top channels are tried first.
          </FrameDescription>
        </FrameHeader>
        <Sortable
          value={channels}
          onValueChange={setChannels}
          getItemValue={(item) => item.id}
          strategy="vertical"
          className="space-y-1"
        >
          {channels.map((channel) => (
            <SortableItem key={channel.id} value={channel.id}>
              <FramePanel className="p-0!">
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground">
                    <IconPlaceholder
                      lucide="GripVerticalIcon"
                      tabler="IconGripVertical"
                      hugeicons="DragDropVerticalIcon"
                      phosphor="DotsSixVerticalIcon"
                      remixicon="RiDraggable"
                      className="size-4"
                    />
                  </SortableItemHandle>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{channel.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {channel.description}
                    </p>
                  </div>
                  <Switch
                    checked={channel.enabled}
                    onCheckedChange={() => toggleChannel(channel.id)}
                  />
                </div>
              </FramePanel>
            </SortableItem>
          ))}
        </Sortable>
      </Frame>
    </div>
  )
}
