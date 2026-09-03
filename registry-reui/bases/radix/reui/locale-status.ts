/**
 * Статус заполнения локали — чистая логика точки на вкладке (ReUI contribution).
 * Спека: `docs/ui-v2/molecules/worship-form-fields.md` §1.
 */

export type LocaleFillStatus = 'full' | 'partial' | 'empty'

/** Пара «имя + фамилия» в одной локали. */
export type NamePairValue = { first: string; last: string }

const filled = (text: string | null | undefined): boolean =>
  typeof text === 'string' && text.trim().length > 0

/** Одиночное поле: заполнено или пусто, промежуточного состояния нет. */
export function singleStatus(value: string | null | undefined): LocaleFillStatus {
  return filled(value) ? 'full' : 'empty'
}

/** Пара: обе части — full, одна — partial, ни одной — empty. */
export function pairStatus(
  value: Partial<NamePairValue> | null | undefined,
): LocaleFillStatus {
  const first = filled(value?.first)
  const last = filled(value?.last)
  if (first && last) return 'full'
  if (first || last) return 'partial'
  return 'empty'
}
