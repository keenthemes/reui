// Description: Timeline with git activity.
// Order: 4
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

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const gitActivity = [
  {
    id: 1,
    date: "15 minutes ago",
    title: "Forked Repository",
    description:
      "Forked the repository to create a new branch for development.",
    icon: (
      <IconPlaceholder
        lucide="GitForkIcon"
        tabler="IconGitFork"
        hugeicons="GitForkIcon"
        phosphor="GitForkIcon"
        remixicon="RiGitForkLine"
        className="size-4"
      />
    ),
  },
  {
    id: 2,
    date: "10 minutes ago",
    title: "Pull Request Submitted",
    description:
      "Submitted PR #342 with new feature implementation. Waiting for code review.",
    icon: (
      <IconPlaceholder
        lucide="GitPullRequestArrowIcon"
        tabler="IconGitPullRequest"
        hugeicons="GitPullRequestIcon"
        phosphor="GitPullRequest"
        remixicon="RiGitPullRequestLine"
        className="size-3.5"
      />
    ),
  },
  {
    id: 3,
    date: "5 minutes ago",
    title: "Comparing Branches",
    description:
      "Received comments on PR. Minor adjustments needed in error handling.",
    icon: (
      <IconPlaceholder
        lucide="GitCompareArrowsIcon"
        tabler="IconGitCompare"
        hugeicons="GitCompareIcon"
        phosphor="GitDiffIcon"
        remixicon="RiGitPullRequestLine"
        className="size-3.5"
      />
    ),
  },
  {
    id: 4,
    date: "Just now",
    title: "Merged Branch",
    description:
      "Merged the feature branch into the main branch. Ready for deployment.",
    icon: (
      <IconPlaceholder
        lucide="GitMergeIcon"
        tabler="IconGitMerge"
        hugeicons="GitMergeIcon"
        phosphor="GitMergeIcon"
        remixicon="RiGitMergeLine"
        className="size-3.5"
      />
    ),
  },
]

export default function Pattern() {
  return (
    <Timeline defaultValue={3} className="w-full max-w-md">
      {gitActivity.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineTitle className="mt-0.5">{item.title}</TimelineTitle>
            <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
              {item.icon}
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>
            {item.description}
            <TimelineDate className="mt-2 mb-0">{item.date}</TimelineDate>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
