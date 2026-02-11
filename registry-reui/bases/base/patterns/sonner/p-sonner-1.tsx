// Description: Basic toast notification.
// Order: 1

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() => toast("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </div>
  )
}
