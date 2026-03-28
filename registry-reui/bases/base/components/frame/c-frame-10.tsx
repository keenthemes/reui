// Description: Frame with small spacing
// Order: 10

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
    <Frame spacing="sm" className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>Database Overview</FrameTitle>
        <FrameDescription>
          Monitoring system health and performance
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Live Connections</h2>
        <p className="text-muted-foreground text-sm">
          Small spacing provides a balanced layout for sidebar widgets and
          secondary dashboards.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">Status: Operational</p>
      </FrameFooter>
    </Frame>
  )
}
