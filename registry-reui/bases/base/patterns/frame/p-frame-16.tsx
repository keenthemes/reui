// Description: Frame with default border radius
// Order: 16

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
    <Frame className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>Default Layout</FrameTitle>
        <FrameDescription>Standard component curvature</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Standard Settings</h2>
        <p className="text-muted-foreground text-sm">
          The default radius matches the overall design system for consistent
          application feel.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">System default applied</p>
      </FrameFooter>
    </Frame>
  )
}
