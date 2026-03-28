// Description: Order summary with separators
// Order: 6

import { Separator } from "@/registry/bases/base/ui/separator"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-2 text-sm">
      <p className="font-medium">Order Summary</p>
      <Separator />
      <dl className="flex items-center justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd>$49.00</dd>
      </dl>
      <dl className="flex items-center justify-between">
        <dt className="text-muted-foreground">Discount</dt>
        <dd className="text-success">-$5.00</dd>
      </dl>
      <dl className="flex items-center justify-between">
        <dt className="text-muted-foreground">Tax</dt>
        <dd>$3.52</dd>
      </dl>
      <Separator />
      <dl className="flex items-center justify-between font-medium">
        <dt>Total</dt>
        <dd>$47.52</dd>
      </dl>
    </div>
  )
}
