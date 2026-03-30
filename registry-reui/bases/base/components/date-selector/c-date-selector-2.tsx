// Description: Date selector with popover
// Order: 2

"use client"

import { useEffect, useState } from "react"
import {
  DateSelector,
  formatDateValue,
  type DateSelectorValue,
} from "@/registry-reui/bases/base/reui/date-selector"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { Separator } from "@/registry/bases/base/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [value, setValue] = useState<DateSelectorValue | undefined>()
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<
    DateSelectorValue | undefined
  >(value)

  const formattedValue = value ? formatDateValue(value) : ""
  const displayText = formattedValue || "Select a date"

  useEffect(() => {
    if (open) {
      setInternalValue(value)
    }
  }, [open, value])

  const handleApply = () => {
    setValue(internalValue)
    setOpen(false)
  }

  const handleCancel = () => {
    setInternalValue(value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-56 justify-start">
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendarEvent"
              hugeicons="Calendar04Icon"
              phosphor="CalendarBlankIcon"
              remixicon="RiCalendarLine"
            />
            {displayText}
          </Button>
        }
      />
      <PopoverContent className="w-auto gap-3 p-0" align="start" sideOffset={4}>
        <div className="p-3">
          <DateSelector
            value={internalValue}
            onChange={setInternalValue}
            allowRange={true}
            label="Due date"
            inputHint="Try: 2025, Q4, 05/10/2025"
          />
        </div>
        <Separator className="p-0" />
        <div className="flex justify-end gap-2 p-3 pt-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
