// Description: User message notification alert
// Order: 19

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry-reui/bases/base/reui/alert"
import { Frame, FramePanel } from "@/registry-reui/bases/base/reui/frame"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame>
        <FramePanel className="overflow-hidden p-0!">
          <Alert className="grid-cols-[32px_1fr] gap-x-3 border-0 shadow-none">
            <Avatar className="size-8 border">
              <AvatarImage
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
                alt="Alex Johnson"
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <AlertTitle className="flex items-center gap-2">
              <span className="truncate">Alex Johnson</span>
              <span className="text-muted-foreground truncate font-normal">
                sent you a message
              </span>
            </AlertTitle>
            <AlertAction>
              <Button size="xs" variant="outline">
                View
              </Button>
              <Button size="xs">Reply</Button>
            </AlertAction>
            <AlertDescription className="line-clamp-1">
              &quot;Hey! I&apos;ve finished the draft for the new design system.
              Let me know what you think when you have a moment.&quot;
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}
