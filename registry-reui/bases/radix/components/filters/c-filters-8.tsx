"use client"

import { useState } from "react"
import { Filters } from "@/registry-reui/bases/radix/reui/filters/filters"
import {
  createFilterQuery,
  createFilterRule,
} from "@/registry-reui/bases/radix/reui/filters/filters-query"
import type {
  FilterEditorProps,
  FilterField,
  FilterOption,
  FilterQuery,
} from "@/registry-reui/bases/radix/reui/filters/filters-types"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import { Label } from "@/registry/bases/radix/ui/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/radix/ui/native-select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/radix/ui/radio-group"
import { Switch } from "@/registry/bases/radix/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/radix/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                  Options                                   */
/* -------------------------------------------------------------------------- */

const CHANNELS = [
  { value: "web", label: "Web" },
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "api", label: "API" },
]

const PLANS = [
  { value: "free", label: "Free", hint: "No card on file" },
  { value: "pro", label: "Pro", hint: "Monthly or yearly" },
  { value: "ultimate", label: "Ultimate", hint: "Seat based" },
]

const PERMISSIONS = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "publish", label: "Publish" },
  { value: "admin", label: "Administer" },
  { value: "billing", label: "Billing" },
]

const REGIONS = [
  { value: "emea", label: "EMEA" },
  { value: "amer", label: "AMER" },
  { value: "apac", label: "APAC" },
  { value: "latam", label: "LATAM" },
]

const asArray = (value: unknown): string[] =>
  Array.isArray(value) ? (value as string[]) : []

/**
 * The row every hand-rolled list below is built from.
 *
 * It is the shipped option row's own density written out: `px-2 py-1` inside a
 * `p-1` list, so a checkbox row and a `FilterMenu` row are the same height in
 * the same popover rather than two densities in one bar. The two overrides are
 * both `Label`'s, and both are wrong for a menu row rather than wrong outright:
 * `font-medium` is emphasis a row does not want, and `leading-none` is a
 * one-line caption's line box, which crushes a row to 24px where the list
 * beside it draws 28.
 */
const ROW =
  "hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 leading-normal font-normal"

/**
 * The first pick by name, plus what it stands in for.
 *
 * The default display collapses anything past one pick to "N selected", which
 * names nothing: the whole point of picking Read and Write is that the chip
 * says Read. c-filters-1 stacks avatars for exactly this reason; these options
 * carry no icon, so the leading LABEL does that work and the overflow follows
 * it in the same muted, tabular treatment the avatar stack uses.
 */
function PickedLabels({
  options,
  empty,
}: {
  options: FilterOption[]
  empty: string
}) {
  if (options.length === 0) return <>{empty}</>
  return (
    <span className="flex items-center gap-1.5">
      {options[0].label}
      {options.length > 1 ? (
        <span className="text-muted-foreground text-xs tabular-nums">
          +{options.length - 1}
        </span>
      ) : null}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Editors                                   */
/* -------------------------------------------------------------------------- */

/**
 * A segmented control, committing on every press.
 *
 * `commit(next, { close: false })` writes the value through WITHOUT dismissing,
 * which is what makes several picks one gesture: each press is a real change
 * the chip redraws from, and the control the user is working in stays where it
 * was. That is the same contract the built-in multi-select uses, so a custom
 * control behaves like the shipped ones for free.
 */
function ChannelToggles({
  value,
  onValueChange,
  commit,
  field,
}: FilterEditorProps<string[]>) {
  const current = asArray(value)

  return (
    // No width: the group is `w-fit` and four short segments already decide how
    // wide the panel wants to be, so a fixed one could only be too much or too
    // little.
    <div className="p-2">
      <ToggleGroup
        type="multiple"
        variant="outline"
        spacing={0}
        aria-label={field.label}
        value={current}
        onValueChange={(next) => {
          onValueChange(next)
          commit(next, { close: false })
        }}
      >
        {CHANNELS.map((channel) => (
          <ToggleGroupItem key={channel.value} value={channel.value}>
            {channel.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

/** One choice, so choosing IS the commit and the popover closes behind it. */
function PlanRadios({ value, commit, field }: FilterEditorProps<string>) {
  return (
    <RadioGroup
      className="flex w-56 flex-col p-1"
      aria-label={field.label}
      value={typeof value === "string" ? value : ""}
      onValueChange={(next) => commit(String(next))}
    >
      {PLANS.map((plan) => (
        // Top aligned, because the row is two lines and the control belongs
        // beside the first of them.
        <Label key={plan.value} className={cn(ROW, "items-start")}>
          <RadioGroupItem value={plan.value} className="mt-0.5" />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm">{plan.label}</span>
            <span className="text-muted-foreground text-xs">{plan.hint}</span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  )
}

/**
 * Checkboxes rather than the built-in list, for a short closed set.
 *
 * Every tick is a real commit with `{ close: false }`, exactly as the built-in
 * multi-select does, so there is nothing held back for an Apply to accept or a
 * Discard to take away: a pair of those buttons would be describing a
 * transaction this editor never runs, and Discard would be a promise it cannot
 * keep. The footer offers the one thing ticking cannot reach instead, which is
 * emptying the set in a single press, beside the count it changes.
 */
function PermissionChecks({
  value,
  onValueChange,
  commit,
  labels,
}: FilterEditorProps<string[]>) {
  const current = asArray(value)

  const write = (next: string[]) => {
    onValueChange(next)
    commit(next, { close: false })
  }

  const toggle = (entry: string, checked: boolean) =>
    write(
      checked ? [...current, entry] : current.filter((item) => item !== entry)
    )

  return (
    <div className="flex w-56 flex-col p-1">
      {PERMISSIONS.map((permission) => (
        <Label key={permission.value} className={ROW}>
          <Checkbox
            checked={current.includes(permission.value)}
            onCheckedChange={(checked) =>
              toggle(permission.value, checked === true)
            }
          />
          <span className="text-sm">{permission.label}</span>
        </Label>
      ))}

      <div className="mt-1 flex items-center justify-between gap-2 border-t ps-2 pt-1">
        <span className="text-muted-foreground text-xs tabular-nums">
          {labels.valueCount(current.length)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={current.length === 0}
          onClick={() => write([])}
        >
          {labels.clear}
        </Button>
      </div>
    </div>
  )
}

/** A switch, for the one case where the value is the control's own state. */
function EnabledSwitch({ value, commit, field }: FilterEditorProps<boolean>) {
  const current = value === true

  return (
    // `w-40` is the width the shipped boolean editor uses, and this is the same
    // filter that editor would have drawn, so the popover is the size the bar's
    // own True/False panel would have been.
    <Label className="flex w-40 cursor-pointer items-center justify-between gap-3 p-2 font-normal">
      <span className="text-sm">{field.label}</span>
      {/* One decisive value, so flipping it is the whole edit. */}
      <Switch
        checked={current}
        onCheckedChange={(checked) => commit(checked)}
        aria-label={field.label}
      />
    </Label>
  )
}

/**
 * The platform's own menu, for a list short enough that a search box is chrome.
 *
 * A native `<select>` opens as an OS popup OUTSIDE the document, which is why it
 * is worth having as an option here: on a phone it becomes the system wheel, and
 * it is the one control in this set whose menu is never clipped by the popover
 * it lives in. The empty option is what lets the filter be cleared back to "any",
 * since a select has no unselected state of its own.
 *
 * No caption over it. The popover is anchored to the chip's value segment and
 * the chip spells the attribute out an inch to the left, so a heading here
 * would be the field's name twice on one line; the select keeps the name as its
 * `aria-label`, where it is not already on screen.
 */
function RegionSelect({ value, commit, field }: FilterEditorProps<string>) {
  return (
    <div className="w-48 p-2">
      <NativeSelect
        className="w-full"
        aria-label={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={(event) =>
          commit(event.target.value === "" ? undefined : event.target.value)
        }
      >
        <NativeSelectOption value="">Any region</NativeSelectOption>
        {REGIONS.map((region) => (
          <NativeSelectOption key={region.value} value={region.value}>
            {region.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const fields: FilterField[] = [
  {
    id: "channel",
    label: "Channel",
    type: "multiselect",
    // The options still ship, even though the editor draws its own rows: they
    // are what the chip resolves a stored value's LABEL from.
    options: CHANNELS,
    editor: ChannelToggles as never,
    renderValue: ({ options }) => (
      <PickedLabels options={options} empty="any channel" />
    ),
    icon: (
      <IconPlaceholder
        lucide="MonitorSmartphoneIcon"
        tabler="IconDevices"
        hugeicons="ComputerPhoneSyncIcon"
        phosphor="DevicesIcon"
        remixicon="RiDeviceLine"
      />
    ),
  },
  {
    id: "plan",
    label: "Plan",
    type: "select",
    options: PLANS.map((plan) => ({ value: plan.value, label: plan.label })),
    editor: PlanRadios as never,
    icon: (
      <IconPlaceholder
        lucide="CreditCardIcon"
        tabler="IconCreditCard"
        hugeicons="CreditCardIcon"
        phosphor="CreditCardIcon"
        remixicon="RiBankCardLine"
      />
    ),
  },
  {
    id: "permissions",
    label: "Permissions",
    type: "multiselect",
    options: PERMISSIONS,
    editor: PermissionChecks as never,
    renderValue: ({ options }) => (
      <PickedLabels options={options} empty="any permission" />
    ),
    icon: (
      <IconPlaceholder
        lucide="ShieldCheckIcon"
        tabler="IconShieldCheck"
        hugeicons="ShieldUserIcon"
        phosphor="ShieldCheckIcon"
        remixicon="RiShieldCheckLine"
      />
    ),
  },
  {
    id: "region",
    label: "Region",
    type: "select",
    options: REGIONS,
    editor: RegionSelect as never,
    icon: (
      <IconPlaceholder
        lucide="GlobeIcon"
        tabler="IconWorld"
        hugeicons="Globe02Icon"
        phosphor="GlobeSimpleIcon"
        remixicon="RiGlobalLine"
      />
    ),
  },
  {
    id: "twoFactor",
    // The short form, because a chip is a row of them. Spelled out, this chip
    // is 60px wider, and the four of them clear the bar by 64 in sera, so the
    // long form is the difference between a row and a wrap. The acronym is what
    // a filter list would call it anyway.
    label: "2FA",
    type: "boolean",
    editor: EnabledSwitch as never,
    renderValue: ({ value }) => (value === true ? "on" : "off"),
    icon: (
      <IconPlaceholder
        lucide="KeyRoundIcon"
        tabler="IconKey"
        hugeicons="SquareLock02Icon"
        phosphor="KeyIcon"
        remixicon="RiKey2Line"
      />
    ),
  },
]

export default function Pattern() {
  const [query, setQuery] = useState<FilterQuery>(() =>
    createFilterQuery<unknown>([
      createFilterRule({
        id: "seed-1",
        path: ["channel"],
        operator: "has_any_of",
        value: ["web", "ios"],
      }),
      createFilterRule({
        id: "seed-2",
        path: ["plan"],
        operator: "is",
        value: "pro",
      }),
      createFilterRule({
        id: "seed-3",
        path: ["region"],
        operator: "is",
        value: "emea",
      }),
      /*
        FOUR chips, and the fourth is the last one that fits.

        Five editors are on show, and seeding one chip each is the obvious
        thing: every editor would then be one press away. It does not fit, and
        the way it fails is worse than the click it saves. The bar is a wrapping
        row whose chips live in an inner toolbar, and a flex child that wraps
        internally claims the full width of its line, so the moment the fifth
        chip goes to a second row the toolbar owns BOTH rows and pushes Add
        filter and Clear onto a third - the trigger at the far left, Clear at
        the far right, a thousand pixels of nothing between them.

        Measured at the width a catalog card gives this bar (1128px), the five
        chips run 1172 to 1336 depending on the style against a budget of 977 to
        1036. No arrangement of five fits and no wording closes a 300px gap, so
        the count is the thing that gives. Two of the five drops leave a row that
        fits; this one clears sera by 64px where dropping Channel clears it by
        15, and it costs the least besides, because Permissions drew the same
        `PickedLabels` display the Channel chip already shows - and shows better,
        since Channel carries the overflow count too. Its editor is reachable
        from Add filter like any other field.
      */
      createFilterRule({
        id: "seed-4",
        path: ["twoFactor"],
        operator: "is",
        value: true,
      }),
    ])
  )

  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  )
}
