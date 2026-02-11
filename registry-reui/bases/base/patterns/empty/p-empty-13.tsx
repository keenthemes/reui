// Description: No automations empty state with toggle illustration
// Order: 13

import { Button } from "@/registry/bases/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"

function AutomationIllustration() {
  return (
    <svg
      width="200"
      height="120"
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left connection line with arrow */}
      <path
        d="M30 60 L68 60"
        className="stroke-muted-foreground/30"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
      />
      <polygon
        points="66,56 74,60 66,64"
        className="fill-muted-foreground/30"
      />

      {/* Toggle body */}
      <rect
        x="76"
        y="42"
        width="56"
        height="36"
        rx="18"
        className="stroke-primary/60 fill-primary/5 dark:fill-primary/10"
        strokeWidth="2"
      />
      {/* Toggle circle */}
      <circle cx="94" cy="60" r="12" className="fill-primary/40" />
      <circle cx="94" cy="60" r="6" className="fill-primary" />

      {/* Right connection line */}
      <path
        d="M134 60 Q150 60 158 48"
        className="stroke-muted-foreground/30"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="162" cy="44" r="3" className="fill-muted-foreground/20" />

      {/* Bottom right connection */}
      <path
        d="M134 60 Q150 60 158 72"
        className="stroke-muted-foreground/30"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="162" cy="76" r="3" className="fill-muted-foreground/20" />

      {/* Decorative dots */}
      <circle cx="22" cy="60" r="2" className="fill-muted-foreground/20" />
      <circle cx="174" cy="44" r="2" className="fill-muted-foreground/15" />
      <circle cx="174" cy="76" r="2" className="fill-muted-foreground/15" />
    </svg>
  )
}

export default function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia>
            <AutomationIllustration />
          </EmptyMedia>
          <EmptyTitle>No automations yet</EmptyTitle>
          <EmptyDescription>
            Hook up your favorite tools and let the automation magic begin.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Create new automation</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
