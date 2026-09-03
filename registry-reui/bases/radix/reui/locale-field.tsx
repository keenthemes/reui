'use client'

/**
 * ReUI contribution: locale-field
 * Source: production use in church CRM (PlusEngine / PlusWorship).
 */

import * as React from 'react'

import { Field, FieldLabel } from '@/registry/bases/radix/ui/field'
import { Input } from '@/registry/bases/radix/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/registry/bases/radix/ui/tabs'
import { cn } from '@/registry/bases/radix/lib/utils'

import {
  type LocaleFillStatus,
  type NamePairValue,
  pairStatus,
  singleStatus,
} from './locale-status'

export type LocaleCode = string

type LocaleFieldCommonProps = {
  /** Порядок вкладок — ровно как показываем, без пересортировки. */
  locales: LocaleCode[]
  /** Язык-оригинал; первым в списке быть не обязан. */
  masterLocale: LocaleCode
  activeLocale?: LocaleCode
  onActiveLocaleChange?: (locale: LocaleCode) => void
  disabled?: boolean
  id?: string
  className?: string
}

export type LocaleFieldSingleProps = LocaleFieldCommonProps & {
  variant: 'single'
  value: Record<LocaleCode, string>
  onChange: (next: Record<LocaleCode, string>) => void
  label?: string
  placeholders?: Partial<Record<LocaleCode, string>>
}

export type LocaleFieldNamePairProps = LocaleFieldCommonProps & {
  variant: 'namePair'
  value: Record<LocaleCode, NamePairValue>
  onChange: (next: Record<LocaleCode, NamePairValue>) => void
  labels?: { first: string; last: string }
  placeholders?: Partial<Record<LocaleCode, { first?: string; last?: string }>>
}

export type LocaleFieldProps = LocaleFieldSingleProps | LocaleFieldNamePairProps

/**
 * Мягкая рамка вкладки-оригинала. Значения взяты из спеки §1 «Master» —
 * это утверждённый вид, а не подобранный на глаз оттенок.
 */
const MASTER_TAB_CLASS = cn(
  'border-[oklch(0.78_0.012_258_/_0.7)]',
  'data-[state=inactive]:shadow-[inset_0_0_0_0.5px_oklch(0.7_0.015_258_/_0.18)]',
  'data-[state=active]:border-[oklch(0.68_0.02_258_/_0.45)]',
)

const DOT_CLASS: Record<LocaleFillStatus, string> = {
  full: 'bg-success',
  partial: 'bg-warning ring-2 ring-warning/20',
  empty: 'bg-muted-foreground/40',
}

function StatusDot({ status }: { status: LocaleFillStatus }) {
  return (
    <span
      aria-hidden
      className={cn('size-1.5 shrink-0 rounded-full', DOT_CLASS[status])}
    />
  )
}

export function LocaleField(props: LocaleFieldProps) {
  const {
    locales,
    masterLocale,
    activeLocale,
    onActiveLocaleChange,
    disabled,
    id,
    className,
  } = props

    const [internalLocale, setInternalLocale] = React.useState(
    () => activeLocale ?? locales[0],
  )
  const active = activeLocale ?? internalLocale
  const fieldId = React.useId()
  const baseId = id ?? fieldId

  const selectLocale = (locale: string) => {
    setInternalLocale(locale)
    onActiveLocaleChange?.(locale)
  }

  const statusOf = (locale: LocaleCode): LocaleFillStatus =>
    props.variant === 'single'
      ? singleStatus(props.value?.[locale])
      : pairStatus(props.value?.[locale])

  return (
    <Field className={cn('gap-2', className)} data-disabled={disabled || undefined}>
      <Tabs value={active} onValueChange={selectLocale} className="gap-0">
        <TabsList className="grid w-full auto-cols-fr grid-flow-col">
          {locales.map((locale) => {
            const isMaster = locale === masterLocale
            return (
              <TabsTrigger
                key={locale}
                value={locale}
                disabled={disabled}
                aria-label={
                  isMaster
                    ? `${locale.toUpperCase()}, default language`
                    : locale.toUpperCase()
                }
                className={cn('gap-1.5', isMaster && MASTER_TAB_CLASS)}
              >
                <StatusDot status={statusOf(locale)} />
                {locale.toUpperCase()}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {props.variant === 'single' ? (
        <SingleInput {...props} activeLocale={active} baseId={baseId} disabled={disabled} />
      ) : (
        <NamePairInputs {...props} activeLocale={active} baseId={baseId} disabled={disabled} />
      )}
    </Field>
  )
}

function SingleInput({
  value,
  onChange,
  label,
  placeholders,
  activeLocale,
  baseId,
  disabled,
}: LocaleFieldSingleProps & { activeLocale: LocaleCode; baseId: string }) {
  const inputId = `${baseId}-${activeLocale}`
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <FieldLabel htmlFor={inputId} className="text-xs text-muted-foreground">
          {label} · {activeLocale.toUpperCase()}
        </FieldLabel>
      ) : null}
      <Input
        id={inputId}
        value={value?.[activeLocale] ?? ''}
        placeholder={placeholders?.[activeLocale]}
        disabled={disabled}
        onChange={(event) => onChange({ ...value, [activeLocale]: event.target.value })}
      />
    </div>
  )
}

function NamePairInputs({
  value,
  onChange,
  labels,
  placeholders,
  activeLocale,
  baseId,
  disabled,
}: LocaleFieldNamePairProps & { activeLocale: LocaleCode; baseId: string }) {
    const current = value?.[activeLocale] ?? { first: '', last: '' }
  const captions = labels ?? {
    first: 'First name',
    last: 'Last name',
  }

  const update = (part: keyof NamePairValue, next: string) =>
    onChange({ ...value, [activeLocale]: { ...current, [part]: next } })

  // На узком экране пара складывается в колонку — граница из спеки §1 (420px).
  return (
    <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
      {(['first', 'last'] as const).map((part) => {
        const inputId = `${baseId}-${activeLocale}-${part}`
        return (
          <div key={part} className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={inputId} className="text-xs text-muted-foreground">
              {captions[part]} · {activeLocale.toUpperCase()}
            </FieldLabel>
            <Input
              id={inputId}
              value={current[part] ?? ''}
              placeholder={placeholders?.[activeLocale]?.[part]}
              disabled={disabled}
              onChange={(event) => update(part, event.target.value)}
            />
          </div>
        )
      })}
    </div>
  )
}
