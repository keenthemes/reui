// Description: Filters with custom controls
// Order: 6
// GridSize: 1

"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  DateSelector,
  formatDateValue,
  type DateSelectorValue,
} from "@/registry-reui/bases/base/reui/date-selector"
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@/registry-reui/bases/base/reui/filters"
import {
  endOfMonth,
  endOfYear,
  format,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"
import { Slider } from "@/registry/bases/base/ui/slider"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Type for custom renderer props
type CustomRendererProps = {
  values: unknown[]
  onChange: (values: unknown[]) => void
  autoFocus?: boolean
}

// Modal-based Date Selector Component
function CustomModalDateSelector({
  values,
  onChange,
  autoFocus,
}: CustomRendererProps) {
  const value = values?.[0] as DateSelectorValue | undefined
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<
    DateSelectorValue | undefined
  >(value)

  const formattedValue = value ? formatDateValue(value) : ""
  const displayText = formattedValue || "Select a date"

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => setOpen(true), 400)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  useEffect(() => {
    if (open) {
      setInternalValue(value)
    }
  }, [open, value])

  const handleApply = () => {
    onChange([internalValue])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{displayText}</DialogTrigger>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>

        <DateSelector
          value={internalValue}
          onChange={setInternalValue}
          showInput={true}
        />

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Custom Date Range Input Component
function CustomDateRangeInput({
  values,
  onChange,
  autoFocus,
}: CustomRendererProps) {
  const [date, setDate] = useState<DateRange | undefined>(
    values?.[0] && typeof values[0] === "string"
      ? {
          from: new Date(values[0] as string),
          to:
            values[1] && typeof values[1] === "string"
              ? new Date(values[1] as string)
              : undefined,
        }
      : undefined
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => setIsOpen(true), 400)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  const handleApply = () => {
    if (date?.from) {
      const fromStr = date.from.toISOString().split("T")[0]
      const toStr = date.to ? date.to.toISOString().split("T")[0] : fromStr
      onChange([fromStr, toStr])
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleSelect = (selected: DateRange | undefined) => {
    setDate(selected)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
            </>
          ) : (
            format(date.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={date?.from}
          showOutsideDays={false}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        <div className="border-border flex items-center justify-end gap-1.5 border-t p-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Custom Date Range with Presets Input Component
function CustomDateRangeWithPresetsInput({
  values,
  onChange,
  autoFocus,
}: CustomRendererProps) {
  const today = useMemo(() => new Date(), [])

  const presets = useMemo(
    () => [
      { label: "Today", range: { from: today, to: today } },
      {
        label: "Yesterday",
        range: { from: subDays(today, 1), to: subDays(today, 1) },
      },
      { label: "Last 7 days", range: { from: subDays(today, 6), to: today } },
      { label: "Last 30 days", range: { from: subDays(today, 29), to: today } },
      {
        label: "Month to date",
        range: { from: startOfMonth(today), to: today },
      },
      {
        label: "Last month",
        range: {
          from: startOfMonth(subMonths(today, 1)),
          to: endOfMonth(subMonths(today, 1)),
        },
      },
      { label: "Year to date", range: { from: startOfYear(today), to: today } },
      {
        label: "Last year",
        range: {
          from: startOfYear(subYears(today, 1)),
          to: endOfYear(subYears(today, 1)),
        },
      },
    ],
    [today]
  )

  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<DateRange | undefined>(
    values?.[0] && typeof values[0] === "string"
      ? {
          from: new Date(values[0] as string),
          to:
            values[1] && typeof values[1] === "string"
              ? new Date(values[1] as string)
              : undefined,
        }
      : undefined
  )
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => setIsOpen(true), 400)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  useEffect(() => {
    const matchedPreset = presets.find(
      (preset) =>
        isEqual(
          startOfDay(preset.range.from),
          startOfDay(date?.from || new Date(0))
        ) &&
        isEqual(
          startOfDay(preset.range.to),
          startOfDay(date?.to || new Date(0))
        )
    )
    setSelectedPreset(matchedPreset?.label || null)
  }, [date, presets])

  const handleApply = () => {
    if (date?.from) {
      const fromStr = date.from.toISOString().split("T")[0]
      const toStr = date.to ? date.to.toISOString().split("T")[0] : fromStr
      onChange([fromStr, toStr])
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleSelect = (selected: DateRange | undefined) => {
    setDate({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    })
    setSelectedPreset(null)
  }

  const handlePresetSelect = (preset: (typeof presets)[0]) => {
    setDate(preset.range)
    setMonth(preset.range.from || today)
    setSelectedPreset(preset.label)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        {date?.from ? (
          format(date.from, "LLL dd, y") +
          (date.to ? ` - ${format(date.to, "LLL dd, y")}` : "")
        ) : (
          <span>Pick a date range with presets</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center" sideOffset={8}>
        <div className="flex max-sm:flex-col">
          <div className="border-border relative max-sm:order-1 max-sm:border-t sm:w-32">
            <div className="border-border h-full py-2 sm:border-e">
              <div className="flex flex-col gap-[2px] px-2">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "h-8 w-full justify-start",
                      selectedPreset === preset.label && "bg-accent"
                    )}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Calendar
            autoFocus
            mode="range"
            month={month}
            onMonthChange={setMonth}
            showOutsideDays={false}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </div>
        <div className="border-border flex items-center justify-end gap-1.5 border-t p-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Custom DateTime Input Component
function CustomDateTimeInput({
  values,
  onChange,
  autoFocus,
}: CustomRendererProps) {
  const today = new Date()
  const [date, setDate] = useState<Date | undefined>(
    values?.[0] && typeof values[0] === "string"
      ? new Date(values[0] as string)
      : undefined
  )
  const [time, setTime] = useState<string | undefined>(
    values?.[0] && typeof values[0] === "string"
      ? new Date(values[0] as string).toTimeString().slice(0, 5)
      : "10:00"
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => setIsOpen(true), 400)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  const timeSlots = [
    { time: "09:00", available: false },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: false },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: false },
    { time: "15:00", available: false },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "18:30", available: true },
    { time: "19:00", available: true },
    { time: "19:30", available: true },
    { time: "20:00", available: true },
    { time: "20:30", available: true },
    { time: "21:00", available: true },
    { time: "21:30", available: true },
    { time: "22:00", available: true },
    { time: "22:30", available: true },
    { time: "23:00", available: true },
    { time: "23:30", available: true },
  ]

  const handleApply = () => {
    if (date && time) {
      const dateTime = new Date(date)
      const [hours, minutes] = time.split(":").map(Number)
      dateTime.setHours(hours, minutes, 0, 0)
      onChange([dateTime.toISOString()])
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        {date ? (
          format(date, "PPP") + (time ? ` - ${time}` : "")
        ) : (
          <span>Pick a date and time</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto gap-0 p-0 pt-1" align="start">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate: Date | undefined) => {
              if (newDate) {
                setDate(newDate)
                setTime(undefined)
              }
            }}
            className="p-2 sm:pe-5"
            disabled={[{ before: today }]}
          />
          <div className="relative w-full max-sm:h-46 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium">
                      {date ? format(date, "EEEE, d") : "Pick a date"}
                    </p>
                  </div>
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
                        variant={time === timeSlot ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => setTime(timeSlot)}
                        disabled={!available}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <div className="border-border flex items-center justify-end gap-1.5 border-t p-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Custom Slider Range Input Component
function CustomSliderRangeInput({
  values,
  onChange,
  autoFocus,
}: CustomRendererProps) {
  const [range, setRange] = useState<number[]>(
    values?.[0] &&
      typeof values[0] === "object" &&
      values[0] !== null &&
      "min" in values[0] &&
      "max" in values[0]
      ? [
          (values[0] as { min: number; max: number }).min,
          (values[0] as { min: number; max: number }).max,
        ]
      : [0, 100]
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => setIsOpen(true), 400)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  const handleApply = () => {
    onChange([{ min: range[0], max: range[1] }])
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={<span />}>
        {range[0]} - {range[1]}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-4"
        align="start"
        sideOffset={8}
        alignOffset={-8}
      >
        <div className="space-y-2.5">
          <div className="space-y-4 pt-2.5">
            <Slider
              value={range}
              onValueChange={(value) => setRange(value as number[])}
              max={100}
              min={0}
              step={1}
              className="w-[200px]"
            />
            <div className="text-muted-foreground flex justify-between ps-1.5 text-xs">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" variant="outline" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function Pattern() {
  const [filters, setFilters] = useState<Filter[]>([
    createFilter("customDateRange", "between", []),
  ])
  const [lastAddedValues, setLastAddedValues] = useState<unknown[] | null>(null)

  const fields: FilterFieldConfig[] = [
    {
      key: "modalDateSelector",
      label: "Modal Date Selector",
      icon: (
        <IconPlaceholder
          lucide="CalendarIcon"
          tabler="IconCalendarEvent"
          hugeicons="Calendar04Icon"
          phosphor="CalendarBlankIcon"
          remixicon="RiCalendarLine"
          className="size-3.5"
        />
      ),
      type: "custom",
      operators: [
        { value: "is", label: "is" },
        { value: "is_not", label: "is not" },
      ],
      customRenderer: ({ values, onChange }) => (
        <CustomModalDateSelector
          values={values}
          onChange={onChange}
          autoFocus={values === lastAddedValues}
        />
      ),
    },
    {
      key: "customDateRange",
      label: "Date Range",
      icon: (
        <IconPlaceholder
          lucide="CalendarIcon"
          tabler="IconCalendarEvent"
          hugeicons="Calendar04Icon"
          phosphor="CalendarBlankIcon"
          remixicon="RiCalendarLine"
          className="size-3.5"
        />
      ),
      type: "custom",
      operators: [
        { value: "between", label: "between" },
        { value: "not_between", label: "not between" },
      ],
      customRenderer: ({ values, onChange }) => (
        <CustomDateRangeInput
          values={values}
          onChange={onChange}
          autoFocus={values === lastAddedValues}
        />
      ),
    },
    {
      key: "customDateRangePresets",
      label: "Date Range Presets",
      icon: (
        <IconPlaceholder
          lucide="CalendarIcon"
          tabler="IconCalendarEvent"
          hugeicons="Calendar04Icon"
          phosphor="CalendarBlankIcon"
          remixicon="RiCalendarLine"
          className="size-3.5"
        />
      ),
      type: "custom",
      operators: [
        { value: "between", label: "between" },
        { value: "not_between", label: "not between" },
      ],
      customRenderer: ({ values, onChange }) => (
        <CustomDateRangeWithPresetsInput
          values={values}
          onChange={onChange}
          autoFocus={values === lastAddedValues}
        />
      ),
    },
    {
      key: "customDateTime",
      label: "Date & Time",
      icon: (
        <IconPlaceholder
          lucide="ClockIcon"
          tabler="IconClock"
          hugeicons="ClockIcon"
          phosphor="ClockIcon"
          remixicon="RiTimeLine"
          className="size-3.5"
        />
      ),
      type: "custom",
      operators: [
        { value: "is", label: "is" },
        { value: "before", label: "before" },
        { value: "after", label: "after" },
      ],
      customRenderer: ({ values, onChange }) => (
        <CustomDateTimeInput
          values={values}
          onChange={onChange}
          autoFocus={values === lastAddedValues}
        />
      ),
    },
    {
      key: "customSliderRange",
      label: "Slider Range",
      icon: (
        <IconPlaceholder
          lucide="SlidersVerticalIcon"
          tabler="IconAdjustmentsAlt"
          hugeicons="SlidersVerticalIcon"
          phosphor="FadersIcon"
          remixicon="RiSoundModuleLine"
          className="size-3.5"
        />
      ),
      type: "custom",
      className: "w-36",
      operators: [
        { value: "between", label: "between" },
        { value: "not_between", label: "not between" },
      ],
      customRenderer: ({ values, onChange }) => (
        <CustomSliderRangeInput
          values={values}
          onChange={onChange}
          autoFocus={values === lastAddedValues}
        />
      ),
    },
  ]

  const handleFiltersChange = useCallback(
    (newFilters: Filter[]) => {
      // Check if a filter was added by comparing IDs
      const added = newFilters.find(
        (nf) => !filters.some((f) => f.id === nf.id)
      )
      if (added) {
        setLastAddedValues(added.values)
      }
      setFilters(newFilters)
    },
    [filters]
  )

  return (
    <div className="flex grow content-start items-start gap-2.5 space-y-6 self-start">
      <div className="flex-1">
        <Filters
          filters={filters}
          fields={fields}
          onChange={handleFiltersChange}
          trigger={
            <Button variant="outline" size="icon">
              <IconPlaceholder
                lucide="ListFilterIcon"
                tabler="IconFilter2"
                hugeicons="FilterMailIcon"
                phosphor="FunnelSimpleIcon"
                remixicon="RiFilter3Line"
              />
            </Button>
          }
        />
      </div>

      {filters.length > 0 && (
        <Button variant="outline" onClick={() => setFilters([])}>
          <IconPlaceholder
            lucide="FunnelXIcon"
            tabler="IconFilterX"
            hugeicons="FilterRemoveIcon"
            phosphor="FunnelXIcon"
            remixicon="RiFilterOffLine"
          />
          Clear
        </Button>
      )}
    </div>
  )
}
