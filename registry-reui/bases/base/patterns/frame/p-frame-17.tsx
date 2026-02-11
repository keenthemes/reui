// Description: Frame with extra large border radius
// Order: 17

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
    <Frame className="w-full max-w-sm [--frame-radius:var(--radius-2xl)]">
      <FrameHeader>
        <FrameTitle>Creative Portfolio</FrameTitle>
        <FrameDescription>Showcasing visual art and design</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Gallery View</h2>
        <p className="text-muted-foreground text-sm">
          2XL radius provides a very soft, organic look suitable for creative
          portfolios and landing pages.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">Browse 12 projects</p>
      </FrameFooter>
    </Frame>
  )
}
