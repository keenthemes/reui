// Description: Frame with extra small spacing
// Order: 9

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
    <Frame spacing="xs" className="w-full max-w-xs">
      <FrameHeader>
        <FrameTitle>Project Configuration</FrameTitle>
        <FrameDescription>Adjust your environment settings</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Environment Variables</h2>
        <p className="text-muted-foreground text-sm">
          XS spacing is ideal for high-density toolbars and property panels.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">Updated 2m ago</p>
      </FrameFooter>
    </Frame>
  )
}
