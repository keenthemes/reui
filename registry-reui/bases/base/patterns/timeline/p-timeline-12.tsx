// Description: Compact horizontal milestone timeline
// Order: 12
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/registry-reui/bases/base/reui/timeline"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const releases = [
  {
    id: 1,
    version: "v1.0",
    date: "Jan 2025",
    title: "Initial Release",
    status: "released",
  },
  {
    id: 2,
    version: "v1.1",
    date: "Mar 2025",
    title: "Bug Fixes",
    status: "released",
  },
  {
    id: 3,
    version: "v2.0",
    date: "Jun 2025",
    title: "Major Update",
    status: "current",
  },
  {
    id: 4,
    version: "v2.1",
    date: "Sep 2025",
    title: "Improvements",
    status: "upcoming",
  },
]

export default function Pattern() {
  return (
    <Timeline
      defaultValue={3}
      orientation="horizontal"
      className="w-full max-w-xl"
    >
      {releases.map((release) => (
        <TimelineItem key={release.id} step={release.id}>
          <TimelineHeader>
            <TimelineSeparator className="bg-input! group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-2.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-2.25rem)]" />
            <TimelineDate>{release.date}</TimelineDate>
            <TimelineTitle className="flex items-center gap-2">
              {release.version}
              {release.status === "current" && (
                <Badge variant="primary-light" size="sm">
                  Current
                </Badge>
              )}
            </TimelineTitle>
            <TimelineIndicator
              className={cn(
                "flex size-6 items-center justify-center border-none",
                release.status === "released" && "bg-emerald-500 text-white",
                release.status === "current" &&
                  "bg-primary text-primary-foreground",
                release.status === "upcoming" &&
                  "bg-muted text-muted-foreground"
              )}
            >
              {release.status === "released" ? (
                <IconPlaceholder
                  lucide="CheckIcon"
                  tabler="IconCheck"
                  hugeicons="Tick02Icon"
                  phosphor="CheckIcon"
                  remixicon="RiCheckLine"
                  className="size-3.5"
                />
              ) : release.status === "current" ? (
                <IconPlaceholder
                  lucide="PlayIcon"
                  tabler="IconPlayerPlay"
                  hugeicons="PlayIcon"
                  phosphor="PlayIcon"
                  remixicon="RiPlayLine"
                  className="size-3"
                />
              ) : (
                <IconPlaceholder
                  lucide="CircleIcon"
                  tabler="IconCircle"
                  hugeicons="CircleIcon"
                  phosphor="CircleIcon"
                  remixicon="RiCircleLine"
                  className="size-3"
                />
              )}
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent className="text-xs">{release.title}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
