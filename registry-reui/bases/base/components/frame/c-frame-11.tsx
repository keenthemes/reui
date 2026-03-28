// Description: Frame with default spacing
// Order: 11

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
        <FrameTitle>User Profile</FrameTitle>
        <FrameDescription>
          Manage your personal account details
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Account Security</h2>
        <p className="text-muted-foreground text-sm">
          Default spacing is the standard for primary application content and
          main dialogs.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">
          Last login: Today at 4:30 PM
        </p>
      </FrameFooter>
    </Frame>
  )
}
