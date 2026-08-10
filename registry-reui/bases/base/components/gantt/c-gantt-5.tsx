"use client"

import { useMemo, useRef, useState } from "react"
import { Badge, type BadgeProps } from "@/registry-reui/bases/base/reui/badge"
import {
  Gantt,
  type GanttApi,
  type GanttColumn,
} from "@/registry-reui/bases/base/reui/gantt/gantt"
import {
  GanttNav,
  GanttToolbar,
} from "@/registry-reui/bases/base/reui/gantt/gantt-nav"
import type {
  GanttEvent,
  GanttResource,
} from "@/registry-reui/bases/base/reui/gantt/gantt-types"
import { GanttView } from "@/registry-reui/bases/base/reui/gantt/gantt-view"
import { addDays, startOfDay, startOfWeek } from "date-fns"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type TaskMeta = { owner: string; status: string }

/** Owner headshots keyed by name. Missing entries (e.g. "Unassigned") fall
 *  back to initials, and the initials also show while the photo loads. */
const OWNER_AVATARS: Record<string, string> = {
  "Ada Lovelace": "https://randomuser.me/api/portraits/women/44.jpg",
  "Grace Hopper": "https://randomuser.me/api/portraits/women/68.jpg",
  "Alan Turing": "https://randomuser.me/api/portraits/men/32.jpg",
  "Linus Torvalds": "https://randomuser.me/api/portraits/men/54.jpg",
  "Katherine Johnson": "https://randomuser.me/api/portraits/women/90.jpg",
  "Margaret Hamilton": "https://randomuser.me/api/portraits/women/12.jpg",
}

/** First + last initial from an owner name, used as the avatar fallback -
 *  "Ada Lovelace" reads "AL", "Unassigned" reads "UN". */
function ownerInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

/** Status label -> ReUI badge light variant (green done, amber in progress,
 *  neutral not started). */
const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  Done: "success-light",
  "In progress": "warning-light",
  "Not started": "secondary",
}

/**
 * Status report: the left tree panel doubles as a task table with Owner and
 * Status columns beside each phase, every bar carries a progress fill, and the
 * timeline is drag-locked. New tasks are appended as rows from the toolbar.
 */
const INITIAL_RESOURCES: GanttResource[] = [
  {
    id: "planning",
    title: "Planning",
    children: [
      { id: "requirements", title: "Requirements" },
      { id: "design-phase", title: "Design" },
    ],
  },
  {
    id: "build",
    title: "Build",
    children: [
      { id: "frontend", title: "Frontend" },
      { id: "backend", title: "Backend" },
    ],
  },
  {
    id: "launch",
    title: "Launch",
    children: [
      { id: "qa", title: "QA & Testing" },
      { id: "rollout", title: "Rollout" },
    ],
  },
]

/** Owner + status per task, keyed by resource.id - GanttResource has no room
 *  for custom fields, so the extra column data lives in a lookup of your own. */
const INITIAL_META: Record<string, TaskMeta> = {
  requirements: { owner: "Ada Lovelace", status: "Done" },
  "design-phase": { owner: "Grace Hopper", status: "Done" },
  frontend: { owner: "Alan Turing", status: "In progress" },
  backend: { owner: "Linus Torvalds", status: "In progress" },
  qa: { owner: "Katherine Johnson", status: "Not started" },
  rollout: { owner: "Margaret Hamilton", status: "Not started" },
}

/** Status-report fixture - progress descends from finished planning to
 *  not-started launch, and the phases straddle today so the now-line falls
 *  mid-plan. Kept inside a month so every phase reads at a glance. */
function buildBars(anchor: Date): GanttEvent[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 })
  const day = (dayOffset: number) => addDays(week, dayOffset)
  const bar = (
    resourceId: string,
    title: string,
    startOffset: number,
    days: number,
    color: string,
    progress?: number
  ): GanttEvent => ({
    id: `bar-${resourceId}`,
    title,
    start: day(startOffset),
    end: day(startOffset + days),
    allDay: true,
    color,
    resourceId,
    progress,
  })

  return [
    bar("requirements", "Requirements", -10, 8, "var(--color-blue-500)", 100),
    bar("design-phase", "Design", -8, 8, "var(--color-sky-500)", 100),
    bar("frontend", "Frontend", -2, 10, "var(--color-violet-500)", 60),
    bar("backend", "Backend", 0, 10, "var(--color-purple-500)", 45),
    bar("qa", "QA & Testing", 8, 8, "var(--color-amber-500)", 0),
    bar("rollout", "Rollout", 14, 5, "var(--color-emerald-500)", 0),
  ]
}

export default function Pattern() {
  const bars = useMemo(() => buildBars(new Date()), [])
  const apiRef = useRef<GanttApi | null>(null)
  const [resources, setResources] = useState<GanttResource[]>(INITIAL_RESOURCES)
  const [meta, setMeta] = useState<Record<string, TaskMeta>>(INITIAL_META)
  // A ref (not state) numbers each appended task, so ids stay unique even when
  // the button is clicked several times before a re-render.
  const addedRef = useRef(0)

  // Extra tree-panel columns after the pinned name column. Built from meta so
  // appended rows pick up their Owner and Status; group rows return null.
  const columns = useMemo<GanttColumn[]>(
    () => [
      {
        id: "owner",
        title: "Owner",
        width: 130,
        align: "start",
        render: ({ resource, isGroup }) => {
          if (isGroup) return null
          const owner = meta[resource.id]?.owner
          if (!owner) return null
          return (
            <span className="flex min-w-0 items-center gap-2">
              <Avatar className="size-5 shrink-0">
                <AvatarImage src={OWNER_AVATARS[owner]} alt={owner} />
                <AvatarFallback className="text-[10px]">
                  {ownerInitials(owner)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{owner}</span>
            </span>
          )
        },
      },
      {
        id: "status",
        title: "Status",
        width: 100,
        align: "start",
        render: ({ resource, isGroup }) => {
          if (isGroup) return null
          const status = meta[resource.id]?.status
          return status ? (
            <Badge variant={STATUS_VARIANT[status] ?? "secondary"} size="sm">
              {status}
            </Badge>
          ) : null
        },
      },
    ],
    [meta]
  )

  // Append a new task as its own row under the Launch phase, register its
  // Owner/Status, and drop a not-started bar on its row.
  const addTask = () => {
    const api = apiRef.current
    if (!api) return
    const n = ++addedRef.current
    const id = `task-${n}`
    setResources((prev) =>
      prev.map((group) =>
        group.id === "launch"
          ? {
              ...group,
              children: [
                ...(group.children ?? []),
                { id, title: `New task ${n}` },
              ],
            }
          : group
      )
    )
    setMeta((prev) => ({
      ...prev,
      [id]: { owner: "Unassigned", status: "Not started" },
    }))
    const week = startOfWeek(startOfDay(new Date()), { weekStartsOn: 0 })
    const start = addDays(week, (n % 6) - 2)
    api.addEvent({
      id: `bar-${id}`,
      title: `New task ${n}`,
      start,
      end: addDays(start, 5),
      allDay: true,
      color: "var(--color-slate-400)",
      resourceId: id,
      progress: 0,
    })
  }

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <Gantt
            defaultEvents={bars}
            resources={resources}
            defaultScale="month"
            apiRef={apiRef}
            // Read-only timeline: drag, resize and slot-select are off so the
            // plan can't be shifted by dragging; rows are added via the toolbar.
            defaultInteractions={{
              drag: false,
              resize: false,
              selectSlot: false,
            }}
            columns={columns}
            // Wider tree with a tighter name column so the Owner avatar,
            // owner name and Status all fit alongside the task names.
            treePanel={{ width: 400, nameColumnWidth: 150 }}
            className="h-[500px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 border-b pe-3">
              <GanttNav className="min-w-0 flex-1 border-b-0" />
              <GanttToolbar>
                <Button variant="outline" size="sm" onClick={addTask}>
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                  Add task
                </Button>
              </GanttToolbar>
            </div>
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  )
}
