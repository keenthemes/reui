// Description: Toast duration options
// Order: 5

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
          toast("Quick notice", {
            description: "Disappears in 2 seconds.",
            duration: 2000,
          })
        }
      >
        2s Duration
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Standard notice", {
            description: "Disappears in 5 seconds.",
            duration: 5000,
          })
        }
      >
        5s Duration
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Extended notice", {
            description: "Stays for 10 seconds.",
            duration: 10000,
          })
        }
      >
        10s Duration
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="col-span-3 w-full"
        onClick={() =>
          toast("Persistent notice", {
            description: "This toast stays until dismissed.",
            duration: Infinity,
            closeButton: true,
          })
        }
      >
        Persistent
      </Button>
    </div>
  )
}
