// Description: Billing warning for expired subscriptions or failed payments
// Order: 12

import { Badge } from "@/registry-reui/bases/radix/reui/badge"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/radix/ui/alert-dialog"
import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Subscription Expiring</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-0 p-0 sm:max-w-sm">
        <div className="mx-auto flex flex-col items-center justify-center gap-2 p-8">
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full size-12">
            <IconPlaceholder
              lucide="BellIcon"
              tabler="IconBell"
              hugeicons="NotificationIcon"
              phosphor="BellIcon"
              remixicon="RiNotificationLine"
              className="size-6"
            />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center">
            Subscription Expiring Soon
          </AlertDialogTitle>
          <Badge variant="destructive-light" className="font-normal">
            Expires in 2 days
          </Badge>
        </div>

        <div className="bg-muted/60 flex flex-col items-center justify-center gap-5 style-vega:rounded-b-2xl style-nova:rounded-b-2xl style-lyra:rounded-b-none style-maia:rounded-b-2xl style-mira:rounded-b-2xl p-6">
          <AlertDialogDescription className="text-muted-foreground text-center">
            Your current plan will expire in 2 days. Update your payment method
            now to ensure uninterrupted access to your Pro features.
          </AlertDialogDescription>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel>Remind Me Later</AlertDialogCancel>
            <AlertDialogAction>Update Payment</AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
