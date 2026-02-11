// Description: Timeline with milestones.
// Order: 5
// GridSize: 1

import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/registry-reui/bases/base/reui/timeline"

import { cn } from "@/registry/bases/base/lib/utils"

const milestones = [
  {
    id: 1,
    date: "Jan 2024",
    title: "Seed Funding",
  },
  {
    id: 2,
    date: "Mar 2024",
    title: "Product MVP",
  },
  {
    id: 3,
    date: "May 2024",
    title: "First Client",
  },
  {
    id: 4,
    date: "Jul 2024",
    title: "Series A",
  },
  {
    id: 5,
    date: "Sep 2024",
    title: "Global Expansion",
  },
]

export default function Pattern() {
  return (
    <Timeline defaultValue={3} className="w-full max-w-md">
      {milestones.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className={cn(
            "w-[calc(50%-1.5rem)] odd:ms-auto even:me-auto even:text-right even:group-data-[orientation=vertical]/timeline:ms-0 even:group-data-[orientation=vertical]/timeline:me-8",
            "even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-indicator]:-right-6 even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-indicator]:left-auto",
            "even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-indicator]:translate-x-1/2 even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-separator]:-right-6",
            "even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-separator]:left-auto even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-separator]:translate-x-1/2"
          )}
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
