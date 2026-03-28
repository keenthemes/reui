// Description: No events empty state with calendar illustration
// Order: 20

import { Button } from "@/registry/bases/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"

function CalendarIllustration() {
  return (
    <svg
      width="160"
      height="140"
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Calendar body */}
      <rect
        x="24"
        y="28"
        width="112"
        height="96"
        rx="10"
        className="fill-background stroke-border"
        strokeWidth="1.5"
      />

      {/* Calendar header bar */}
      <rect
        x="24"
        y="28"
        width="112"
        height="24"
        rx="10"
        className="fill-muted dark:fill-muted/60"
      />
      <rect
        x="24"
        y="42"
        width="112"
        height="10"
        className="fill-muted dark:fill-muted/60"
      />

      {/* Calendar hooks */}
      <line
        x1="56"
        y1="20"
        x2="56"
        y2="36"
        className="stroke-muted-foreground/30"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="104"
        y1="20"
        x2="104"
        y2="36"
        className="stroke-muted-foreground/30"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Day dots - row 1 */}
      <circle cx="48" cy="68" r="4" className="fill-muted-foreground/10" />
      <circle cx="68" cy="68" r="4" className="fill-muted-foreground/10" />
      <circle cx="88" cy="68" r="4" className="fill-muted-foreground/10" />
      <circle cx="108" cy="68" r="4" className="fill-muted-foreground/10" />

      {/* Day dots - row 2 */}
      <circle cx="48" cy="86" r="4" className="fill-muted-foreground/10" />
      <circle cx="68" cy="86" r="4" className="fill-muted-foreground/10" />
      <circle cx="88" cy="86" r="4" className="fill-primary/25" />
      <circle cx="88" cy="86" r="2" className="fill-primary" />
      <circle cx="108" cy="86" r="4" className="fill-muted-foreground/10" />

      {/* Day dots - row 3 */}
      <circle cx="48" cy="104" r="4" className="fill-muted-foreground/10" />
      <circle cx="68" cy="104" r="4" className="fill-muted-foreground/10" />
      <circle cx="88" cy="104" r="4" className="fill-muted-foreground/10" />
      <circle cx="108" cy="104" r="4" className="fill-muted-foreground/10" />

      {/* Floating decoration */}
      <circle cx="14" cy="70" r="2" className="fill-muted-foreground/10" />
      <circle cx="148" cy="56" r="2.5" className="fill-primary/10" />
      <circle cx="146" cy="100" r="1.5" className="fill-muted-foreground/8" />
    </svg>
  )
}

export default function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia>
            <CalendarIllustration />
          </EmptyMedia>
          <EmptyTitle>No upcoming events</EmptyTitle>
          <EmptyDescription>
            Your schedule is clear. Create an event to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Create event</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
