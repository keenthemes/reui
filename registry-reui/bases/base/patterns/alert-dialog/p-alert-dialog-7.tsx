// Description: Task success confirmation
// Order: 7

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/base/ui/alert-dialog"
import { Button } from "@/registry/bases/base/ui/button"
import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import { Label } from "@/registry/bases/base/ui/label"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline">Task Status</Button>}
      />
      <AlertDialogContent>
        <div className="flex items-center gap-3 py-1">
          <div className="style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full flex size-10 items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-300">
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
              className="size-5"
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <AlertDialogTitle className="text-sm font-semibold">
              Task successful
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              Your task has been completed successfully.
            </AlertDialogDescription>
          </div>
        </div>
        <AlertDialogFooter className="items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="show-again" />
            <Label
              htmlFor="show-again"
              className="text-muted-foreground font-normal"
            >
              Don&apos;t show again
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
