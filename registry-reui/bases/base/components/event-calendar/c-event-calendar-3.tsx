"use client"

import { useMemo, useRef, useState } from "react"
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
  EventCalendarOccurrence,
  EventCalendarSlotInfo,
} from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-types"
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  setHours,
  startOfDay,
  startOfWeek,
} from "date-fns"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/bases/base/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { Switch } from "@/registry/bases/base/ui/switch"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const COLORS = [
  { value: "var(--color-blue-500)", label: "Blue" },
  { value: "var(--color-violet-500)", label: "Violet" },
  { value: "var(--color-emerald-500)", label: "Emerald" },
  { value: "var(--color-amber-500)", label: "Amber" },
  { value: "var(--color-rose-500)", label: "Rose" },
]

const START_HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7:00 - 19:00
const DURATIONS = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
]

/** The one dialog is a create form when `id` is null and an edit form
 *  otherwise - a single working copy the calendar clicks seed. */
interface EventDraft {
  id: string | null
  title: string
  date: Date
  startHour: number
  duration: number
  allDay: boolean
  color: string
}

function buildEvents(anchor: Date): CalendarEvent[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 })
  const at = (dayOffset: number, hour: number) =>
    setHours(addDays(week, dayOffset), hour)
  return [
    {
      id: "kickoff",
      title: "Project kickoff",
      start: at(1, 10),
      end: at(1, 11),
      color: COLORS[0].value,
    },
    {
      id: "1on1",
      title: "1:1 with Mia",
      start: at(2, 14),
      end: at(2, 15),
      color: COLORS[1].value,
    },
    {
      id: "review",
      title: "Design review",
      start: at(4, 11),
      end: at(4, 12),
      color: COLORS[2].value,
    },
    {
      id: "standup",
      title: "Team standup",
      start: at(3, 9),
      end: addMinutes(at(3, 9), 30),
      color: COLORS[3].value,
    },
    {
      id: "interview",
      title: "Candidate interview",
      start: at(5, 13),
      end: at(5, 14),
      color: COLORS[4].value,
    },
    {
      id: "retro",
      title: "Sprint retro",
      start: at(5, 16),
      end: at(5, 17),
      color: COLORS[1].value,
    },
  ]
}

export default function Pattern() {
  const events = useMemo(() => buildEvents(new Date()), [])
  const apiRef = useRef<EventCalendarApi | null>(null)
  const counter = useRef(0)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<EventDraft | null>(null)

  // Seed a blank create draft for a given day - shared by the empty-slot click
  // and the header "Add event" button.
  const seedCreate = (date: Date) => {
    setDraft({
      id: null,
      title: "",
      date: startOfDay(date),
      startHour: 9,
      duration: 60,
      allDay: false,
      color: COLORS[0].value,
    })
    setOpen(true)
  }

  // Empty slot → create draft. Month cells report allDay with no `end`, so the
  // form starts as a sensible timed event the user can adjust.
  const openCreate = (slot: EventCalendarSlotInfo) => seedCreate(slot.date)

  // Event click → seed an edit draft from the event itself (source of truth).
  const openEdit = (occurrence: EventCalendarOccurrence) => {
    const event = occurrence.event
    setDraft({
      id: event.id,
      title: event.title,
      date: startOfDay(event.start),
      startHour: event.start.getHours(),
      duration: Math.max(30, differenceInMinutes(event.end, event.start)),
      allDay: event.allDay ?? false,
      color: event.color ?? COLORS[0].value,
    })
    setOpen(true)
  }

  const save = () => {
    const api = apiRef.current
    if (!api || !draft || !draft.title.trim()) return
    const start = draft.allDay
      ? draft.date
      : setHours(draft.date, draft.startHour)
    const end = draft.allDay
      ? addDays(draft.date, 1)
      : addMinutes(start, draft.duration)
    const patch = {
      title: draft.title.trim(),
      start,
      end,
      allDay: draft.allDay,
      color: draft.color,
    }
    if (draft.id === null) {
      api.addEvent({ id: `evt-${counter.current++}`, ...patch })
    } else {
      api.updateEvent(draft.id, patch)
    }
    setOpen(false)
  }

  const remove = () => {
    const api = apiRef.current
    if (!api || !draft?.id) return
    api.removeEvent(draft.id)
    setOpen(false)
  }

  const isEdit = draft?.id != null

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <EventCalendar
            defaultEvents={events}
            defaultView="month"
            apiRef={apiRef}
            onSlotClick={openCreate}
            onEventClick={(occurrence, e) => {
              // open the editor instead of the built-in selection tint
              e.preventDefault()
              openEdit(occurrence)
            }}
            // the dialog owns creation; drag/resize reschedules and persists
            interactions={{ drag: true, resize: true, selectSlot: false }}
            className="h-[640px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 pe-2">
              <EventCalendarNav className="min-w-0 flex-1" />
              <EventCalendarToolbar>
                <Button size="sm" onClick={() => seedCreate(new Date())}>
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                  Add event
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        {draft && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit event" : "New event"}</DialogTitle>
              <DialogDescription>
                {format(draft.date, "EEEE, MMMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="ec-crud-title">Title</FieldLabel>
                <Input
                  id="ec-crud-title"
                  placeholder="Add a title"
                  value={draft.title}
                  autoFocus
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Color</FieldLabel>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      aria-label={color.label}
                      aria-pressed={draft.color === color.value}
                      onClick={() => setDraft({ ...draft, color: color.value })}
                      style={{ backgroundColor: color.value }}
                      className={cn(
                        "ring-offset-background size-6 rounded-full transition",
                        draft.color === color.value &&
                          "ring-ring ring-2 ring-offset-2"
                      )}
                    />
                  ))}
                </div>
              </Field>

              {!draft.allDay && (
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="ec-crud-start">Start</FieldLabel>
                    <Select
                      value={String(draft.startHour)}
                      onValueChange={(value) =>
                        setDraft({ ...draft, startHour: Number(value) })
                      }
                    >
                      <SelectTrigger id="ec-crud-start" size="sm">
                        <SelectValue>
                          {`${String(draft.startHour).padStart(2, "0")}:00`}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {START_HOURS.map((hour) => (
                          <SelectItem key={hour} value={String(hour)}>
                            {`${String(hour).padStart(2, "0")}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="ec-crud-duration">Duration</FieldLabel>
                    <Select
                      value={String(draft.duration)}
                      onValueChange={(value) =>
                        setDraft({ ...draft, duration: Number(value) })
                      }
                    >
                      <SelectTrigger id="ec-crud-duration" size="sm">
                        <SelectValue>
                          {DURATIONS.find((d) => d.value === draft.duration)
                            ?.label ?? `${draft.duration} min`}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {DURATIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}

              <Field orientation="horizontal">
                <FieldLabel htmlFor="ec-crud-allday" className="font-normal">
                  All day
                </FieldLabel>
                <Switch
                  id="ec-crud-allday"
                  checked={draft.allDay}
                  onCheckedChange={(allDay) => setDraft({ ...draft, allDay })}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="sm:justify-between">
              {isEdit ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={remove}
                >
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <DialogClose render={<Button variant="outline" size="sm" />}>
                  Cancel
                </DialogClose>
                <Button size="sm" onClick={save} disabled={!draft.title.trim()}>
                  {isEdit ? "Save changes" : "Create event"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
