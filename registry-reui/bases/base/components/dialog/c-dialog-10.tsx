// Description: Dialog with full width button
// Order: 10

import { Button } from "@/registry/bases/base/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Session Expired
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Session Expired</DialogTitle>
            <DialogDescription>
              Your session has timed out due to inactivity. Please sign in again
              to continue where you left off.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full">Sign In Again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
