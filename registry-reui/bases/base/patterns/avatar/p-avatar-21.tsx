// Description: Compact social proof with initials
// Order: 21

import { Frame, FramePanel } from "@/registry-reui/bases/base/reui/frame"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <Frame>
      <FramePanel className="flex items-center gap-2 p-2!">
        <AvatarGroup>
          <Avatar className="size-7">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <Avatar className="size-7">
            <AvatarImage
              src="https://github.com/maxleiter.png"
              alt="@maxleiter"
            />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <Avatar className="size-7">
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <Avatar className="size-7">
            <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
        </AvatarGroup>

        <p className="text-muted-foreground me-1.5 text-xs">
          Joined by <span className="text-foreground font-semibold">500+</span>{" "}
          developers.
        </p>
      </FramePanel>
    </Frame>
  )
}
