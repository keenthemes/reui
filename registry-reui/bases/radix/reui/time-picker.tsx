"use client"

import type { ReactNode } from "react"
import * as React from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { cva } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface TimePickerDisabledTimeOptions {
  hour: number
  minute: number
  second?: number
}

export interface ParsedTime {
  hour: number
  minute: number
  second: number
}

export type TimePickerSize = "sm" | "default" | "lg"
export type TimePickerColumnType = "hour" | "minute" | "second" | "period"

export interface TimePickerI18nConfig {
  ariaLabel: string
  clear: string
  confirm: string
  hour: string
  hoursAriaLabel: string
  minute: string
  minutesAriaLabel: string
  now: string
  period: string
  periodAriaLabel: string
  placeholder: string
  second: string
  secondsAriaLabel: string
}

export type TimePickerLocale = "en" | "zh"

export const TIME_PICKER_I18N: Record<TimePickerLocale, TimePickerI18nConfig> =
  {
    en: {
      ariaLabel: "Select time",
      clear: "Clear",
      confirm: "OK",
      hour: "Hour",
      hoursAriaLabel: "Hours",
      minute: "Minute",
      minutesAriaLabel: "Minutes",
      now: "Now",
      period: "AM/PM",
      periodAriaLabel: "AM / PM period",
      placeholder: "Select time",
      second: "Second",
      secondsAriaLabel: "Seconds",
    },
    zh: {
      ariaLabel: "选择时间",
      clear: "清空",
      confirm: "确定",
      hour: "时",
      hoursAriaLabel: "小时",
      minute: "分",
      minutesAriaLabel: "分钟",
      now: "此时",
      period: "周期",
      periodAriaLabel: "上下午",
      placeholder: "请选择时间",
      second: "秒",
      secondsAriaLabel: "秒",
    },
  }

export interface TimePickerContextValue {
  align?: "start" | "center" | "end"
  ariaInvalid?: boolean
  ariaLabel?: string
  clearable?: boolean
  currentPeriod: "AM" | "PM"
  disabled?: boolean
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  disabledTime?: (options: TimePickerDisabledTimeOptions) => boolean
  format?: string
  handleClear: () => void
  handleNow: () => void
  handleSelectHour: (h: number) => void
  handleSelectMinute: (m: number) => void
  handleSelectPeriod: (p: "AM" | "PM") => void
  handleSelectSecond: (s: number) => void
  hasSeconds: boolean
  hours: number[]
  hourStep: number
  i18n: TimePickerI18nConfig
  id?: string
  is12Hours: boolean
  isHourDisabled: (h: number, period: "AM" | "PM") => boolean
  isMinuteDisabled: (h24: number, m: number) => boolean
  isPeriodDisabled: (period: "AM" | "PM") => boolean
  isSecondDisabled: (h24: number, m: number, s: number) => boolean
  locale: TimePickerLocale
  minutes: number[]
  minuteStep: number
  nowButton?: boolean
  open: boolean
  parsedValue: ParsedTime | null
  placeholder?: string
  seconds: number[]
  secondStep: number
  selectedDisplayH: number | null
  selectedH24: number
  selectedM: number | null
  selectedS: number | null
  setOpen: (open: boolean) => void
  size: TimePickerSize
  triggerId: string
  value: string
}

export interface TimePickerProps {
  /** Alignment of the popover content */
  align?: "start" | "center" | "end"
  /** Mark trigger as invalid for form error state linkage */
  ariaInvalid?: boolean
  /** Accessible label for the trigger button */
  ariaLabel?: string
  /** Composable subcomponents; renders standard full picker layout if omitted */
  children?: ReactNode
  /** Additional CSS class names applied to the trigger */
  className?: string
  /** Whether to show the clear button in footer, defaults to true */
  clearable?: boolean
  /** Controlled or initial uncontrolled value */
  defaultValue?: string
  /** Disables trigger and interaction */
  disabled?: boolean
  /** Predicate returning hours (0-23) to disable */
  disabledHours?: () => number[]
  /** Predicate returning minutes (0-59) to disable given selected hour */
  disabledMinutes?: (selectedHour: number) => number[]
  /** Predicate returning seconds (0-59) to disable given selected hour and minute */
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  /** Custom granular disabled predicate */
  disabledTime?: (options: TimePickerDisabledTimeOptions) => boolean
  /** Time format string: "HH:mm" (default) | "HH:mm:ss" | "hh:mm a" | "hh:mm:ss a" */
  format?: string
  /** Hour stepping interval, defaults to 1 */
  hourStep?: number
  /** Internationalization text and ARIA overrides */
  i18n?: Partial<TimePickerI18nConfig>
  /** Associated input / trigger id */
  id?: string
  /** Built-in locale preset, defaults to "en" */
  locale?: TimePickerLocale
  /** Upper bound selectable time (e.g. "18:00" or "18:00:00") */
  maxTime?: string
  /** Lower bound selectable time (e.g. "08:00" or "08:00:00") */
  minTime?: string
  /** Minute stepping interval, defaults to 1 */
  minuteStep?: number
  /** Whether to show the "Now" shortcut button, defaults to true */
  nowButton?: boolean
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Callback fired when time selection changes */
  onChange?: (value: string) => void
  /** Placeholder text shown when empty, defaults to "Select time" */
  placeholder?: string
  /** Second stepping interval, defaults to 1 */
  secondStep?: number
  /** Whether to display the seconds column */
  showSeconds?: boolean
  /** Size variant matching ReUI button standards (sm: 28px, default: 32px, lg: 36px) */
  size?: TimePickerSize
  /** Whether to use 12-hour display mode with AM/PM column */
  use12Hours?: boolean
  /** Current controlled time value */
  value?: string
}

/* -------------------------------------------------------------------------- */
/*                               Time Utilities                               */
/* -------------------------------------------------------------------------- */

export function parseTimeString(value?: string | null): ParsedTime | null {
  if (!value || typeof value !== "string") return null

  const trimmed = value.trim()
  if (!trimmed) return null

  // 12-hour format: "09:30 AM", "09:30:45 PM", "9:30 am"
  const twelveHourMatch = trimmed.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/
  )
  if (twelveHourMatch) {
    const rawHour = Number(twelveHourMatch[1])
    const rawMinute = Number(twelveHourMatch[2])
    const rawSecond = twelveHourMatch[3] ? Number(twelveHourMatch[3]) : 0
    const period = twelveHourMatch[4]!.toUpperCase()

    if (
      rawHour < 1 ||
      rawHour > 12 ||
      rawMinute < 0 ||
      rawMinute > 59 ||
      rawSecond < 0 ||
      rawSecond > 59
    ) {
      return null
    }

    let hour = rawHour % 12
    if (period === "PM") {
      hour += 12
    }

    return { hour, minute: rawMinute, second: rawSecond }
  }

  // 24-hour format: "09:30", "09:30:45", "9:30"
  const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1])
    const minute = Number(twentyFourHourMatch[2])
    const second = twentyFourHourMatch[3] ? Number(twentyFourHourMatch[3]) : 0

    if (
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59 ||
      second < 0 ||
      second > 59
    ) {
      return null
    }

    return { hour, minute, second }
  }

  return null
}

export function formatTimeString(
  hour: number,
  minute: number,
  second: number,
  options: { showSeconds: boolean; use12Hours: boolean }
): string {
  const { showSeconds, use12Hours } = options

  if (use12Hours) {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    const formattedHour = String(displayHour).padStart(2, "0")
    const formattedMinute = String(minute).padStart(2, "0")
    const formattedSecond = String(second).padStart(2, "0")

    if (showSeconds) {
      return `${formattedHour}:${formattedMinute}:${formattedSecond} ${period}`
    }
    return `${formattedHour}:${formattedMinute} ${period}`
  }

  const formattedHour = String(hour).padStart(2, "0")
  const formattedMinute = String(minute).padStart(2, "0")
  const formattedSecond = String(second).padStart(2, "0")

  if (showSeconds) {
    return `${formattedHour}:${formattedMinute}:${formattedSecond}`
  }
  return `${formattedHour}:${formattedMinute}`
}

function timeToSeconds(hour: number, minute: number, second = 0): number {
  return hour * 3600 + minute * 60 + second
}

/* -------------------------------------------------------------------------- */
/*                               CVA Variants                                 */
/* -------------------------------------------------------------------------- */

export const timePickerTriggerVariants = cva(
  "w-full justify-between font-normal border border-input bg-transparent dark:bg-input/30 hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 transition-colors cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-7 text-xs px-2 [&_svg]:size-3.5",
        default: "h-8 text-sm px-2.5 [&_svg]:size-4",
        lg: "h-9 text-sm px-3 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

const TimePickerContext = createContext<TimePickerContextValue | null>(null)

export function useTimePicker(): TimePickerContextValue {
  const context = useContext(TimePickerContext)
  if (!context) {
    throw new Error("useTimePicker must be used within a TimePicker component.")
  }
  return context
}

/* -------------------------------------------------------------------------- */
/*                              Root Component                                */
/* -------------------------------------------------------------------------- */

export function TimePicker({
  align = "start",
  ariaInvalid = false,
  ariaLabel: propAriaLabel,
  children,
  className,
  clearable = true,
  defaultValue,
  disabled = false,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  disabledTime,
  format,
  hourStep = 1,
  i18n: propI18n,
  id,
  locale = "en",
  maxTime,
  minTime,
  minuteStep = 1,
  nowButton = true,
  open: propOpen,
  onOpenChange: propOnOpenChange,
  onChange: propOnChange,
  placeholder: propPlaceholder,
  secondStep = 1,
  showSeconds: propShowSeconds,
  size = "default",
  use12Hours: propUse12Hours,
  value: propValue,
}: TimePickerProps) {
  const triggerId = useId()

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlledOpen = propOpen !== undefined
  const open = isControlledOpen ? propOpen : uncontrolledOpen
  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlledOpen) {
        setUncontrolledOpen(nextOpen)
      }
      propOnOpenChange?.(nextOpen)
    },
    [isControlledOpen, propOnOpenChange]
  )

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "")
  const isControlledValue = propValue !== undefined
  const value = isControlledValue ? propValue : uncontrolledValue

  const onChange = useCallback(
    (nextValue: string) => {
      if (!isControlledValue) {
        setUncontrolledValue(nextValue)
      }
      propOnChange?.(nextValue)
    },
    [isControlledValue, propOnChange]
  )

  const resolvedI18n = useMemo<TimePickerI18nConfig>(() => {
    const base = TIME_PICKER_I18N[locale] ?? TIME_PICKER_I18N.en
    return {
      ...base,
      ...propI18n,
    }
  }, [locale, propI18n])

  const ariaLabel = propAriaLabel ?? resolvedI18n.ariaLabel
  const placeholder = propPlaceholder ?? resolvedI18n.placeholder

  const is12Hours = useMemo(() => {
    if (propUse12Hours !== undefined) return propUse12Hours
    if (format) {
      return /a|hh/i.test(format)
    }
    return false
  }, [propUse12Hours, format])

  const hasSeconds = useMemo(() => {
    if (propShowSeconds !== undefined) return propShowSeconds
    if (format) {
      return /s/i.test(format)
    }
    return false
  }, [propShowSeconds, format])

  const parsedValue = useMemo(() => parseTimeString(value), [value])

  const minSeconds = useMemo(() => {
    if (!minTime) return null
    const parsed = parseTimeString(minTime)
    return parsed
      ? timeToSeconds(parsed.hour, parsed.minute, parsed.second)
      : null
  }, [minTime])

  const maxSeconds = useMemo(() => {
    if (!maxTime) return null
    const parsed = parseTimeString(maxTime)
    return parsed
      ? timeToSeconds(parsed.hour, parsed.minute, parsed.second)
      : null
  }, [maxTime])

  const hours = useMemo(() => {
    const list: number[] = []
    const maxHour = is12Hours ? 12 : 23
    const minHour = is12Hours ? 1 : 0
    const step = Math.max(1, hourStep)

    for (let h = minHour; h <= maxHour; h += step) {
      list.push(h)
    }
    return list
  }, [is12Hours, hourStep])

  const minutes = useMemo(() => {
    const list: number[] = []
    const step = Math.max(1, minuteStep)
    for (let m = 0; m <= 59; m += step) {
      list.push(m)
    }
    return list
  }, [minuteStep])

  const seconds = useMemo(() => {
    if (!hasSeconds) return []
    const list: number[] = []
    const step = Math.max(1, secondStep)
    for (let s = 0; s <= 59; s += step) {
      list.push(s)
    }
    return list
  }, [hasSeconds, secondStep])

  const currentPeriod = useMemo(() => {
    if (!is12Hours) return "AM"
    if (parsedValue) {
      return parsedValue.hour >= 12 ? "PM" : "AM"
    }
    return "AM"
  }, [is12Hours, parsedValue])

  const to24Hour = useCallback(
    (displayHour: number, period: "AM" | "PM"): number => {
      if (!is12Hours) return displayHour
      const mod = displayHour % 12
      return period === "PM" ? mod + 12 : mod
    },
    [is12Hours]
  )

  const to12Hour = useCallback((hour: number): number => {
    return hour % 12 === 0 ? 12 : hour % 12
  }, [])

  const isTimePointDisabled = useCallback(
    (h24: number, m: number, s: number): boolean => {
      const totalSec = timeToSeconds(h24, m, s)
      if (minSeconds !== null && totalSec < minSeconds) return true
      if (maxSeconds !== null && totalSec > maxSeconds) return true
      if (disabledHours?.().includes(h24)) return true
      if (disabledMinutes?.(h24).includes(m)) return true
      if (disabledSeconds?.(h24, m).includes(s)) return true
      if (disabledTime?.({ hour: h24, minute: m, second: s })) return true
      return false
    },
    [
      minSeconds,
      maxSeconds,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      disabledTime,
    ]
  )

  const isHourDisabled = useCallback(
    (h: number, period: "AM" | "PM"): boolean => {
      const h24 = to24Hour(h, period)
      if (disabledHours?.().includes(h24)) return true

      if (minSeconds !== null && timeToSeconds(h24, 59, 59) < minSeconds)
        return true
      if (maxSeconds !== null && timeToSeconds(h24, 0, 0) > maxSeconds)
        return true

      const stepM = Math.max(1, minuteStep)
      let allMinutesDisabled = true
      for (let m = 0; m <= 59; m += stepM) {
        if (!isTimePointDisabled(h24, m, 0)) {
          allMinutesDisabled = false
          break
        }
      }
      return allMinutesDisabled
    },
    [
      to24Hour,
      disabledHours,
      minSeconds,
      maxSeconds,
      minuteStep,
      isTimePointDisabled,
    ]
  )

  const isMinuteDisabled = useCallback(
    (h24: number, m: number): boolean => {
      if (disabledMinutes?.(h24).includes(m)) return true

      if (minSeconds !== null && timeToSeconds(h24, m, 59) < minSeconds)
        return true
      if (maxSeconds !== null && timeToSeconds(h24, m, 0) > maxSeconds)
        return true

      if (hasSeconds) {
        const stepS = Math.max(1, secondStep)
        let allSecondsDisabled = true
        for (let s = 0; s <= 59; s += stepS) {
          if (!isTimePointDisabled(h24, m, s)) {
            allSecondsDisabled = false
            break
          }
        }
        return allSecondsDisabled
      }

      return isTimePointDisabled(h24, m, 0)
    },
    [
      disabledMinutes,
      minSeconds,
      maxSeconds,
      hasSeconds,
      secondStep,
      isTimePointDisabled,
    ]
  )

  const isSecondDisabled = useCallback(
    (h24: number, m: number, s: number): boolean => {
      return isTimePointDisabled(h24, m, s)
    },
    [isTimePointDisabled]
  )

  const isPeriodDisabled = useCallback(
    (period: "AM" | "PM"): boolean => {
      return hours.every((h) => isHourDisabled(h, period))
    },
    [hours, isHourDisabled]
  )

  const selectedDisplayH = parsedValue
    ? is12Hours
      ? to12Hour(parsedValue.hour)
      : parsedValue.hour
    : null
  const selectedH24 = parsedValue
    ? parsedValue.hour
    : is12Hours
      ? to24Hour(12, currentPeriod)
      : 0
  const selectedM = parsedValue ? parsedValue.minute : null
  const selectedS = parsedValue ? parsedValue.second : null

  const handleSelectHour = useCallback(
    (h: number) => {
      const h24 = to24Hour(h, currentPeriod)
      const m = selectedM ?? 0
      const s = hasSeconds ? (selectedS ?? 0) : 0

      const formatted = formatTimeString(h24, m, s, {
        showSeconds: hasSeconds,
        use12Hours: is12Hours,
      })
      onChange(formatted)
    },
    [
      to24Hour,
      currentPeriod,
      selectedM,
      hasSeconds,
      selectedS,
      is12Hours,
      onChange,
    ]
  )

  const handleSelectMinute = useCallback(
    (m: number) => {
      const h24 = selectedH24
      const s = hasSeconds ? (selectedS ?? 0) : 0

      const formatted = formatTimeString(h24, m, s, {
        showSeconds: hasSeconds,
        use12Hours: is12Hours,
      })
      onChange(formatted)
    },
    [selectedH24, hasSeconds, selectedS, is12Hours, onChange]
  )

  const handleSelectSecond = useCallback(
    (s: number) => {
      const h24 = selectedH24
      const m = selectedM ?? 0

      const formatted = formatTimeString(h24, m, s, {
        showSeconds: hasSeconds,
        use12Hours: is12Hours,
      })
      onChange(formatted)
    },
    [selectedH24, selectedM, hasSeconds, is12Hours, onChange]
  )

  const handleSelectPeriod = useCallback(
    (period: "AM" | "PM") => {
      if (!is12Hours) return
      const current12H = selectedDisplayH ?? 12
      const h24 = to24Hour(current12H, period)
      const m = selectedM ?? 0
      const s = hasSeconds ? (selectedS ?? 0) : 0

      const formatted = formatTimeString(h24, m, s, {
        showSeconds: hasSeconds,
        use12Hours: true,
      })
      onChange(formatted)
    },
    [
      is12Hours,
      selectedDisplayH,
      to24Hour,
      selectedM,
      hasSeconds,
      selectedS,
      onChange,
    ]
  )

  const handleNow = useCallback(() => {
    const now = new Date()
    const rawH = now.getHours()
    const rawM = now.getMinutes()
    const rawS = now.getSeconds()

    const stepH = Math.max(1, hourStep)
    const stepM = Math.max(1, minuteStep)
    const stepS = Math.max(1, secondStep)

    const nowH = Math.round(rawH / stepH) * stepH
    const nowM = Math.round(rawM / stepM) * stepM
    const nowS = hasSeconds ? Math.round(rawS / stepS) * stepS : 0

    if (isTimePointDisabled(nowH, nowM, nowS)) {
      return
    }

    const formatted = formatTimeString(nowH, nowM, nowS, {
      showSeconds: hasSeconds,
      use12Hours: is12Hours,
    })
    onChange(formatted)
  }, [
    hourStep,
    minuteStep,
    secondStep,
    hasSeconds,
    isTimePointDisabled,
    is12Hours,
    onChange,
  ])

  const handleClear = useCallback(() => {
    onChange("")
  }, [onChange])

  const contextValue = useMemo<TimePickerContextValue>(
    () => ({
      align,
      ariaInvalid,
      ariaLabel,
      clearable,
      currentPeriod,
      disabled,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      disabledTime,
      format,
      handleClear,
      handleNow,
      handleSelectHour,
      handleSelectMinute,
      handleSelectPeriod,
      handleSelectSecond,
      hasSeconds,
      hours,
      hourStep,
      i18n: resolvedI18n,
      id,
      is12Hours,
      isHourDisabled,
      isMinuteDisabled,
      isPeriodDisabled,
      isSecondDisabled,
      locale,
      minutes,
      minuteStep,
      nowButton,
      open,
      parsedValue,
      placeholder,
      seconds,
      secondStep,
      selectedDisplayH,
      selectedH24,
      selectedM,
      selectedS,
      setOpen,
      size,
      triggerId,
      value,
    }),
    [
      align,
      ariaInvalid,
      ariaLabel,
      clearable,
      currentPeriod,
      disabled,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      disabledTime,
      format,
      handleClear,
      handleNow,
      handleSelectHour,
      handleSelectMinute,
      handleSelectPeriod,
      handleSelectSecond,
      hasSeconds,
      hours,
      hourStep,
      id,
      is12Hours,
      isHourDisabled,
      isMinuteDisabled,
      isPeriodDisabled,
      isSecondDisabled,
      locale,
      minutes,
      minuteStep,
      nowButton,
      open,
      parsedValue,
      placeholder,
      resolvedI18n,
      seconds,
      secondStep,
      selectedDisplayH,
      selectedH24,
      selectedM,
      selectedS,
      setOpen,
      size,
      triggerId,
      value,
    ]
  )

  return (
    <TimePickerContext.Provider value={contextValue}>
      <Popover open={open} onOpenChange={setOpen}>
        <div data-slot="time-picker" className="relative w-full">
          {children ? (
            children
          ) : (
            <>
              <TimePickerTrigger className={className} />
              <TimePickerContent align={align}>
                <TimePickerGroup>
                  <TimePickerColumn type="hour" />
                  <TimePickerColumn type="minute" />
                  {hasSeconds && <TimePickerColumn type="second" />}
                  {is12Hours && <TimePickerColumn type="period" />}
                </TimePickerGroup>
                {(nowButton || clearable) && (
                  <TimePickerFooter>
                    {nowButton && <TimePickerNow />}
                    {clearable && <TimePickerClear />}
                    <TimePickerConfirm />
                  </TimePickerFooter>
                )}
              </TimePickerContent>
            </>
          )}
        </div>
      </Popover>
    </TimePickerContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Trigger Component                            */
/* -------------------------------------------------------------------------- */

export interface TimePickerTriggerProps {
  asChild?: boolean
  children?: ReactNode
  className?: string
  size?: TimePickerSize
}

export function TimePickerTrigger({
  asChild = false,
  children,
  className,
  size: sizeProp,
}: TimePickerTriggerProps) {
  const {
    ariaInvalid,
    ariaLabel,
    disabled,
    id,
    placeholder,
    size: contextSize,
    triggerId,
    value,
  } = useTimePicker()

  const size = sizeProp ?? contextSize

  if (asChild) {
    return <PopoverTrigger asChild>{children}</PopoverTrigger>
  }

  return (
    <PopoverTrigger asChild>
      <Button
        aria-invalid={ariaInvalid}
        aria-label={ariaLabel}
        className={cn(timePickerTriggerVariants({ size }), className)}
        data-slot="time-picker-trigger"
        disabled={disabled}
        id={id ?? triggerId}
        type="button"
        variant="outline"
      >
        {children ?? (
          <>
            <span
              className={cn(!value && "text-muted-foreground", "tabular-nums")}
            >
              {value || placeholder}
            </span>
            <IconPlaceholder
              lucide="ClockIcon"
              tabler="IconClock"
              hugeicons="Clock01Icon"
              phosphor="ClockIcon"
              remixicon="RiTimeLine"
              aria-hidden="true"
              className="size-4 shrink-0 opacity-60"
            />
          </>
        )}
      </Button>
    </PopoverTrigger>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Content Component                            */
/* -------------------------------------------------------------------------- */

export interface TimePickerContentProps {
  align?: "start" | "center" | "end"
  children: ReactNode
  className?: string
}

export function TimePickerContent({
  align: alignProp,
  children,
  className,
}: TimePickerContentProps) {
  const { align: contextAlign } = useTimePicker()
  const align = alignProp ?? contextAlign ?? "start"

  return (
    <PopoverContent
      align={align}
      className={cn(
        "w-auto min-w-[8.5rem] gap-0 overflow-hidden p-0",
        className
      )}
      data-slot="time-picker-content"
    >
      {children}
    </PopoverContent>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Group Component                             */
/* -------------------------------------------------------------------------- */

export interface TimePickerGroupProps {
  children: ReactNode
  className?: string
}

export function TimePickerGroup({ children, className }: TimePickerGroupProps) {
  return (
    <div
      className={cn("divide-border/40 flex divide-x select-none", className)}
      data-slot="time-picker-group"
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Column Component                             */
/* -------------------------------------------------------------------------- */

export interface TimePickerColumnProps {
  className?: string
  label?: string
  type: TimePickerColumnType
}

export function TimePickerColumn({
  className,
  label,
  type,
}: TimePickerColumnProps) {
  const {
    currentPeriod,
    handleSelectHour,
    handleSelectMinute,
    handleSelectPeriod,
    handleSelectSecond,
    hours,
    i18n,
    isHourDisabled,
    isMinuteDisabled,
    isPeriodDisabled,
    isSecondDisabled,
    minutes,
    open,
    seconds,
    selectedDisplayH,
    selectedH24,
    selectedM,
    selectedS,
  } = useTimePicker()

  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string | number, HTMLButtonElement | null>>({})

  const displayLabel = useMemo(() => {
    if (label !== undefined) return label
    switch (type) {
      case "hour":
        return i18n.hour
      case "minute":
        return i18n.minute
      case "second":
        return i18n.second
      case "period":
        return i18n.period
    }
  }, [label, type, i18n])

  const ariaLabel = useMemo(() => {
    switch (type) {
      case "hour":
        return i18n.hoursAriaLabel
      case "minute":
        return i18n.minutesAriaLabel
      case "second":
        return i18n.secondsAriaLabel
      case "period":
        return i18n.periodAriaLabel
    }
  }, [type, i18n])

  useEffect(() => {
    if (!open) return

    let targetKey: string | number | null = null
    if (type === "hour") targetKey = selectedDisplayH
    else if (type === "minute") targetKey = selectedM
    else if (type === "second") targetKey = selectedS
    else if (type === "period") targetKey = currentPeriod

    if (targetKey !== null && itemRefs.current[targetKey]) {
      const el = itemRefs.current[targetKey]
      if (typeof el?.scrollIntoView === "function") {
        el.scrollIntoView({ block: "center", behavior: "instant" })
      }
    }
  }, [open, type, selectedDisplayH, selectedM, selectedS, currentPeriod])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const container = listRef.current
      if (!container) return

      const items = Array.from(
        container.querySelectorAll<HTMLButtonElement>(
          'button[role="option"]:not([disabled])'
        )
      )
      if (items.length === 0) return

      const activeEl = document.activeElement as HTMLButtonElement | null
      const currentIndex = activeEl ? items.indexOf(activeEl) : -1

      const scrollElIntoView = (el?: HTMLButtonElement | null) => {
        if (typeof el?.scrollIntoView === "function") {
          el.scrollIntoView({ block: "nearest", behavior: "smooth" })
        }
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        items[nextIndex]?.focus()
        scrollElIntoView(items[nextIndex])
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        items[prevIndex]?.focus()
        scrollElIntoView(items[prevIndex])
      } else if (e.key === "Home") {
        e.preventDefault()
        items[0]?.focus()
        scrollElIntoView(items[0])
      } else if (e.key === "End") {
        e.preventDefault()
        items[items.length - 1]?.focus()
        scrollElIntoView(items[items.length - 1])
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const group = container.closest('[data-slot="time-picker-group"]')
        if (!group) return
        const columns = Array.from(
          group.querySelectorAll<HTMLDivElement>(
            '[data-slot="time-picker-column-scroll"]'
          )
        )
        const colIdx = columns.indexOf(container)
        if (colIdx !== -1) {
          const nextColIdx =
            e.key === "ArrowRight"
              ? Math.min(columns.length - 1, colIdx + 1)
              : Math.max(0, colIdx - 1)
          if (nextColIdx !== colIdx) {
            e.preventDefault()
            const targetCol = columns[nextColIdx]
            const targetActive =
              targetCol?.querySelector<HTMLButtonElement>(
                'button[role="option"][aria-selected="true"]:not([disabled])'
              ) ??
              targetCol?.querySelector<HTMLButtonElement>(
                'button[role="option"]:not([disabled])'
              )
            targetActive?.focus()
          }
        }
      }
    },
    []
  )

  return (
    <div
      className={cn("flex min-w-[4.25rem] flex-1 flex-col", className)}
      data-slot="time-picker-column"
    >
      <div
        className="text-muted-foreground/60 flex h-6 items-center justify-center pt-0.5 text-[10px] font-medium tracking-wider select-none"
        data-slot="time-picker-column-header"
      >
        {displayLabel}
      </div>

      <div
        className="h-[178px] snap-y snap-mandatory [scrollbar-width:none] overflow-y-auto overscroll-contain select-none focus:outline-none [&::-webkit-scrollbar]:hidden"
        data-slot="time-picker-column-scroll"
        onKeyDown={handleKeyDown}
        ref={listRef}
      >
        <div
          aria-label={ariaLabel}
          className="space-y-1 px-1 py-1"
          data-slot="time-picker-column-listbox"
          role="listbox"
        >
          {type === "hour" &&
            hours.map((h) => {
              const isSelected = selectedDisplayH === h
              const itemDisabled = isHourDisabled(h, currentPeriod)

              return (
                <div key={h} className="flex justify-center">
                  <TimePickerItem
                    disabled={itemDisabled}
                    ref={(el) => {
                      itemRefs.current[h] = el
                    }}
                    selected={isSelected}
                    onClick={() => handleSelectHour(h)}
                  >
                    {String(h).padStart(2, "0")}
                  </TimePickerItem>
                </div>
              )
            })}

          {type === "minute" &&
            minutes.map((m) => {
              const isSelected = selectedM === m
              const itemDisabled = isMinuteDisabled(selectedH24, m)

              return (
                <div key={m} className="flex justify-center">
                  <TimePickerItem
                    disabled={itemDisabled}
                    ref={(el) => {
                      itemRefs.current[m] = el
                    }}
                    selected={isSelected}
                    onClick={() => handleSelectMinute(m)}
                  >
                    {String(m).padStart(2, "0")}
                  </TimePickerItem>
                </div>
              )
            })}

          {type === "second" &&
            seconds.map((s) => {
              const isSelected = selectedS === s
              const itemDisabled = isSecondDisabled(
                selectedH24,
                selectedM ?? 0,
                s
              )

              return (
                <div key={s} className="flex justify-center">
                  <TimePickerItem
                    disabled={itemDisabled}
                    ref={(el) => {
                      itemRefs.current[s] = el
                    }}
                    selected={isSelected}
                    onClick={() => handleSelectSecond(s)}
                  >
                    {String(s).padStart(2, "0")}
                  </TimePickerItem>
                </div>
              )
            })}

          {type === "period" &&
            (["AM", "PM"] as const).map((period) => {
              const isSelected = currentPeriod === period
              const itemDisabled = isPeriodDisabled(period)

              return (
                <div key={period} className="flex justify-center">
                  <TimePickerItem
                    disabled={itemDisabled}
                    ref={(el) => {
                      itemRefs.current[period] = el
                    }}
                    selected={isSelected}
                    onClick={() => handleSelectPeriod(period)}
                  >
                    {period}
                  </TimePickerItem>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Item Component                              */
/* -------------------------------------------------------------------------- */

export interface TimePickerItemProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  ref?: React.Ref<HTMLButtonElement>
  selected?: boolean
}

export function TimePickerItem({
  children,
  className,
  disabled,
  onClick,
  ref,
  selected,
}: TimePickerItemProps) {
  return (
    <button
      aria-selected={selected}
      className={cn(
        "focus-visible:ring-ring flex h-7.5 w-10 cursor-pointer snap-center items-center justify-center rounded-md text-xs tabular-nums transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        selected
          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
          : "text-foreground hover:bg-accent hover:text-accent-foreground font-normal",
        disabled &&
          "text-muted-foreground/30 pointer-events-none cursor-not-allowed hover:bg-transparent",
        className
      )}
      data-selected={selected}
      data-slot="time-picker-item"
      disabled={disabled}
      ref={ref}
      role="option"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Footer Component                             */
/* -------------------------------------------------------------------------- */

export interface TimePickerFooterProps {
  children: ReactNode
  className?: string
}

export function TimePickerFooter({
  children,
  className,
}: TimePickerFooterProps) {
  return (
    <div
      className={cn(
        "border-border/40 bg-muted/20 flex items-center justify-between border-t px-2 py-1.5 text-xs",
        className
      )}
      data-slot="time-picker-footer"
    >
      {children}
    </div>
  )
}

export function TimePickerNow({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  const { handleNow, i18n } = useTimePicker()
  return (
    <Button
      className={cn(
        "text-foreground/80 hover:text-foreground hover:bg-accent h-6.5 px-2 text-xs font-medium transition-colors",
        className
      )}
      data-slot="time-picker-now"
      size="xs"
      type="button"
      variant="ghost"
      onClick={handleNow}
    >
      {children ?? i18n.now}
    </Button>
  )
}

export function TimePickerClear({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  const { handleClear, i18n } = useTimePicker()
  return (
    <Button
      className={cn(
        "text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-6.5 px-2 text-xs font-normal transition-colors",
        className
      )}
      data-slot="time-picker-clear"
      size="xs"
      type="button"
      variant="ghost"
      onClick={handleClear}
    >
      {children ?? i18n.clear}
    </Button>
  )
}

export function TimePickerConfirm({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  const { i18n, setOpen } = useTimePicker()
  return (
    <Button
      className={cn(
        "bg-secondary hover:bg-secondary/80 text-secondary-foreground h-6.5 px-2.5 text-xs font-medium shadow-none transition-colors",
        className
      )}
      data-slot="time-picker-confirm"
      size="xs"
      type="button"
      variant="secondary"
      onClick={() => setOpen(false)}
    >
      {children ?? i18n.confirm}
    </Button>
  )
}
