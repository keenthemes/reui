// Description: Feature roadmap kanban with progress
// Order: 5
// GridSize: 1

"use client"

import { ComponentProps, useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/registry-reui/bases/base/reui/kanban"

import { cn } from "@/registry/bases/base/lib/utils"
import { Progress } from "@/registry/bases/base/ui/progress"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface Feature {
  id: string
  title: string
  description: string
  progress: number
  votes: number
}

const COLUMNS: Record<string, { title: string; color: string }> = {
  planned: { title: "Planned", color: "bg-blue-500" },
  building: { title: "Building", color: "bg-yellow-500" },
  testing: { title: "Testing", color: "bg-purple-500" },
  shipped: { title: "Shipped", color: "bg-green-500" },
}

function FeatureCard({
  feature,
  asHandle,
  ...props
}: { feature: Feature; asHandle?: boolean } & Omit<
  ComponentProps<typeof KanbanItem>,
  "value" | "children"
>) {
  const content = (
    <Frame variant="ghost" spacing="sm" className="p-0">
      <FramePanel className="p-3">
        <div className="flex flex-col gap-2.5">
          <span className="text-sm font-medium">{feature.title}</span>
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {feature.description}
          </p>
          <Progress value={feature.progress} className="h-1.5" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[10px] tabular-nums">
              {feature.progress}% complete
            </span>
            <div className="flex items-center gap-1">
              <IconPlaceholder
                lucide="ArrowUpIcon"
                tabler="IconArrowUp"
                hugeicons="ArrowUp02Icon"
                phosphor="ArrowUpIcon"
                remixicon="RiArrowUpLine"
                className="text-muted-foreground size-3"
              />
              <span className="text-muted-foreground text-xs tabular-nums">
                {feature.votes}
              </span>
            </div>
          </div>
        </div>
      </FramePanel>
    </Frame>
  )

  return (
    <KanbanItem value={feature.id} {...props}>
      {asHandle ? <KanbanItemHandle>{content}</KanbanItemHandle> : content}
    </KanbanItem>
  )
}

export default function Pattern() {
  const [columns, setColumns] = useState<Record<string, Feature[]>>({
    planned: [
      {
        id: "f1",
        title: "AI-powered search",
        description: "Natural language search across all content",
        progress: 0,
        votes: 142,
      },
      {
        id: "f2",
        title: "Custom webhooks",
        description: "User-configurable webhook endpoints",
        progress: 0,
        votes: 98,
      },
    ],
    building: [
      {
        id: "f3",
        title: "Real-time collaboration",
        description: "Multi-user editing with presence indicators",
        progress: 65,
        votes: 234,
      },
      {
        id: "f4",
        title: "API v2 migration",
        description: "RESTful API with OpenAPI 3.0 spec",
        progress: 40,
        votes: 176,
      },
    ],
    shipped: [
      {
        id: "f6",
        title: "Dark mode",
        description: "System-aware theme with manual override",
        progress: 100,
        votes: 456,
      },
      {
        id: "f7",
        title: "Export to CSV",
        description: "Bulk data export with custom fields",
        progress: 100,
        votes: 189,
      },
    ],
  })

  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className="grid grid-cols-3">
        {Object.entries(columns).map(([colId, features]) => {
          const col = COLUMNS[colId]
          return (
            <KanbanColumn key={colId} value={colId}>
              <Frame spacing="sm" className="h-full">
                <FrameHeader className="flex flex-row items-center gap-2">
                  <div className={cn("size-2 rounded-full", col.color)} />
                  <FrameTitle className="capitalize">{col.title}</FrameTitle>
                  <Badge variant="outline" size="sm" className="ml-auto">
                    {features.length}
                  </Badge>
                </FrameHeader>
                <KanbanColumnContent
                  value={colId}
                  className="flex flex-col gap-2 p-0.5"
                >
                  {features.map((feature) => (
                    <FeatureCard key={feature.id} feature={feature} asHandle />
                  ))}
                </KanbanColumnContent>
              </Frame>
            </KanbanColumn>
          )
        })}
      </KanbanBoard>
      <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
    </Kanban>
  )
}
