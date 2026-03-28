// Description: Frame with large spacing
// Order: 12

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
    <Frame spacing="lg" className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>System Analytics</FrameTitle>
        <FrameDescription>Global traffic and usage patterns</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Performance Metrics</h2>
        <p className="text-muted-foreground text-sm">
          Large spacing creates a focused, airy feel suitable for marketing
          pages or empty states.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">View full report</p>
      </FrameFooter>
    </Frame>
  )
}
