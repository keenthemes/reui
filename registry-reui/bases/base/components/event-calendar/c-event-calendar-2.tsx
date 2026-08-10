"use client"

import { useMemo, useRef } from "react"
import {
  EventCalendar,
  type EventCalendarApi,
} from "@/registry-reui/bases/base/reui/event-calendar/event-calendar"
import { EventCalendarContent } from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-content"
import {
  EventCalendarNav,
  EventCalendarToolbar,
} from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-nav"
import type {
  CalendarEvent,
  EventCalendarResource,
} from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-types"
import { addMinutes, setHours, startOfDay } from "date-fns"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/** Rooms become columns in the resource day view - the time-grid layout tuned
 *  for space/booking scenarios. */
const ROOMS: EventCalendarResource[] = [
  { id: "r101", title: "101 · King", color: "var(--color-blue-500)" },
  { id: "r102", title: "102 · Queen", color: "var(--color-emerald-500)" },
  { id: "r204", title: "204 · Twin", color: "var(--color-violet-500)" },
  { id: "r301", title: "Suite 301", color: "var(--color-amber-500)" },
]

/** One source of truth for booking status: drives both the chip color and the
 *  legend, so the two can never drift apart. */
type BookingStatus = "occupied" | "checkout" | "housekeeping" | "checkin"

const STATUS: Record<BookingStatus, { label: string; color: string }> = {
  occupied: { label: "Occupied", color: "var(--color-emerald-500)" },
  checkout: { label: "Check-out", color: "var(--color-rose-500)" },
  housekeeping: { label: "Housekeeping", color: "var(--color-cyan-500)" },
  checkin: { label: "Check-in", color: "var(--color-blue-500)" },
}

interface BookingData {
  status: BookingStatus
}

/** A hotel's day of room activity - stays, turnovers, housekeeping, and
 *  check-ins - anchored to today so the resource view opens full. */
function buildBookings(anchor: Date): CalendarEvent<BookingData>[] {
  const base = startOfDay(anchor)
  // fractional hours (11.5 = 11:30) resolve through minutes so half-hour
  // turnovers land precisely
  const at = (hour: number) => addMinutes(base, Math.round(hour * 60))

  const booking = (
    id: string,
    title: string,
    startHour: number,
    endHour: number,
    resourceId: string,
    status: BookingStatus
  ): CalendarEvent<BookingData> => ({
    id,
    title,
    start: at(startHour),
    end: at(endHour),
    resourceId,
    color: STATUS[status].color,
    data: { status },
  })

  return [
    // 101 - morning stay, turnover, afternoon check-in
    booking("stay-reed", "Occupied · Reed", 8, 10, "r101", "occupied"),
    booking("checkout-reed", "Check-out · Reed", 10, 10.5, "r101", "checkout"),
    booking("clean-101", "Housekeeping", 10.5, 12, "r101", "housekeeping"),
    booking("checkin-alvarez", "Check-in · Alvarez", 14, 15, "r101", "checkin"),
    // 102 - long stay with a late-afternoon turnover
    booking("stay-chen", "Occupied · Chen", 8, 16, "r102", "occupied"),
    booking("checkout-chen", "Check-out · Chen", 16, 16.5, "r102", "checkout"),
    booking("clean-102", "Housekeeping", 16.5, 18, "r102", "housekeeping"),
    // 204 - midday turnover into an evening stay
    booking(
      "checkout-novak",
      "Check-out · Novak",
      11,
      11.5,
      "r204",
      "checkout"
    ),
    booking("clean-204", "Deep clean", 11.5, 13, "r204", "housekeeping"),
    booking("checkin-ford", "Check-in · Ford", 15, 16, "r204", "checkin"),
    booking("stay-ford", "Occupied · Ford", 16, 20, "r204", "occupied"),
    // Suite 301 - early prep, mid-morning check-in, VIP stay
    booking("clean-301", "Housekeeping", 8, 9.5, "r301", "housekeeping"),
    booking("checkin-osei", "Check-in · Osei", 10, 11, "r301", "checkin"),
    booking("stay-osei", "Occupied · Osei", 11, 20, "r301", "occupied"),
  ]
}

export default function Pattern() {
  const events = useMemo(() => buildBookings(new Date()), [])
  const apiRef = useRef<EventCalendarApi | null>(null)
  const bookingCount = useRef(0)

  // Add a one-hour booking at noon in the first room and jump to it - a minimal
  // stand-in for a real "book a room" dialog.
  const addBooking = () => {
    const api = apiRef.current
    if (!api) return
    const start = setHours(startOfDay(new Date()), 12)
    const end = addMinutes(start, 60)
    api.addEvent({
      id: `booking-${bookingCount.current++}`,
      title: "New booking",
      start,
      end,
      resourceId: "r101",
      color: STATUS.checkin.color,
      data: { status: "checkin" },
    })
    api.goTo(start)
  }

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <EventCalendar
            defaultEvents={events}
            defaultView="resource"
            resources={ROOMS}
            dayStartHour={8}
            dayEndHour={20}
            interval={60}
            // a booking board reschedules and stretches stays, but a stray
            // drag should not carve out a new booking - creation is the button
            interactions={{ drag: true, resize: true, selectSlot: false }}
            apiRef={apiRef}
            className="h-[600px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 pe-2">
              {/* resource is the only view here, so the switcher is hidden */}
              <EventCalendarNav
                className="min-w-0 flex-1"
                showViewSwitcher={false}
              />
              <EventCalendarToolbar>
                <Button size="sm" onClick={addBooking}>
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                  New booking
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
          {/* Status legend - swatch colors are runtime var(--color-*) tokens, so
              they ride inline styles rather than synthesized utility classes. */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-4 py-3 text-xs">
            {Object.values(STATUS).map((status) => (
              <span key={status.label} className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                {status.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
