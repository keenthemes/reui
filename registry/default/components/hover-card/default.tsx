import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar"
import { Button } from "@/registry/default/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/default/ui/hover-card"

export default function Component() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button mode="link">@reui_io</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://reui.io/brand/logo-default.png" />
            <AvatarFallback>RE</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@reui_io</h4>
            <p className="text-sm">
							Open-source collection of UI components and animated effects built with React, Typescript, 
							Tailwind CSS, and Motion. 
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
