// Description: Toast with close button on top-right
// Order: 18

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() =>
          toast("File uploaded successfully", {
            description: "report-2025.pdf has been saved to your documents.",
            closeButton: true,
            classNames: {
              closeButton: "left-auto! -right-4! -top-1!",
            },
          })
        }
        variant="outline"
        className="w-fit"
      >
        Toast with Close Button
      </Button>
    </div>
  )
}
