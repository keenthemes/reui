'use client'

/**
 * ReUI contribution: music-key-field
 * Source: production use in church CRM (PlusEngine / PlusWorship).
 */

import * as React from 'react'
import { ChevronDownIcon, XIcon } from 'lucide-react'

import { Button } from '@/registry/bases/base/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/bases/base/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/registry/bases/base/ui/tabs'
import { cn } from '@/registry/bases/base/lib/utils'

import {
  type KeySpelling,
  NOTES,
  SHARPS,
  FLATS,
  displayKey,
  joinKey,
  pitchIndex,
  spellKey,
  spellingOfKey,
  splitKey,
} from './music-key-notes'

export type MusicKeyFieldSimpleProps = {
  mode: 'simple'
  /** Имя pitch class без суффикса минора: `C`, `C#`, `Db`… */
  value: string
  onChange: (value: string) => void
  defaultSpelling?: KeySpelling
  disabled?: boolean
  id?: string
  className?: string
  'aria-label'?: string
}

export type MusicKeyFieldComplexProps = {
  mode: 'complex'
  /** Полное значение тональности: `''`, `C`, `F#m`, `Bb`… */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  clearLabel?: string
  disabled?: boolean
  id?: string
  className?: string
  /**
   * Подпись ВНУТРИ закрытого поля («Тональность A»), как у соседнего каподастра.
   * Правка Andrey 11.08: «поле не развёрнутое не пишет, что там выбирается».
   * В форме подпись даёт `FieldLabel` — там проп не нужен.
   */
  label?: string
  /**
   * `sm` — рост и радиус соседних кнопок ленты (h-7), ширина по содержимому.
   * `default` — геометрия формы из спеки молекулы (h-9, 168px).
   */
  size?: 'sm' | 'default'
}

export type MusicKeyFieldProps = MusicKeyFieldSimpleProps | MusicKeyFieldComplexProps

/** Геометрия клетки — общая для обоих режимов (спека §2a «Геометрия»). */
const CELL_CLASS = 'h-[34px] w-full rounded-[7px] px-0 font-mono text-[13px] font-semibold'

export function MusicKeyField(props: MusicKeyFieldProps) {
  return props.mode === 'simple' ? (
    <MusicKeyFieldSimple {...props} />
  ) : (
    <MusicKeyFieldComplex {...props} />
  )
}

function MusicKeyFieldSimple({
  value,
  onChange,
  defaultSpelling = 'sharp',
  disabled,
  id,
  className,
  'aria-label': ariaLabel,
}: MusicKeyFieldSimpleProps) {
    const [preferred, setPreferred] = React.useState<KeySpelling>(defaultSpelling)

  // Написание диктует само значение; выбор человека решает только там,
  // где значение о написании молчит (чистые ноты и пустое поле).
  const spelling = spellingOfKey(value) ?? preferred
  const names = spelling === 'flat' ? FLATS : SHARPS
  const selected = pitchIndex(value)

  const flipSpelling = (next: KeySpelling) => {
    setPreferred(next)
    // Держимся за индекс, а не за имя: C♯ не должен уехать на другой класс.
    if (selected >= 0) onChange(spellKey(selected, next))
  }

  return (
    <div
      id={id}
      className={cn(
        'w-[168px] overflow-hidden rounded-[10px] border border-input bg-background shadow-sm',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <div className="px-2 pt-2">
        <Tabs
          value={spelling}
          onValueChange={(next) => flipSpelling(next as KeySpelling)}
          className="gap-0"
        >
          <TabsList className="grid h-7 w-full grid-cols-2">
            <TabsTrigger
              value="sharp"
              disabled={disabled}
              aria-label={'Sharp'}
              className="font-mono text-[13px] font-semibold"
            >
              ♯
            </TabsTrigger>
            <TabsTrigger
              value="flat"
              disabled={disabled}
              aria-label={'Flat'}
              className="font-mono text-[13px] font-semibold"
            >
              ♭
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-2 pt-1.5 pb-2">
        <div
          role="radiogroup"
          aria-label={ariaLabel ?? 'Key'}
          className="grid grid-cols-2 gap-0.5"
        >
          {names.map((name, index) => (
            <Button
              key={name}
              type="button"
              role="radio"
              aria-checked={index === selected}
              variant={index === selected ? 'default' : 'ghost'}
              disabled={disabled}
              onClick={() => onChange(name)}
              className={CELL_CLASS}
            >
              {displayKey(name)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MusicKeyFieldComplex({
  value,
  onChange,
  placeholder,
  clearLabel,
  disabled,
  id,
  className,
  label,
  size = 'default',
}: MusicKeyFieldComplexProps) {
    const [open, setOpen] = React.useState(false)
  const [isMinor, setIsMinor] = React.useState(() => splitKey(value).minor)

  const base = splitKey(value).base
  const clearText = clearLabel ?? 'Clear'
  const placeholderText = placeholder ?? 'Key'

  const selectNote = (note: string) => {
    onChange(joinKey(note, isMinor))
    setOpen(false)
  }

  const toggleMinor = (minor: boolean) => {
    setIsMinor(minor)
    // База уже выбрана — значение переписывается сразу, без второго клика.
    if (base) onChange(joinKey(base, minor))
  }

  const clear = () => {
    onChange('')
    setOpen(false)
  }

  /** Клетка ноты; `null` — пустой слот сетки, он держит место и не кликается. */
  const noteCell = (note: string | null, key: string) => {
    if (!note) {
      return (
        <Button
          key={key}
          type="button"
          variant="ghost"
          disabled
          aria-hidden
          tabIndex={-1}
          className={cn(CELL_CLASS, 'disabled:opacity-0')}
        />
      )
    }
    const active = base === note
    return (
      <Button
        key={key}
        type="button"
        aria-pressed={active}
        variant={active ? 'default' : 'ghost'}
        onClick={() => selectNote(note)}
        className={CELL_CLASS}
      >
        {displayKey(note)}
        {isMinor ? 'm' : ''}
      </Button>
    )
  }

  /** Последний слот сетки — сброс; пока значения нет, он невидим, как и прочие пустые. */
  const clearCell = () => {
    if (!value) return noteCell(null, 'clear-slot')
    return (
      <Button
        key="clear-slot"
        type="button"
        variant="ghost"
        aria-label={clearText}
        title={clearText}
        onClick={clear}
        className={cn(CELL_CLASS, 'text-destructive hover:bg-destructive/10')}
      >
        <XIcon className="size-4" aria-hidden />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          size={size === 'sm' ? 'sm' : 'default'}
          role="combobox"
          disabled={disabled}
          className={cn(
            // Штатная геометрия кнопки кита; своей высоты и своего радиуса поле
            // больше не назначает — в ленте оно стояло выше соседей и выпадало
            // из ряда (правка Andrey 11.08, п. 8).
            size === 'sm' ? 'justify-between gap-1.5' : 'h-9 w-[168px] justify-between rounded-lg px-3',
            className,
          )}
        >
          {label && <span className="text-muted-foreground font-normal">{label}</span>}
          <span
            className={cn(
              'truncate font-mono text-[13px] font-semibold',
              !value && 'text-muted-foreground font-sans font-medium',
            )}
          >
            {value ? displayKey(value) : label ? placeholderText : placeholderText}
          </span>
          <ChevronDownIcon
            className={cn('shrink-0 opacity-45', size === 'sm' ? 'size-3.5' : 'size-4')}
            aria-hidden
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" side="bottom" className="w-[200px] gap-2 p-2.5">
        <Tabs
          value={isMinor ? 'minor' : 'major'}
          onValueChange={(next) => toggleMinor(next === 'minor')}
          className="gap-0"
        >
          <TabsList className="grid h-[30px] w-full grid-cols-2">
            <TabsTrigger value="major">{'Major'}</TabsTrigger>
            <TabsTrigger value="minor">{'Minor'}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Сетка 7×3 по канону NOTES; заголовков ♭/♯ нет — сняты Andrey 10.08.2026. */}
        <div className="grid grid-cols-3 gap-0.5">
          {NOTES.map((row, index) => {
            const isLastRow = index === NOTES.length - 1
            return [
              noteCell(row.flat, `${row.natural}-flat`),
              noteCell(row.natural, `${row.natural}-natural`),
              isLastRow && !row.sharp
                ? clearCell()
                : noteCell(row.sharp, `${row.natural}-sharp`),
            ]
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
