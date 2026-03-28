// Description: User message notification alert
// Order: 20

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
          <Alert
            variant="invert"
            className="grid-cols-[32px_1fr] gap-x-3 border-0 shadow-none"
          >
            <Avatar className="border-border/10 size-8 border">
              <AvatarImage
                src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80"
                alt="Sarah Chen"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <AlertTitle className="flex items-center gap-2">
              <span className="truncate">Sarah Chen</span>
              <span className="text-invert-foreground/60 truncate font-normal">
                mentioned you in a comment
              </span>
            </AlertTitle>
            <AlertAction>
              <Button
                variant="outline"
                size="xs"
                className="bg-background/10 border-border/10"
              >
                Dismiss
              </Button>
              <Button
                size="xs"
                className="border-blue-800 bg-blue-500 text-white hover:border-blue-900 hover:bg-blue-600"
              >
                View
              </Button>
            </AlertAction>
            <AlertDescription className="text-invert-foreground/70 line-clamp-1">
              &quot;Great work on the user profile layout! I&apos;ve added some
              suggestions for the avatar spacing.&quot;
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}
