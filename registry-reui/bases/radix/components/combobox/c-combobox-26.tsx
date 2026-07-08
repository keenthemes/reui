"use client"

import * as React from "react"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/radix/ui/combobox"
import { Field } from "@/registry/bases/radix/ui/field"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type EmptyLabelOption = {
  type: "none"
  id: "no-label"
  label: string
  searchText: string
}

type LabelOption = {
  type: "label"
  id: string
  value: string
  label: string
  colorClassName: string
  searchText: string
}

type LabelSelectionItem = EmptyLabelOption | LabelOption

const noLabelOption: EmptyLabelOption = {
  type: "none",
  id: "no-label",
  label: "No label",
  searchText: "No label clear labels remove labels empty",
}

const labelOptions: LabelOption[] = [
  {
    type: "label",
    id: "feature",
    value: "feature",
    label: "Feature",
    colorClassName: "bg-sky-500",
    searchText: "Feature product enhancement capability",
  },
  {
    type: "label",
    id: "bug",
    value: "bug",
    label: "Bug",
    colorClassName: "bg-rose-500",
    searchText: "Bug issue defect problem",
  },
  {
    type: "label",
    id: "improvement",
    value: "improvement",
    label: "Improvement",
    colorClassName: "bg-emerald-500",
    searchText: "Improvement refinement polish optimization",
  },
  {
    type: "label",
    id: "design",
    value: "design",
    label: "Design",
    colorClassName: "bg-violet-500",
    searchText: "Design ui ux creative visual",
  },
] as const

const labelSelectionOptions: LabelSelectionItem[] = [
  noLabelOption,
  ...labelOptions,
]

function TagGlyph({ className }: { className?: string }) {
  return (
    <IconPlaceholder
      lucide="TagIcon"
      tabler="IconTag"
      hugeicons="Tag01Icon"
      phosphor="TagIcon"
      remixicon="RiPriceTag3Line"
      className={cn("size-4 shrink-0", className)}
    />
  )
}

function LabelDot({ option }: { option: LabelOption }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-3 shrink-0 rounded-full", option.colorClassName)}
    />
  )
}

function LabelTriggerSummary({
  selectedLabels,
  placeholder,
}: {
  selectedLabels: LabelOption[]
  placeholder: string
}) {
  if (!selectedLabels.length) {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <TagGlyph className="text-muted-foreground" />
        <span className="text-muted-foreground truncate">{placeholder}</span>
      </span>
    )
  }

  const visibleLabels = selectedLabels.slice(0, 3)
  const hiddenLabelCount = selectedLabels.length - visibleLabels.length
  const selectedLabelText = selectedLabels
    .map((label) => label.label)
    .join(", ")

  if (selectedLabels.length === 1) {
    const [label] = selectedLabels

    return (
      <span className="flex min-w-0 items-center gap-2">
        <LabelDot option={label} />
        <span className="truncate">{label.label}</span>
      </span>
    )
  }

  return (
    <span className="flex min-w-0 items-center gap-1">
      <span className="sr-only">Selected labels: {selectedLabelText}</span>
      {visibleLabels.map((label) => (
        <LabelDot key={label.id} option={label} />
      ))}
      {hiddenLabelCount > 0 ? (
        <span className="text-muted-foreground ml-0.5 text-xs tabular-nums">
          +{hiddenLabelCount}
        </span>
      ) : null}
    </span>
  )
}

function LabelOptionRow({ option }: { option: LabelSelectionItem }) {
  if (option.type === "none") {
    return <span className="truncate">{option.label}</span>
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <LabelDot option={option} />
      <span className="truncate">{option.label}</span>
    </span>
  )
}

function isLabelSelectionItemEqual(
  item: LabelSelectionItem,
  value: LabelSelectionItem
) {
  return item.id === value.id
}

export default function Pattern() {
  const [labels, setLabels] = React.useState<LabelOption[]>(labelOptions)

  function handleLabelsChange(nextItems: LabelSelectionItem[]) {
    if (nextItems.some((item) => item.type === "none")) {
      setLabels([])
      return
    }

    setLabels(
      nextItems.filter((item): item is LabelOption => item.type === "label")
    )
  }

  return (
    <Field className="max-w-xs">
      <Combobox
        multiple
        items={labelSelectionOptions}
        value={labels}
        onValueChange={handleLabelsChange}
        itemToStringValue={(item: LabelSelectionItem) => item.searchText}
        isItemEqualToValue={isLabelSelectionItemEqual}
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
          <ComboboxValue placeholder="Add label">
            {(selectedLabels: LabelOption[]) => (
              <LabelTriggerSummary
                selectedLabels={selectedLabels ?? []}
                placeholder="Add label"
              />
            )}
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder="Select labels"
            className="mb-1"
          />
          <ComboboxEmpty>No labels found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noLabelOption}>
              <LabelOptionRow option={noLabelOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            {labelOptions.map((item) => (
              <ComboboxItem key={item.id} value={item}>
                <LabelOptionRow option={item} />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
