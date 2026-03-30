// Description: Appointment calendar
// Order: 19

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00")

  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15
    const hour = Math.floor(totalMinutes / 60) + 9
    const minute = totalMinutes % 60

    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const bookedDates = Array.from(
    { length: 3 },
    (_, i) =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + i
      )
  )

  return (
    <Card className="gap-0 p-0">
      <CardHeader className="flex h-max items-center justify-start border-b px-4! py-3!">
        <CardTitle>Book your appointment</CardTitle>
      </CardHeader>
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            disabled={bookedDates}
            showOutsideDays={false}
            modifiers={{
              booked: bookedDates,
            }}
          />
        </div>
        <div className="inset-y-0 right-0 flex w-full flex-col gap-4 border-t max-md:h-60 md:absolute md:w-48 md:border-t-0 md:border-l">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 p-4">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="w-full shadow-none"
                >
                  {time}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-4 py-3! md:flex-row">
        <div className="flex max-w-64 items-center gap-2 text-sm">
          {date && selectedTime ? (
            <>
              <IconPlaceholder
                lucide="CircleCheckIcon"
                tabler="IconCircleCheck"
                hugeicons="CheckmarkCircle01Icon"
                phosphor="CheckCircleIcon"
                remixicon="RiCheckboxCircleLine"
                className="size-4 shrink-0"
              />
              <span className="text-sm">
                Your meeting is booked for{" "}
                <span className="font-medium">
                  {" "}
                  {date?.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                </span>
                at <span className="font-medium">{selectedTime}</span>
              </span>
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime}
          className="w-full md:ml-auto md:w-auto"
          variant="outline"
        >
          Confirm
        </Button>
      </CardFooter>
    </Card>
  )
}
