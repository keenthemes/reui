// Description: Logout confirmation dialog
// Order: 13

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
} from "@/registry/bases/base/ui/alert-dialog"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Logout</Button>} />
      <AlertDialogContent
        size="sm"
        className="gap-0 overflow-hidden p-0 sm:max-w-sm"
      >
        <div className="flex flex-col items-center justify-center gap-2 p-8">
          <AlertDialogMedia className="style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full size-12 bg-violet-50 text-violet-500 dark:bg-violet-950 dark:text-violet-400">
            <IconPlaceholder
              lucide="ShieldQuestionMarkIcon"
              tabler="IconShieldQuestion"
              hugeicons="ShieldEnergyIcon"
              phosphor="ShieldIcon"
              remixicon="RiShieldLine"
              className="size-6"
            />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center text-base font-semibold">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="p-0 text-center text-sm font-medium">
            You can always log in later to your account.
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="grid flex-none grid-cols-2 gap-0 divide-x border-t pt-0">
          <AlertDialogCancel
            variant="ghost"
            className="border-border h-12 flex-1 rounded-none border-0 border-r p-0"
          >
            No
          </AlertDialogCancel>
          <AlertDialogAction
            variant="ghost"
            className="h-12 flex-1 rounded-none border-0 p-0"
          >
            Yes, Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
