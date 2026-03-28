// Description: Horizontal timeline with leading labels
// Order: 9
// GridSize: 1

"use client"

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

const projectJourney = [
  {
    id: 1,
    date: "Oct 2024",
    title: "Kickoff",
    description: "Defining project goals and core team selection.",
  },
  {
    id: 2,
    date: "Nov 2024",
    title: "Discovery",
    description: "User research and requirements gathering phase.",
  },
  {
    id: 3,
    date: "Dec 2024",
    title: "Implementation",
    description: "Core development and sprint execution.",
  },
]

export default function Pattern() {
  return (
    <Timeline
      defaultValue={2}
      orientation="horizontal"
      className="w-full max-w-xl"
    >
      {projectJourney.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=horizontal]/timeline:mt-0"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=horizontal]/timeline:top-8" />
            <TimelineDate className="mb-10">{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator className="group-data-[orientation=horizontal]/timeline:top-8" />
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
