// Description: Toast variants with colored icons
// Order: 4

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => toast("Default notification")}
      >
        Default
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.success("Operation completed", {
            classNames: { icon: "text-green-500" },
          })
        }
      >
        Success
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.error("Operation failed", {
            classNames: { icon: "text-destructive" },
          })
        }
      >
        Error
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.warning("Proceed with caution", {
            classNames: { icon: "text-yellow-500" },
          })
        }
      >
        Warning
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.info("System update available", {
            classNames: { icon: "text-violet-500" },
          })
        }
      >
        Info
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => toast.loading("Processing...")}
      >
        Loading
      </Button>
    </div>
  )
}
