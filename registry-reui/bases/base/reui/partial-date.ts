/**
 * Частичная дата — чистая логика разбора, записи и подписи (ReUI contribution).
 *
 * Хранение — строка без времени: `YYYY`, `YYYY-MM` или `YYYY-MM-DD`.
 * Часовых поясов здесь нет намеренно: дата релиза песни — календарная,
 * а не момент времени, и перевод в UTC сдвигал бы её на сутки.
 */

export type PartialDateMode = 'full' | 'month-year' | 'year'

export type PartialDateParts = {
  /** Режим, прочитанный из значения; `null` — значение пустое или битое. */
  mode: PartialDateMode | null
  year: number | null
  month: number | null
  day: number | null
}

const EMPTY: PartialDateParts = { mode: null, year: null, month: null, day: null }

const VALUE_RE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/

/** Число дней в месяце (месяц с единицы). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** Разбирает хранимое значение. Всё, что не подходит под формат, — пустая дата. */
export function parsePartialDate(value: string | null | undefined): PartialDateParts {
  const match = VALUE_RE.exec(String(value ?? '').trim())
  if (!match) return { ...EMPTY }

  const year = Number(match[1])
  if (match[2] === undefined) return { mode: 'year', year, month: null, day: null }

  const month = Number(match[2])
  if (month < 1 || month > 12) return { ...EMPTY }
  if (match[3] === undefined) return { mode: 'month-year', year, month, day: null }

  const day = Number(match[3])
  if (day < 1 || day > daysInMonth(year, month)) return { ...EMPTY }
  return { mode: 'full', year, month, day }
}

/** Собирает значение под режим. Не хватает частей — пустая строка. */
export function formatPartialDate(
  mode: PartialDateMode,
  parts: Pick<PartialDateParts, 'year' | 'month' | 'day'>,
): string {
  const { year, month, day } = parts
  if (!year) return ''
  const yyyy = String(year).padStart(4, '0')
  if (mode === 'year') return yyyy
  if (!month) return ''
  const mm = String(month).padStart(2, '0')
  if (mode === 'month-year') return `${yyyy}-${mm}`
  if (!day) return ''
  return `${yyyy}-${mm}-${String(day).padStart(2, '0')}`
}

/**
 * Смена режима сохраняет всё, что уже известно, и отрезает лишнее:
 * день → месяц теряет число, месяц → день подставляет первое.
 */
export function applyMode(
  parts: Pick<PartialDateParts, 'year' | 'month' | 'day'>,
  mode: PartialDateMode,
): PartialDateParts {
  const year = parts.year
  if (!year) return { mode, year: null, month: null, day: null }
  if (mode === 'year') return { mode, year, month: null, day: null }
  const month = parts.month ?? 1
  if (mode === 'month-year') return { mode, year, month, day: null }
  const day = Math.min(parts.day ?? 1, daysInMonth(year, month))
  return { mode, year, month, day }
}

/**
 * Отбрасывает крайние литералы форматтера, оставляя внутренние.
 * Русскому «15 июня 2015 г.» так снимается хвост « г.», а английскому
 * «June 15, 2015» запятая внутри сохраняется.
 */
const joinParts = (parts: Intl.DateTimeFormatPart[]): string => {
  const kept = new Set(['day', 'month', 'year'])
  const first = parts.findIndex((part) => kept.has(part.type))
  if (first === -1) return ''
  let last = parts.length - 1
  while (last > first && !kept.has(parts[last].type)) last -= 1
  return parts
    .slice(first, last + 1)
    .map((part) => part.value)
    .join('')
    .trim()
}

/** Человеческая подпись значения: `15 июня 2015`, `июнь 2015`, `2015`. */
export function displayPartialDate(
  parts: PartialDateParts,
  locale = 'ru',
): string {
  const { mode, year, month, day } = parts
  if (!mode || !year) return ''
  if (mode === 'year') return String(year)
  if (!month) return ''
  if (mode === 'month-year') {
    return joinParts(
      new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).formatToParts(
        new Date(year, month - 1, 1),
      ),
    )
  }
  if (!day) return ''
  return joinParts(
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).formatToParts(new Date(year, month - 1, day)),
  )
}

/** Названия месяцев для сетки пикера: `long` для подписи, `short` для клеток. */
export function monthNames(locale = 'ru', width: 'long' | 'short' = 'short'): string[] {
  const format = new Intl.DateTimeFormat(locale, { month: width })
  return Array.from({ length: 12 }, (_, index) => format.format(new Date(2000, index, 1)))
}
