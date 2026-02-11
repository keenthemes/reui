// Description: Timestamp hover card with active relative time
// Order: 7

"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import { format, formatDistanceToNow } from "date-fns"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/bases/base/ui/hover-card"
import { Separator } from "@/registry/bases/base/ui/separator"

export default function Pattern() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Static reference time for the "last deployed" example
  const referenceTime = new Date(now.getTime() - 1000 * 60 * 120) // 2 hours ago

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <p className="text-muted-foreground text-sm">
        Last deployed{" "}
        <HoverCard>
          <HoverCardTrigger
            delay={100}
            closeDelay={100}
            className="text-foreground cursor-default underline decoration-dashed decoration-1 underline-offset-4"
          >
            {formatDistanceToNow(referenceTime, { addSuffix: true })}
          </HoverCardTrigger>
          <HoverCardContent className="w-78 p-0">
            <p className="text-foreground px-2 py-1 font-medium">
              {formatDistanceToNow(referenceTime, { addSuffix: true })}
            </p>
            <Separator />
            <div className="px-2 py-1.5">
              <table>
                <tbody>
                  <tr>
                    <td className="pr-4 pb-1.5">
                      <Badge variant="outline">UTC</Badge>
                    </td>
                    <td className="pr-6 pb-1.5">
                      {format(referenceTime, "MMM d, yyyy")}
                    </td>
                    <td className="text-muted-foreground pb-1.5">
                      {format(referenceTime, "hh:mm:ss a")}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4">
                      <span className="bg-muted rounded px-1.5 py-0.5 font-medium">
                        {Intl.DateTimeFormat()
                          .resolvedOptions()
                          .timeZone.split("/")
                          .pop()
                          ?.replace("_", " ") || "Local"}
                      </span>
                    </td>
                    <td className="pr-6">{format(now, "MMM d, yyyy")}</td>
                    <td className="text-muted-foreground w-28">
                      {format(now, "hh:mm:ss a")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </HoverCardContent>
        </HoverCard>{" "}
        by CI/CD pipeline.
      </p>
    </div>
  )
}
