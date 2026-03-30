// Description: Custom accent border toast
// Order: 12

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className="bg-popover text-popover-foreground border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] items-start gap-3 border border-l-4 border-l-blue-500 p-4 shadow-lg">
        <div className="text-blue-500">
          <IconPlaceholder
            lucide="InfoIcon"
            tabler="IconInfoCircle"
            hugeicons="InformationCircleIcon"
            phosphor="InfoIcon"
            remixicon="RiInformationLine"
            className="size-5 shrink-0"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-semibold">New Version Available</p>
          <p className="text-muted-foreground text-sm">
            v2.4.0 includes performance improvements and bug fixes.
          </p>
          <div className="mt-2 flex gap-2">
            <Button size="xs" variant="outline" onClick={() => toast.dismiss()}>
              Later
            </Button>
            <Button size="xs" onClick={() => toast.dismiss()}>
              Update Now
            </Button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        Accent Border Toast
      </Button>
    </div>
  )
}
