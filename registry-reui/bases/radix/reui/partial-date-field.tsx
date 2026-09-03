'use client'

/**
 * ReUI contribution: partial-date-field
 * Source: production use in church CRM (PlusEngine / PlusWorship).
 */

import * as React from 'react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/registry/bases/radix/ui/button'
import { Calendar } from '@/registry/bases/radix/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/bases/radix/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/registry/bases/radix/ui/tabs'
import { cn } from '@/registry/bases/radix/lib/utils'

import {
  type PartialDateMode,
  applyMode,
  displayPartialDate,
  formatPartialDate,
  monthNames,
  parsePartialDate,
} from './partial-date'

export type PartialDateFieldProps = {
  value: string
  onChange: (value: string) => void
  /** Управляемый режим; без него режим живёт внутри поля. */
  mode?: PartialDateMode
  defaultMode?: PartialDateMode
  onModeChange?: (mode: PartialDateMode) => void
  placeholder?: string
  clearLabel?: string
  /** Язык подписей; по умолчанию язык интерфейса. */
  locale?: string
  disabled?: boolean
  id?: string
  className?: string
}

/** Внутренний вид поповера в режиме «день»: сам календарь либо шаг вверх. */
type PickerView = 'days' | 'months' | 'years'

const YEARS_PER_PAGE = 12

const pageStart = (year: number): number => Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE

export function PartialDateField({
  value,
  onChange,
  mode: controlledMode,
  defaultMode = 'month-year',
  onModeChange,
  placeholder,
  clearLabel,
  locale: localeProp,
  disabled,
  id,
  className,
}: PartialDateFieldProps) {
      const locale = localeProp ?? 'en'

  const parsed = parsePartialDate(value)
  const [internalMode, setInternalMode] = React.useState<PartialDateMode>(
    () => parsed.mode ?? defaultMode,
  )
  const mode = controlledMode ?? internalMode

  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<PickerView>('days')
  const today = React.useMemo(() => new Date(), [])
  const [viewYear, setViewYear] = React.useState(() => parsed.year ?? today.getFullYear())
  const [viewMonth, setViewMonth] = React.useState(
    () => parsed.month ?? today.getMonth() + 1,
  )
  const [yearPage, setYearPage] = React.useState(() =>
    pageStart(parsed.year ?? today.getFullYear()),
  )

  const months = React.useMemo(() => monthNames(locale, 'short'), [locale])
  const monthsLong = React.useMemo(() => monthNames(locale, 'long'), [locale])

  const display = displayPartialDate({ ...parsed, mode }, locale)
  const stored = formatPartialDate(mode, parsed)
  const placeholderText = placeholder ?? 'Select date…'
  const clearText = clearLabel ?? 'Clear'

  const changeMode = (next: PartialDateMode) => {
    setInternalMode(next)
    onModeChange?.(next)
    const trimmed = applyMode(parsed, next)
    setViewYear(trimmed.year ?? today.getFullYear())
    setViewMonth(trimmed.month ?? today.getMonth() + 1)
    setView('days')
    onChange(formatPartialDate(next, trimmed))
  }

  const commit = (year: number, month: number | null, day: number | null) => {
    onChange(formatPartialDate(mode, { year, month, day }))
    setView('days')
    setOpen(false)
  }

  const clear = () => {
    onChange('')
    setView('days')
    setOpen(false)
  }

  // Поповер открывается там, где стоит значение, а не там, где его закрыли.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      const year = parsed.year ?? today.getFullYear()
      setViewYear(year)
      setViewMonth(parsed.month ?? today.getMonth() + 1)
      setYearPage(pageStart(year))
      setView('days')
    }
    setOpen(next)
  }

  const footer = (
    <div className="flex items-center justify-between border-t pt-2.5">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={clear}
        className="text-muted-foreground"
      >
        {clearText}
      </Button>
      <span className="font-mono text-xs text-muted-foreground">{stored || '—'}</span>
    </div>
  )

  const yearGrid = (onPick: (year: number) => void, selectedYear: number | null) => (
    <>
      <PickerNav
        title={`${yearPage}–${yearPage + YEARS_PER_PAGE - 1}`}
        onPrev={() => setYearPage(yearPage - YEARS_PER_PAGE)}
        onNext={() => setYearPage(yearPage + YEARS_PER_PAGE)}
        prevLabel={'Prev'}
        nextLabel={'Next'}
      />
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: YEARS_PER_PAGE }, (_, index) => yearPage + index).map(
          (year) => (
            <Button
              key={year}
              type="button"
              variant={year === selectedYear ? 'default' : 'ghost'}
              onClick={() => onPick(year)}
              className="h-9 w-full"
            >
              {year}
            </Button>
          ),
        )}
      </div>
    </>
  )

  const monthGrid = (
    onPick: (month: number) => void,
    selectedMonth: number | null,
    navYear: number,
  ) => (
    <>
      <PickerNav
        title={String(navYear)}
        onPrev={() => setViewYear(navYear - 1)}
        onNext={() => setViewYear(navYear + 1)}
        prevLabel={'Prev'}
        nextLabel={'Next'}
      />
      <div className="grid grid-cols-3 gap-1">
        {months.map((name, index) => (
          <Button
            key={name}
            type="button"
            variant={index + 1 === selectedMonth ? 'default' : 'ghost'}
            onClick={() => onPick(index + 1)}
            className="h-9 w-full"
          >
            {name}
          </Button>
        ))}
      </div>
    </>
  )

  const picker = () => {
    if (mode === 'year') {
      return (
        <>
          {yearGrid((year) => commit(year, null, null), parsed.year)}
          {footer}
        </>
      )
    }

    if (mode === 'month-year') {
      return (
        <>
          {monthGrid(
            (month) => commit(viewYear, month, null),
            parsed.year === viewYear ? parsed.month : null,
            viewYear,
          )}
          {footer}
        </>
      )
    }

    if (view === 'years') {
      return yearGrid((year) => {
        setViewYear(year)
        setView('months')
      }, viewYear)
    }

    if (view === 'months') {
      return monthGrid(
        (month) => {
          setViewMonth(month)
          setView('days')
        },
        viewMonth,
        viewYear,
      )
    }

    const selectedDay =
      parsed.mode === 'full' && parsed.year && parsed.month && parsed.day
        ? new Date(parsed.year, parsed.month - 1, parsed.day)
        : undefined

    return (
      <>
        <Calendar
          mode="single"
          
          month={new Date(viewYear, viewMonth - 1, 1)}
          onMonthChange={(next) => {
            setViewYear(next.getFullYear())
            setViewMonth(next.getMonth() + 1)
          }}
          selected={selectedDay}
          onSelect={(next) => {
            if (next) commit(next.getFullYear(), next.getMonth() + 1, next.getDate())
          }}
          className="w-full p-0"
          components={{
            // Заголовок месяца — две кнопки: шаг вверх к месяцам и к годам.
            // `relative z-10` обязателен: панель навигации календаря лежит
            // абсолютом поверх всей строки и иначе съедает клики по заголовку.
            CaptionLabel: () => (
              <span className="relative z-10 flex w-fit items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('months')}
                >
                  {monthsLong[viewMonth - 1]}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setYearPage(pageStart(viewYear))
                    setView('years')
                  }}
                >
                  {viewYear}
                </Button>
              </span>
            ),
          }}
        />
        {footer}
      </>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Tabs
        value={mode}
        onValueChange={(next) => changeMode(next as PartialDateMode)}
        className="gap-0"
      >
        <TabsList className="grid w-full max-w-[280px] grid-cols-3">
          <TabsTrigger value="full" disabled={disabled}>
            {'Day'}
          </TabsTrigger>
          <TabsTrigger value="month-year" disabled={disabled}>
            {'Month'}
          </TabsTrigger>
          <TabsTrigger value="year" disabled={disabled}>
            {'Year'}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'h-9 w-full max-w-[280px] justify-between rounded-lg px-3 font-normal',
              !display && 'text-muted-foreground',
            )}
          >
            <span className="truncate">{display || placeholderText}</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-45" aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="bottom" className="w-[288px] gap-2.5 p-3">
          {picker()}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function PickerNav({
  title,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: {
  title: string
  onPrev: () => void
  onNext: () => void
  prevLabel: string
  nextLabel: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={prevLabel}
        onClick={onPrev}
      >
        <ChevronLeftIcon className="size-4" aria-hidden />
      </Button>
      <span className="flex-1 text-center text-sm font-semibold">{title}</span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={nextLabel}
        onClick={onNext}
      >
        <ChevronRightIcon className="size-4" aria-hidden />
      </Button>
    </div>
  )
}
