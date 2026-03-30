// Description: Confirmation dialog with destructive action
// Order: 7

import { Button } from "@/registry/bases/base/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Delete Item
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="bg-destructive/10 text-destructive style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-md flex size-10 shrink-0 items-center justify-center">
                <IconPlaceholder
                  lucide="AlertTriangleIcon"
                  tabler="IconAlertTriangle"
                  hugeicons="Alert02Icon"
                  phosphor="WarningIcon"
                  remixicon="RiAlertLine"
                  className="size-5"
                />
              </div>
              <div className="flex flex-col gap-1">
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  item and remove all associated data from our servers.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
