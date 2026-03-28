// Description: No messages empty state with chat bubbles illustration
// Order: 17

import { Button } from "@/registry/bases/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"

function ChatIllustration() {
  return (
    <svg
      width="180"
      height="120"
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left bubble */}
      <rect
        x="20"
        y="20"
        width="80"
        height="44"
        rx="12"
        className="fill-muted dark:fill-muted/60 stroke-border"
        strokeWidth="1.5"
      />
      {/* Left bubble tail */}
      <path
        d="M36 64 L32 76 L48 64"
        className="fill-muted dark:fill-muted/60 stroke-border"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left bubble text lines */}
      <rect
        x="32"
        y="32"
        width="48"
        height="4"
        rx="2"
        className="fill-muted-foreground/20"
      />
      <rect
        x="32"
        y="42"
        width="36"
        height="4"
        rx="2"
        className="fill-muted-foreground/15"
      />
      {/* Left bubble avatar dot */}
      <circle cx="32" cy="52" r="3" className="fill-muted-foreground/12" />

      {/* Right bubble */}
      <rect
        x="80"
        y="50"
        width="80"
        height="40"
        rx="12"
        className="fill-primary/10 dark:fill-primary/15 stroke-primary/30"
        strokeWidth="1.5"
      />
      {/* Right bubble tail */}
      <path
        d="M144 90 L148 100 L132 90"
        className="fill-primary/10 dark:fill-primary/15 stroke-primary/30"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right bubble text lines */}
      <rect
        x="92"
        y="62"
        width="52"
        height="4"
        rx="2"
        className="fill-primary/20"
      />
      <rect
        x="92"
        y="72"
        width="32"
        height="4"
        rx="2"
        className="fill-primary/15"
      />

      {/* Decorative dots */}
      <circle cx="14" cy="46" r="2" className="fill-muted-foreground/10" />
      <circle cx="168" cy="66" r="2" className="fill-primary/15" />
      <circle cx="110" cy="16" r="2.5" className="fill-muted-foreground/10" />
    </svg>
  )
}

export default function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia>
            <ChatIllustration />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>
            Start a conversation with your team. Messages will appear here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Send a message</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
