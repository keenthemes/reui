// Description: Toast positions
// Order: 3

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Top Left", {
            description: "Notification appears in the top left.",
            position: "top-left",
          })
        }
      >
        Top Left
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Top Center", {
            description: "Notification appears in the top center.",
            position: "top-center",
          })
        }
      >
        Top Center
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Top Right", {
            description: "Notification appears in the top right.",
            position: "top-right",
          })
        }
      >
        Top Right
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Bottom Left", {
            description: "Notification appears in the bottom left.",
            position: "bottom-left",
          })
        }
      >
        Bottom Left
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Bottom Center", {
            description: "Notification appears in the bottom center.",
            position: "bottom-center",
          })
        }
      >
        Bottom Center
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Bottom Right", {
            description: "Notification appears in the bottom right.",
            position: "bottom-right",
          })
        }
      >
        Bottom Right
      </Button>
    </div>
  )
}
