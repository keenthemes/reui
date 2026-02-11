// Description: Toast with custom rich content
// Order: 9

import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  const showUserToast = () => {
    toast.custom(() => (
      <div className="bg-popover text-popover-foreground border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md flex w-[356px] items-start gap-3 border p-4 shadow-lg">
        <Avatar className="size-9 shrink-0">
          <AvatarImage
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
            alt="Alex Johnson"
          />
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Alex Johnson</p>
            <span className="text-muted-foreground text-xs">2m ago</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Hey! I&apos;ve finished the design review. Let me know when
            you&apos;re free to discuss.
          </p>
          <div className="mt-2 flex gap-2">
            <Button size="xs" variant="outline" onClick={() => toast.dismiss()}>
              Dismiss
            </Button>
            <Button size="xs" onClick={() => toast.dismiss()}>
              Reply
            </Button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showUserToast} variant="outline" className="w-fit">
        User Message Toast
      </Button>
    </div>
  )
}
