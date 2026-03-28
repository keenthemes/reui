// Description: Dialog with full width button
// Order: 10

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/radix/ui/dialog"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Session Expired</Button>
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
