/**
 * Тональность — чистая доменная логика (ReUI contribution).
 *
 * их переписывать. Здесь нет ни React, ни вёрстки — только имена нот и правила.
 */

export type KeySpelling = 'sharp' | 'flat'

/** Двенадцать pitch classes в бемольном написании; индекс = высота. */
export const FLATS = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
] as const

/** Те же двенадцать классов в диезном написании; индексы совпадают с FLATS. */
export const SHARPS = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

/** Сетка complex-режима: 7 строк × 3 колонки (бемоль · чистая · диез). */
export const NOTES: readonly {
  flat: string | null
  natural: string
  sharp: string | null
}[] = [
  { flat: null, natural: 'C', sharp: 'C#' },
  { flat: 'Db', natural: 'D', sharp: 'D#' },
  { flat: 'Eb', natural: 'E', sharp: null },
  { flat: null, natural: 'F', sharp: 'F#' },
  { flat: 'Gb', natural: 'G', sharp: 'G#' },
  { flat: 'Ab', natural: 'A', sharp: 'A#' },
  { flat: 'Bb', natural: 'B', sharp: null },
]

/**
 * Последняя ячейка сетки (строка B, колонка диеза) пустая — там живёт сброс.
 * Индексы держим здесь, чтобы вёрстка не пересчитывала их заново.
 */
export const CLEAR_SLOT = { row: NOTES.length - 1, column: 'sharp' } as const

/** Подпись ноты для экрана: `#` → ♯, `b` → ♭. Минорная `m` остаётся как есть. */
export function displayKey(key: string): string {
  return String(key || '')
    .replace(/#/g, '♯')
    .replace(/b/g, '♭')
}

/** Разбирает значение поля на базовую ноту и признак минора: `F#m` → `F#` + minor. */
export function splitKey(value: string): { base: string; minor: boolean } {
  const raw = String(value || '')
  const minor = raw.endsWith('m')
  return { base: minor ? raw.slice(0, -1) : raw, minor }
}

/** Собирает значение поля обратно; пустая база остаётся пустой строкой. */
export function joinKey(base: string, minor: boolean): string {
  if (!base) return ''
  return minor ? `${base}m` : base
}

/** Индекс pitch class по имени ноты (любое написание); `-1`, если имени нет. */
export function pitchIndex(key: string): number {
  const { base } = splitKey(key)
  if (!base) return -1
  const sharp = SHARPS.indexOf(base as (typeof SHARPS)[number])
  if (sharp !== -1) return sharp
  return FLATS.indexOf(base as (typeof FLATS)[number])
}

/** Имя ноты по индексу и написанию; вне диапазона — пустая строка. */
export function spellKey(index: number, spelling: KeySpelling): string {
  const list = spelling === 'flat' ? FLATS : SHARPS
  return list[index] ?? ''
}

/**
 * Написание, в котором записано значение. Нужно, чтобы поле открывалось
 * на том же сегменте, в каком лежит сохранённая тональность.
 * Ноты без альтерации (C, D, E…) не решают ничего — для них `null`.
 */
export function spellingOfKey(key: string): KeySpelling | null {
  const { base } = splitKey(key)
  if (!base) return null
  if (base.endsWith('#')) return 'sharp'
  if (base.endsWith('b')) return 'flat'
  return null
}
