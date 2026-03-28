// Description: Multi-action invert toast with avatar group
// Order: 17

import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import { Separator } from "@/registry/bases/base/ui/separator"

const reviewers = [
  {
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
  },
  {
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
  },
  {
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    initials: "DK",
  },
]

export default function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className="bg-invert text-invert-foreground style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] flex-col gap-3 border border-transparent p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Pull Request #284</p>
          <span className="text-invert-foreground/40 text-xs">2m ago</span>
        </div>
        <p className="text-invert-foreground/70 text-sm">
          All reviewers approved. Ready to merge into{" "}
          <code className="bg-background/10 rounded px-1 py-0.5 font-mono text-xs">
            main
          </code>
        </p>
        <Separator className="bg-border/10" />
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {reviewers.map((reviewer) => (
              <Avatar
                key={reviewer.name}
                className="border-invert size-6 border-2"
              >
                <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                <AvatarFallback className="text-[10px]">
                  {reviewer.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              size="xs"
              variant="outline"
              className="bg-background/10 border-border/10 text-invert-foreground"
              onClick={() => toast.dismiss()}
            >
              View
            </Button>
            <Button
              size="xs"
              className="border-green-800 bg-green-500 text-white hover:border-green-900 hover:bg-green-600"
              onClick={() => {
                toast.dismiss()
                toast.success("Merged successfully")
              }}
            >
              Merge
            </Button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        PR Merge Toast
      </Button>
    </div>
  )
}
