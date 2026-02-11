// Description: Full-screen fluid dialog with sticky header and footer
// Order: 6

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

export default function Pattern() {
  return (
    <>
      <style>{`
        .transparent-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(120, 120, 120, 0.4) transparent;
        }  
      `}</style>
      <div className="flex items-center justify-center">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Full Screen Fluid
          </DialogTrigger>
          <DialogContent className="flex max-h-[calc(100vh-3rem)] w-full max-w-[calc(100vw-3rem)] flex-col overflow-hidden p-0">
            <DialogHeader className="bg-background sticky top-0 z-10 border-b px-6 py-4">
              <DialogTitle>Full Screen Dialog</DialogTitle>
              <DialogDescription>
                A fluid full-screen dialog with sticky header and footer.
              </DialogDescription>
            </DialogHeader>
            <div className="transparent-scrollbar me-0.5 flex-1 overflow-auto px-6">
              <div className="space-y-4 text-sm">
                {Array.from({ length: 20 }).map((_, index) => (
                  <p
                    key={index}
                    className="text-muted-foreground leading-normal"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                ))}
              </div>
            </div>
            <DialogFooter className="bg-background border-t px-6 py-4">
              <DialogClose render={<Button variant="outline" />}>
                Close
              </DialogClose>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
