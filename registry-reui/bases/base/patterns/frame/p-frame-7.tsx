// Description: Frame with dense layout
// Order: 7

import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"

export default function Pattern() {
  return (
    <Frame dense className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>Inventory Check</FrameTitle>
        <FrameDescription>Real-time stock monitoring</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Warehouse A</h2>
        <p className="text-muted-foreground text-sm">
          Dense mode removes outer padding for a more compact appearance.
        </p>
      </FramePanel>
    </Frame>
  )
}
