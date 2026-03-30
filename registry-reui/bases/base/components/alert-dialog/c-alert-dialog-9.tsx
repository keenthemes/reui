// Description: Warning for unsaved changes when navigating away
// Order: 9

import { Frame, FramePanel } from "@/registry-reui/bases/base/reui/frame"

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
        render={<Button variant="outline">Discard Changes</Button>}
      />
      <AlertDialogContent className="overflow-hidden p-0! ring-0">
        <Frame className="p-px">
          <FramePanel>
            <div className="flex items-start gap-3">
              <div className="style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full flex size-10 shrink-0 items-center justify-center border border-amber-100 bg-amber-50 text-amber-500 dark:bg-amber-950 dark:text-amber-300">
                <IconPlaceholder
                  lucide="CardSimIcon"
                  tabler="IconDeviceSdCard"
                  hugeicons="SdCardIcon"
                  phosphor="SimCardIcon"
                  remixicon="RiSdCardLine"
                  className="size-5"
                />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <AlertDialogTitle className="text-sm font-semibold">
                  Unsaved changes
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground text-sm">
                  You have unsaved changes in this form. If you leave now, your
                  progress will be lost.
                </AlertDialogDescription>
              </div>
            </div>
            <AlertDialogFooter className="mt-6 items-center gap-4 sm:justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="dont-ask-again" />
                <Label
                  htmlFor="dont-ask-again"
                  className="text-muted-foreground font-normal"
                >
                  Don&apos;t ask again
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <AlertDialogCancel>Stay</AlertDialogCancel>
                <AlertDialogAction>Discard Changes</AlertDialogAction>
              </div>
            </AlertDialogFooter>
          </FramePanel>
        </Frame>
      </AlertDialogContent>
    </AlertDialog>
  )
}
