// Description: Multi-line button with icon, title & description
// Order: 52

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button
      variant="outline"
      className="group/button h-auto justify-start gap-3 px-4 py-3 text-left"
    >
      <div className="bg-muted text-accent-foreground group-hover/button:bg-background style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-md flex size-10 items-center justify-center">
        <IconPlaceholder
          lucide="CreditCardIcon"
          tabler="IconCreditCard"
          hugeicons="CreditCardIcon"
          phosphor="CreditCardIcon"
          remixicon="RiBankCardLine"
          aria-hidden="true"
          className="size-5"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <span>Credit Card</span>
        <span className="text-muted-foreground text-xs font-normal">
          Pay securely with your Visa or Mastercard
        </span>
      </div>
    </Button>
  )
}
