// Description: Custom invert warning toast with countdown
// Order: 16

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const showToast = () => {
    toast.custom(
      () => (
        <div className="bg-invert text-invert-foreground style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] items-start gap-3 border border-transparent p-4 shadow-lg">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
            <IconPlaceholder
              lucide="AlertTriangleIcon"
              tabler="IconAlertTriangle"
              hugeicons="Alert02Icon"
              phosphor="WarningIcon"
              remixicon="RiAlertLine"
              className="size-3.5"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-sm font-semibold">Session Expiring</p>
            <p className="text-invert-foreground/70 text-sm">
              Your session will expire in 5 minutes due to inactivity.
            </p>
            <div className="mt-2">
              <Button
                size="xs"
                className="border-amber-700 bg-amber-500 text-white hover:border-amber-800 hover:bg-amber-600"
                onClick={() => {
                  toast.dismiss()
                  toast.success("Session extended")
                }}
              >
                Extend Session
              </Button>
            </div>
          </div>
        </div>
      ),
      { duration: 10000 }
    )
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        Invert Warning Toast
      </Button>
    </div>
  )
}
