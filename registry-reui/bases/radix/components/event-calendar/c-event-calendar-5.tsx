"use client"

import { useMemo, useRef } from "react"
import {
  EventCalendar,
  type EventCalendarApi,
  type EventCalendarRenderEventProps,
} from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar"
import { EventCalendarContent } from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar-content"
import {
  EventCalendarNav,
  EventCalendarToolbar,
} from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar-nav"
import type {
  CalendarEvent,
  EventCalendarSlotDraft,
} from "@/registry-reui/bases/radix/reui/event-calendar/event-calendar-types"
import { addMinutes, setHours, startOfDay } from "date-fns"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/** Each service type carries its own Tailwind hue, so the day reads as a
 *  color-coded schedule at a glance. */
const SERVICE = {
  consultation: { label: "Consultation", color: "var(--color-violet-500)" },
  followup: { label: "Follow-up", color: "var(--color-sky-500)" },
  assessment: { label: "Assessment", color: "var(--color-amber-500)" },
  therapy: { label: "Therapy", color: "var(--color-rose-500)" },
} as const

type Service = keyof typeof SERVICE

const NEW_COLOR = "var(--color-emerald-500)"

interface ApptData {
  client: string
  initials: string
  avatar?: string
  service?: Service
}

/** A consultant's day with color-coded appointments and deliberate gaps to
 *  drag into - anchored to today so the day view opens on real appointments. */
function buildAppointments(anchor: Date): CalendarEvent<ApptData>[] {
  const base = startOfDay(anchor)
  const at = (hour: number, minute = 0) =>
    addMinutes(setHours(base, hour), minute)

  const appt = (
    id: string,
    client: string,
    initials: string,
    avatar: string,
    service: Service,
    startHour: number,
    startMinute: number,
    minutes: number
  ): CalendarEvent<ApptData> => {
    const start = at(startHour, startMinute)
    return {
      id,
      title: client,
      start,
      end: addMinutes(start, minutes),
      color: SERVICE[service].color,
      data: { client, initials, avatar, service },
    }
  }

  return [
    appt(
      "a1",
      "Dana Whitfield",
      "DW",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "consultation",
      9,
      0,
      45
    ),
    appt(
      "a2",
      "Marco Reyes",
      "MR",
      "https://randomuser.me/api/portraits/men/32.jpg",
      "followup",
      11,
      0,
      45
    ),
    appt(
      "a3",
      "Priya Nair",
      "PN",
      "https://randomuser.me/api/portraits/women/68.jpg",
      "assessment",
      14,
      0,
      60
    ),
    appt(
      "a4",
      "Leon Fischer",
      "LF",
      "https://randomuser.me/api/portraits/men/75.jpg",
      "therapy",
      16,
      0,
      45
    ),
  ]
}

/** Richer chip via `renderEvent`: an initials badge, the client name, and - when
 *  the block is tall enough - the service type on a second aligned line. */
function renderChip({
  occurrence,
  segment,
}: EventCalendarRenderEventProps<ApptData>) {
  const data = occurrence.event.data
  if (!data) return undefined
  const service = data.service ? SERVICE[data.service] : null
  const minutes = (segment.endMin ?? 0) - (segment.startMin ?? 0)

  return (
    <span className="flex h-full w-full min-w-0 flex-col justify-start gap-0.5">
      <span className="flex min-w-0 items-center gap-1.5">
        <Avatar className="size-5 shrink-0">
          {data.avatar && <AvatarImage src={data.avatar} alt={data.client} />}
          <AvatarFallback className="bg-(--ec-event-color)/25 text-[9px] font-semibold text-(--ec-event-color)">
            {data.initials}
          </AvatarFallback>
        </Avatar>
        <span className="truncate font-medium">{data.client}</span>
      </span>
      {service && minutes >= 45 && (
        <span className="truncate ps-[1.625rem] text-[11px] font-medium text-(--ec-event-color)">
          {service.label}
        </span>
      )}
    </span>
  )
}

export default function Pattern() {
  const events = useMemo(() => buildAppointments(new Date()), [])
  const apiRef = useRef<EventCalendarApi | null>(null)
  const counter = useRef(0)

  // Drag across an open span to book it. The calendar reports the drawn slot
  // but does NOT insert anything - `onSelectSlot` is where the appointment is
  // actually created, so real apps can open a form or hit an API here instead.
  const bookSlot = (slot: EventCalendarSlotDraft) => {
    const api = apiRef.current
    if (!api) return
    api.addEvent({
      id: `appt-${counter.current++}`,
      title: "New appointment",
      start: slot.start,
      end: slot.end,
      color: NEW_COLOR,
      data: { client: "New appointment", initials: "+" },
    })
  }

  // Refuse a draw that would overlap an existing appointment - no
  // double-booking. Returning false cancels the create gesture.
  const canBook = (slot: EventCalendarSlotDraft) => {
    const api = apiRef.current
    if (!api) return true
    return (
      api.findOverlapping({ start: slot.start, end: slot.end }).length === 0
    )
  }

  // Book the first open 45-minute slot in business hours and jump to it - the
  // toolbar shortcut for the same thing the drag gesture does.
  const addAppointment = () => {
    const api = apiRef.current
    if (!api) return
    const base = startOfDay(new Date())
    for (let minutes = 9 * 60; minutes + 45 <= 18 * 60; minutes += 30) {
      const start = addMinutes(base, minutes)
      const end = addMinutes(start, 45)
      if (api.findOverlapping({ start, end }).length === 0) {
        api.addEvent({
          id: `appt-${counter.current++}`,
          title: "New appointment",
          start,
          end,
          color: NEW_COLOR,
          data: { client: "New appointment", initials: "+" },
        })
        api.goTo(start)
        return
      }
    }
  }

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <EventCalendar
            defaultEvents={events}
            defaultView="day"
            dayStartHour={9}
            dayEndHour={18}
            interval={30}
            snapDuration={15}
            apiRef={apiRef}
            renderEvent={renderChip}
            onSelectSlot={bookSlot}
            canSelectSlot={canBook}
            // booking is the whole point: drag an empty span to create; moving
            // and resizing existing appointments stays on for rescheduling
            interactions={{ drag: true, resize: true, selectSlot: true }}
            className="h-[600px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 pe-2">
              {/* the switcher is on: booking lives in the day view, but the week
                  and month give the same appointments a wider context */}
              <EventCalendarNav className="min-w-0 flex-1" />
              <EventCalendarToolbar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => apiRef.current?.setView("agenda")}
                >
                  <IconPlaceholder
                    lucide="ListIcon"
                    tabler="IconList"
                    hugeicons="LeftToRightListBulletIcon"
                    phosphor="ListBulletsIcon"
                    remixicon="RiListUnordered"
                    className="size-4"
                    aria-hidden="true"
                  />
                  Agenda
                </Button>
                <Button size="sm" onClick={addAppointment}>
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                  New appointment
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
          <p className="text-muted-foreground border-t px-4 py-3 text-xs">
            Drag across an open time to book an appointment. Slots that overlap
            an existing booking are blocked.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
