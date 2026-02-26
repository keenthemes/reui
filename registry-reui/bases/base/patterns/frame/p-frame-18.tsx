// Description: Frame with inverse variant
// Order: 6

import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"

export default function Pattern() {
  return (
    <Frame className="w-full" variant="inverse">
      <FrameHeader>
        <FrameTitle>Inverse</FrameTitle>
      </FrameHeader>
      <FramePanel>
        <p className="text-muted-foreground text-sm">
          Frame and panel background are inversed.
        </p>
      </FramePanel>
    </Frame>
  )
}
