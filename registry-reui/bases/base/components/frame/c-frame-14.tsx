// Description: Frame with medium border radius
// Order: 14

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
    <Frame className="w-full max-w-sm [--frame-radius:var(--radius-md)]">
      <FrameHeader>
        <FrameTitle>Media Library</FrameTitle>
        <FrameDescription>Manage your assets and downloads</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Storage Capacity</h2>
        <p className="text-muted-foreground text-sm">
          Medium radius is a versatile middle ground between sharp and rounded
          aesthetics.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">75% of 100GB used</p>
      </FrameFooter>
    </Frame>
  )
}
