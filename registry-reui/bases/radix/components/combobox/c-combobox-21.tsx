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
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/radix/ui/combobox"
import { Field } from "@/registry/bases/radix/ui/field"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const statusOptions = [
  { value: "backlog", label: "Backlog", tone: "backlog" },
  { value: "planned", label: "Planned", tone: "planned" },
  { value: "in-progress", label: "In Progress", tone: "inProgress" },
  { value: "paused", label: "Paused", tone: "paused" },
  { value: "completed", label: "Completed", tone: "completed" },
  { value: "cancelled", label: "Cancelled", tone: "cancelled" },
] as const

type StatusOption = (typeof statusOptions)[number]

function StatusGlyph({
  tone,
  className,
}: {
  tone: StatusOption["tone"]
  className?: string
}) {
  switch (tone) {
    case "backlog":
      return (
        <IconPlaceholder
          lucide="CircleDotIcon"
          tabler="IconCircleDot"
          hugeicons="CircleIcon"
          phosphor="CircleIcon"
          remixicon="RiRecordCircleLine"
          className={cn(
            "text-muted-foreground/70! **:text-muted-foreground/70! size-4 shrink-0",
            className
          )}
        />
      )
    case "planned":
      return (
        <IconPlaceholder
          lucide="CircleIcon"
          tabler="IconCircle"
          hugeicons="CircleIcon"
          phosphor="CircleIcon"
          remixicon="RiCircleLine"
          className={cn(
            "text-foreground/70! [&_*]:text-foreground/70! size-4 shrink-0",
            className
          )}
        />
      )
    case "inProgress":
      return (
        <IconPlaceholder
          lucide="CircleDotIcon"
          tabler="IconCircleDot"
          hugeicons="CircleIcon"
          phosphor="CircleIcon"
          remixicon="RiRecordCircleLine"
          className={cn(
            "size-4 shrink-0 text-sky-500! [&_*]:text-sky-500!",
            className
          )}
        />
      )
    case "paused":
      return (
        <IconPlaceholder
          lucide="PauseCircleIcon"
          tabler="IconPlayerPauseFilled"
          hugeicons="PauseCircleIcon"
          phosphor="PauseCircleIcon"
          remixicon="RiPauseCircleLine"
          className={cn(
            "size-4 shrink-0 text-amber-500! [&_*]:text-amber-500!",
            className
          )}
        />
      )
    case "completed":
      return (
        <IconPlaceholder
          lucide="CircleCheckIcon"
          tabler="IconCircleCheck"
          hugeicons="CheckmarkCircle02Icon"
          phosphor="CheckCircleIcon"
          remixicon="RiCheckboxCircleLine"
          className={cn(
            "size-4 shrink-0 text-emerald-500! [&_*]:text-emerald-500!",
            className
          )}
        />
      )
    case "cancelled":
      return (
        <IconPlaceholder
          lucide="CircleXIcon"
          tabler="IconCircleX"
          hugeicons="CancelCircleIcon"
          phosphor="XCircleIcon"
          remixicon="RiCloseCircleLine"
          className={cn(
            "text-muted-foreground! [&_*]:text-muted-foreground! size-4 shrink-0",
            className
          )}
        />
      )
  }
}

function StatusLabel({
  status,
  className,
}: {
  status: StatusOption
  className?: string
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      <StatusGlyph tone={status.tone} />
      <span className="truncate">{status.label}</span>
    </span>
  )
}

export default function Pattern() {
  const [status, setStatus] = React.useState<StatusOption | null>(
    statusOptions[1]
  )

  return (
    <Field className="max-w-xs">
      <Combobox
        items={statusOptions}
        value={status}
        onValueChange={setStatus}
        itemToStringValue={(item: StatusOption) => item.label}
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
          <ComboboxValue placeholder="Set status">
            {(selectedStatus: StatusOption | null) =>
              selectedStatus ? (
                <StatusLabel status={selectedStatus} />
              ) : (
                <span className="text-muted-foreground">Set status</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder="Change status"
            className="mb-1"
          />
          <ComboboxEmpty>No statuses found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                <StatusLabel status={item} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
