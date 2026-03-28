// Description: Custom invert info toast with avatar
// Order: 15

import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className="bg-invert text-invert-foreground style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] items-start gap-3 border border-transparent p-4 shadow-lg">
        <Avatar className="border-border/10 size-9 shrink-0 border">
          <AvatarImage
            src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80"
            alt="Sarah Chen"
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Sarah Chen</p>
            <span className="text-invert-foreground/40 text-xs">Just now</span>
          </div>
          <p className="text-invert-foreground/70 text-sm">
            Invited you to collaborate on &quot;Design System v2&quot;
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              size="xs"
              variant="outline"
              className="bg-background/10 border-border/10 text-invert-foreground"
              onClick={() => toast.dismiss()}
            >
              Decline
            </Button>
            <Button
              size="xs"
              className="border-blue-800 bg-blue-500 text-white hover:border-blue-900 hover:bg-blue-600"
              onClick={() => toast.dismiss()}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        Invert Invite Toast
      </Button>
    </div>
  )
}
