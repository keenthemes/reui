import { Frame, FramePanel } from "@/registry-reui/bases/radix/reui/frame"

export default function Pattern() {
  return (
    <Frame className="w-full max-w-sm">
      <FramePanel>
        <h2 className="text-sm font-semibold">Account Snapshot</h2>
        <p className="text-muted-foreground text-sm">
          Active seats, usage limits, and billing status are ready for review.
        </p>
      </FramePanel>
      <FramePanel>
        <h2 className="text-sm font-semibold">Team Activity</h2>
        <p className="text-muted-foreground text-sm">
          24 members signed in this week with no unresolved security alerts.
        </p>
      </FramePanel>
    </Frame>
  )
}
