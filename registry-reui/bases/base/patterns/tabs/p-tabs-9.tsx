// Description: Segmented control tabs
// Order: 9
// GridSize: 1

"use client"

import { useState } from "react"

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/base/ui/tabs"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-6">
      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="w-full">
          <TabsTrigger value="daily" className="gap-1.5">
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="Calendar04Icon"
              phosphor="CalendarBlankIcon"
              remixicon="RiCalendarLine"
              className="size-3.5"
            />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-1.5">
            <IconPlaceholder
              lucide="SquareCheckIcon"
              tabler="IconSquareCheck"
              hugeicons="CheckmarkSquare02Icon"
              phosphor="CheckSquareIcon"
              remixicon="RiCheckboxLine"
              className="size-4"
            />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-1.5">
            <IconPlaceholder
              lucide="UsersIcon"
              tabler="IconUsers"
              hugeicons="UserMultiple02Icon"
              phosphor="UsersIcon"
              remixicon="RiGroupLine"
              className="size-4"
            />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="gap-1.5">
            <IconPlaceholder
              lucide="CalendarClockIcon"
              tabler="IconCalendarTime"
              hugeicons="Calendar02Icon"
              phosphor="CalendarCheckIcon"
              remixicon="RiCalendarTodoLine"
              className="size-3.5"
            />
            Yearly
          </TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <Card>
            <CardContent className="text-center">
              <p className="text-3xl font-bold">1,284</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Visitors today
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly">
          <Card>
            <CardContent className="text-center">
              <p className="text-3xl font-bold">8,942</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Visitors this week
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card>
            <CardContent className="text-center">
              <p className="text-3xl font-bold">32,156</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Visitors this month
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="yearly">
          <Card>
            <CardContent className="text-center">
              <p className="text-3xl font-bold">384,721</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Visitors this year
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
