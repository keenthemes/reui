// Description: Toast with action button
// Order: 6

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() =>
          toast("Message archived", {
            description: "The conversation has been moved to archive.",
            action: {
              label: "Undo",
              onClick: () => toast.success("Action undone"),
            },
          })
        }
        variant="outline"
        className="w-fit"
      >
        Toast with Action
      </Button>
    </div>
  )
}
