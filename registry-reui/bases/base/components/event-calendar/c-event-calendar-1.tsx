"use client"

import { useMemo, useRef, useState } from "react"
import {
  EventCalendar,
  type EventCalendarApi,
  type EventCalendarRenderEventProps,
} from "@/registry-reui/bases/base/reui/event-calendar/event-calendar"
import { EventCalendarContent } from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-content"
import type { EventCalendarI18nConfig } from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-i18n"
import {
  EventCalendarNav,
  EventCalendarToolbar,
} from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-nav"
import type {
  CalendarEvent,
  CalendarView,
  EventCalendarInteractions,
  EventCalendarResource,
  EventCalendarViewSettings,
} from "@/registry-reui/bases/base/reui/event-calendar/event-calendar-types"
import {
  addDays,
  addMinutes,
  setHours,
  startOfDay,
  startOfWeek,
  type Locale,
} from "date-fns"
import { ar, de, es, fr, ja } from "date-fns/locale"

import { Avatar, AvatarFallback } from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { Label } from "@/registry/bases/base/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { Switch } from "@/registry/bases/base/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/base/ui/tabs"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/** Team members - passing resources unlocks the resource day view, so the
 *  view switcher offers every view the calendar ships. */
const TEAM: EventCalendarResource[] = [
  { id: "alex", title: "Alex", color: "var(--color-blue-500)" },
  { id: "mia", title: "Mia", color: "var(--color-violet-500)" },
  { id: "sam", title: "Sam", color: "var(--color-emerald-500)" },
]

/** Demo events: a balanced current week (timed, multi-day, all-day, two
 *  custom-rendered chips) plus a light scatter in the nearby weeks so the
 *  month view reads naturally without crowding any cell. */
function buildEvents(anchor: Date): CalendarEvent[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 })
  const at = (dayOffset: number, hour: number, minute = 0) =>
    addMinutes(setHours(addDays(week, dayOffset), hour), minute)
  const day = (dayOffset: number) => addDays(week, dayOffset)

  return [
    {
      id: "team-sync",
      title: "Team sync",
      start: at(1, 9, 0),
      end: at(1, 9, 30),
      resourceId: "alex",
    },
    {
      id: "design-review",
      title: "Design review",
      start: at(2, 11, 0),
      end: at(2, 12, 0),
      resourceId: "mia",
      color: "var(--color-violet-500)",
    },
    {
      id: "product-demo",
      title: "Product demo",
      start: at(3, 15, 0),
      end: at(3, 16, 0),
      resourceId: "sam",
      color: "var(--color-emerald-500)",
    },
    {
      id: "roadmap-planning",
      title: "Roadmap planning",
      start: at(4, 10, 0),
      end: at(4, 11, 30),
      resourceId: "alex",
      color: "var(--color-indigo-500)",
    },
    {
      id: "client-call",
      title: "Client call",
      start: at(5, 14, 0),
      end: at(5, 15, 0),
      resourceId: "mia",
      color: "var(--color-amber-500)",
    },
    {
      id: "team-offsite",
      title: "Team offsite",
      start: day(4),
      end: day(6),
      allDay: true,
      color: "var(--color-rose-500)",
    },
    {
      id: "sprint-planning",
      title: "Sprint planning",
      start: at(9, 9, 30),
      end: at(9, 10, 30),
      resourceId: "sam",
      color: "var(--color-blue-500)",
    },
    {
      id: "quarterly-review",
      title: "Quarterly review",
      start: at(17, 13, 0),
      end: at(17, 14, 30),
      resourceId: "alex",
      color: "var(--color-cyan-500)",
    },
  ]
}

/**
 * Custom chip content for a couple of events - proof that the chip is fully
 * yours to shape via `renderEvent`. Returning undefined for everything else
 * falls back to the built-in dot + title + time.
 */
function renderEventContent({ occurrence }: EventCalendarRenderEventProps) {
  const { event } = occurrence

  // Attendee avatars (real shadcn Avatar + AvatarFallback) in place of the
  // leading color dot; a thin ring-1 keeps the overlap crisp at this size.
  if (event.id === "design-review") {
    return (
      <>
        <span className="flex shrink-0 -space-x-1">
          <Avatar className="ring-background size-4 ring-1">
            <AvatarFallback className="bg-violet-500 text-[8px] font-semibold text-white">
              MJ
            </AvatarFallback>
          </Avatar>
          <Avatar className="ring-background size-4 ring-1">
            <AvatarFallback className="bg-sky-500 text-[8px] font-semibold text-white">
              AL
            </AvatarFallback>
          </Avatar>
        </span>
        <span className="truncate font-medium">{event.title}</span>
      </>
    )
  }

  // Title with a trailing status pill. The dot, title and pill share one
  // flex row so the leading dot stays glued to the label - a stacked
  // (flex-col) timed-grid chip would otherwise drop the dot onto its own line.
  if (event.id === "client-call") {
    return (
      <span className="flex w-full min-w-0 items-center gap-1.5">
        <span
          aria-hidden
          className="-me-0.5 size-1.5 shrink-0 rounded-full bg-(--ec-event-color)"
        />
        <span className="truncate font-medium">{event.title}</span>
        <span className="ms-auto shrink-0 rounded bg-(--ec-event-color)/25 px-1 text-[10px] font-semibold">
          30m
        </span>
      </span>
    )
  }

  return undefined
}

/**
 * i18n presets - each language ships a date-fns `locale` (localizes every
 * formatted date: weekday headers, month title, time gutter) plus an `i18n`
 * override map for the static UI strings the locale can't reach (Today, view
 * names, "+N more"). Arabic also flips the whole calendar to right-to-left.
 * English is the built-in default, so it leaves both undefined.
 */
interface DemoLocale {
  id: string
  /** Native language name, shown in the picker. */
  label: string
  locale: Locale | undefined
  dir: "ltr" | "rtl"
  i18n: Partial<EventCalendarI18nConfig> | undefined
}

const LOCALES: DemoLocale[] = [
  {
    id: "en",
    label: "English",
    locale: undefined,
    dir: "ltr",
    i18n: undefined,
  },
  {
    id: "de",
    label: "Deutsch",
    locale: de,
    dir: "ltr",
    i18n: {
      labels: {
        today: "Heute",
        allDay: "Ganztägig",
        noEvents: "Keine Termine",
        more: (count) => `+${count} weitere`,
      },
      viewNames: {
        month: "Monat",
        week: "Woche",
        day: "Tag",
        days: (count) => `${count} Tage`,
        agenda: "Agenda",
        resource: "Zeitraster",
      },
    },
  },
  {
    id: "fr",
    label: "Français",
    locale: fr,
    dir: "ltr",
    i18n: {
      labels: {
        today: "Aujourd'hui",
        allDay: "Journée entière",
        noEvents: "Aucun événement",
        more: (count) => `+${count} autres`,
      },
      viewNames: {
        month: "Mois",
        week: "Semaine",
        day: "Jour",
        days: (count) => `${count} jours`,
        agenda: "Agenda",
        resource: "Grille horaire",
      },
    },
  },
  {
    id: "es",
    label: "Español",
    locale: es,
    dir: "ltr",
    i18n: {
      labels: {
        today: "Hoy",
        allDay: "Todo el día",
        noEvents: "Sin eventos",
        more: (count) => `+${count} más`,
      },
      viewNames: {
        month: "Mes",
        week: "Semana",
        day: "Día",
        days: (count) => `${count} días`,
        agenda: "Agenda",
        resource: "Cuadrícula",
      },
    },
  },
  {
    id: "ja",
    label: "日本語",
    locale: ja,
    dir: "ltr",
    i18n: {
      labels: {
        today: "今日",
        allDay: "終日",
        noEvents: "予定なし",
        more: (count) => `他${count}件`,
      },
      viewNames: {
        month: "月",
        week: "週",
        day: "日",
        days: (count) => `${count}日間`,
        agenda: "予定",
        resource: "タイムグリッド",
      },
    },
  },
  {
    id: "ar",
    label: "العربية",
    locale: ar,
    dir: "rtl",
    i18n: {
      labels: {
        today: "اليوم",
        allDay: "طوال اليوم",
        noEvents: "لا توجد أحداث",
        more: (count) => `+${count} المزيد`,
      },
      viewNames: {
        month: "شهر",
        week: "أسبوع",
        day: "يوم",
        days: (count) => `${count} أيام`,
        agenda: "جدول الأعمال",
        resource: "شبكة زمنية",
      },
    },
  },
]

/** Display time zones - all event math and rendering happen in the chosen
 *  zone, so switching it visibly shifts every event's clock time. */
const TIME_ZONES: Array<{ id: string; label: string; value?: string }> = [
  { id: "local", label: "Browser" },
  { id: "ny", label: "New York", value: "America/New_York" },
  { id: "london", label: "London", value: "Europe/London" },
  { id: "tokyo", label: "Tokyo", value: "Asia/Tokyo" },
  { id: "kolkata", label: "Kolkata", value: "Asia/Kolkata" },
]

/** Everything the settings panel drives, as one resettable object. */
interface DemoSettings {
  viewSettings: EventCalendarViewSettings
  interactions: EventCalendarInteractions
  weekStartsOn: 0 | 1
  dayStartHour: number
  dayEndHour: number
  interval: number
  snapDuration: number
  eventTooltip: boolean
  showDayAddButton: boolean
  localeId: string
  timeZoneId: string
}

const DEFAULT_SETTINGS: DemoSettings = {
  viewSettings: {
    weekends: true,
    weekNumbers: false,
    nowIndicator: true,
    offDays: false,
  },
  interactions: { drag: true, resize: true, selectSlot: true },
  weekStartsOn: 0,
  dayStartHour: 0,
  dayEndHour: 24,
  interval: 60,
  snapDuration: 15,
  eventTooltip: false,
  showDayAddButton: false,
  localeId: "en",
  timeZoneId: "local",
}

function SettingsSwitch({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

function SettingsSelect({
  id,
  label,
  value,
  options,
  onValueChange,
}: {
  id: string
  label: string
  value: number
  options: Array<{ value: number; label: string }>
  onValueChange: (value: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      <Select
        value={String(value)}
        onValueChange={(next) => onValueChange(Number(next))}
      >
        <SelectTrigger id={id} size="sm" className="w-28">
          {/* Base UI's Value renders the raw value string by default; the
              selected option's label reads better for every control here. */}
          <SelectValue>
            {options.find((option) => option.value === value)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/** String-keyed sibling of SettingsSelect, for the language/time-zone pickers. */
function SettingsTextSelect({
  id,
  label,
  value,
  options,
  onValueChange,
}: {
  id: string
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onValueChange: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} size="sm" className="w-36">
          {/* Base UI's Value renders the raw value string by default; the
              selected option's label reads better for every control here. */}
          <SelectValue>
            {options.find((option) => option.value === value)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function Pattern() {
  const events = useMemo(() => buildEvents(new Date()), [])
  const apiRef = useRef<EventCalendarApi | null>(null)
  const newEventCount = useRef(0)
  const [settings, setSettings] = useState<DemoSettings>(DEFAULT_SETTINGS)
  // Mirror the active view so the settings panel can show the time-grid
  // internals tab only where those options are visible (week/day/N-days and
  // the resource time grid - month and agenda render no hour track).
  const [view, setView] = useState<CalendarView>("month")
  const isTimeGridView = view !== "month" && view !== "agenda"

  const activeLocale =
    LOCALES.find((entry) => entry.id === settings.localeId) ?? LOCALES[0]
  const activeTimeZone =
    TIME_ZONES.find((entry) => entry.id === settings.timeZoneId) ??
    TIME_ZONES[0]

  const patch = (partial: Partial<DemoSettings>) =>
    setSettings((current) => ({ ...current, ...partial }))

  // Add a one-hour event at noon today and jump to it - a minimal stand-in for
  // a real "create event" dialog.
  const addEvent = () => {
    const api = apiRef.current
    if (!api) return
    const start = setHours(startOfDay(new Date()), 12)
    const end = addMinutes(start, 60)
    api.addEvent({
      id: `new-event-${newEventCount.current++}`,
      title: "New event",
      start,
      end,
      resourceId: "alex",
      color: "var(--color-blue-500)",
    })
    api.goTo(start)
  }

  return (
    <div className="w-full p-4" dir={activeLocale.dir}>
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <EventCalendar
            defaultEvents={events}
            defaultView="month"
            onViewChange={setView}
            resources={TEAM}
            apiRef={apiRef}
            renderEvent={renderEventContent}
            locale={activeLocale.locale}
            i18n={activeLocale.i18n}
            timeZone={activeTimeZone.value}
            viewSettings={settings.viewSettings}
            onViewSettingsChange={(viewSettings) => patch({ viewSettings })}
            interactions={settings.interactions}
            onInteractionsChange={(interactions) => patch({ interactions })}
            weekStartsOn={settings.weekStartsOn}
            dayStartHour={settings.dayStartHour}
            dayEndHour={settings.dayEndHour}
            interval={settings.interval}
            snapDuration={settings.snapDuration}
            eventTooltip={settings.eventTooltip}
            showDayAddButton={settings.showDayAddButton}
            offDays
            className="h-[640px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 pe-2">
              <EventCalendarNav className="min-w-0 flex-1" />
              <EventCalendarToolbar>
                <Popover>
                  <PopoverTrigger
                    render={<Button variant="outline" size="sm" />}
                  >
                    <IconPlaceholder
                      lucide="Settings2Icon"
                      tabler="IconAdjustmentsHorizontal"
                      hugeicons="SlidersHorizontalIcon"
                      phosphor="SlidersHorizontalIcon"
                      remixicon="RiEqualizer2Line"
                      className="size-4"
                      aria-hidden="true"
                    />
                    Settings
                  </PopoverTrigger>
                  <PopoverContent align="end" sideOffset={8} className="w-80">
                    <Tabs defaultValue="view">
                      <TabsList className="w-full">
                        <TabsTrigger value="view" className="flex-1">
                          View
                        </TabsTrigger>
                        {/* time-grid internals only exist where an hour track
                            renders, so the tab follows the active view */}
                        {isTimeGridView && (
                          <TabsTrigger value="time" className="flex-1">
                            Time grid
                          </TabsTrigger>
                        )}
                        <TabsTrigger value="behavior" className="flex-1">
                          Behavior
                        </TabsTrigger>
                        <TabsTrigger value="region" className="flex-1">
                          Region
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="view" className="flex flex-col gap-3">
                        <SettingsSwitch
                          id="ec-set-weekends"
                          label="Weekends"
                          checked={settings.viewSettings.weekends ?? true}
                          onCheckedChange={(weekends) =>
                            patch({
                              viewSettings: {
                                ...settings.viewSettings,
                                weekends,
                              },
                            })
                          }
                        />
                        <SettingsSwitch
                          id="ec-set-week-numbers"
                          label="Week numbers"
                          checked={settings.viewSettings.weekNumbers ?? false}
                          onCheckedChange={(weekNumbers) =>
                            patch({
                              viewSettings: {
                                ...settings.viewSettings,
                                weekNumbers,
                              },
                            })
                          }
                        />
                        <SettingsSwitch
                          id="ec-set-now"
                          label="Now indicator"
                          checked={settings.viewSettings.nowIndicator ?? true}
                          onCheckedChange={(nowIndicator) =>
                            patch({
                              viewSettings: {
                                ...settings.viewSettings,
                                nowIndicator,
                              },
                            })
                          }
                        />
                        <SettingsSwitch
                          id="ec-set-off-days"
                          label="Mark off days"
                          checked={settings.viewSettings.offDays ?? false}
                          onCheckedChange={(offDays) =>
                            patch({
                              viewSettings: {
                                ...settings.viewSettings,
                                offDays,
                              },
                            })
                          }
                        />
                        <SettingsSwitch
                          id="ec-set-day-add"
                          label="Day add button"
                          checked={settings.showDayAddButton}
                          onCheckedChange={(showDayAddButton) =>
                            patch({ showDayAddButton })
                          }
                        />
                        {/* week start shapes month and week grids alike, so
                            it lives here rather than in time-grid internals */}
                        <SettingsSelect
                          id="ec-set-week-start"
                          label="Week starts"
                          value={settings.weekStartsOn}
                          options={[
                            { value: 0, label: "Sunday" },
                            { value: 1, label: "Monday" },
                          ]}
                          onValueChange={(weekStartsOn) =>
                            patch({ weekStartsOn: weekStartsOn as 0 | 1 })
                          }
                        />
                      </TabsContent>
                      <TabsContent value="time" className="flex flex-col gap-3">
                        <SettingsSelect
                          id="ec-set-day-start"
                          label="Day starts"
                          value={settings.dayStartHour}
                          options={[
                            { value: 0, label: "00:00" },
                            { value: 6, label: "06:00" },
                            { value: 8, label: "08:00" },
                          ]}
                          onValueChange={(dayStartHour) =>
                            patch({ dayStartHour })
                          }
                        />
                        <SettingsSelect
                          id="ec-set-day-end"
                          label="Day ends"
                          value={settings.dayEndHour}
                          options={[
                            { value: 18, label: "18:00" },
                            { value: 20, label: "20:00" },
                            { value: 24, label: "24:00" },
                          ]}
                          onValueChange={(dayEndHour) => patch({ dayEndHour })}
                        />
                        <SettingsSelect
                          id="ec-set-interval"
                          label="Grid interval"
                          value={settings.interval}
                          options={[
                            { value: 30, label: "30 min" },
                            { value: 60, label: "60 min" },
                          ]}
                          onValueChange={(interval) => patch({ interval })}
                        />
                        <SettingsSelect
                          id="ec-set-snap"
                          label="Drag snap"
                          value={settings.snapDuration}
                          options={[
                            { value: 5, label: "5 min" },
                            { value: 15, label: "15 min" },
                            { value: 30, label: "30 min" },
                          ]}
                          onValueChange={(snapDuration) =>
                            patch({ snapDuration })
                          }
                        />
                      </TabsContent>
                      <TabsContent
                        value="behavior"
                        className="flex flex-col gap-3"
                      >
                        <SettingsSwitch
                          id="ec-set-drag"
                          label="Drag to move"
                          checked={settings.interactions.drag}
                          onCheckedChange={(drag) =>
                            patch({
                              interactions: { ...settings.interactions, drag },
                            })
                          }
                        />
                        <SettingsSwitch
                          id="ec-set-resize"
                          label="Drag to resize"
                          checked={settings.interactions.resize}
                          onCheckedChange={(resize) =>
                            patch({
                              interactions: {
                                ...settings.interactions,
                                resize,
                              },
                            })
                          }
                        />
                        <SettingsSwitch
                          id="ec-set-select-slot"
                          label="Drag to create"
                          checked={settings.interactions.selectSlot}
                          onCheckedChange={(selectSlot) =>
                            patch({
                              interactions: {
                                ...settings.interactions,
                                selectSlot,
                              },
                            })
                          }
                        />
                        <SettingsSwitch
                          id="ec-set-tooltip"
                          label="Event tooltips"
                          checked={settings.eventTooltip}
                          onCheckedChange={(eventTooltip) =>
                            patch({ eventTooltip })
                          }
                        />
                      </TabsContent>
                      <TabsContent
                        value="region"
                        className="flex flex-col gap-3"
                      >
                        <SettingsTextSelect
                          id="ec-set-language"
                          label="Language"
                          value={settings.localeId}
                          options={LOCALES.map((entry) => ({
                            value: entry.id,
                            label: entry.label,
                          }))}
                          onValueChange={(localeId) => patch({ localeId })}
                        />
                        <SettingsTextSelect
                          id="ec-set-timezone"
                          label="Time zone"
                          value={settings.timeZoneId}
                          options={TIME_ZONES.map((entry) => ({
                            value: entry.id,
                            label: entry.label,
                          }))}
                          onValueChange={(timeZoneId) => patch({ timeZoneId })}
                        />
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Language switches the date-fns locale and every UI
                          label. Time zone shifts all event times. Arabic also
                          flips the calendar to right-to-left.
                        </p>
                      </TabsContent>
                    </Tabs>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => setSettings(DEFAULT_SETTINGS)}
                    >
                      Reset to defaults
                    </Button>
                  </PopoverContent>
                </Popover>
                <Button size="sm" onClick={addEvent}>
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                  New event
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
        </CardContent>
      </Card>
    </div>
  )
}
