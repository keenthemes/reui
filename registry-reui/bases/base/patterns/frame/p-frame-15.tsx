// Description: Frame with large border radius
// Order: 15

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
    <Frame className="w-full max-w-sm [--frame-radius:var(--radius-lg)]">
      <FrameHeader>
        <FrameTitle>Team Collaboration</FrameTitle>
        <FrameDescription>Invite and manage workspace members</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Active Members</h2>
        <p className="text-muted-foreground text-sm">
          Large radius offers a modern, friendly appearance for social and
          collaborative interfaces.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">3 members online</p>
      </FrameFooter>
    </Frame>
  )
}
