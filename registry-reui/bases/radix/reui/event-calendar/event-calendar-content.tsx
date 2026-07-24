// Title: Event Calendar Content
// Description: Active-view switchboard rendering month, week, day, N-days, or agenda; swappable per view via the components prop.

"use client"

import { type ComponentType, type HTMLAttributes, type ReactNode } from "react"
import {
  useEventCalendarSelector,
  useEventCalendarViewConfig,
} from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar"
import { EventCalendarAgendaView } from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar-agenda-view"
import { EventCalendarMonthView } from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar-month-view"
import { EventCalendarResourceView } from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar-resource-view"
import {
  EventCalendarDaysView,
  EventCalendarDayView,
  EventCalendarWeekView,
} from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar-time-grid"
import type { CalendarView } from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar-types"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"

const DEFAULT_VIEW_COMPONENTS: Record<CalendarView, ComponentType> = {
  month: EventCalendarMonthView,
  week: EventCalendarWeekView,
  day: EventCalendarDayView,
  days: EventCalendarDaysView,
  agenda: EventCalendarAgendaView,
  resource: EventCalendarResourceView,
}

interface EventCalendarContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Swap individual view implementations. */
  components?: Partial<Record<CalendarView, ComponentType>>
  /** Replaces the switchboard entirely; read useEventCalendarView() inside. */
  children?: ReactNode
  asChild?: boolean
}

function EventCalendarContent({
  className,
  asChild = false,
  components,
  children,
  ...props
}: EventCalendarContentProps) {
  const viewConfig = useEventCalendarViewConfig()
  const view = useEventCalendarSelector((state) => state.view)
  const loading = useEventCalendarSelector((state) => state.loading)

  const resolved = {
    ...DEFAULT_VIEW_COMPONENTS,
    ...viewConfig.components,
    ...components,
  }
  const ActiveView = resolved[view]

  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="event-calendar-content"
      data-view={view}
      data-loading={loading || undefined}
      className={cn(
        "relative flex min-h-0 min-w-0 flex-1 flex-col",
        "data-loading:pointer-events-none data-loading:opacity-60",
        viewConfig.classNames?.content,
        className
      )}
      {...props}
    >
      {children ?? <ActiveView />}
    </Comp>
  )
}

export { DEFAULT_VIEW_COMPONENTS, EventCalendarContent }
export type { EventCalendarContentProps }
