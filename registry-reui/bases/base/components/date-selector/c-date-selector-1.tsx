// Description: Basic date selector
// Order: 1
// GridSize: 1

"use client"

import { useState } from "react"
import {
  DateSelector,
  type DateSelectorValue,
} from "@/registry-reui/bases/base/reui/date-selector"
import { format } from "date-fns"

import { Card, CardContent } from "@/registry/bases/base/ui/card"

export default function Pattern() {
  const [value, setValue] = useState<DateSelectorValue | undefined>()

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Card className="p-0">
        <CardContent className="p-3">
          <DateSelector
            value={value}
            onChange={setValue}
            label="Due date"
            inputHint="Try: 2025, Q4, 05/10/2025"
          />
        </CardContent>
      </Card>

      {value ? (
        <pre className="bg-muted w-full overflow-auto rounded-md p-3 font-mono text-xs md:w-[500px]">
          {JSON.stringify(
            value,
            (key, val) => {
              if (val instanceof Date) {
                return format(val, "MM/dd/yyyy")
              }
              return val
            },
            2
          )}
        </pre>
      ) : (
        <div className="text-muted-foreground text-sm">
          No value selected. Select a date to see the debug information.
        </div>
      )}
    </div>
  )
}
