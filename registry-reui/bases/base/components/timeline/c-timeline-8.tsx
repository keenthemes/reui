// Description: Vertical timeline
// Order: 8
// GridSize: 1

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

const releaseCycle = [
  {
    id: 1,
    date: "Week 1",
    title: "Planning",
    description: "Scope definition and resource planning.",
  },
  {
    id: 2,
    date: "Week 2",
    title: "Design",
    description: "UI/UX design and prototyping.",
  },
  {
    id: 3,
    date: "Week 4",
    title: "Development",
    description: "Core features implementation.",
  },
]

export default function Pattern() {
  return (
    <Timeline
      defaultValue={2}
      orientation="horizontal"
      className="w-full max-w-xl"
    >
      {releaseCycle.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
