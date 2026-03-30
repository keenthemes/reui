// Description: System update notification requiring application restart
// Order: 11

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
        <Button variant="outline">System Update</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-0 p-0 sm:max-w-sm">
        <div className="mx-auto flex flex-col items-center justify-center gap-2 p-8">
          <AlertDialogMedia className="bg-info/10 text-info dark:bg-info/20 style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full size-12">
            <IconPlaceholder
              lucide="ShieldAlertIcon"
              tabler="IconShieldExclamation"
              hugeicons="ShieldEnergyIcon"
              phosphor="ShieldWarningIcon"
              remixicon="RiShieldLine"
              className="size-6"
            />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center">
            System Update Available!
          </AlertDialogTitle>
          <Badge variant="success-light">Release v28.1.0 (2026-01-12)</Badge>
        </div>

        <div className="bg-muted/60 style-vega:rounded-b-2xl style-nova:rounded-b-2xl style-lyra:rounded-b-none style-maia:rounded-b-2xl style-mira:rounded-b-2xl flex flex-col items-center justify-center gap-5 p-6">
          <AlertDialogDescription className="text-muted-foreground text-center">
            A new version of the application is ready. Restarting now will apply
            the latest security patches and features.
          </AlertDialogDescription>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel>Remind Me Later</AlertDialogCancel>
            <AlertDialogAction>Update Now</AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
