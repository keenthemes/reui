// Description: Calendar with event list
// Order: 22

"use client"

import { useState } from "react"
import { formatDateRange } from "little-date"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import { Card, CardContent, CardFooter } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const events = [
  {
    title: "Product Launch",
    start: "2026-01-24T10:00:00",
    end: "2026-01-24T11:30:00",
    colorful: "after:bg-green-500",
  },
  {
    title: "Weekly Standup",
    start: "2026-01-28T13:00:00",
    end: "2026-01-28T13:30:00",
    colorful: "after:bg-yellow-500",
  },
  {
    title: "Code Review Session",
    start: "2026-01-31T15:00:00",
    end: "2026-01-31T16:00:00",
    colorful: "after:bg-blue-500",
  },
]

export default function Pattern() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card className="w-2xs py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full bg-transparent p-0"
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4! pt-3! pb-0!">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Add Event"
          >
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
            <span className="sr-only">Add Event</span>
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2">
          {events.map((event) => (
            <div
              key={event.title}
              className={cn(
                "bg-muted relative p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1",
                "style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md",
                "style-vega:after:rounded-full style-nova:after:rounded-full style-lyra:after:rounded-none style-maia:after:rounded-full style-mira:after:rounded-full",
                event.colorful
              )}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-muted-foreground text-xs">
                {formatDateRange(new Date(event.start), new Date(event.end))}
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
