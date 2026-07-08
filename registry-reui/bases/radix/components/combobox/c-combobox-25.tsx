"use client"

import * as React from "react"
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfDay,
} from "date-fns"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { Calendar } from "@/registry/bases/radix/ui/calendar"
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@/registry/bases/radix/ui/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/bases/radix/ui/dialog"
import { Field } from "@/registry/bases/radix/ui/field"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type PresetDateOption = {
  type: "preset"
  id: string
  label: string
  date: Date
  searchText: string
}

type CustomDateAction = {
  type: "custom"
  id: "custom-date"
  label: string
  searchText: string
}

type EmptyDateOption = {
  type: "none"
  id: "no-date"
  label: string
  searchText: string
}

type DateOption = EmptyDateOption | PresetDateOption | CustomDateAction

const noDateOption: EmptyDateOption = {
  type: "none",
  id: "no-date",
  label: "No date",
  searchText: "No date clear date remove date empty",
}

const customDateOption: CustomDateAction = {
  type: "custom",
  id: "custom-date",
  label: "Custom date...",
  searchText:
    "Custom date custom day calendar picker choose a date manual date",
}

type DateSelectionValue =
  | {
      type: "preset"
      id: string
      label: string
      date: Date
    }
  | {
      type: "custom"
      label: string
      date: Date
    }
  | null

function CalendarGlyph({ className }: { className?: string }) {
  return (
    <IconPlaceholder
      lucide="CalendarIcon"
      tabler="IconCalendarEvent"
      hugeicons="Calendar04Icon"
      phosphor="CalendarBlankIcon"
      remixicon="RiCalendarLine"
      className={cn("size-4 shrink-0", className)}
    />
  )
}

function CalendarSearchGlyph({ className }: { className?: string }) {
  return (
    <IconPlaceholder
      lucide="CalendarSearchIcon"
      tabler="IconCalendarEvent"
      hugeicons="Calendar04Icon"
      phosphor="CalendarBlankIcon"
      remixicon="RiCalendarLine"
      className={cn("size-4 shrink-0", className)}
    />
  )
}

function DateTriggerLabel({
  value,
  placeholder,
}: {
  value: DateSelectionValue
  placeholder: string
}) {
  if (!value) {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <CalendarGlyph className="text-muted-foreground" />
        <span className="text-muted-foreground truncate">{placeholder}</span>
      </span>
    )
  }

  const displayLabel =
    value.type === "custom" ? format(value.date, "MMM d") : value.label

  return (
    <span className="flex min-w-0 items-center gap-2">
      <CalendarGlyph className="text-muted-foreground" />
      <span className="truncate">{displayLabel}</span>
    </span>
  )
}

function DateOptionRow({ option }: { option: DateOption }) {
  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <CalendarGlyph className="text-muted-foreground" />
        <span className="truncate">{option.label}</span>
      </span>
    )
  }

  if (option.type === "custom") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <CalendarSearchGlyph className="text-muted-foreground" />
        <span className="truncate">{option.label}</span>
      </span>
    )
  }

  return (
    <span className="flex w-full min-w-0 items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2">
        <CalendarGlyph className="text-muted-foreground" />
        <span className="truncate">{option.label}</span>
      </span>
      <span className="text-muted-foreground shrink-0 text-[13px] tabular-nums">
        {format(option.date, "dd/MM/yyyy")}
      </span>
    </span>
  )
}

function getUpcomingWeekEnd(today: Date) {
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  return isSameDay(today, weekEnd) ? addWeeks(weekEnd, 1) : weekEnd
}

function getUpcomingMonthEnd(today: Date) {
  const monthEnd = endOfMonth(today)
  return isSameDay(today, monthEnd) ? endOfMonth(addMonths(today, 1)) : monthEnd
}

function DateSelectionCombobox({
  value,
  onValueChange,
}: {
  value: DateSelectionValue
  onValueChange: (value: DateSelectionValue) => void
}) {
  const today = React.useMemo(() => startOfDay(new Date()), [])
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [draftDate, setDraftDate] = React.useState<Date | undefined>(
    value?.date ?? addDays(today, 1)
  )

  const presetOptions = React.useMemo<PresetDateOption[]>(
    () => [
      {
        type: "preset",
        id: "tomorrow",
        label: "Tomorrow",
        date: addDays(today, 1),
        searchText: "Tomorrow next day due date",
      },
      {
        type: "preset",
        id: "end-of-week",
        label: "End of week",
        date: getUpcomingWeekEnd(today),
        searchText: "End of week Sunday week close target",
      },
      {
        type: "preset",
        id: "in-one-week",
        label: "In one week",
        date: addWeeks(today, 1),
        searchText: "In one week next week seven days target",
      },
      {
        type: "preset",
        id: "end-of-month",
        label: "End of month",
        date: getUpcomingMonthEnd(today),
        searchText: "End of month month close month end target",
      },
      {
        type: "preset",
        id: "in-one-month",
        label: "In one month",
        date: addMonths(today, 1),
        searchText: "In one month next month thirty days target",
      },
    ],
    [today]
  )

  const dateOptions: DateOption[] = [
    noDateOption,
    ...presetOptions,
    customDateOption,
  ]

  const activePreset =
    value?.type === "preset"
      ? (presetOptions.find((option) => option.id === value.id) ?? null)
      : !value
        ? noDateOption
        : null

  React.useEffect(() => {
    if (!pickerOpen) {
      return
    }

    setDraftDate(value?.date ?? addDays(today, 1))
  }, [pickerOpen, today, value])

  function handleOptionChange(nextValue: DateOption | null) {
    if (!nextValue) {
      return
    }

    if (nextValue.type === "none") {
      onValueChange(null)
      return
    }

    if (nextValue.type === "custom") {
      requestAnimationFrame(() => setPickerOpen(true))
      return
    }

    onValueChange({
      type: "preset",
      id: nextValue.id,
      label: nextValue.label,
      date: nextValue.date,
    })
  }

  function handleConfirmCustomDate() {
    if (!draftDate) {
      return
    }

    onValueChange({
      type: "custom",
      label: format(draftDate, "MMM d"),
      date: draftDate,
    })
    setPickerOpen(false)
  }

  return (
    <>
      <Combobox
        items={dateOptions}
        value={activePreset}
        onValueChange={handleOptionChange}
        itemToStringValue={(item: DateOption) => item.searchText}
        autoHighlight
      >
        <ComboboxTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            />
          }
        >
          <DateTriggerLabel value={value} placeholder="Set start" />
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxList>
            <ComboboxItem value={noDateOption}>
              <DateOptionRow option={noDateOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            {presetOptions.map((option) => (
              <ComboboxItem key={option.id} value={option}>
                <DateOptionRow option={option} />
              </ComboboxItem>
            ))}

            <ComboboxSeparator />
            <ComboboxItem value={customDateOption}>
              <DateOptionRow option={customDateOption} />
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="flex w-auto max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden sm:max-w-none">
          <DialogHeader>
            <DialogTitle>Pick a date</DialogTitle>
          </DialogHeader>

          <div className="py-3">
            <Calendar
              mode="single"
              selected={draftDate}
              onSelect={setDraftDate}
              defaultMonth={draftDate ?? today}
              numberOfMonths={2}
              pagedNavigation
              showOutsideDays={false}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Dismiss
              </Button>
            </DialogClose>
            <Button
              size="sm"
              onClick={handleConfirmCustomDate}
              disabled={!draftDate}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function Pattern() {
  const [startDate, setStartDate] = React.useState<DateSelectionValue>(null)

  return (
    <Field className="max-w-xs">
      <DateSelectionCombobox value={startDate} onValueChange={setStartDate} />
    </Field>
  )
}
