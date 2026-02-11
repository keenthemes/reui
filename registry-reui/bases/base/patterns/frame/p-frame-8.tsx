// Description: Frame with stacked panels
// Order: 8

import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"

export default function Pattern() {
  return (
    <Frame stacked className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>Server Logs</FrameTitle>
        <FrameDescription>Recent activity and errors</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Auth Service</h2>
        <p className="text-muted-foreground text-sm">
          Successfully logged in user: admin
        </p>
      </FramePanel>
      <FramePanel>
        <h2 className="text-sm font-semibold">Database</h2>
        <p className="text-muted-foreground text-sm">
          Query execution time: 12ms
        </p>
      </FramePanel>
      <FramePanel>
        <h2 className="text-sm font-semibold">Storage</h2>
        <p className="text-muted-foreground text-sm">
          Upload complete: image.png
        </p>
      </FramePanel>
    </Frame>
  )
}
