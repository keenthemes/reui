// Description: Projects table with team avatars and status
// Order: 8
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const projects = [
  {
    name: "Website Redesign",
    description: "Landing page and marketing site",
    status: "In Progress",
    statusVariant: "info-light" as const,
    team: [
      {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
        fallback: "SC",
      },
      {
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
        fallback: "MJ",
      },
      {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
        fallback: "EP",
      },
    ],
    extra: 2,
    dueDate: "Mar 15",
  },
  {
    name: "Mobile App v2",
    description: "iOS and Android release",
    status: "Review",
    statusVariant: "warning-light" as const,
    team: [
      {
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
        fallback: "DK",
      },
      {
        src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
        fallback: "SD",
      },
    ],
    extra: 0,
    dueDate: "Apr 1",
  },
  {
    name: "API Integration",
    description: "Third-party payment gateway",
    status: "Completed",
    statusVariant: "success-light" as const,
    team: [
      {
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
        fallback: "MJ",
      },
    ],
    extra: 0,
    dueDate: "Feb 28",
  },
  {
    name: "Analytics Dashboard",
    description: "Real-time metrics and reporting",
    status: "Planning",
    statusVariant: "outline" as const,
    team: [
      {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
        fallback: "SC",
      },
      {
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
        fallback: "DK",
      },
      {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
        fallback: "EP",
      },
    ],
    extra: 4,
    dueDate: "May 10",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.name}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-muted style-vega:rounded-md style-maia:rounded-md style-nova:rounded-sm style-lyra:rounded-none style-mira:rounded-sm flex size-8 shrink-0 items-center justify-center">
                    <IconPlaceholder
                      lucide="FolderIcon"
                      tabler="IconFolder"
                      hugeicons="FolderIcon"
                      phosphor="FolderIcon"
                      remixicon="RiFolderLine"
                      className="text-muted-foreground size-4"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{project.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {project.description}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={project.statusVariant} size="sm">
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <AvatarGroup>
                  {project.team.map((member) => (
                    <Avatar key={member.fallback} size="sm">
                      <AvatarImage src={member.src} alt={member.fallback} />
                      <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.extra > 0 && (
                    <AvatarGroupCount>
                      <span className="text-muted-foreground text-[0.625rem]">
                        +{project.extra}
                      </span>
                    </AvatarGroupCount>
                  )}
                </AvatarGroup>
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm">
                {project.dueDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
