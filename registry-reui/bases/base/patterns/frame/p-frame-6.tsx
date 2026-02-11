// Description: Frame with ghost(no outer border) variant
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
    <Frame className="w-full" variant="ghost">
      <FrameHeader>
        <FrameTitle>No Outer Border</FrameTitle>
        <FrameDescription>
          This frame uses variant="ghost" to remove the outer border.
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <p className="text-muted-foreground text-sm">
          The outer container of this frame has no border, only the background
          and panels are visible.
        </p>
      </FramePanel>
    </Frame>
  )
}
