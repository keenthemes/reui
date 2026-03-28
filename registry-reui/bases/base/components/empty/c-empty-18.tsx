// Description: No payments empty state with credit card illustration
// Order: 18

import { Button } from "@/registry/bases/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"

function CreditCardIllustration() {
  return (
    <svg
      width="200"
      height="130"
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shadow card behind */}
      <rect
        x="48"
        y="12"
        width="120"
        height="78"
        rx="10"
        className="fill-muted/50 dark:fill-muted/25"
        transform="rotate(6 108 51)"
      />

      {/* Main card */}
      <rect
        x="36"
        y="18"
        width="128"
        height="82"
        rx="10"
        className="fill-background stroke-border"
        strokeWidth="1.5"
      />

      {/* Chip */}
      <rect
        x="52"
        y="38"
        width="22"
        height="16"
        rx="3"
        className="fill-muted-foreground/15 stroke-muted-foreground/20"
        strokeWidth="1"
      />
      {/* Chip lines */}
      <line
        x1="52"
        y1="46"
        x2="74"
        y2="46"
        className="stroke-muted-foreground/15"
        strokeWidth="0.8"
      />
      <line
        x1="63"
        y1="38"
        x2="63"
        y2="54"
        className="stroke-muted-foreground/15"
        strokeWidth="0.8"
      />

      {/* Contactless icon */}
      <g className="stroke-muted-foreground/20" strokeWidth="1.5" fill="none">
        <path d="M84 42 Q87 46 84 50" strokeLinecap="round" />
        <path d="M88 40 Q92 46 88 52" strokeLinecap="round" />
        <path d="M92 38 Q97 46 92 54" strokeLinecap="round" />
      </g>

      {/* Card number dots */}
      <g className="fill-muted-foreground/20">
        <circle cx="56" cy="68" r="2" />
        <circle cx="64" cy="68" r="2" />
        <circle cx="72" cy="68" r="2" />
        <circle cx="80" cy="68" r="2" />
      </g>
      <g className="fill-muted-foreground/15">
        <circle cx="94" cy="68" r="2" />
        <circle cx="102" cy="68" r="2" />
        <circle cx="110" cy="68" r="2" />
        <circle cx="118" cy="68" r="2" />
      </g>

      {/* Bottom info lines */}
      <rect
        x="52"
        y="80"
        width="40"
        height="3"
        rx="1.5"
        className="fill-muted-foreground/12"
      />
      <rect
        x="120"
        y="80"
        width="28"
        height="3"
        rx="1.5"
        className="fill-muted-foreground/12"
      />

      {/* Card network logo placeholder */}
      <circle cx="140" cy="88" r="6" className="fill-muted-foreground/8" />
      <circle cx="150" cy="88" r="6" className="fill-muted-foreground/12" />

      {/* Floating decorative elements */}
      <circle cx="26" cy="50" r="3" className="fill-primary/10" />
      <circle cx="180" cy="40" r="2" className="fill-primary/10" />
      <path
        d="M174 70 L178 66 L178 74 Z"
        className="fill-muted-foreground/10"
      />
    </svg>
  )
}

export default function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia>
            <CreditCardIllustration />
          </EmptyMedia>
          <EmptyTitle>No payment methods</EmptyTitle>
          <EmptyDescription>
            Add a payment method to start making transactions securely.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Add payment method</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
