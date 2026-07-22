"use client"

import { useMemo, useRef, useState } from "react"
import {
  Gantt,
  type GanttApi,
} from "@/registry-reui/bases/radix/reui/gantt/gantt"
import {
  GanttNav,
  GanttToolbar,
} from "@/registry-reui/bases/radix/reui/gantt/gantt-nav"
import type {
  GanttEvent,
  GanttResource,
} from "@/registry-reui/bases/radix/reui/gantt/gantt-types"
import { GanttView } from "@/registry-reui/bases/radix/reui/gantt/gantt-view"
import { addDays, startOfDay, startOfWeek } from "date-fns"

import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/**
 * Yearly roadmap: each workstream is a swimlane group and its multi-month
 * initiatives are the bars. The Backlog group ships with empty rows - the
 * toolbar button schedules the next one onto the timeline.
 */
const RESOURCES: GanttResource[] = [
  {
    id: "platform",
    title: "Platform",
    children: [
      { id: "auth-revamp", title: "Auth Revamp" },
      { id: "api-v2", title: "API v2" },
    ],
  },
  {
    id: "growth",
    title: "Growth",
    children: [
      { id: "onboarding", title: "Onboarding Flow" },
      { id: "referrals", title: "Referral Program" },
    ],
  },
  {
    id: "design-system",
    title: "Design System",
    children: [
      { id: "tokens", title: "Design Tokens" },
      { id: "components", title: "Component Library" },
    ],
  },
  {
    id: "backlog",
    title: "Backlog",
    children: [
      { id: "search", title: "Search Revamp" },
      { id: "billing", title: "Billing v2" },
      { id: "mobile", title: "Mobile App" },
    ],
  },
]

/** Backlog initiatives, scheduled one per click in this order. */
const BACKLOG: Array<{ id: string; title: string; color: string }> = [
  { id: "search", title: "Search Revamp", color: "var(--color-rose-500)" },
  { id: "billing", title: "Billing v2", color: "var(--color-amber-500)" },
  { id: "mobile", title: "Mobile App", color: "var(--color-cyan-500)" },
]

/** Roadmap fixture - initiatives span months so the quarter axis has something
 *  to show, and offsets straddle today so both past and future are visible. */
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
    bar("auth-revamp", "Auth Revamp", -30, 60, "var(--color-blue-500)", 100),
    bar("api-v2", "API v2", 20, 90, "var(--color-sky-500)", 30),
    bar(
      "onboarding",
      "Onboarding Flow",
      -20,
      60,
      "var(--color-emerald-500)",
      80
    ),
    bar("referrals", "Referral Program", 50, 90, "var(--color-teal-500)", 0),
    bar("tokens", "Design Tokens", -60, 70, "var(--color-violet-500)", 100),
    bar(
      "components",
      "Component Library",
      0,
      120,
      "var(--color-purple-500)",
      45
    ),
  ]
}

export default function Pattern() {
  const bars = useMemo(() => buildBars(new Date()), [])
  const apiRef = useRef<GanttApi | null>(null)
  // How many backlog initiatives have been scheduled so far.
  const [scheduled, setScheduled] = useState(0)

  // Schedule the next unscheduled backlog initiative onto its (empty) row.
  // The "next" one is derived from the live events, not a captured counter,
  // so it stays correct even if the button is clicked in quick succession.
  const addInitiative = () => {
    const api = apiRef.current
    if (!api) return
    const scheduledIds = new Set(api.getEvents().map((event) => event.id))
    const index = BACKLOG.findIndex(
      (item) => !scheduledIds.has(`bar-${item.id}`)
    )
    if (index === -1) return
    const item = BACKLOG[index]
    const week = startOfWeek(startOfDay(new Date()), { weekStartsOn: 0 })
    // Land the scheduled bars in the near-future part of the current quarter so
    // each one is visible the moment it drops onto its row.
    const start = addDays(week, 12 + index * 20)
    api.addEvent({
      id: `bar-${item.id}`,
      title: item.title,
      start,
      end: addDays(start, 24),
      allDay: true,
      color: item.color,
      resourceId: item.id,
    })
    setScheduled((count) => count + 1)
  }

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <Gantt
            defaultEvents={bars}
            resources={RESOURCES}
            defaultScale="quarter"
            apiRef={apiRef}
            treePanel={{ width: 200 }}
            className="h-[480px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 border-b pe-3">
              <GanttNav className="min-w-0 flex-1 border-b-0" />
              <GanttToolbar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addInitiative}
                  disabled={scheduled >= BACKLOG.length}
                >
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                  Add to roadmap
                </Button>
              </GanttToolbar>
            </div>
            {/* Parent workstream rows carry no bars - summaryBars rolls up the
                child initiatives into one envelope on the group row. */}
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  )
}
