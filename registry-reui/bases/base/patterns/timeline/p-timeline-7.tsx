// Description: Timeline with roadmap items.
// Order: 7
// GridSize: 1

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@/registry-reui/bases/base/reui/timeline"

import { cn } from "@/registry/bases/base/lib/utils"

const roadmapItems = [
  {
    date: "Dec 15, 2025",
    content: (
      <>
        <span className="text-muted-foreground">Completed</span> Beta Program
      </>
    ),
    color: "bg-emerald-500",
  },
  {
    date: "Nov 01, 2025",
    content: (
      <>
        <span className="text-muted-foreground">Completed</span> Usability
        Testing
      </>
    ),
    color: "bg-violet-500",
  },
  {
    date: "Oct 15, 2025",
    content: (
      <>
        <span className="text-muted-foreground">Initiated</span> Design Phase
      </>
    ),
    color: "bg-fuchsia-500",
  },
  {
    date: "Aug 01, 2024",
    content: (
      <>
        <span className="text-muted-foreground">Completed</span> Requirements
        Gathering
      </>
    ),
    color: "bg-blue-500",
  },
  {
    date: "Jul 15, 2024",
    content: (
      <>
        <span className="text-muted-foreground">Started</span> Project Kickoff
      </>
    ),
    color: "bg-red-500",
  },
]

export default function Pattern() {
  return (
    <div className="w-full max-w-xs">
      <Timeline defaultValue={0} className="gap-2.5">
        {roadmapItems.map((item, index) => (
          <TimelineItem
            key={index}
            step={index + 1}
            className="has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-foreground/20 group-data-[orientation=vertical]/timeline:not-last:pb-0"
          >
            <TimelineHeader className="flex items-center gap-2.5">
              <TimelineSeparator className="" />
              <TimelineIndicator
                className={cn("size-2 border-none", item.color)}
              />
              <TimelineDate className="text-muted-foreground/60 mb-0 text-[10px] font-semibold uppercase">
                {item.date}
              </TimelineDate>
            </TimelineHeader>
            <TimelineContent className="text-foreground text-sm font-medium">
              {item.content}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
