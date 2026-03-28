// Description: Toast with custom close and cancel buttons
// Order: 8

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() =>
          toast("Confirm deletion", {
            description:
              "This item will be permanently deleted. This action cannot be undone.",
            action: {
              label: "Delete",
              onClick: () => toast.success("Item deleted"),
            },
            cancel: {
              label: "Cancel",
              onClick: () => {},
            },
          })
        }
        variant="outline"
        className="w-fit"
      >
        Confirm Action
      </Button>
    </div>
  )
}
