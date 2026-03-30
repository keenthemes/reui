// Description: Custom invert success toast
// Order: 13

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className="bg-invert text-invert-foreground style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] items-start gap-3 border border-transparent p-4 shadow-lg">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
            className="size-3.5"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-semibold">Payment Successful</p>
          <p className="text-invert-foreground/70 text-sm">
            Invoice #INV-2025-0042 has been paid. $2,400.00 received.
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              size="xs"
              variant="outline"
              className="bg-background/10 border-border/10 text-invert-foreground"
              onClick={() => toast.dismiss()}
            >
              View Receipt
            </Button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        Invert Success Toast
      </Button>
    </div>
  )
}
