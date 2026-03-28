// Description: Frame with small border radius
// Order: 13

import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"

export default function Pattern() {
  return (
    <Frame className="w-full max-w-sm [--frame-radius:var(--radius-sm)]">
      <FrameHeader>
        <FrameTitle>Network Diagnostics</FrameTitle>
        <FrameDescription>
          Analyzing real-time socket connections
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Port Status</h2>
        <p className="text-muted-foreground text-sm">
          Small radius gives a sharp, precise look, perfect for technical
          dashboards and data grids.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">Scan completed</p>
      </FrameFooter>
    </Frame>
  )
}
